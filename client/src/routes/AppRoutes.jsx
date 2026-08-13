import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "../components/routing/ProtectedRoute";
import Home from "../features/home/pages/Home";
import Services from "../features/services/pages/Services";
import Testimonials from "../features/testimonials/pages/Testimonials";
import Blog from "../features/blog/pages/Blog";
import BlogDetails from "../features/blog/pages/BlogDetails";
import Resources from "../features/resources/pages/Resources";
import Contact from "../features/contact/pages/Contact";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import NotFound from "../features/NotFound/NotFound";
import PrivacyPolicy from "../features/legal/pages/PrivacyPolicy";
import TermsAndConditions from "../features/legal/pages/TermsAndConditions";

// Admin
import AdminProtectedRoute from "../components/routing/AdminProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../features/admin/pages/AdminDashboard";
import AdminServices from "../features/admin/pages/AdminServices";
import AdminBlogs from "../features/admin/pages/AdminBlogs";
import AdminResources from "../features/admin/pages/AdminResources";
import AdminTestimonials from "../features/admin/pages/AdminTestimonials";
import AdminContacts from "../features/admin/pages/AdminContacts";
import AdminSettings from "../features/admin/pages/AdminSettings";

//dashboard
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHome from "../features/dashboard/pages/DashboardHome";
import DashboardProfile from "../features/dashboard/pages/DashboardProfile";
import DashboardTestimonials from "../features/dashboard/pages/DashboardTestimonials";
import ChangePassword from "../features/dashboard/pages/ChangePassword"
import DashboardNotifications from "../features/dashboard/pages/DashboardNotifications";
import DashboardContact from "../features/dashboard/pages/DashboardContact";
import AdminNotifications from "../features/admin/pages/AdminNotifications";

//forget password
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";

// Staff and Permissions
import StaffProtectedRoute from "../components/routing/StaffProtectedRoute";
import StaffRegister from "../features/auth/pages/StaffRegister";
import AdminStaffManagement from "../features/admin/pages/AdminStaffManagement";

// Clinic
import ClinicLayout from "../layouts/ClinicLayout";
import ClinicDashboard from "../features/clinic/pages/ClinicDashboard";
import ClinicAppointments from "../features/clinic/pages/ClinicAppointments";
import ClinicPatients from "../features/clinic/pages/ClinicPatients";
import ClinicReport from "../features/clinic/pages/ClinicReport";
import ClinicPatientDetails from "../features/clinic/pages/ClinicPatientDetails";
import ClinicPayments from "../features/clinic/pages/ClinicPayments";
import ClinicPaymentIndividual from "../features/clinic/pages/ClinicPaymentIndividual";
import ClinicTodayVisits from "../features/clinic/pages/ClinicTodayVisits";
import ClinicTodayAppointments from "../features/clinic/pages/ClinicTodayAppointments";
import ClinicUnpaidCases from "../features/clinic/pages/ClinicUnpaidCases";
import ClinicTomorrowVisits from "../features/clinic/pages/ClinicTomorrowVisits";
import PublicInvoiceView from "../features/clinic/pages/PublicInvoiceView";


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Route>

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/staff/register/:token" element={<StaffRegister />} />
      <Route path="/public/invoice/:caseId" element={<PublicInvoiceView />} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute> <DashboardLayout /> </ProtectedRoute>} >

        <Route index element={<DashboardHome />} />

        <Route path="update-profile" element={<DashboardProfile />} />

        <Route path="testimonials" element={<DashboardTestimonials />} />

        <Route path="contact" element={<DashboardContact />} />

        <Route path="change-password" element={<ChangePassword />} />
        <Route path="notifications" element={<DashboardNotifications />} />
      </Route>

      {/* Admin */}
      <Route
        path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>

        <Route index element={<AdminDashboard />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="blogs" element={<AdminBlogs />} />
        <Route path="resources" element={<AdminResources />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="contacts" element={<AdminContacts />} />
        <Route path="profile" element={<DashboardProfile />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="staff" element={<AdminStaffManagement />} />
      </Route>

      {/* Clinic */}
      <Route
        path="/clinic"
        element={
          <AdminProtectedRoute>
            <ClinicLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<ClinicDashboard />} />
        <Route path="dashboard/visits" element={<ClinicTodayVisits />} />
        <Route path="dashboard/tomorrow-visits" element={<ClinicTomorrowVisits />} />
        <Route path="dashboard/appointments" element={<ClinicTodayAppointments />} />
        <Route path="unpaid" element={<ClinicUnpaidCases />} />
        <Route path="appointments" element={<ClinicAppointments />} />
        <Route path="patients" element={<ClinicPatients />} />
        <Route path="patients/:id" element={<ClinicPatientDetails />} />
        <Route path="report" element={<ClinicReport />} />
        <Route path="payments" element={<ClinicPayments />} />
        <Route path="payments/:id" element={<ClinicPaymentIndividual />} />
      </Route>

      {/* Staff Routes */}
      {["assistant", "intern", "physiotherapist", "receptionist"].map((role) => (
        <Route
          key={role}
          path={`/staff/${role}`}
          element={
            <StaffProtectedRoute allowedRole={role}>
              <AdminLayout />
            </StaffProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="resources" element={<AdminResources />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="contacts" element={<AdminContacts />} />
          <Route path="profile" element={<DashboardProfile />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="staff" element={<AdminStaffManagement />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Route>
      ))}

      {/* Staff Clinic Panels */}
      {["assistant", "intern", "physiotherapist", "receptionist"].map((role) => (
        <Route
          key={`clinic-${role}`}
          path={`/staff/${role}/clinic`}
          element={
            <StaffProtectedRoute allowedRole={role}>
              <ClinicLayout />
            </StaffProtectedRoute>
          }
        >
          <Route index element={<ClinicDashboard />} />
          <Route path="dashboard/visits" element={<ClinicTodayVisits />} />
          <Route path="dashboard/tomorrow-visits" element={<ClinicTomorrowVisits />} />
          <Route path="dashboard/appointments" element={<ClinicTodayAppointments />} />
          <Route path="unpaid" element={<ClinicUnpaidCases />} />
          <Route path="appointments" element={<ClinicAppointments />} />
          <Route path="patients" element={<ClinicPatients />} />
          <Route path="patients/:id" element={<ClinicPatientDetails />} />
          <Route path="report" element={<ClinicReport />} />
          <Route path="payments" element={<ClinicPayments />} />
          <Route path="payments/:id" element={<ClinicPaymentIndividual />} />
        </Route>
      ))}

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;