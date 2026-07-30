import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import api from "../../../api/axios";
import { changePasswordSchema } from "../../../validations/changePasswordSchema";
import { useEffect } from "react";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.put("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      toast.success(res.data.message || "Password changed successfully.");
      reset();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to change password."
      );
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white/85 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-hidden text-left max-w-xl mx-auto">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-primary/5 blur-[50px] pointer-events-none" />

      {/* Header Info */}
      <div className="mb-8 relative z-10">
        <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
          Security Key
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-secondary font-heading mb-1.5">
          Change Password
        </h2>
        <p className="text-xs text-text-muted font-body leading-relaxed">
          Maintain a secure credential key to protect your private clinic records and downloads drive.
        </p>
      </div>

      {/* Form Submission */}
      <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-5">

        {/* Current Password */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            Current Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("currentPassword")}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
          />
          {errors.currentPassword && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("newPassword")}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
          />
          {errors.newPassword && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
          />
          {errors.confirmPassword && (
            <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Action Button */}
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
              Updating Security Key...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Change Password
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default ChangePassword;