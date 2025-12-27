import { Navigate } from "react-router-dom";
import type { Role } from "../state/auth";
import { useAuthStore } from "../state/auth";

export function RequireRole({ role, children }: { role: Role; children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
}
