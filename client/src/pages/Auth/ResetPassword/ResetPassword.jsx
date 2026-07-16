import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../../../api/axios";
import { resetPasswordSchema } from "../../../validations/resetPasswordSchema";
import { useBranding } from "../../../context/BrandingContext";
import { useEffect } from "react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { settings } = useBranding();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.put(
        `/auth/reset-password/${token}`,
        {
          password: data.password,
        }
      );

      toast.success(res.data.message);
      reset();
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to reset password."
      );
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

        <Link to="/login" className="arrow">
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
            <span className="font-heading text-lg lg:text-[23px] font-bold text-secondary tracking-tight">
              {settings?.name || "PhysioCare"}
            </span>
          </div>
          <div className="text-center">
            {/* <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-accent">
              Security Gate
            </span> */}
            <h2 className="text-2.5xl font-bold tracking-tight text-secondary font-heading mt-1 mb-1.5">
              Reset Password
            </h2>
            <p className="text-xs text-text-muted font-body leading-relaxed max-w-xs mx-auto">
              Please enter and confirm your new account password credentials below.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5.5">
          {/* New Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
              New Password
            </label>
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

          {/* Confirm Password input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword")}
                className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
                {errors.confirmPassword.message}
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
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-text-muted font-body">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Log in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ResetPassword;