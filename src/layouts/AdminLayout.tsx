import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, CreditCard, Package, ShoppingBag, Users, Wallet } from "lucide-react";

import { TopBar } from "../ui/TopBar";

const items = [
  { to: "/admin/dashboard", label: "Analytics", Icon: BarChart3 },
  { to: "/admin/products", label: "Products", Icon: ShoppingBag },
  { to: "/admin/orders", label: "Orders", Icon: Package },
  { to: "/admin/payments", label: "Payment Settings", Icon: CreditCard },
  { to: "/admin/withdrawals", label: "Withdrawals", Icon: Wallet },
  { to: "/admin/users", label: "Users", Icon: Users }
] as const;

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopBar variant="admin" />

      <aside className="fixed left-0 top-0 h-screen w-72 border-r border-slate-200 bg-white">
        <div className="h-16 border-b border-slate-200 px-6 py-4">
          <div className="text-sm font-semibold text-slate-900">Admin Console</div>
          <div className="text-xs text-slate-500">Vestoria</div>
        </div>
        <div className="space-y-1 p-3">
          {items.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
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
