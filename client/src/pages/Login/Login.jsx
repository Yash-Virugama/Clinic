import "./Login.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../../validations/authSchema";
import { useAuth } from "../../context/AuthContext";
import { useBranding } from "../../context/BrandingContext";
import { useEffect } from "react";

const Login = () => {
  const { login, fetchCurrentUser } = useAuth();
  const { settings } = useBranding();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data);
      const currentUser = await fetchCurrentUser();

      if (currentUser?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-offwhite bg-grid-blueprint relative px-4 py-8 overflow-hidden">
      {/* Ambient background lighting */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-primary-glow blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-glow blur-[100px] pointer-events-none z-0" />

      <div className="w-full max-w-md bg-white/85 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-8 sm:p-10 shadow-2xl relative z-10 text-left overflow-visible animate-page-entrance">

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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3" />
                </svg>
              </div>
            )}
            <span className="font-heading text-lg sm:text-[23px] font-bold text-secondary tracking-tight">
              {settings?.name || "PhysioCare"}
            </span>
          </div>
          {/* <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-accent">
            Secure Portal
          </span> */}
          <h2 className="text-2.5xl font-bold tracking-tight text-secondary font-heading mt-1 mb-1.5">
            Welcome Back
          </h2>
          <p className="text-xs text-text-muted font-body leading-relaxed max-w-xs mx-auto">
            Log in to access your digital exercises, downloads drive, and recovery checklist logs.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5.5">
          {/* Email input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
            </div>
            {errors.email && (
              <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold text-primary hover:text-primary/80 uppercase tracking-wide font-accent"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002-2v-6.75a2.25 2.25 0 00-2-2H6.75a2.25 2.25 0 00-2 2v6.75a2.25 2.25 0 002 2z" />
                </svg>
              </div>
            </div>
            {errors.password && (
              <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Action Trigger */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ cursor: isSubmitting ? "wait" : "pointer" }}
            className={`w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer mt-1 ${isSubmitting
              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
              : "bg-primary hover:bg-primary/95 text-white border border-primary shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.01]"
              }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                Validating...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="pt-8 text-center">
          <p className="text-xs text-text-muted font-body">
            Not registered?{" "}
            <Link
              to="/register"
              className="font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;