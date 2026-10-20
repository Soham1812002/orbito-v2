import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Smartphone,
  HelpCircle
} from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { setCredentials } from "../../redux/userSlice";
import apiClient from "../../utils/api";
import { showToast } from "../../lib/toast";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { AuthLayout } from "./AuthLayout";
import { signInSchema, SignInSchema } from "./auth.schema";

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "Admin@123456",
      rememberMe: true
    }
  });

  const onSubmit = async (data: SignInSchema) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post("/auth/login", {
        email: data.email,
        password: data.password
      });

      const { user, token } = response.data.result;

      dispatch(
        setCredentials({
          user,
          token,
          rememberMe: data.rememberMe
        })
      );

      showToast.success(`Welcome back, ${user.firstName || user.email}!`);
      navigate(from, { replace: true });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Invalid credentials or authentication failed. Please try again.";
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (role: "admin" | "user" | "mobile") => {
    if (role === "admin") {
      setValue("email", "admin@example.com");
      setValue("password", "Admin@123456");
    } else if (role === "user") {
      setValue("email", "user@example.com");
      setValue("password", "User@123456");
    } else {
      setValue("email", "+15550192834");
      setValue("password", "Admin@123456");
    }
  };

  return (
    <AuthLayout>
      <div className="panel-card p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#95F8FF]">
            Fleet Operations
          </span>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Enter your credentials to access the fleet management console.
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-2.5 dark:border-slate-800/80 dark:bg-slate-900/60">
          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-blue-500 dark:text-[#95F8FF]" />
            Quick Demo Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials("admin")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-500/20 dark:text-blue-300 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("user")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
              <span>Demo User</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <Input
            label="Email or Mobile Number"
            type="text"
            autoComplete="username"
            placeholder="admin@example.com or +1555..."
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              leftIcon={<Lock className="h-4 w-4" />}
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
              {...register("password")}
            />
          </div>

          <div className="flex items-center justify-between text-xs pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-300 select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 bg-white text-blue-600 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800"
                {...register("rememberMe")}
              />
              <span>Remember this device</span>
            </label>

            <Link
              to="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Log in
          </Button>

          {/* Divider */}
          <div className="relative my-2 flex items-center justify-center">
            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            <span className="absolute bg-white px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-[#0F172B]">
              OR
            </span>
          </div>

          {/* Mobile Login Option Button */}
          <button
            type="button"
            onClick={() => setDemoCredentials("mobile")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Smartphone className="h-4 w-4 text-slate-500" />
            <span>Continue with mobile number</span>
          </button>
        </form>

        {/* Footer Contact Support */}
        <div className="border-t border-slate-200 pt-3 text-center dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Need access?</span>
            <a
              href="mailto:support@inorbitfleet.com"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Contact administrator
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignInPage;
