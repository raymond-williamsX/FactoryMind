import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authService } from "@/services/authService";

const loginSchema = zod.object({
  email: zod.string().min(1, "Email address is required").email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Resolve post-login redirection target
  const from = location.state?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await authService.signIn({
        email: values.email,
        password: values.password,
      });
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Login attempt failed:", err);
      setErrorMsg(err.message || "Failed to establish a valid platform session.");
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
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-wider text-white uppercase mt-2">
            FactoryMind AI
          </h2>
          <span className="text-[10px] text-primary font-bold uppercase tracking-widest leading-none">
            Dangote Plant Intelligence
          </span>
          <p className="text-xs text-muted-foreground mt-1 max-w-[280px]">
            Enterprise Gateway. Authenticate session to access kiln, milling, and asset status.
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
              <span className="font-semibold text-white">System Error:</span> {errorMsg}
            </div>
          </motion.div>
        )}

        {/* Form Controls */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              Plant Operator Email
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

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                Operator Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold text-primary hover:underline hover:text-primary/90"
              >
                Reset Access?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                disabled={isSubmitting}
                placeholder="••••••••"
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

          {/* Submit Trigger */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs uppercase tracking-wider py-2.5 rounded shadow-lg shadow-primary/10 active:translate-y-[1px] transition-all flex items-center justify-center gap-2 border border-primary/40 mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Establishing Session...
              </>
            ) : (
              "Establish Secure Connection"
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="border-t border-slate-800/80 pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            New operator node?{" "}
            <Link
              to="/register"
              className="font-bold text-primary hover:underline hover:text-primary/90"
            >
              Provision Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
