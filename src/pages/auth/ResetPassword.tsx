import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/authService";

const resetSchema = zod
  .object({
    password: zod.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: zod.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormValues = zod.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await authService.resetPassword(values.password);
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Password reset failure:", err);
      setErrorMsg(err.message || "Failed to update operator password.");
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
        className="relative w-full max-w-[460px] bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-8 shadow-2xl flex flex-col gap-6"
      >
        {/* Success Card overlay */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm rounded-xl z-20 flex flex-col items-center justify-center text-center p-6 gap-4"
          >
            <CheckCircle2 className="h-14 w-14 text-emerald-500 animate-bounce" />
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">
              Password Restored
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your password has been updated. Redirection to the Login screen is starting.
            </p>
            <Loader2 className="h-4 w-4 text-emerald-500 animate-spin mt-2" />
          </motion.div>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-wider text-white uppercase mt-2">
            FactoryMind AI
          </h2>
          <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">
            Reset Password
          </span>
          <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
            Configure a new operator password to access your profile nodes.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive flex gap-2.5 items-start"
          >
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-white">Update Fault:</span> {errorMsg}
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                disabled={isSubmitting}
                placeholder="Minimum 6 characters"
                {...register("password")}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-primary/80 focus:ring-1 focus:ring-primary/40 rounded pl-3.5 pr-10 py-2 text-sm placeholder:text-muted-foreground/35 outline-none transition-all text-slate-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-slate-100 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[10px] text-destructive font-semibold">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Confirm New Password
            </label>
            <input
              type="password"
              disabled={isSubmitting}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className="w-full bg-slate-950/60 border border-slate-800 focus:border-primary/80 focus:ring-1 focus:ring-primary/40 rounded px-3.5 py-2 text-sm placeholder:text-muted-foreground/35 outline-none transition-all text-slate-100"
            />
            {errors.confirmPassword && (
              <span className="text-[10px] text-destructive font-semibold">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs uppercase tracking-wider py-2.5 rounded shadow-lg shadow-primary/10 active:translate-y-[1px] transition-all flex items-center justify-center gap-2 border border-primary/40 mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Updating Credentials...
              </>
            ) : (
              "Save New Password"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="border-t border-slate-800/80 pt-4 text-center">
          <Link
            to="/login"
            className="text-xs font-bold text-primary hover:underline"
          >
            Cancel and Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
