import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

   return <>{children}</>;
};

export default ProtectedRoute;
