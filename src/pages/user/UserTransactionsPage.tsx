import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Card } from "../../ui/Card";

type Transaction = {
  id: string;
  amountCents: number;
  type: "SEND" | "RECEIVE";
  createdAt: string;
  fromUser?: {
    id: string;
    name: string;
    email: string;
  };
  toUser?: {
    id: string;
    name: string;
    email: string;
  };
};

export function UserTransactionsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "sent" | "received">("all");

  const { data: sentTransactions } = useQuery({
    queryKey: ["transactions", "sent"],
    queryFn: async () => {
      const res = await http.get("/transactions/sent");
      return res.data.transactions as Transaction[];
    }
  });

  const { data: receivedTransactions } = useQuery({
    queryKey: ["transactions", "received"],
    queryFn: async () => {
      const res = await http.get("/transactions/received");
      return res.data.transactions as Transaction[];
    }
  });

  const allTransactions = [...(sentTransactions ?? []), ...(receivedTransactions ?? [])]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const displayTransactions = activeTab === "all" ? allTransactions :
    activeTab === "sent" ? sentTransactions ?? [] :
    receivedTransactions ?? [];

  const totalSent = sentTransactions?.reduce((sum, t) => sum + t.amountCents, 0) ?? 0;
  const totalReceived = receivedTransactions?.reduce((sum, t) => sum + t.amountCents, 0) ?? 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Transactions</div>
        <div className="mt-1 text-sm text-slate-600">View your money transfer history.</div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <Metric title="Total Sent" value={`ETB ${(totalSent / 100).toFixed(2)}`} />
          <Metric title="Total Received" value={`ETB ${(totalReceived / 100).toFixed(2)}`} />
          <Metric title="Net Balance" value={`ETB ${((totalReceived - totalSent) / 100).toFixed(2)}`} />
        </div>
      </Card>

      <Card>
        <div className="border-b border-slate-200">
          <div className="flex space-x-8 px-4">
            <TabButton
              label="All"
              isActive={activeTab === "all"}
              count={allTransactions.length}
              onClick={() => setActiveTab("all")}
            />
            <TabButton
              label="Sent"
              isActive={activeTab === "sent"}
              count={sentTransactions?.length ?? 0}
              onClick={() => setActiveTab("sent")}
            />
            <TabButton
              label="Received"
              isActive={activeTab === "received"}
              count={receivedTransactions?.length ?? 0}
              onClick={() => setActiveTab("received")}
            />
          </div>
        </div>
        <div className="divide-y divide-slate-200">
          {displayTransactions.map((transaction) => (
            <div key={transaction.id} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-slate-900">
                      {transaction.type === "SEND" ? "Sent to" : "Received from"}{" "}
                      {transaction.type === "SEND" ? transaction.toUser?.name : transaction.fromUser?.name}
                    </div>
                    <TransactionTypePill type={transaction.type} />
                  </div>
                  <div className="text-sm text-slate-600">
                    {transaction.type === "SEND" ? transaction.toUser?.email : transaction.fromUser?.email}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${
                    transaction.type === "SEND" ? "text-red-700" : "text-green-700"
                  }`}>
                    {transaction.type === "SEND" ? "-" : "+"}ETB {(transaction.amountCents / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {displayTransactions.length === 0 && (
            <div className="px-4 py-6 text-sm text-slate-600">
              {activeTab === "all" ? "No transactions yet." :
               activeTab === "sent" ? "No sent transactions yet." :
               "No received transactions yet."}
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

function TransactionTypePill({ type }: { type: "SEND" | "RECEIVE" }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        type === "SEND"
          ? "bg-red-50 text-red-800 border-red-200"
          : "bg-green-50 text-green-800 border-green-200"
      }`}
    >
      {type}
    </span>
  );
}
