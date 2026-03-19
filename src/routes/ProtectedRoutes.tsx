import type React from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRoutesProps {
  allowedRoles?: string[];
  children: ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
  allowedRoles,
  children,
}) => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && (!userRole || !allowedRoles.includes(userRole))) {
    return (
      <Navigate
        to={userRole === "trader" ? "/trader-dashboard" : "/admin-dashboard"}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
