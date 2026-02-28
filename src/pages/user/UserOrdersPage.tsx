import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Card } from "../../ui/Card";
import { NavigationBar } from "../../components/ui/NavigationBar";
import { OrderCard } from "../../components/user/OrderCard";

type Order = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdAt: string;
  amountCents: number;
  product: { name: string };
};

export function UserOrdersPage() {
  const orders = useQuery({
    queryKey: ["my-orders"],
    queryFn: async () => {
      const res = await http.get("/orders/mine");
      return res.data.orders as Order[];
    }
  });

  const [filter, setFilter] = useState<"ALL" | Order["status"]>("ALL");

  const filtered = useMemo(() => {
    const list = orders.data ?? [];
    if (filter === "ALL") return list;
    return list.filter((o) => o.status === filter);
  }, [orders.data, filter]);

  return (
    <div className="space-y-6">
      {/* Navigation Bar */}
      <NavigationBar 
        title="My Orders"
        backTo="/app/home"
      />

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {(["ALL", "PENDING", "APPROVED", "REJECTED", "COMPLETED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={
              "rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 whitespace-nowrap " +
              (filter === s
                ? "border-teal-200 bg-teal-50 text-teal-700 shadow-sm"
                : "border-slate-200/80 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700")
            }
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="grid gap-6">
        {filtered.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}

        {filtered.length === 0 && (
          <Card className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600">
              {filter === "ALL" ? "You haven't placed any orders yet." : `No ${filter.toLowerCase()} orders found.`}
            </p>
          </Card>
        )}
      </div>

      {orders.isLoading ? <div className="text-sm text-slate-600">Loading…</div> : null}
    </div>
  );
}

function StatusPill({ status }: { status: Order["status"] }) {
  const cls =
    status === "PENDING"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : status === "APPROVED"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : status === "REJECTED"
      ? "bg-rose-50 text-rose-800 border-rose-200"
      : "bg-slate-100 text-slate-800 border-slate-200";

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
}
