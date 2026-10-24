import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";

const isProduction = process.env.NODE_ENV === "production";

export const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "strict" : "lax") as "strict" | "lax",
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: "/v1/api"
};

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: (isProduction ? "strict" : "lax") as "strict" | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/v1/api/auth"
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("orbito_access_token", { path: "/v1/api" });
  res.clearCookie("orbito_refresh_token", { path: "/v1/api/auth" });
};

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const context = {
        ip: (req.headers["x-forwarded-for"] as string) || req.ip || undefined,
        userAgent: req.headers["user-agent"] || undefined
      };

      const result = await AuthService.login(email, password, context);

      // Attach dual httpOnly cookies
      res.cookie("orbito_access_token", result.accessToken, ACCESS_COOKIE_OPTIONS);
      res.cookie("orbito_refresh_token", result.refreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(200).json({
        message: "Login successful",
        result: {
          user: result.user,
          token: result.accessToken,
          isPasswordExpired: result.isPasswordExpired
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response): Promise<void> {
    const rawRefreshToken =
      req.cookies?.orbito_refresh_token || req.body?.refreshToken;

    if (!rawRefreshToken) {
      clearAuthCookies(res);
      res.status(401).json({
        message: "Refresh token missing. Please sign in again.",
        code: "REFRESH_TOKEN_MISSING"
      });
      return;
    }

    try {
      const context = {
        ip: (req.headers["x-forwarded-for"] as string) || req.ip || undefined,
        userAgent: req.headers["user-agent"] || undefined
      };

      const result = await AuthService.refresh(rawRefreshToken, context);

      // Rotate cookies with newly issued tokens
      res.cookie("orbito_access_token", result.accessToken, ACCESS_COOKIE_OPTIONS);
      res.cookie("orbito_refresh_token", result.refreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(200).json({
        message: "Token refreshed successfully",
        result: {
          user: result.user,
          token: result.accessToken
        }
      });
    } catch (err: any) {
      clearAuthCookies(res);
      res.status(err.status || 401).json({
        message: err.message || "Failed to refresh session",
        code: err.code || "REFRESH_FAILED"
      });
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const rawRefreshToken =
        req.cookies?.orbito_refresh_token || req.body?.refreshToken;

      await AuthService.logout(rawRefreshToken);
      clearAuthCookies(res);

      res.status(200).json({
        message: "Logged out successfully"
      });
    } catch (err) {
      clearAuthCookies(res);
      next(err);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({
        message: "Registration successful",
        result
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await AuthService.getProfile(userId);
      res.status(200).json({
        result: user
      });
    } catch (err) {
      next(err);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;
      await AuthService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({
        message: "Password updated successfully"
      });
    } catch (err) {
      next(err);
    }
  }
}
