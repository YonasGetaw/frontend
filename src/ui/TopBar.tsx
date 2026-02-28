import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../state/auth";

export function TopBar({ variant }: { variant: "user" | "admin" }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 glass">
      <div className={variant === "admin" ? "ml-72" : ""}>
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 shadow-md shadow-teal-600/20">
              <span className="text-sm font-bold text-white">V</span>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 tracking-wide">Vestoria</div>
              <div className="text-xs text-slate-500">
                {variant === "admin" ? "Admin Console" : "Dashboard"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <div className="text-sm font-semibold text-slate-800">{user?.name ?? ""}</div>
              <div className="text-xs text-slate-400">{user?.email ?? ""}</div>
            </div>
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 shadow-premium transition-all duration-200 hover:bg-slate-50 hover:shadow-premium-hover hover:text-slate-800 active:scale-[0.98]"
              onClick={async () => {
                await logout();
                navigate("/login", { replace: true });
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
