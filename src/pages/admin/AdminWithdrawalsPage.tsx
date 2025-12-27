import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

type Withdrawal = {
  id: string;
  amountCents: number;
  method: "COMMERCIAL_BANK" | "TELEBIRR" | "CBE_BIRR";
  accountName?: string | null;
  accountNumber?: string | null;
  phone?: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: { id: string; name: string; email: string };
};

const statuses: Withdrawal["status"][] = ["PENDING", "APPROVED", "REJECTED"];

export function AdminWithdrawalsPage() {
  const qc = useQueryClient();

  const withdrawals = useQuery({
    queryKey: ["admin-withdrawals"],
    queryFn: async () => {
      const res = await http.get("/admin/withdrawals");
      return res.data.withdrawals as Withdrawal[];
    }
  });

  const [filter, setFilter] = useState<"ALL" | Withdrawal["status"]>("ALL");

  const filtered = useMemo(() => {
    const list = withdrawals.data ?? [];
    if (filter === "ALL") return list;
    return list.filter((w) => w.status === filter);
  }, [withdrawals.data, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-xl font-semibold text-slate-900">Withdrawals</div>
          <div className="mt-1 text-sm text-slate-600">Approve or reject user withdrawal requests</div>
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
          <div>Amount</div>
          <div>Method</div>
          <div>Details</div>
          <div>Date</div>
          <div>Status</div>
          <div>Action</div>
        </div>
        <div className="divide-y divide-slate-200">
          {filtered.map((w) => (
            <div key={w.id} className="grid grid-cols-7 gap-2 px-4 py-3 text-sm">
              <div>
                <div className="font-medium text-slate-900">{w.user.name}</div>
                <div className="text-xs text-slate-500">{w.user.email}</div>
              </div>
              <div className="text-slate-800">ETB {(w.amountCents / 100).toFixed(2)}</div>
              <div className="text-slate-800">{w.method}</div>
              <div className="text-xs text-slate-600">
                {w.method === "COMMERCIAL_BANK"
                  ? `${w.accountName ?? "—"} • ${w.accountNumber ?? "—"}`
                  : w.phone ?? "—"}
              </div>
              <div className="text-xs text-slate-600">{new Date(w.createdAt).toLocaleString()}</div>
              <div>
                <StatusPill status={w.status} />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  disabled={w.status !== "PENDING"}
                  onClick={async () => {
                    await http.patch(`/admin/withdrawals/${w.id}`, { status: "APPROVED" });
                    await qc.invalidateQueries({ queryKey: ["admin-withdrawals"] });
                    await qc.invalidateQueries({ queryKey: ["admin-analytics"] });
                  }}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  disabled={w.status !== "PENDING"}
                  onClick={async () => {
                    await http.patch(`/admin/withdrawals/${w.id}`, { status: "REJECTED" });
                    await qc.invalidateQueries({ queryKey: ["admin-withdrawals"] });
                  }}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}

          {filtered.length === 0 ? <div className="px-4 py-8 text-sm text-slate-600">No withdrawals found.</div> : null}
        </div>
      </Card>

      {withdrawals.isLoading ? <div className="text-sm text-slate-600">Loading…</div> : null}
    </div>
  );
}

function StatusPill({ status }: { status: Withdrawal["status"] }) {
  const cls =
    status === "PENDING"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : status === "APPROVED"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : "bg-rose-50 text-rose-800 border-rose-200";

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
}
