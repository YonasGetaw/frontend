import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../../api/http";
import { env } from "../../env";
import { Card } from "../../ui/Card";

function toPublicUrl(url: string) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${env.API_BASE_URL}${url}`;
}

type Order = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  paymentMethod: "COMMERCIAL_BANK" | "TELEBIRR" | "CBE_BIRR";
  amountCents: number;
  createdAt: string;
  paymentProofImageUrl?: string;
  product: { id: string; name: string };
  user: { id: string; name: string; email: string };
};

const statuses: Order["status"][] = ["PENDING", "APPROVED", "REJECTED", "COMPLETED"];

export function AdminOrdersPage() {
  const qc = useQueryClient();

  const orders = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await http.get("/admin/orders");
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
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xl font-semibold text-slate-900">Order Management</div>
          <div className="mt-1 text-sm text-slate-600">Approve or reject payments, and update order status</div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(["ALL", ...statuses] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={
                "rounded-xl border px-3 py-2 text-xs font-semibold transition " +
                (filter === s
                  ? "border-brand-200 bg-brand-50 text-brand-700"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")
              }
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-7 gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
          <div>User</div>
          <div>Product</div>
          <div>Amount</div>
          <div>Date</div>
          <div>Status</div>
          <div>Proof</div>
          <div>Update</div>
        </div>
        <div className="divide-y divide-slate-200">
          {filtered.map((o) => (
            <div key={o.id} className="grid grid-cols-7 gap-2 px-4 py-3 text-sm">
              <div>
                <div className="font-medium text-slate-900">{o.user.name}</div>
                <div className="text-xs text-slate-500">{o.user.email}</div>
              </div>
              <div className="font-medium text-slate-900">{o.product.name}</div>
              <div className="text-slate-700">ETB {(o.amountCents / 100).toFixed(2)}</div>
              <div className="text-slate-600">{new Date(o.createdAt).toLocaleString()}</div>
              <div>
                <StatusPill status={o.status} />
              </div>
              <div>
                {o.paymentProofImageUrl ? (
                  <a href={toPublicUrl(o.paymentProofImageUrl)} target="_blank" rel="noopener noreferrer">
                    <img
                      src={toPublicUrl(o.paymentProofImageUrl)}
                      alt="Proof"
                      className="h-16 w-16 rounded-xl object-cover border border-slate-200 cursor-pointer hover:opacity-80 transition"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<span class="text-xs text-slate-500">Not available</span>`;
                        }
                      }}
                    />
                  </a>
                ) : (
                  <div className="text-xs text-slate-400">No proof</div>
                )}
              </div>
              <div>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm"
                  value={o.status}
                  onChange={async (e) => {
                    await http.patch(`/admin/orders/${o.id}/status`, { status: e.target.value });
                    await qc.invalidateQueries({ queryKey: ["admin-orders"] });
                  }}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {filtered.length === 0 ? <div className="px-4 py-8 text-sm text-slate-600">No orders found.</div> : null}
        </div>
      </Card>

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
