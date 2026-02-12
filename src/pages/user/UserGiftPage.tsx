import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { SpinRewardCard } from "../../components/user/SpinRewardCard";

export function UserGiftPage() {
  const qc = useQueryClient();

  const dailyStatus = useQuery({
    queryKey: ["daily-reward-status"],
    queryFn: async () => {
      const res = await http.get("/me/daily-reward-status");
      return res.data as { eligible: boolean; amountCents: number; nextAt?: string | null; reason?: string };
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

      <SpinRewardCard />

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Daily reward</div>
        <div className="p-4 space-y-3">
          <div className="text-sm text-slate-700">
            Daily rewards start after you deposit 550 birr (25 birr/day) or 1100 birr (70 birr/day). You also get 80 birr bonus assets when your deposits reach 550 birr.
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-slate-600">
              {dailyStatus.data?.eligible
                ? `Available: ${dailyStatus.data.amountCents ? Math.round(dailyStatus.data.amountCents / 100) : 0} birr`
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
              {claimDaily.isPending ? "Claiming…" : dailyStatus.data?.amountCents ? `Get ${Math.round(dailyStatus.data.amountCents / 100)} birr` : "Get daily reward"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
