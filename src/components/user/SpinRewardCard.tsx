import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

export function SpinRewardCard(props: { className?: string; title?: string }) {
  const qc = useQueryClient();
  const [spinResultBirr, setSpinResultBirr] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const segments = useMemo(() => [80, 100, 300, 500], []);
  const intervalRef = useRef<number | null>(null);

  const spinStatus = useQuery({
    queryKey: ["spin-status"],
    queryFn: async () => {
      const res = await http.get("/me/spin-status");
      return res.data as { eligible: boolean; pendingCount: number };
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
        qc.invalidateQueries({ queryKey: ["me"] }),
        qc.invalidateQueries({ queryKey: ["me-activity"] })
      ]);
    }
  });

  useEffect(() => {
    return () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  async function startSpin() {
    if (!spinStatus.data?.eligible) return;
    if (isAnimating || claimSpin.isPending) return;

    setSpinResultBirr(null);
    setIsAnimating(true);

    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % segments.length);
    }, 120);

    await new Promise((r) => window.setTimeout(r, 5000));

    if (intervalRef.current != null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    await claimSpin.mutateAsync();
    setIsAnimating(false);
  }

  return (
    <Card className={props.className}>
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
        {props.title ?? "Spin reward"}
      </div>
      <div className="p-4 space-y-3">
        <div className="text-sm text-slate-700">
          You can spin when a user you invite makes their first approved deposit. Reward is always {" "}
          <span className="font-semibold">80</span> or <span className="font-semibold">100</span> birr.
        </div>

        <div className="grid grid-cols-4 gap-2">
          {segments.map((v, idx) => (
            <div
              key={v}
              className={`rounded-xl border px-2 py-3 text-center transition-colors ${
                isAnimating && idx === activeIndex
                  ? "border-brand-300 bg-brand-50"
                  : "border-slate-200 bg-white"
              }`}
            >
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
          <Button onClick={startSpin} disabled={!spinStatus.data?.eligible || isAnimating || claimSpin.isPending}>
            {isAnimating ? "Spinning…" : "Spin"}
          </Button>
        </div>

        {spinResultBirr != null ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
            You won {spinResultBirr} birr.
          </div>
        ) : null}
      </div>
    </Card>
  );
}
