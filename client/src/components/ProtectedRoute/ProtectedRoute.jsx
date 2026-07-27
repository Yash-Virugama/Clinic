import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (user.role!=="patient") {
    // toast.error("Login to access this page.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;