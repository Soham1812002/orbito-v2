import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  KeyRound,
  Mail,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Shield,
  HelpCircle,
  Phone
} from "lucide-react";
import { Button } from "../../components/common/Button";
import { Input } from "../../components/common/Input";
import { AuthLayout } from "./AuthLayout";
import { forgotPasswordSchema, ForgotPasswordSchema } from "./auth.schema";
import { RecoveryMethod } from "./auth.types";
import { showToast } from "../../lib/toast";

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<RecoveryMethod>("email");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      method: "email",
      email: "admin@example.com",
      phone: ""
    }
  });

  const handleMethodChange = (method: RecoveryMethod) => {
    setSelectedMethod(method);
    setValue("method", method, { shouldValidate: true });
  };

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsSubmitting(true);
    try {
      // Simulate network request for reset dispatch
      await new Promise((resolve) => setTimeout(resolve, 800));

      const destination =
        data.method === "email" ? (data.email || "") : (data.phone || "");

      showToast.success(
        `Reset link sent to ${destination}! Please check your inbox.`
      );

      navigate("/link-confirmation", {
        state: {
          method: data.method,
          destination
        }
      });
    } catch {
      showToast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="panel-card p-5 sm:p-6 space-y-3.5 sm:space-y-4">
        {/* Top Icon Badge & Header */}
        <div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-[#95F8FF] shadow-xs mb-2">
            <KeyRound className="h-5 w-5" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-[#95F8FF]">
              Account Recovery
            </span>
            <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Forgot password?
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Choose how you would like to receive a secure password reset link.
            </p>
          </div>
        </div>

        {/* Method Selector Options */}
        <div className="space-y-2.5">
          {/* Email Option Card */}
          <button
            type="button"
            onClick={() => handleMethodChange("email")}
            className={`w-full text-left rounded-xl border p-3 transition-all duration-200 flex items-start gap-3 ${
              selectedMethod === "email"
                ? "border-blue-600 bg-blue-50/50 shadow-sm dark:border-blue-500 dark:bg-blue-950/20"
                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
            }`}
          >
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                selectedMethod === "email"
                  ? "border-blue-500/40 bg-blue-500 text-white"
                  : "border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              <Mail className="h-3.5 w-3.5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  Send reset link by email
                </span>
                <div
                  className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    selectedMethod === "email"
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {selectedMethod === "email" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                We'll send a password reset link to your registered email address.
              </p>
            </div>
          </button>

          {/* WhatsApp Option Card */}
          <button
            type="button"
            onClick={() => handleMethodChange("whatsapp")}
            className={`w-full text-left rounded-xl border p-3 transition-all duration-200 flex items-start gap-3 ${
              selectedMethod === "whatsapp"
                ? "border-blue-600 bg-blue-50/50 shadow-sm dark:border-blue-500 dark:bg-blue-950/20"
                : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
            }`}
          >
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors ${
                selectedMethod === "whatsapp"
                  ? "border-emerald-500/40 bg-emerald-600 text-white"
                  : "border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  Send reset link by WhatsApp
                </span>
                <div
                  className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                    selectedMethod === "whatsapp"
                      ? "border-blue-600 bg-blue-600"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {selectedMethod === "whatsapp" && (
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </div>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                We'll send a secure one-time reset link via WhatsApp message.
              </p>
            </div>
          </button>
        </div>

        {/* Input Form based on Selected Method */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input type="hidden" {...register("method")} value={selectedMethod} />

          {selectedMethod === "email" ? (
            <Input
              label="Registered Email Address"
              type="email"
              autoComplete="email"
              placeholder="e.g. admin@example.com"
              leftIcon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              {...register("email")}
            />
          ) : (
            <Input
              label="WhatsApp Phone Number"
              type="tel"
              autoComplete="tel"
              placeholder="+1 (555) 019-2834"
              leftIcon={<Phone className="h-4 w-4" />}
              error={errors.phone?.message}
              {...register("phone")}
            />
          )}

          {/* Secure Access Advisory Callout */}
          <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 p-3 text-xs text-blue-900 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
            <div className="flex items-start gap-2.5">
              <Shield className="h-4 w-4 shrink-0 text-blue-600 dark:text-[#95F8FF] mt-0.5" />
              <div>
                <span className="font-bold tracking-wide uppercase text-[10px] text-blue-700 dark:text-[#95F8FF] block">
                  Secure Access Policy
                </span>
                <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  For security, reset instructions are dispatched only to verified contact details already linked to your active fleet workspace account.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm shadow-blue-500/25"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Send reset link
            </Button>

            <Link
              to="/sign-in"
              className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to log in</span>
            </Link>
          </div>
        </form>

        {/* Footer Help */}
        <div className="border-t border-slate-200 pt-3 text-center dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Need help?</span>
            <a
              href="mailto:support@inorbitfleet.com"
              className="font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
