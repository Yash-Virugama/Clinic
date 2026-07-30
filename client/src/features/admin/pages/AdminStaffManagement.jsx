import { useEffect, useState } from "react";
import api from "../../../api/axios";
import toast from "react-hot-toast";
import ModalShell from "../../../components/ui/ModalShell";
import Button from "../../../components/ui/Button";
import CustomSelect from "../../../components/ui/CustomSelect";
import Spinner from "../../../components/ui/Spinner";
import CustomConfirmModal from "../../../components/ui/CustomConfirmModal";
import Searchbar from "../../../components/ui/Searchbar";

const PERMISSION_METADATA = {
  admin: [
    { value: "services:view", label: "View Services" },
    { value: "services:manage", label: "Manage Services" },
    { value: "blogs:view", label: "View Blogs" },
    { value: "blogs:manage", label: "Manage Blogs" },
    { value: "resources:view", label: "View Resources" },
    { value: "resources:manage", label: "Manage Resources" },
    { value: "testimonials:view", label: "View Testimonials" },
    { value: "testimonials:manage", label: "Manage Testimonials" },
    { value: "contacts:view", label: "View Contact Inquiries" },
    { value: "contacts:manage", label: "Delete Contact Inquiries" },
    { value: "notifications:send", label: "Send Push Notifications" },
    { value: "settings:manage", label: "Manage Clinic Settings" },
    { value: "staff:manage", label: "Manage Staff & Invitations" },
  ],
  clinic: [
    { value: "clinic:dashboard", label: "View Clinic Dashboard" },
    { value: "appointments:view", label: "View Appointments" },
    { value: "appointments:manage", label: "Manage Appointments" },
    { value: "patients:view", label: "View Patients" },
    { value: "patients:manage", label: "Manage Patients (Add, Edit, Notes)" },
    { value: "visits:view", label: "View Clinic Visits" },
    { value: "visits:manage", label: "Manage Clinic Visits" },
    { value: "payments:view", label: "View Payments" },
    { value: "payments:manage", label: "Manage Payments" },
    { value: "reports:view", label: "View Reports & Export" },
  ],
};

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "assistant", label: "Assistant" },
  { value: "intern", label: "Intern" },
  { value: "physiotherapist", label: "Physiotherapist" },
  { value: "receptionist", label: "Receptionist" },
];

const DEFAULT_ROLE_PERMISSIONS = {
  assistant: [
    "services:view",
    "blogs:view",
    "resources:view",
    "testimonials:view",
    "clinic:dashboard",
    "appointments:view",
    "patients:view"
  ],
  intern: [
    "services:view",
    "blogs:view",
    "resources:view",
    "testimonials:view",
    "clinic:dashboard",
    "appointments:view",
    "patients:view",
    "visits:view"
  ],
  physiotherapist: [
    "services:view",
    "blogs:view",
    "resources:view",
    "testimonials:view",
    "clinic:dashboard",
    "appointments:view",
    "appointments:manage",
    "patients:view",
    "patients:manage",
    "visits:view",
    "visits:manage"
  ],
  receptionist: [
    "services:view",
    "blogs:view",
    "resources:view",
    "testimonials:view",
    "contacts:view",
    "clinic:dashboard",
    "appointments:view",
    "appointments:manage",
    "patients:view",
    "patients:manage",
    "visits:view",
    "visits:manage",
    "payments:view"
  ],
  admin: []
};

const AdminStaffManagement = () => {
  const [activeTab, setActiveTab] = useState("staff");
  const [staffList, setStaffList] = useState([]);
  const [invitationList, setInvitationList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Confirm Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    isLoading: false,
    confirmText: "Confirm",
    loadingText: "Processing...",
  });

  // Form State
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("physiotherapist");
  const [permissions, setPermissions] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Search/Filters State
  const [staffSearch, setStaffSearch] = useState("");
  const [staffRoleFilter, setStaffRoleFilter] = useState("all");

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (DEFAULT_ROLE_PERMISSIONS[newRole]) {
      setPermissions(DEFAULT_ROLE_PERMISSIONS[newRole]);
    } else {
      setPermissions([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "staff") {
        const res = await api.get("/staff");
        setStaffList(res.data.staff || []);
      } else {
        const res = await api.get("/staff/invitations");
        setInvitationList(res.data.invitations || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [activeTab]);

  const handlePermissionChange = (permValue) => {
    if (permissions.includes(permValue)) {
      setPermissions(permissions.filter((p) => p !== permValue));
    } else {
      setPermissions([...permissions, permValue]);
    }
  };

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email is required.");

    setSubmitting(true);
    try {
      const payload = {
        email: email.trim(),
        role,
        permissions: role === "admin" ? [] : permissions, // Admins bypass permissions
      };

      await api.post("/staff/invitations", payload);
      toast.success("Invitation sent successfully!");
      setInviteModalOpen(false);
      // Reset form
      setEmail("");
      setRole("physiotherapist");
      setPermissions([]);
      // Refresh list
      fetchData();
    } catch (error) {
      console.error("Invite error:", error);
      toast.error(error.response?.data?.message || "Failed to send invitation.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditOpen = (staff) => {
    setSelectedStaff(staff);
    setRole(staff.role);
    setPermissions(staff.permissions || []);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        role,
        permissions: role === "admin" ? [] : permissions,
      };

      await api.patch(`/staff/${selectedStaff._id}/role`, payload);
      toast.success("Staff profile updated successfully!");
      setEditModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update staff.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = (staffId, currentStatus) => {
    const actionWord = currentStatus ? "deactivate" : "activate";
    setConfirmModalConfig({
      isOpen: true,
      title: `${currentStatus ? "Deactivate" : "Activate"} Staff Member`,
      message: `Are you sure you want to ${actionWord} this staff member?`,
      confirmText: currentStatus ? "Deactivate" : "Activate",
      loadingText: currentStatus ? "Deactivating..." : "Activating...",
      isLoading: false,
      onConfirm: async () => {
        try {
          setConfirmModalConfig((prev) => ({ ...prev, isLoading: true }));
          await api.patch(`/staff/${staffId}/status`, { isActive: !currentStatus });
          toast.success(`Staff member ${currentStatus ? "deactivated" : "activated"} successfully.`);
          setConfirmModalConfig({ isOpen: false, title: "", message: "", onConfirm: () => {}, isLoading: false, confirmText: "Confirm", loadingText: "Processing..." });
          fetchData();
        } catch (error) {
          console.error("Status toggle error:", error);
          toast.error(error.response?.data?.message || "Failed to change status.");
          setConfirmModalConfig((prev) => ({ ...prev, isLoading: false }));
        }
      },
    });
  };

  const handleRevokeInvitation = (inviteId) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Revoke Invitation",
      message: "Are you sure you want to revoke this staff invitation? The invite link will immediately expire.",
      confirmText: "Revoke Invite",
      loadingText: "Revoking...",
      isLoading: false,
      onConfirm: async () => {
        try {
          setConfirmModalConfig((prev) => ({ ...prev, isLoading: true }));
          await api.delete(`/staff/invitations/${inviteId}`);
          toast.success("Invitation revoked successfully.");
          setConfirmModalConfig({ isOpen: false, title: "", message: "", onConfirm: () => {}, isLoading: false, confirmText: "Confirm", loadingText: "Processing..." });
          fetchData();
        } catch (error) {
          console.error("Revoke error:", error);
          toast.error("Failed to revoke invitation.");
          setConfirmModalConfig((prev) => ({ ...prev, isLoading: false }));
        }
      },
    });
  };

  const handleResendInvitation = async (inviteId) => {
    try {
      const res = await api.post(`/staff/invitations/${inviteId}/resend`);
      toast.success(res.data.message || "Invitation resent successfully.");
      fetchData();
    } catch (error) {
      console.error("Resend error:", error);
      toast.error("Failed to resend invitation.");
    }
  };

  const getRoleBadgeClass = (roleName) => {
    switch (roleName) {
      case "admin":
        return "bg-rose-50 border-rose-100 text-rose-600";
      case "assistant":
        return "bg-purple-50 border-purple-100 text-purple-600";
      case "intern":
        return "bg-amber-50 border-amber-100 text-amber-600";
      case "physiotherapist":
        return "bg-emerald-50 border-emerald-100 text-emerald-600";
      case "receptionist":
        return "bg-blue-50 border-blue-100 text-blue-600";
      default:
        return "bg-slate-50 border-slate-100 text-slate-600";
    }
  };

  const getStatusBadgeClass = (isActive) => {
    return isActive
      ? "bg-emerald-50 border-emerald-100 text-emerald-700"
      : "bg-rose-50 border-rose-100 text-rose-700";
  };

  const getInviteStatusBadgeClass = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-50 border-emerald-100 text-emerald-700";
      case "Expired":
        return "bg-rose-50 border-rose-100 text-rose-700";
      default:
        return "bg-amber-50 border-amber-100 text-amber-700";
    }
  };

  // Filters logic
  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      staff.email.toLowerCase().includes(staffSearch.toLowerCase()) ||
      staff.phone.includes(staffSearch);

    const matchesRole = staffRoleFilter === "all" || staff.role === staffRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col gap-8 text-left w-full">
      {/* Header and Trigger Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="inline-block text-primary text-[10px] font-bold tracking-wider uppercase mb-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 font-accent animate-pulse">
            Staff Portal Control
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-secondary font-heading leading-tight">
            Clinic Staff Management
          </h2>
          <p className="text-xs text-text-muted font-body mt-0.5">
            Configure clinic roles, permission maps, activate/deactivate accounts, and invite new staff members.
          </p>
        </div>

        <Button
          onClick={() => {
            setEmail("");
            setRole("physiotherapist");
            setPermissions(DEFAULT_ROLE_PERMISSIONS["physiotherapist"]);
            setInviteModalOpen(true);
          }}
          variant="primary"
          className="shadow-md hover:scale-[1.01] shrink-0"
        >
          ✚ Invite Staff Member
        </Button>
      </div>

      {/* Tabs Row */}
      <div className="border-b border-slate-200 flex gap-4">
        <button
          onClick={() => setActiveTab("staff")}
          className={`py-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "staff"
              ? "border-primary text-primary"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Staff Directory ({staffList.length})
        </button>
        <button
          onClick={() => setActiveTab("invitations")}
          className={`py-3 px-1 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === "invitations"
              ? "border-primary text-primary"
              : "border-transparent text-slate-400 hover:text-slate-600"
          }`}
        >
          Invitations Log ({invitationList.length})
        </button>
      </div>

      {/* Primary Section */}
      {loading ? (
        <Spinner text="Loading staff records..." />
      ) : activeTab === "staff" ? (
        <div className="flex flex-col gap-6">
          {/* Staff Filters */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white border border-slate-200/60 p-4 rounded-2xl shadow-sm">
            <Searchbar
              value={staffSearch}
              onChange={setStaffSearch}
              placeholder="Search staff by name, email, phone..."
            />
            <div className="w-full sm:w-48">
              <CustomSelect
                value={staffRoleFilter}
                onChange={(val) => setStaffRoleFilter(val)}
                options={[
                  { value: "all", label: "All Roles" },
                  ...ROLE_OPTIONS,
                ]}
              />
            </div>
          </div>          {/* Directory Cards */}
          {filteredStaff.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center shadow-sm">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                No Staff Members Found
              </p>
              <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
                No active staff matches the specified criteria. Try removing search terms or filter constraints.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map((staff) => (
                <div
                  key={staff._id}
                  className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {/* Header: Initial avatar or user image & Name */}
                    <div className="flex items-center gap-3">
                      {staff.image ? (
                        <img 
                          src={staff.image} 
                          alt={staff.name} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-secondary text-sm border border-slate-200 shadow-sm shrink-0">
                          {staff.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="text-left">
                        <div className="font-bold text-secondary text-sm truncate max-w-[180px]">{staff.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono tracking-tight truncate max-w-[180px]">{staff.email}</div>
                      </div>
                    </div>

                    {/* Meta Row: Contact & Role */}
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block font-accent">Role</span>
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider mt-1 ${getRoleBadgeClass(staff.role)}`}>
                          {staff.role}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block font-accent">Status</span>
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold mt-1 ${getStatusBadgeClass(staff.isActive)}`}>
                          {staff.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>

                    {/* Secondary Row: Phone & Joined Date */}
                    <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block font-accent">Phone</span>
                        <span className="font-semibold text-slate-500 font-mono mt-0.5 block">{staff.phone || "N/A"}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block font-accent">Joined</span>
                        <span className="font-semibold text-slate-500 mt-0.5 block">
                          {new Date(staff.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-2.5 mt-6 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => handleEditOpen(staff)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 hover:border-primary hover:text-primary bg-white text-slate-500 font-bold text-xs cursor-pointer shadow-sm transition-all text-center"
                    >
                      Permissions
                    </button>
                    <button
                      onClick={() => handleToggleStatus(staff._id, staff.isActive)}
                      className={`flex-1 px-3 py-2 rounded-xl border font-bold text-xs cursor-pointer shadow-sm transition-all text-center ${
                        staff.isActive
                          ? "border-rose-200 hover:bg-rose-50 text-rose-600 bg-white"
                          : "border-emerald-200 hover:bg-emerald-50 text-emerald-600 bg-white"
                      }`}
                    >
                      {staff.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Invitations Cards */
        invitationList.length === 0 ? (
          <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center shadow-sm">
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
              No Staff Invitations Sent
            </p>
            <p className="text-xs text-text-muted mt-1 max-w-sm mx-auto">
              There are no active or expired invitations logged in the database. Use the button above to invite staff.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {invitationList.map((inv) => (
              <div
                key={inv._id}
                className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4 text-left">
                  {/* Top row: Email Address */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block font-accent">Recipient</span>
                    <div className="font-bold text-secondary text-sm truncate max-w-[280px] mt-0.5">
                      {inv.email}
                    </div>
                  </div>

                  {/* Role & Status info */}
                  <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-accent">Role</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider mt-1 ${getRoleBadgeClass(inv.role)}`}>
                        {inv.role}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-accent">Status</span>
                      <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold mt-1 ${getInviteStatusBadgeClass(inv.status)}`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>

                  {/* Invited By & Expires info */}
                  <div className="flex justify-between items-center text-xs border-t border-slate-100 pt-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-accent">Invited By</span>
                      <span className="font-semibold text-slate-500 mt-0.5 block">{inv.invitedBy?.name || "N/A"}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-accent">Expires</span>
                      <span className="font-semibold text-slate-500 mt-0.5 block font-mono">
                        {new Date(inv.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons if Pending */}
                {inv.status === "Pending" && (
                  <div className="flex gap-2.5 mt-6 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => handleResendInvitation(inv._id)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 hover:border-primary hover:text-primary bg-white text-slate-500 font-bold text-xs cursor-pointer shadow-sm transition-all text-center"
                    >
                      Resend
                    </button>
                    <button
                      onClick={() => handleRevokeInvitation(inv._id)}
                      className="flex-1 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 bg-white font-bold text-xs cursor-pointer shadow-sm transition-all text-center"
                    >
                      Revoke
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}

      {/* Invite Modal */}
      <ModalShell
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite New Staff Member"
        panelClassName="sm:max-w-xl"
      >
        <form onSubmit={handleInviteSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
              Email Address
            </label>
            <input
              type="email"
              placeholder="staff@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary text-secondary text-sm font-medium transition-all shadow-sm"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
              Staff Role
            </label>
            <CustomSelect
              value={role}
              onChange={handleRoleChange}
              options={ROLE_OPTIONS}
            />
          </div>

          {/* Permissions checkbox grid */}
          {role !== "admin" && (
            <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 animate-page-entrance">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Configure Permissions
              </span>

              {/* Admin Pages Group */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Admin Manager Panels
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {PERMISSION_METADATA.admin.map((perm) => (
                    <label key={perm.value} className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={permissions.includes(perm.value)}
                        onChange={() => handlePermissionChange(perm.value)}
                        className="rounded text-primary focus:ring-primary w-4 h-4 border-slate-300 shrink-0"
                      />
                      <span className="font-medium text-slate-700">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clinic Pages Group */}
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Clinic Operation Panels
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {PERMISSION_METADATA.clinic.map((perm) => (
                    <label key={perm.value} className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={permissions.includes(perm.value)}
                        onChange={() => handlePermissionChange(perm.value)}
                        className="rounded text-primary focus:ring-primary w-4 h-4 border-slate-300 shrink-0"
                      />
                      <span className="font-medium text-slate-700">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {role === "admin" && (
            <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl text-xs text-rose-700 leading-relaxed font-medium animate-page-entrance">
              ⚠️ Users with the **Admin** role automatically bypass all permission gates and receive full clinical administrator capabilities.
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            variant="primary"
            className="w-full mt-2"
          >
            {submitting ? "Processing Invitation..." : "Send Secure Email Invitation"}
          </Button>
        </form>
      </ModalShell>

      {/* Edit Permissions Modal */}
      <ModalShell
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Edit permissions for: ${selectedStaff?.name || ""}`}
        panelClassName="sm:max-w-xl"
      >
        <form onSubmit={handleEditSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-heading">
              Staff Member Email
            </label>
            <input
              type="email"
              value={selectedStaff?.email || ""}
              readOnly
              className="w-full px-4 py-3 rounded-2xl border border-slate-200/50 bg-slate-50 text-slate-400 text-sm font-medium outline-none cursor-not-allowed shadow-inner"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
              Staff Role
            </label>
            <CustomSelect
              value={role}
              onChange={handleRoleChange}
              options={ROLE_OPTIONS}
            />
          </div>

          {/* Permissions checkbox grid */}
          {role !== "admin" && (
            <div className="flex flex-col gap-4 border-t border-slate-100 pt-4 animate-page-entrance">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Configure Permissions
              </span>

              {/* Admin Pages Group */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Admin Manager Panels
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {PERMISSION_METADATA.admin.map((perm) => (
                    <label key={perm.value} className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={permissions.includes(perm.value)}
                        onChange={() => handlePermissionChange(perm.value)}
                        className="rounded text-primary focus:ring-primary w-4 h-4 border-slate-300 shrink-0"
                      />
                      <span className="font-medium text-slate-700">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clinic Pages Group */}
              <div className="flex flex-col gap-2 mt-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider font-heading">
                  Clinic Operation Panels
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {PERMISSION_METADATA.clinic.map((perm) => (
                    <label key={perm.value} className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={permissions.includes(perm.value)}
                        onChange={() => handlePermissionChange(perm.value)}
                        className="rounded text-primary focus:ring-primary w-4 h-4 border-slate-300 shrink-0"
                      />
                      <span className="font-medium text-slate-700">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {role === "admin" && (
            <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl text-xs text-rose-700 leading-relaxed font-medium animate-page-entrance">
              ⚠️ Users with the **Admin** role automatically bypass all permission gates and receive full clinical administrator capabilities.
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting}
            variant="primary"
            className="w-full mt-2"
          >
            {submitting ? "Saving changes..." : "Save Role & Permissions"}
          </Button>
        </form>
      </ModalShell>

      <CustomConfirmModal
        isOpen={confirmModalConfig.isOpen}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModalConfig.onConfirm}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        isLoading={confirmModalConfig.isLoading}
        confirmText={confirmModalConfig.confirmText}
        loadingText={confirmModalConfig.loadingText}
      />
    </div>
  );
};

export default AdminStaffManagement;
