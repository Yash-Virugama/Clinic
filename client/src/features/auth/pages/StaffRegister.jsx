import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useBranding } from "../../../context/BrandingContext";
import { staffRegisterSchema } from "../../../validations/authSchema";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import CustomSelect from "../../../components/ui/CustomSelect";
import BackgroundGlows from "../../../components/ui/BackgroundGlows";
import Button from "../../../components/ui/Button";
import Loader from "../../../components/ui/Loader";

const StaffRegister = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { fetchCurrentUser } = useAuth();
  const { settings } = useBranding();

  const [invitation, setInvitation] = useState(null);
  const [loadingInvitation, setLoadingInvitation] = useState(true);
  const [invitationError, setInvitationError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(staffRegisterSchema),
    defaultValues: {
      name: "",
      password: "",
      confirmPassword: "",
      phone: "",
      age: "",
      gender: "",
    },
  });

  // Validate the invitation token on mount
  useEffect(() => {
    const checkInvitation = async () => {
      try {
        setLoadingInvitation(true);
        const res = await api.get(`/staff/invitations/${token}`);
        setInvitation(res.data.invitation);
      } catch (error) {
        console.error("Token validation error:", error);
        setInvitationError(
          error.response?.data?.message || "This invitation is invalid or has expired."
        );
      } finally {
        setLoadingInvitation(false);
      }
    };

    if (token) {
      checkInvitation();
    }
  }, [token]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        password: data.password,
        phone: data.phone,
        age: Number(data.age),
        gender: data.gender,
      };

      const res = await api.post(`/staff/invitations/${token}/accept`, payload);
      toast.success(res.data.message || "Account setup successful!");

      // Retrieve authenticated user
      const currentUser = await fetchCurrentUser();

      // Redirect depending on user role
      if (currentUser?.user?.role === "admin") {
        navigate("/admin");
      } else if (["assistant", "intern", "physiotherapist", "receptionist"].includes(currentUser?.user?.role)) {
        navigate(`/staff/${currentUser.user.role}`);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Setup error:", error);
      toast.error(error.response?.data?.message || "Failed to set up account.");
    }
  };

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
    { value: "Prefer not to say", label: "Prefer not to say" },
  ];

  if (loadingInvitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-offwhite bg-grid-blueprint relative">
        <BackgroundGlows />
        <div className="text-center z-10">
          <Loader />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-4">
            Verifying Invitation Token...
          </p>
        </div>
      </div>
    );
  }

  if (invitationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-offwhite bg-grid-blueprint relative px-4 py-8 overflow-hidden">
        <BackgroundGlows />
        <div className="w-full max-w-md bg-white/85 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-8 sm:p-10 shadow-2xl relative z-10 text-center animate-page-entrance">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-secondary font-heading mb-3">
            Invitation Invalid
          </h2>
          <p className="text-xs text-text-muted font-body leading-relaxed mb-8">
            {invitationError}. Please contact your clinic administrator for a new staff registration invitation link.
          </p>
          <Link to="/">
            <Button variant="primary" className="w-full">
              Go to Home Page
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const roleDisplay = invitation?.role ? invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1) : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-offwhite bg-grid-blueprint relative px-4 py-6 sm:py-12 overflow-hidden">
      <BackgroundGlows />

      <div className="w-full max-w-2xl bg-white/85 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-8 sm:p-10 shadow-2xl relative z-10 text-left animate-page-entrance">
        {/* Clinic Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            {settings?.logo ? (
              <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
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
          <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase font-accent">
            Staff Portal Setup
          </span>
          <h2 className="text-2.5xl font-bold tracking-tight text-secondary font-heading mt-1 mb-1.5">
            Complete Account Setup
          </h2>
          <p className="text-xs text-text-muted font-body leading-relaxed max-w-sm mx-auto">
            Fill out your profile credentials below to activate your staff membership account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5.5">
          {/* Row 1: Email and Role (Read-only) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                Assigned Email (Read-Only)
              </label>
              <input
                type="text"
                readOnly
                value={invitation?.email || ""}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/50 bg-slate-100/50 text-slate-400 text-sm font-medium focus:outline-none cursor-not-allowed shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
                Assigned Role (Read-Only)
              </label>
              <input
                type="text"
                readOnly
                value={roleDisplay}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/50 bg-slate-100/50 text-slate-400 text-sm font-medium focus:outline-none cursor-not-allowed shadow-inner"
              />
            </div>
          </div>

          {/* Row 2: Full Name and Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
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
                Phone Number
              </label>
              <input
                type="text"
                placeholder="e.g. 9876543210"
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
                Age
              </label>
              <input
                type="number"
                placeholder="Enter your age"
                {...register("age")}
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
                Gender
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

          {/* Row 4: Password and Confirm Password */}
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
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              />
              {errors.confirmPassword && (
                <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            className="w-full mt-4"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-transparent rounded-full animate-spin mr-2" />
                Setting up account...
              </>
            ) : (
              "Complete Setup & Login"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StaffRegister;
