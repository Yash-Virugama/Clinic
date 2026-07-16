import "./Register.css";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validations/authSchema";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBranding } from "../../context/BrandingContext";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import { useEffect } from "react";

const Register = () => {
  const { register: registerUser } = useAuth();
  const { settings } = useBranding();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      age: "",
      gender: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
    { value: "Prefer not to say", label: "Prefer not to say" }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-offwhite bg-grid-blueprint relative px-4 py-6 sm:py-12 overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] rounded-full bg-primary-glow blur-[110px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-accent-glow blur-[110px] pointer-events-none z-0" />

      <div className="w-full max-w-2xl bg-white/85 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-8 sm:p-10 shadow-2xl relative z-10 text-left overflow-visible animate-page-entrance">

        <Link to="/" className="arrow">
          <svg
            className="w-5 h-5 text-primary hover:text-primary-hover stroke-[2.2]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>

        {/* Dynamic Clinic Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            {settings?.logo ? (
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={settings.logo}
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner shrink-0">
                <svg className="w-5 h-5 text-primary stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-9-4.5h.01M9 16h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <span className="font-heading text-lg lg:text-[23px] font-bold text-secondary tracking-tight">
              {settings?.name || "PhysioCare"}
            </span>
          </div>
          {/* <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-accent">
            Patient Hub Registration
          </span> */}
          <h2 className="text-2.5xl font-bold tracking-tight text-secondary font-heading mt-1 mb-1.5">
            Create Account
          </h2>
          <p className="text-xs text-text-muted font-body leading-relaxed max-w-sm mx-auto">
            Sign up to access your digital exercises, downloads drive, and customize your therapy logs.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5.5">

          {/* Row 1: Name and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              />
              {errors.name && (
                <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                {...register("email")}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              />
              {errors.email && (
                <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Password and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("password")}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              />
              {errors.password && (
                <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 XXXXX XXXXX"
                {...register("phone")}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              />
              {errors.phone && (
                <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Age and Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                Age (Years)
              </label>
              <input
                type="number"
                placeholder="Enter age"
                {...register("age", { valueAsNumber: true })}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              />
              {errors.age && (
                <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                Gender Identity
              </label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    value={field.value}
                    onChange={field.onChange}
                    options={genderOptions}
                    placeholder="Select Gender"
                  />
                )}
              />
              {errors.gender && (
                <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
                  {errors.gender.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Trigger */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ cursor: isSubmitting ? "wait" : "pointer" }}
            className={`w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer mt-2 ${isSubmitting
              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              : "bg-primary hover:bg-primary/95 text-white border border-primary shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.01]"
              }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                Registering Patient...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="pt-8 text-center">
          <p className="text-xs text-text-muted font-body">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;