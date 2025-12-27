import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../state/auth";

export function TopBar({ variant }: { variant: "user" | "admin" }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className={variant === "admin" ? "ml-72" : ""}>
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-400 shadow-soft" />
            <div>
              <div className="text-sm font-semibold text-slate-900">Vestoria</div>
              <div className="text-xs text-slate-500">
                {variant === "admin" ? "Admin Dashboard" : "User Dashboard"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right md:block">
              <div className="text-sm font-medium text-slate-900">{user?.name ?? ""}</div>
              <div className="text-xs text-slate-500">{user?.email ?? ""}</div>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
              onClick={async () => {
                await logout();
                navigate("/login", { replace: true });
              }}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
