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

type UserLookup = { id: string; name: string; email: string };

type Transaction = {
  id: string;
  amountCents: number;
  type: "SEND";
  createdAt: string;
  toUser?: UserLookup;
  fromUser?: UserLookup;
};

export function UserSendMoneyPage() {
  const qc = useQueryClient();

  const me = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await http.get("/me");
      return res.data as MeResponse;
    }
  });

  const sent = useQuery({
    queryKey: ["transactions-sent"],
    queryFn: async () => {
      const res = await http.get("/transactions/sent");
      return res.data.transactions as Transaction[];
    }
  });

  const received = useQuery({
    queryKey: ["transactions-received"],
    queryFn: async () => {
      const res = await http.get("/transactions/received");
      return res.data.transactions as Transaction[];
    }
  });

  const balanceCents = me.data?.user?.balanceCents ?? 0;
  const reservedCents = me.data?.user?.reservedBalanceCents ?? 0;
  const availableCents = useMemo(() => Math.max(0, balanceCents - reservedCents), [balanceCents, reservedCents]);

  const [toUserId, setToUserId] = useState("");
  const [amountEtb, setAmountEtb] = useState("");
  const [withdrawPassword, setWithdrawPassword] = useState("");

  const [recipient, setRecipient] = useState<UserLookup | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!toUserId.trim()) {
      setSearchError("Please enter a user ID");
      setRecipient(null);
      return;
    }
    setSearching(true);
    setSearchError(null);
    try {
      const res = await http.get(`/admin/users/${toUserId.trim()}`);
      setRecipient(res.data.user);
    } catch (e: any) {
      setSearchError(e?.response?.data?.message ?? "User not found");
      setRecipient(null);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Send Money</div>
        <div className="mt-1 text-sm text-slate-600">Transfer to another user by ID. Requires withdraw password.</div>
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
          <div>
            <Input label="Recipient user ID" value={toUserId} onChange={(e) => setToUserId(e.target.value)} />
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" disabled={searching} onClick={handleSearch}>
                {searching ? "Searching…" : "Search"}
              </Button>
              {recipient && <div className="text-sm text-slate-600">Found: {recipient.name} ({recipient.email})</div>}
            </div>
            {searchError && <div className="mt-1 text-xs text-rose-600">{searchError}</div>}
          </div>

          <Input label="Amount (ETB)" value={amountEtb} onChange={(e) => setAmountEtb(e.target.value)} />
          <Input
            label="Withdraw password"
            type="password"
            value={withdrawPassword}
            onChange={(e) => setWithdrawPassword(e.target.value)}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            disabled={saving || !recipient}
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

                await http.post("/transactions/send", {
                  toUserId: recipient!.id,
                  amountEtb: Number(amountEtb),
                  withdrawPassword
                });

                setToUserId("");
                setAmountEtb("");
                setWithdrawPassword("");
                setRecipient(null);

                setOk("Money sent successfully.");

                await qc.invalidateQueries({ queryKey: ["transactions-sent"] });
                await qc.invalidateQueries({ queryKey: ["transactions-received"] });
                await qc.invalidateQueries({ queryKey: ["me"] });
              } catch (e: any) {
                setError(e?.response?.data?.message ?? "Send failed");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Sending…" : "Send Money"}
          </Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Sent</div>
        <div className="divide-y divide-slate-200">
          {(sent.data ?? []).map((t) => (
            <div key={t.id} className="px-4 py-3 text-sm flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">ETB {(t.amountCents / 100).toFixed(2)}</div>
                <div className="text-xs text-slate-500">
                  To: {t.toUser?.name} ({t.toUser?.email}) • {new Date(t.createdAt).toLocaleString()}
                </div>
              </div>
              <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                SENT
              </span>
            </div>
          ))}

          {sent.isLoading ? <div className="px-4 py-6 text-sm text-slate-600">Loading…</div> : null}
          {!sent.isLoading && (sent.data ?? []).length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-600">No sent transactions yet.</div>
          ) : null}
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Received</div>
        <div className="divide-y divide-slate-200">
          {(received.data ?? []).map((t) => (
            <div key={t.id} className="px-4 py-3 text-sm flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">ETB {(t.amountCents / 100).toFixed(2)}</div>
                <div className="text-xs text-slate-500">
                  From: {t.fromUser?.name} ({t.fromUser?.email}) • {new Date(t.createdAt).toLocaleString()}
                </div>
              </div>
              <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
                RECEIVED
              </span>
            </div>
          ))}

          {received.isLoading ? <div className="px-4 py-6 text-sm text-slate-600">Loading…</div> : null}
          {!received.isLoading && (received.data ?? []).length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-600">No received transactions yet.</div>
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
