import { Request, Response, NextFunction } from "express";

/**
 * Native cookie parser middleware.
 * Zero-dependency parser that decodes RFC 6265 HTTP Cookie headers into `req.cookies`.
 */
export const cookieParser = (req: Request, _res: Response, next: NextFunction): void => {
  const cookieHeader = req.headers.cookie;
  const parsedCookies: Record<string, string> = {};

  if (cookieHeader) {
    const pairs = cookieHeader.split(";");
    for (const pair of pairs) {
      const idx = pair.indexOf("=");
      if (idx !== -1) {
        const key = pair.slice(0, idx).trim();
        const val = pair.slice(idx + 1).trim();
        try {
          parsedCookies[key] = decodeURIComponent(val);
        } catch {
          parsedCookies[key] = val;
        }
      }
    }
  }

  req.cookies = parsedCookies;
  next();
};
