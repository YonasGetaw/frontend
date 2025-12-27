import { useQuery } from "@tanstack/react-query";
import { BarChart3, DollarSign, Users } from "lucide-react";

import { http } from "../../api/http";
import { Card } from "../../ui/Card";

type Analytics = {
  users: number;
  orders: { total: number; pending: number };
  incomeCents: number;
};

export function AdminDashboardPage() {
  const analytics = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await http.get("/admin/analytics");
      return res.data as Analytics;
    }
  });

  const data = analytics.data;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Analytics</div>
        <div className="mt-1 text-sm text-slate-600">Overview of users, orders, and income</div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard title="Users" value={data ? String(data.users) : "—"} icon={<Users className="h-5 w-5" />} />
        <MetricCard
          title="Orders (pending)"
          value={data ? `${data.orders.pending} / ${data.orders.total}` : "—"}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        <MetricCard
          title="Income"
          value={data ? `ETB ${(data.incomeCents / 100).toFixed(2)}` : "—"}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      <Card>
        <div className="text-sm font-semibold text-slate-900">Notes</div>
        <div className="mt-2 text-sm text-slate-600">
          Income is calculated from orders with status Approved or Completed.
        </div>
      </Card>

      {analytics.isLoading ? <div className="text-sm text-slate-600">Loading…</div> : null}
    </div>
  );
}

function MetricCard(props: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{props.title}</div>
          <div className="mt-2 text-lg font-semibold text-slate-900">{props.value}</div>
        </div>
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
          {props.icon}
        </div>
      </div>
    </Card>
  );
}
