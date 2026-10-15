import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Orbit, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from "lucide-react";
import { useAppDispatch } from "../../redux/hooks";
import { setCredentials } from "../../redux/userSlice";
import apiClient from "../../utils/api";
import { showToast } from "../../lib/toast";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(true)
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "admin@example.com",
      password: "Admin@123456",
      rememberMe: true
    }
  });

  const onSubmit = async (data: SignInFormData) => {
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
    } catch {
      // Handled by Axios response interceptor
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (role: "admin" | "user") => {
    if (role === "admin") {
      setValue("email", "admin@example.com");
      setValue("password", "Admin@123456");
    } else {
      setValue("email", "user@example.com");
      setValue("password", "User@123456");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12 relative overflow-hidden">
      {/* Background ambient decorative glowing orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl relative z-10">
        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
            <Orbit className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
            Orbito Enterprise
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Contract-driven Fullstack Architecture Platform
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="rounded-xl border border-slate-800 bg-slate-800/40 p-3">
          <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-indigo-400" />
            Quick Demo Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials("admin")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 transition-colors"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Super Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials("user")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <span>Demo User</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="admin@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register("password")}
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/20"
                {...register("rememberMe")}
              />
              <span>Remember this device</span>
            </label>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full py-2.5"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            Sign In to Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
