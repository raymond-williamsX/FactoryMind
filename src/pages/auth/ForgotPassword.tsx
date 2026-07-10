import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/authService";

const forgotSchema = zod.object({
  email: zod.string().min(1, "Email address is required").email("Please enter a valid email"),
});

type ForgotFormValues = zod.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const resetRedirectUrl = `${window.location.origin}/reset-password`;
      await authService.forgotPassword(values.email, resetRedirectUrl);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Forgot password request failed:", err);
      setErrorMsg(err.message || "Failed to trigger recovery sequence.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 p-4 font-sans select-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[460px] bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-8 shadow-2xl flex flex-col gap-6"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-wider text-white uppercase mt-2">
            FactoryMind AI
          </h2>
          <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">
            Access Recovery
          </span>
          <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
            Trigger credential reset token for your plant operator profile.
          </p>
        </div>

        {/* Success Alert */}
        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs text-emerald-400 flex flex-col items-center text-center gap-2.5"
          >
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            <div>
              <span className="font-bold text-white block mb-1">Recovery Transmitted</span>
              An access recovery link has been dispatched to your email inbox. Please review the instructions to reset your password.
            </div>
            <Link
              to="/login"
              className="mt-2 text-xs font-bold text-primary hover:underline"
            >
              Return to Login
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Error Alert Box */}
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3.5 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive flex gap-2.5 items-start"
              >
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-semibold text-white">Transmission Fault:</span> {errorMsg}
                </div>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  Registered Operator Email
                </label>
                <input
                  type="email"
                  disabled={isSubmitting}
                  placeholder="e.g. operator@dangotecement.com"
                  {...register("email")}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-primary/80 focus:ring-1 focus:ring-primary/40 rounded px-3.5 py-2 text-sm placeholder:text-muted-foreground/35 outline-none transition-all text-slate-100"
                />
                {errors.email && (
                  <span className="text-[10px] text-destructive font-semibold">
                    {errors.email.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs uppercase tracking-wider py-2.5 rounded shadow-lg shadow-primary/10 active:translate-y-[1px] transition-all flex items-center justify-center gap-2 border border-primary/40 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Transmitting Request...
                  </>
                ) : (
                  "Request Recovery Link"
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="border-t border-slate-800/80 pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Recall access code?{" "}
                <Link
                  to="/login"
                  className="font-bold text-primary hover:underline"
                >
                  Return to Login
                </Link>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
