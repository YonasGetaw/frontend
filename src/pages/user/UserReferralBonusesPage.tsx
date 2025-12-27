import { useQuery } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Card } from "../../ui/Card";

type ReferralBonus = {
  id: string;
  amountCents: number;
  tier: number;
  createdAt: string;
  referred: { id: string; name: string; email: string };
  order: { product: { name: string } };
};

export function UserReferralBonusesPage() {
  const bonuses = useQuery({
    queryKey: ["referral-bonuses"],
    queryFn: async () => {
      const res = await http.get("/me/referral-bonuses");
      return res.data.bonuses as ReferralBonus[];
    }
  });

  const totalCents = (bonuses.data ?? []).reduce((sum, b) => sum + b.amountCents, 0);

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Referral Bonuses</div>
        <div className="mt-1 text-sm text-slate-600">Bonuses earned when your referred users make their first purchase.</div>
      </div>

      <Card>
        <div className="grid gap-3 md:grid-cols-3">
          <Metric title="Total bonuses" value={`ETB ${(totalCents / 100).toFixed(2)}`} />
          <Metric title="Count" value={String(bonuses.data?.length ?? 0)} />
          <Metric title="Tier 3" value={`${(bonuses.data ?? []).filter(b => b.tier === 3).length}`} />
        </div>
      </Card>

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Tier Rules</div>
        <div className="p-4 text-sm text-slate-700 space-y-2">
          <div><strong>Tier 1:</strong> Product price &lt; 50 ETB → 3% bonus</div>
          <div><strong>Tier 2:</strong> Product price 50–99.99 ETB → 5% bonus</div>
          <div><strong>Tier 3:</strong> Product price ≥ 100 ETB → 10% bonus</div>
          <div className="text-xs text-slate-500 mt-2">Bonus is awarded only once per referred user, on their first approved order.</div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Bonuses</div>
        <div className="divide-y divide-slate-200">
          {(bonuses.data ?? []).map((b) => (
            <div key={b.id} className="px-4 py-3 text-sm flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-900">ETB {(b.amountCents / 100).toFixed(2)}</div>
                <div className="text-xs text-slate-500">
                  From: {b.referred.name} ({b.referred.email}) • {b.order.product.name} • Tier {b.tier} • {new Date(b.createdAt).toLocaleString()}
                </div>
              </div>
              <TierPill tier={b.tier} />
            </div>
          ))}

          {bonuses.isLoading ? <div className="px-4 py-6 text-sm text-slate-600">Loading…</div> : null}
          {!bonuses.isLoading && (bonuses.data ?? []).length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-600">No referral bonuses yet.</div>
          ) : null}
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

function TierPill({ tier }: { tier: number }) {
  const colors = {
    1: "bg-slate-50 text-slate-800 border-slate-200",
    2: "bg-sky-50 text-sky-800 border-sky-200",
    3: "bg-amber-50 text-amber-800 border-amber-200"
  };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${colors[tier as keyof typeof colors] || colors[1]}`}>Tier {tier}</span>;
}
