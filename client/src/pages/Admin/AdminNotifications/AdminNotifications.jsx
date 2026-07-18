import { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import CustomSelect from "../../../components/CustomSelect/CustomSelect";

const AdminNotifications = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targetUrl, setTargetUrl] = useState("/dashboard");
  const [recipientType, setRecipientType] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch users when specific user recipient is selected
  useEffect(() => {
    if (recipientType === "specific" && users.length === 0) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const res = await api.get("/notifications/users");
          setUsers(res.data.users || []);
          if (res.data.users?.length > 0) {
            setSelectedUserId(res.data.users[0]._id);
          }
        } catch (error) {
          console.error("Error fetching users list:", error);
          toast.error("Failed to load users list.");
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [recipientType, users.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!title.trim()) {
      return toast.error("Notification Title is required.");
    }
    if (!message.trim()) {
      return toast.error("Notification Message is required.");
    }
    if (!targetUrl.startsWith("/")) {
      return toast.error("Target URL must be a relative internal path starting with '/'.");
    }
    if (recipientType === "specific" && !selectedUserId) {
      return toast.error("Please select a specific recipient user.");
    }

    setSubmitting(true);
    try {
      const payload = {
        title,
        message,
        targetUrl,
        recipientType,
        userId: recipientType === "specific" ? selectedUserId : undefined,
      };

      await api.post("/notifications/send", payload);
      toast.success("Notifications broadcasted successfully!");

      // Reset form (except recipient settings)
      setTitle("");
      setMessage("");
    } catch (error) {
      console.error("Error sending push notifications:", error);
      toast.error(error.response?.data?.message || "Failed to send notifications.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredUsers = users.filter(
    (usr) =>
      usr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usr.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userOptions = filteredUsers.map((usr) => ({
    value: usr._id,
    label: `${usr.name} (${usr.email}) [${usr.role.toUpperCase()}]`,
  }));

  return (
    <div className="flex flex-col gap-8 text-left max-w-3xl mx-auto">

      <div>
        <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
          Notification Dispatch
        </span>
        <h2 className="text-2xl font-bold tracking-tight text-secondary font-heading leading-tight">
          Send Web Push Notifications
        </h2>
        <p className="text-xs text-text-muted font-body mt-0.5">
          Broadcast a clinic-wide alert, notify fellow administrators, or target a specific user directly on their active devices.
        </p>
      </div>

      {/*Dispatch Form */}
      <div className="bg-white border border-slate-200/60 rounded-[32px] p-6 sm:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6.5">

          {/* Recipient Type Row */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
              Recipient Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option: All */}
              <button
                type="button"
                onClick={() => setRecipientType("all")}
                className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${recipientType === "all"
                  ? "bg-primary border-primary text-white shadow shadow-primary/20"
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
              >
                All Subscribed
              </button>

              {/* Option: Admins */}
              <button
                type="button"
                onClick={() => setRecipientType("admin")}
                className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${recipientType === "admin"
                  ? "bg-primary border-primary text-white shadow shadow-primary/20"
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
              >
                Admins Only
              </button>

              {/* Option: Specific User */}
              <button
                type="button"
                onClick={() => setRecipientType("specific")}
                className={`py-3 px-4 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${recipientType === "specific"
                  ? "bg-primary border-primary text-white shadow shadow-primary/20"
                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                  }`}
              >
                Specific User
              </button>
            </div>
          </div>

          {/* Conditional Dropdown for Specific User Selection */}
          {recipientType === "specific" && (
            <div className="flex flex-col gap-2 animate-page-entrance">
              <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                Target User
              </label>
              <input
                type="text"
                placeholder="Type name or email to search user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2.5 mb-2 rounded-2xl border border-slate-200 bg-white text-secondary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-sm"
              />
              {loadingUsers ? (
                <div className="text-xs text-slate-400 font-semibold uppercase animate-pulse py-2">
                  Loading user list...
                </div>
              ) : (
                <CustomSelect
                  value={selectedUserId}
                  onChange={(val) => setSelectedUserId(val)}
                  options={userOptions}
                  placeholder="Select Target User"
                />
              )}
            </div>
          )}

          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
              Notification Title
            </label>
            <input
              type="text"
              placeholder="e.g. Appointment Confirmed, Special Clinic Updates"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
            />
            <span className="text-[10px] text-slate-400 self-end">
              {title.length}/100 characters
            </span>
          </div>

          {/* Message Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
              Notification Message
            </label>
            <textarea
              placeholder="Enter the body content details here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm resize-none"
            />
            <span className="text-[10px] text-slate-400 self-end">
              {message.length}/500 characters
            </span>
          </div>

          {/* Target URL Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
              Target Redirect URL
            </label>
            <input
              type="text"
              placeholder="e.g. /dashboard/appointments, /resources, /blog"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
            />
            <p className="text-[10px] text-text-muted leading-relaxed">
              Must be a relative path starting with '/' (e.g. <code>/blog</code>). External domains are forbidden for security.
            </p>

            {/* Quick Suggestions buttons list */}
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-1">Suggestions:</span>
              {["/dashboard", "/resources", "/blog", "/testimonials", "/contact"].map((sugg) => (
                <button
                  key={sugg}
                  type="button"
                  onClick={() => setTargetUrl(sugg)}
                  className="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-slate-200 text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{ cursor: submitting ? "wait" : "pointer" }}
            className={`w-full py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-premium mt-2 ${submitting
              ? "bg-slate-100 text-slate-400 border border-slate-200"
              : "bg-primary hover:bg-primary/95 text-white border border-primary shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.01]"
              }`}
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                Dispatching push notifications...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Send Notifications
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AdminNotifications;
