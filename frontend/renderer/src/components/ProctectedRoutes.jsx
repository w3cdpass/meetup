import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContex";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  return children;
};

export default ProtectedRoute;
