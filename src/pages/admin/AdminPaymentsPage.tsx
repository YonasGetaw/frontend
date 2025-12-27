import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { Input } from "../../ui/Input";

type PaymentSettings = {
  commercialBankName: string;
  commercialAccountNumber: string;
  telebirrPhone: string;
  cbeBirrPhone: string;
};

export function AdminPaymentsPage() {
  const qc = useQueryClient();

  const settings = useQuery({
    queryKey: ["payment-settings-admin"],
    queryFn: async () => {
      const res = await http.get("/admin/payment-settings");
      return res.data.settings as PaymentSettings | null;
    }
  });

  const [form, setForm] = useState<PaymentSettings>({
    commercialBankName: "Commercial Bank",
    commercialAccountNumber: "",
    telebirrPhone: "",
    cbeBirrPhone: ""
  });

  useEffect(() => {
    if (settings.data) setForm(settings.data);
  }, [settings.data]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Payment Settings</div>
        <div className="mt-1 text-sm text-slate-600">Configure bank and wallet details shown to users during checkout</div>
      </div>

      <Card>
        {error ? (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <Input
            label="Commercial Bank Name"
            value={form.commercialBankName}
            onChange={(e) => setForm((p) => ({ ...p, commercialBankName: e.target.value }))}
          />
          <Input
            label="Account Number"
            value={form.commercialAccountNumber}
            onChange={(e) => setForm((p) => ({ ...p, commercialAccountNumber: e.target.value }))}
          />
          <Input
            label="Telebirr Phone"
            value={form.telebirrPhone}
            onChange={(e) => setForm((p) => ({ ...p, telebirrPhone: e.target.value }))}
          />
          <Input
            label="CBE Birr Phone"
            value={form.cbeBirrPhone}
            onChange={(e) => setForm((p) => ({ ...p, cbeBirrPhone: e.target.value }))}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            disabled={saving}
            onClick={async () => {
              setSaving(true);
              setError(null);
              try {
                await http.put("/admin/payment-settings", form);
                await qc.invalidateQueries({ queryKey: ["payment-settings-admin"] });
              } catch (e: any) {
                setError(e?.response?.data?.message ?? "Save failed");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </Card>

      {settings.isLoading ? <div className="text-sm text-slate-600">Loading…</div> : null}
    </div>
  );
}
