import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";

type MeResponse = {
  user: { hasWithdrawPassword?: boolean } | null;
};

export function UserWithdrawPasswordPage() {
  const qc = useQueryClient();

  const me = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await http.get("/me");
      return res.data as MeResponse;
    }
  });

  const hasWithdrawPassword = Boolean(me.data?.user?.hasWithdrawPassword);

  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Withdraw password</div>
        <div className="mt-1 text-sm text-slate-600">This password is required for withdraw and send money.</div>
      </div>

      <Card>
        {error ? <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
        {ok ? <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{ok}</div> : null}

        <div className="grid gap-3 md:grid-cols-2">
          {hasWithdrawPassword ? (
            <Input
              label="Current withdraw password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          ) : null}

          <Input label="New withdraw password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input
            label="Confirm new withdraw password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              setError(null);
              setOk(null);
              try {
                await http.post("/me/withdraw-password", {
                  currentPassword: hasWithdrawPassword ? currentPassword : undefined,
                  password,
                  confirmPassword
                });
                setCurrentPassword("");
                setPassword("");
                setConfirmPassword("");
                setOk("Withdraw password saved");
                await qc.invalidateQueries({ queryKey: ["me"] });
              } catch (e: any) {
                setError(e?.response?.data?.message ?? "Failed to save password");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving…" : hasWithdrawPassword ? "Change password" : "Set password"}
          </Button>
        </div>
      </Card>

      {me.isLoading ? <div className="text-sm text-slate-600">Loading…</div> : null}
    </div>
  );
}
