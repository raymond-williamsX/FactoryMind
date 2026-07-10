import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Forbidden from "@/pages/auth/Forbidden";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermission?: string;
  redirectTo?: string;
}

export default function RoleGuard({
  children,
  allowedRoles,
  requiredPermission,
  redirectTo,
}: RoleGuardProps) {
  const { profile, hasPermission, hasRole, isLoading } = useAuth();

  // If AuthContext is resolving session, defer rendering
  if (isLoading) {
    return null;
  }

  let isAuthorized = false;

  // 1. Evaluate role matches if specified
  if (allowedRoles && allowedRoles.length > 0) {
    isAuthorized = allowedRoles.some((role) => hasRole(role));
  }

  // 2. Evaluate permission matches if specified
  if (requiredPermission) {
    // If roles matches were also checked, combine them or default to permission checks
    isAuthorized = isAuthorized || hasPermission(requiredPermission);
  }

  // 3. Fallback to permit access to Super Admin always
  if (profile?.user_roles?.role_name === "super_admin") {
    isAuthorized = true;
  }

  if (!isAuthorized) {
    // Redirect if target path is specified, otherwise render forbidden screen inline
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <Forbidden isInline={true} />;
  }

  return <>{children}</>;
}
