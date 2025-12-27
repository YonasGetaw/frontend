import { NavLink, Outlet } from "react-router-dom";
import { Home, Package, ShoppingBag, User } from "lucide-react";

import { TopBar } from "../ui/TopBar";

const items = [
  { to: "/app/home", label: "Home", Icon: Home },
  { to: "/app/products", label: "Products", Icon: ShoppingBag },
  { to: "/app/orders", label: "My Orders", Icon: Package },
  { to: "/app/account", label: "My Account", Icon: User }
] as const;

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden md:block">
        <TopBar variant="user" />
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 md:pl-64 md:pr-6 md:pb-10">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-4">
          {items.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-1 px-2 py-3 text-xs font-medium transition-all duration-200",
                  isActive 
                    ? "text-yellow-400" 
                    : "text-blue-100 hover:text-white"
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-blue-200 bg-gradient-to-b from-blue-50 to-white md:block">
        <div className="h-16 border-b border-blue-200 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="text-sm font-semibold text-white">User Dashboard</div>
          <div className="text-xs text-blue-100">Vestoria</div>
        </div>
        <div className="space-y-1 p-3">
          {items.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-yellow-400"
                    : "text-slate-700 hover:bg-blue-100 hover:text-blue-700"
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
