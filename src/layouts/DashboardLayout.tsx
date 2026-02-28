import { NavLink, Outlet } from "react-router-dom";
import { Home, Package, ShoppingBag, User } from "lucide-react";

import { TopBar } from "../ui/TopBar";

const items = [
  { to: "/app/home", label: "Home", Icon: Home },
  { to: "/app/products", label: "Products", Icon: ShoppingBag },
  { to: "/app/orders", label: "My Orders", Icon: Package },
  { to: "/app/account", label: "Account", Icon: User }
] as const;

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/10 to-slate-50">
      <div className="hidden md:block">
        <TopBar variant="user" />
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 md:pl-64 md:pr-6 md:pb-10">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav - Premium Glass Design */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/80 bg-white/90 backdrop-blur-xl md:hidden">
        <div className="safe-area-bottom mx-auto grid max-w-6xl grid-cols-4">
          {items.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "relative flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-all duration-200",
                  isActive 
                    ? "text-teal-700" 
                    : "text-slate-400 hover:text-slate-600"
                ].join(" ")
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-teal-600" />
                  )}
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200/80 bg-white md:block">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200/80 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-teal-700 shadow-sm shadow-teal-600/20">
            <span className="text-xs font-bold text-white">V</span>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 tracking-wide">Vestoria</div>
            <div className="text-[11px] text-slate-400">Dashboard</div>
          </div>
        </div>
        <div className="space-y-1 p-3">
          {items.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-teal-50 text-teal-700 shadow-sm shadow-teal-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5" />
              {label}
            </NavLink>
          ))}
        </div>
      </aside>
    </div>
  );
}
