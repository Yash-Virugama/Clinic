import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../ui/Loader";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user || user.role !== "patient") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;