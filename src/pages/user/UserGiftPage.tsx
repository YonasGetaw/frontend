import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

export function UserGiftPage() {
  const qc = useQueryClient();
  const [spinResultBirr, setSpinResultBirr] = useState<number | null>(null);

  const segments = useMemo(() => [80, 100, 300, 500], []);

  const spinStatus = useQuery({
    queryKey: ["spin-status"],
    queryFn: async () => {
      const res = await http.get("/me/spin-status");
      return res.data as { eligible: boolean; pendingCount: number };
    }
  });

  const dailyStatus = useQuery({
    queryKey: ["daily-reward-status"],
    queryFn: async () => {
      const res = await http.get("/me/daily-reward-status");
      return res.data as { eligible: boolean; amountCents: number; nextAt?: string | null; reason?: string };
    }
  });

  const claimSpin = useMutation({
    mutationFn: async () => {
      const res = await http.post("/me/claim-spin");
      return res.data as { claimed: boolean; rewardCents: number; reason: string };
    },
    onSuccess: async (data) => {
      setSpinResultBirr(data.claimed ? Math.round((data.rewardCents ?? 0) / 100) : null);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["spin-status"] }),
        qc.invalidateQueries({ queryKey: ["account-stats"] }),
        qc.invalidateQueries({ queryKey: ["me"] })
      ]);
    }
  });

  const claimDaily = useMutation({
    mutationFn: async () => {
      const res = await http.post("/me/claim-daily-reward");
      return res.data as { claimed: boolean; amountCents: number; reason: string; nextAt?: string };
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["daily-reward-status"] }),
        qc.invalidateQueries({ queryKey: ["account-stats"] }),
        qc.invalidateQueries({ queryKey: ["me"] })
      ]);
    }
  });

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Gifts</div>
        <div className="mt-1 text-sm text-slate-600">View available gifts and rewards.</div>
      </div>

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Spin reward</div>
        <div className="p-4 space-y-3">
          <div className="text-sm text-slate-700">
            You can spin when a user you invited makes their first approved deposit. Reward is always <span className="font-semibold">80</span>{" "}
            or <span className="font-semibold">100</span> birr.
          </div>

          <div className="grid grid-cols-4 gap-2">
            {segments.map((v) => (
              <div key={v} className="rounded-xl border border-slate-200 bg-white px-2 py-3 text-center">
                <div className="text-xs font-semibold text-slate-500">Birr</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">{v}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-slate-600">
              {spinStatus.data?.eligible
                ? `You have ${spinStatus.data.pendingCount} spin chance.`
                : "No spin chance yet."}
            </div>
            <Button
              onClick={async () => {
                setSpinResultBirr(null);
                await claimSpin.mutateAsync();
              }}
              disabled={!spinStatus.data?.eligible || claimSpin.isPending}
            >
              {claimSpin.isPending ? "Spinning…" : "Spin"}
            </Button>
          </div>

          {spinResultBirr != null ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
              You won {spinResultBirr} birr.
            </div>
          ) : null}
        </div>
      </Card>

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Daily reward</div>
        <div className="p-4 space-y-3">
          <div className="text-sm text-slate-700">Claim 30 birr every 24 hours after your first approved deposit.</div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-slate-600">
              {dailyStatus.data?.eligible
                ? "Available now"
                : dailyStatus.data?.nextAt
                ? `Next at ${new Date(dailyStatus.data.nextAt).toLocaleString()}`
                : "Not available"}
            </div>

            <Button
              onClick={async () => {
                await claimDaily.mutateAsync();
              }}
              className={dailyStatus.data?.eligible ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-400 hover:bg-slate-400"}
              disabled={!dailyStatus.data?.eligible || claimDaily.isPending}
            >
              {claimDaily.isPending ? "Claiming…" : "Get 30 birr"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
