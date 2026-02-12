import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Card } from "../../ui/Card";

type ActivityItem = {
  id: string;
  kind: "ORDER" | "WITHDRAWAL" | "SEND" | "RECEIVE" | "DAILY_REWARD" | "SPIN_REWARD";
  amountCents: number;
  createdAt: string;
  meta: any;
};

export function UserTransactionsPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "orders" | "withdrawals" | "transfers" | "rewards"
  >("all");

  const activity = useQuery({
    queryKey: ["me-activity"],
    queryFn: async () => {
      const res = await http.get("/me/activity?limit=100");
      return res.data.items as ActivityItem[];
    }
  });

  const items = activity.data ?? [];
  const display =
    activeTab === "all"
      ? items
      : activeTab === "orders"
      ? items.filter((i) => i.kind === "ORDER")
      : activeTab === "withdrawals"
      ? items.filter((i) => i.kind === "WITHDRAWAL")
      : activeTab === "transfers"
      ? items.filter((i) => i.kind === "SEND" || i.kind === "RECEIVE")
      : items.filter((i) => i.kind === "DAILY_REWARD" || i.kind === "SPIN_REWARD");

  const totalIn = items
    .filter((i) => i.kind === "RECEIVE" || i.kind === "DAILY_REWARD" || i.kind === "SPIN_REWARD")
    .reduce((sum, i) => sum + i.amountCents, 0);
  const totalOut = items
    .filter((i) => i.kind === "SEND" || i.kind === "WITHDRAWAL")
    .reduce((sum, i) => sum + i.amountCents, 0);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Transactions</div>
        <div className="mt-1 text-sm text-slate-600">View your money transfer history.</div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <Metric title="Total In" value={`ETB ${(totalIn / 100).toFixed(2)}`} />
          <Metric title="Total Out" value={`ETB ${(totalOut / 100).toFixed(2)}`} />
          <Metric title="Net" value={`ETB ${((totalIn - totalOut) / 100).toFixed(2)}`} />
        </div>
      </Card>

      <Card>
        <div className="border-b border-slate-200">
          <div className="flex space-x-8 px-4">
            <TabButton
              label="All"
              isActive={activeTab === "all"}
              count={items.length}
              onClick={() => setActiveTab("all")}
            />
            <TabButton
              label="Orders"
              isActive={activeTab === "orders"}
              count={items.filter((i) => i.kind === "ORDER").length}
              onClick={() => setActiveTab("orders")}
            />
            <TabButton
              label="Withdraw"
              isActive={activeTab === "withdrawals"}
              count={items.filter((i) => i.kind === "WITHDRAWAL").length}
              onClick={() => setActiveTab("withdrawals")}
            />
            <TabButton
              label="Transfers"
              isActive={activeTab === "transfers"}
              count={items.filter((i) => i.kind === "SEND" || i.kind === "RECEIVE").length}
              onClick={() => setActiveTab("transfers")}
            />
            <TabButton
              label="Rewards"
              isActive={activeTab === "rewards"}
              count={items.filter((i) => i.kind === "DAILY_REWARD" || i.kind === "SPIN_REWARD").length}
              onClick={() => setActiveTab("rewards")}
            />
          </div>
        </div>
        <div className="divide-y divide-slate-200">
          {display.map((item) => (
            <div key={item.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-slate-900">
                      {item.kind === "ORDER"
                        ? `Order - ${item.meta?.productName ?? "Product"}`
                        : item.kind === "WITHDRAWAL"
                        ? `Withdrawal (${item.meta?.status ?? ""})`
                        : item.kind === "SEND"
                        ? `Sent to ${item.meta?.to?.name ?? "User"}`
                        : item.kind === "RECEIVE"
                        ? `Received from ${item.meta?.from?.name ?? "User"}`
                        : item.kind === "DAILY_REWARD"
                        ? "Daily reward"
                        : "Spin reward"}
                    </div>
                    <ActivityPill kind={item.kind} />
                  </div>
                  {item.kind === "SEND" || item.kind === "RECEIVE" ? (
                    <div className="text-sm text-slate-600">
                      {item.kind === "SEND" ? item.meta?.to?.email : item.meta?.from?.email}
                    </div>
                  ) : null}
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    item.kind === "SEND" || item.kind === "WITHDRAWAL" ? "text-red-700" : "text-green-700"
                  }`}>
                    {item.kind === "SEND" || item.kind === "WITHDRAWAL" ? "-" : "+"}ETB {(item.amountCents / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {display.length === 0 && (
            <div className="px-4 py-6 text-sm text-slate-600">
              {activeTab === "all"
                ? "No activity yet."
                : activeTab === "orders"
                ? "No orders yet."
                : activeTab === "withdrawals"
                ? "No withdrawals yet."
                : activeTab === "transfers"
                ? "No transfers yet."
                : "No rewards yet."}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function Metric(props: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3">
      <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{props.title}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{props.value}</div>
    </div>
  );
}

function TabButton({ label, isActive, count, onClick }: {
  label: string;
  isActive: boolean;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
        isActive
          ? "border-brand-700 text-brand-700"
          : "border-transparent text-slate-600 hover:text-slate-900"
      }`}
      onClick={onClick}
    >
      {label} ({count})
    </button>
  );
}

function ActivityPill({ kind }: { kind: ActivityItem["kind"] }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        kind === "SEND" || kind === "WITHDRAWAL"
          ? "bg-red-50 text-red-800 border-red-200"
          : kind === "ORDER"
          ? "bg-sky-50 text-sky-800 border-sky-200"
          : kind === "RECEIVE"
          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
          : "bg-violet-50 text-violet-800 border-violet-200"
      }`}
    >
      {kind}
    </span>
  );
}
