import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../../validations/profileSchema";
import api from "../../../api/axios";
import { useAuth } from "../../../context/AuthContext";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";

const DashboardProfile = () => {
  const { user, fetchCurrentUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("age", data.age);
      formData.append("gender", data.gender);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const res = await api.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchCurrentUser();
      toast.success(res.data.message || "Profile updated successfully.");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to update profile."
      );
    }
  };

  return (
    <div className="bg-white/85 border border-slate-200/60 backdrop-blur-md rounded-[32px] p-6 sm:p-10 shadow-2xl relative overflow-visible text-left max-w-l mx-auto">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] rounded-full bg-primary/5 blur-[50px] pointer-events-none" />

      {/* Header Info */}
      <div className="mb-8 relative z-10">
        <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
          Credentials
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-secondary font-heading mb-1.5">
          Update Profile Details
        </h2>
        <p className="text-xs text-text-muted font-body leading-relaxed">
          Maintain your personal record credentials, phone contacts, and customize your profile photo.
        </p>
      </div>

      {/* Form Submission */}
      <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 flex flex-col gap-6">

        {/* Profile Image Uploader Row */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
          <div className="relative shrink-0">
            {user?.image ? (
              <img
                src={user.image}
                alt="Avatar"
                className="w-22 h-22 rounded-2xl object-cover border-2 border-primary/30 shadow-md"
              />
            ) : (
              <div className="w-22 h-22 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-3xl text-primary border-2 border-dashed border-slate-200">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full text-left">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
              Update Avatar / Photo
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="text-xs text-slate-500 file:mr-4 file:py-2 file:px-4.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
            {errors.image && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.image.message}</p>}
          </div>
        </div>

        {/* Name and Email Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Full Name</label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
            />
            {errors.name && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Email Address</label>
            <input
              type="email"
              disabled
              {...register("email")}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200/50 bg-slate-50/70 text-slate-400 cursor-not-allowed text-sm font-medium focus:outline-none"
            />
            {errors.email && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.email.message}</p>}
          </div>
        </div>

        {/* Phone and Age Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Phone Number</label>
            <input
              type="text"
              {...register("phone")}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
            />
            {errors.phone && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.phone.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Age (Years)</label>
            <input
              type="number"
              {...register("age")}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200/80 bg-white/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
            />
            {errors.age && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.age.message}</p>}
          </div>
        </div>

        {/* Gender Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">Gender Identity</label>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <CustomSelect
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: "Male", label: "Male" },
                  { value: "Female", label: "Female" },
                  { value: "Other", label: "Other" },
                  { value: "Prefer not to say", label: "Prefer not to say" }
                ]}
                placeholder="Select Gender"
              />
            )}
          />
          {errors.gender && <p className="text-[10px] text-rose-500 font-bold uppercase mt-1">{errors.gender.message}</p>}
        </div>

        {/* Action Trigger */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ cursor: isSubmitting ? "wait" : "pointer" }}
          className={`w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-premium cursor-pointer mt-2 ${isSubmitting
              ? "bg-slate-100 text-slate-400 border border-slate-200"
              : "bg-primary hover:bg-primary/95 text-white border border-primary shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.01]"
            }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Save Credentials
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default DashboardProfile;