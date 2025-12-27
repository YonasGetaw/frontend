import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";

type MeResponse = {
  user: {
    balanceCents: number;
    reservedBalanceCents: number;
    hasWithdrawPassword?: boolean;
  } | null;
};

type Withdrawal = {
  id: string;
  amountCents: number;
  method: "COMMERCIAL_BANK" | "TELEBIRR" | "CBE_BIRR";
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

export function UserWithdrawPage() {
  const qc = useQueryClient();

  const me = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await http.get("/me");
      return res.data as MeResponse;
    }
  });

  const withdrawals = useQuery({
    queryKey: ["my-withdrawals"],
    queryFn: async () => {
      const res = await http.get("/withdrawals/mine");
      return res.data.withdrawals as Withdrawal[];
    }
  });

  const balanceCents = me.data?.user?.balanceCents ?? 0;
  const reservedCents = me.data?.user?.reservedBalanceCents ?? 0;
  const availableCents = useMemo(() => Math.max(0, balanceCents - reservedCents), [balanceCents, reservedCents]);

  const [method, setMethod] = useState<Withdrawal["method"]>("COMMERCIAL_BANK");
  const [amountEtb, setAmountEtb] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Withdraw</div>
        <div className="mt-1 text-sm text-slate-600">Your request will be reviewed within 24 hours.</div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <Metric title="Total balance" value={`ETB ${(balanceCents / 100).toFixed(2)}`} />
          <Metric title="Reserved" value={`ETB ${(reservedCents / 100).toFixed(2)}`} />
          <Metric title="Available" value={`ETB ${(availableCents / 100).toFixed(2)}`} />
        </div>
      </Card>

      <Card>
        {error ? <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
        {ok ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{ok}</div> : null}

        <div className="grid gap-3 md:grid-cols-2">
          <Input label="Amount (ETB)" value={amountEtb} onChange={(e) => setAmountEtb(e.target.value)} />

          <label className="block">
            <div className="mb-1 text-sm font-medium text-slate-700">Method</div>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand-300 focus:ring-2 focus:ring-brand-100"
            >
              <option value="COMMERCIAL_BANK">Commercial Bank</option>
              <option value="TELEBIRR">Telebirr</option>
              <option value="CBE_BIRR">CBE Birr</option>
            </select>
          </label>

          {method === "COMMERCIAL_BANK" ? (
            <>
              <Input label="Account name" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
              <Input label="Account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
            </>
          ) : (
            <Input label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          )}

          <Input
            label="Withdraw password"
            type="password"
            value={withdrawPassword}
            onChange={(e) => setWithdrawPassword(e.target.value)}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            disabled={saving}
            onClick={async () => {
              setError(null);
              setOk(null);
              setSaving(true);
              try {
                const amountCents = Math.round(Number(amountEtb) * 100);
                if (!Number.isFinite(amountCents) || amountCents <= 0) {
                  setError("Please enter a valid amount");
                  return;
                }

                await http.post("/withdrawals", {
                  amountCents,
                  method,
                  accountName: method === "COMMERCIAL_BANK" ? accountName : undefined,
                  accountNumber: method === "COMMERCIAL_BANK" ? accountNumber : undefined,
                  phone: method !== "COMMERCIAL_BANK" ? phone : undefined,
                  withdrawPassword
                });

                setAmountEtb("");
                setAccountName("");
                setAccountNumber("");
                setPhone("");
                setWithdrawPassword("");

                setOk("Withdrawal submitted. Please wait up to 24 hours for approval.");

                await qc.invalidateQueries({ queryKey: ["my-withdrawals"] });
                await qc.invalidateQueries({ queryKey: ["me"] });
              } catch (e: any) {
                setError(e?.response?.data?.message ?? "Withdraw request failed");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Submitting…" : "Submit withdrawal"}
          </Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">My withdrawals</div>
        <div className="divide-y divide-slate-200">
          {(withdrawals.data ?? []).map((w) => (
            <div key={w.id} className="px-4 py-3 text-sm flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">ETB {(w.amountCents / 100).toFixed(2)}</div>
                <div className="text-xs text-slate-500">{w.method} • {new Date(w.createdAt).toLocaleString()}</div>
              </div>
              <StatusPill status={w.status} />
            </div>
          ))}

          {withdrawals.isLoading ? <div className="px-4 py-6 text-sm text-slate-600">Loading…</div> : null}
          {!withdrawals.isLoading && (withdrawals.data ?? []).length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-600">No withdrawals yet.</div>
          ) : null}
        </div>
      </Card>

      {me.isLoading ? <div className="text-sm text-slate-600">Loading…</div> : null}
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

function StatusPill({ status }: { status: Withdrawal["status"] }) {
  const cls =
    status === "PENDING"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : status === "APPROVED"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : "bg-rose-50 text-rose-800 border-rose-200";

  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
}
