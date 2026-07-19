import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminRequired = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/reservations" replace />;
  if (user?.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

export default AdminRequired;
