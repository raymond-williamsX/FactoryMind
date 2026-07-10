import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cpu, Loader2, AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/authService";
import { dbService } from "@/services/dbService";
import type { Plant, Department } from "@/services/dbService";

// Fallbacks for UI if database is empty or unreachable during loading
const FALLBACK_ROLES = [
  { role_name: "super_admin", display_name: "Super Administrator" },
  { role_name: "plant_manager", display_name: "Plant Manager" },
  { role_name: "operations_manager", display_name: "Operations Manager" },
  { role_name: "maintenance_engineer", display_name: "Maintenance Engineer" },
  { role_name: "quality_engineer", display_name: "Quality Engineer" },
  { role_name: "energy_analyst", display_name: "Energy Analyst" },
  { role_name: "read_only_executive", display_name: "Read-Only Executive" },
];

const FALLBACK_PLANTS = [
  { id: "33333333-3333-3333-3333-333333333331", name: "Obajana Cement Plant" },
  { id: "33333333-3333-3333-3333-333333333332", name: "Ibese Cement Plant" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Gboko Cement Plant" },
];

const FALLBACK_DEPARTMENTS = [
  { id: "44444444-4444-4444-4444-444444444411", name: "Kiln & Pyroprocessing" },
  { id: "44444444-4444-4444-4444-444444444412", name: "Raw Grinding & Mill" },
  { id: "44444444-4444-4444-4444-444444444413", name: "Quality Control Lab" },
  { id: "44444444-4444-4444-4444-444444444414", name: "Energy & Power Utility" },
];

const registerSchema = zod.object({
  fullName: zod.string().min(2, "Full name must be at least 2 characters"),
  email: zod.string().min(1, "Email is required").email("Please enter a valid email"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
  roleName: zod.string().min(1, "Please select an operational role"),
  assignedPlantId: zod.string().min(1, "Please assign a primary plant"),
  departmentId: zod.string().min(1, "Please select a department segment"),
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [roles, setRoles] = useState<any[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(true);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      roleName: "read_only_executive",
      assignedPlantId: "",
      departmentId: "",
    },
  });

  const selectedPlantId = watch("assignedPlantId");

  // Load selection fields (roles, plants, departments) from the database
  useEffect(() => {
    let isMounted = true;
    const fetchMetadata = async () => {
      try {
        const [rolesList, plantsList] = await Promise.all([
          dbService.getRoles(),
          dbService.getPlants(),
        ]);
        
        if (isMounted) {
          setRoles(rolesList.length > 0 ? rolesList : FALLBACK_ROLES);
          setPlants(plantsList.length > 0 ? plantsList : FALLBACK_PLANTS as Plant[]);
        }
      } catch (err) {
        console.warn("Failed to load DB dropdowns, utilizing standard defaults:", err);
        if (isMounted) {
          setRoles(FALLBACK_ROLES);
          setPlants(FALLBACK_PLANTS as Plant[]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingDropdowns(false);
        }
      }
    };

    fetchMetadata();
    return () => { isMounted = false; };
  }, []);

  // Fetch departments dynamically when selected plant changes
  useEffect(() => {
    let isMounted = true;
    const fetchDepts = async () => {
      if (!selectedPlantId) {
        setDepartments([]);
        return;
      }
      try {
        const deptsList = await dbService.getDepartments(selectedPlantId);
        if (isMounted) {
          setDepartments(deptsList.length > 0 ? deptsList : FALLBACK_DEPARTMENTS as Department[]);
        }
      } catch (err) {
        if (isMounted) {
          setDepartments(FALLBACK_DEPARTMENTS as Department[]);
        }
      }
    };

    fetchDepts();
    return () => { isMounted = false; };
  }, [selectedPlantId]);

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await authService.signUp(
        { email: values.email, password: values.password },
        {
          fullName: values.fullName,
          roleName: values.roleName,
          assignedPlantId: values.assignedPlantId,
          departmentId: values.departmentId,
        }
      );
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3500);
    } catch (err: any) {
      console.error("Registration error:", err);
      setErrorMsg(err.message || "Failed to provision operator node on Supabase.");
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
        className="relative w-full max-w-[500px] bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-8 shadow-2xl flex flex-col gap-6"
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
              Node Provisioned
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Operator profile created successfully! Redirection to the Login screen is starting.
            </p>
            <Loader2 className="h-4 w-4 text-emerald-500 animate-spin mt-2" />
          </motion.div>
        )}

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center gap-1">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold tracking-wider text-white uppercase mt-2">
            FactoryMind AI
          </h2>
          <span className="text-[9px] text-primary font-bold uppercase tracking-widest leading-none">
            Provision Operator Node
          </span>
          <p className="text-xs text-muted-foreground mt-1.5">
            Configure role permissions, plant allocation, and local team structure.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-destructive/10 border border-destructive/20 rounded text-xs text-destructive flex gap-2 items-start"
          >
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold text-white">Provision Failure:</span> {errorMsg}
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 text-left">
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">
                Operator Full Name
              </label>
              <input
                type="text"
                disabled={isSubmitting}
                placeholder="e.g. Aliko Dangote"
                {...register("fullName")}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-primary/80 focus:ring-1 focus:ring-primary/40 rounded px-3 py-1.5 text-xs placeholder:text-muted-foreground/35 outline-none transition-all text-slate-100"
              />
              {errors.fullName && (
                <span className="text-[9px] text-destructive font-semibold">
                  {errors.fullName.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">
                Email Address
              </label>
              <input
                type="email"
                disabled={isSubmitting}
                placeholder="e.g. name@dangote.com"
                {...register("email")}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-primary/80 focus:ring-1 focus:ring-primary/40 rounded px-3 py-1.5 text-xs placeholder:text-muted-foreground/35 outline-none transition-all text-slate-100"
              />
              {errors.email && (
                <span className="text-[9px] text-destructive font-semibold">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">
              Account Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                disabled={isSubmitting}
                placeholder="Minimum 6 characters"
                {...register("password")}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-primary/80 focus:ring-1 focus:ring-primary/40 rounded pl-3 pr-10 py-1.5 text-xs placeholder:text-muted-foreground/35 outline-none transition-all text-slate-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-2 text-muted-foreground hover:text-slate-100 transition-colors"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
            {errors.password && (
              <span className="text-[9px] text-destructive font-semibold">
                {errors.password.message}
              </span>
            )}
          </div>

          {/* Operational Role Selection */}
          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">
              Security Role Authorization
            </label>
            {isLoadingDropdowns ? (
              <div className="h-8 bg-slate-950/60 border border-slate-800 rounded animate-pulse flex items-center px-3">
                <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <select
                disabled={isSubmitting}
                {...register("roleName")}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-primary/80 focus:ring-1 focus:ring-primary/40 rounded px-3 py-1.5 text-xs outline-none transition-all text-slate-100 cursor-pointer appearance-none"
              >
                {roles.map((r) => (
                  <option key={r.role_name} value={r.role_name} className="bg-slate-950 text-slate-200">
                    {r.display_name} ({r.role_name})
                  </option>
                ))}
              </select>
            )}
            {errors.roleName && (
              <span className="text-[9px] text-destructive font-semibold">
                {errors.roleName.message}
              </span>
            )}
          </div>

          {/* Primary Plant & Department selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">
                Primary Plant Assignment
              </label>
              {isLoadingDropdowns ? (
                <div className="h-8 bg-slate-950/60 border border-slate-800 rounded animate-pulse flex items-center px-3" />
              ) : (
                <select
                  disabled={isSubmitting}
                  {...register("assignedPlantId")}
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-primary/80 focus:ring-1 focus:ring-primary/40 rounded px-3 py-1.5 text-xs outline-none transition-all text-slate-100 cursor-pointer appearance-none"
                >
                  <option value="" className="bg-slate-950">-- Select Cement Plant --</option>
                  {plants.map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-950 text-slate-200">
                      {p.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.assignedPlantId && (
                <span className="text-[9px] text-destructive font-semibold">
                  {errors.assignedPlantId.message}
                </span>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">
                Department Segment
              </label>
              <select
                disabled={isSubmitting || !selectedPlantId}
                {...register("departmentId")}
                className="w-full bg-slate-950/60 border border-slate-800 focus:border-primary/80 focus:ring-1 focus:ring-primary/40 rounded px-3 py-1.5 text-xs outline-none transition-all text-slate-100 cursor-pointer appearance-none disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-slate-950">-- Select Department --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-950 text-slate-200">
                    {d.name}
                  </option>
                ))}
              </select>
              {errors.departmentId && (
                <span className="text-[9px] text-destructive font-semibold">
                  {errors.departmentId.message}
                </span>
              )}
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold text-xs uppercase tracking-wider py-2 rounded shadow-lg shadow-primary/10 active:translate-y-[1px] transition-all flex items-center justify-center gap-2 border border-primary/40 mt-5"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Provisioning Operator Node...
              </>
            ) : (
              "Provision Operator Node"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="border-t border-slate-800/80 pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Already authorized?{" "}
            <Link
              to="/login"
              className="font-bold text-primary hover:underline hover:text-primary/90"
            >
              Sign In Session
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
