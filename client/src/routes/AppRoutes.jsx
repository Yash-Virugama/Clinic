import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout/MainLayout";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import Home from "../pages/Home/Home";
import Services from "../pages/Services/Services";
import Testimonials from "../pages/Testimonials/Testimonials";
import Blog from "../pages/Blog/Blog";
import BlogDetails from "../pages/Blog/BlogDetails";
import Resources from "../pages/Resources/Resources";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import NotFound from "../pages/NotFound/NotFound";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions/TermsAndConditions";

// Admin
import AdminProtectedRoute from "../components/AdminProtectedRoute/AdminProtectedRoute";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard/AdminDashboard";
import AdminServices from "../pages/Admin/AdminServices/AdminServices";
import AdminBlogs from "../pages/Admin/AdminBlogs/AdminBlogs";
import AdminResources from "../pages/Admin/AdminResources/AdminResources";
import AdminTestimonials from "../pages/Admin/AdminTestimonials/AdminTestimonials";
import AdminContacts from "../pages/Admin/AdminContacts/AdminContacts";
import AdminSettings from "../pages/Admin/AdminSettings/AdminSettings";

//dashboard
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import DashboardHome from "../pages/Dashboard/DashboardHome/DashboardHome";
import DashboardProfile from "../pages/Dashboard/DashboardProfile/DashboardProfile";
import DashboardTestimonials from "../pages/Dashboard/DashboardTestimonials/DashboardTestimonials";
import ChangePassword from "../pages/Dashboard/ChangePassword/ChangePassword"
import DashboardNotifications from "../pages/Dashboard/DashboardNotifications/DashboardNotifications";
import DashboardContact from "../pages/Dashboard/DashboardContact/DashboardContact";
import AdminNotifications from "../pages/Admin/AdminNotifications/AdminNotifications";

//forget password
import ForgotPassword from "../pages/Auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword/ResetPassword";


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
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
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
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;