import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, CreditCard, Package, ShoppingBag, Users, Wallet } from "lucide-react";

import { TopBar } from "../ui/TopBar";

const items = [
  { to: "/admin/dashboard", label: "Analytics", Icon: BarChart3 },
  { to: "/admin/products", label: "Products", Icon: ShoppingBag },
  { to: "/admin/orders", label: "Orders", Icon: Package },
  { to: "/admin/payments", label: "Payments", Icon: CreditCard },
  { to: "/admin/withdrawals", label: "Withdrawals", Icon: Wallet },
  { to: "/admin/users", label: "Users", Icon: Users }
] as const;

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/10 to-slate-50">
      <TopBar variant="admin" />

      <aside className="fixed left-0 top-0 h-screen w-72 border-r border-slate-200/80 bg-white">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200/80 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-teal-700 shadow-sm shadow-teal-600/20">
            <span className="text-xs font-bold text-white">V</span>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 tracking-wide">Admin Console</div>
            <div className="text-[11px] text-slate-400">Vestoria</div>
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

      <main className="ml-72 px-6 pb-10 pt-6">
        <Outlet />
      </main>
    </div>
  );
}
