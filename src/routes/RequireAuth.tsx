import { Navigate } from "react-router-dom";
import { useAuthStore } from "../state/auth";
import { PageLoader } from "../ui/PageLoader";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const bootstrapped = useAuthStore((s) => s.bootstrapped);
  const user = useAuthStore((s) => s.user);

  if (!bootstrapped) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
