import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { http } from "../../api/http";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

export function SpinRewardCard(props: { className?: string; title?: string }) {
  const qc = useQueryClient();
  const [spinResultBirr, setSpinResultBirr] = useState<number | null>(null);
  const [pendingResultBirr, setPendingResultBirr] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotationDeg, setRotationDeg] = useState(0);

  // Visual wheel slices (game look). Server reward stays 80/100.
  // We keep many slices for a richer UI, but we always land on a slice
  // that corresponds to the server reward.
  const wheelSlices = useMemo(() => [80, 100, 300, 500, 80, 100, 300, 500], []);
  const currentRotationRef = useRef(0);

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
      const birr = data.claimed ? Math.round((data.rewardCents ?? 0) / 100) : null;
      setPendingResultBirr(birr);
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
      // no timers to cleanup; kept for future extension
    };
  }, []);

  function sliceAngleDeg() {
    return 360 / wheelSlices.length;
  }

  function normalizeDeg(deg: number) {
    const v = deg % 360;
    return v < 0 ? v + 360 : v;
  }

  function pickTargetIndexForReward(rewardBirr: number) {
    const candidates = wheelSlices
      .map((v, idx) => ({ v, idx }))
      .filter((x) => x.v === rewardBirr)
      .map((x) => x.idx);
    return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : 0;
  }

  async function animateWheelToReward(rewardBirr: number) {
    const idx = pickTargetIndexForReward(rewardBirr);
    const slice = sliceAngleDeg();

    // Pointer is at the top (0deg). Our wheel is rotated clockwise.
    // To land with slice idx under pointer, rotate so that the center of that slice aligns at 0deg.
    const targetCenterDeg = idx * slice + slice / 2;
    const desiredFinal = 360 - targetCenterDeg;

    const start = normalizeDeg(currentRotationRef.current);
    const rounds = 6;
    const final = start + rounds * 360 + (normalizeDeg(desiredFinal - start) || 360);

    currentRotationRef.current = final;
    setRotationDeg(final);

    await new Promise<void>((resolve) => window.setTimeout(resolve, 4200));
  }

  async function startSpin() {
    if (!spinStatus.data?.eligible) return;
    if (isAnimating || claimSpin.isPending) return;

    setSpinResultBirr(null);
    setPendingResultBirr(null);
    setIsAnimating(true);

    // Get the server reward first, then animate the UI to stop on that reward.
    const data = await claimSpin.mutateAsync();
    const rewardBirr = data.claimed ? Math.round((data.rewardCents ?? 0) / 100) : null;

    if (rewardBirr != null) {
      await animateWheelToReward(rewardBirr);
      setSpinResultBirr(rewardBirr);
    }

    setIsAnimating(false);
  }

  const slice = 360 / wheelSlices.length;
  const colors = ["#3b82f6", "#22c55e", "#a855f7", "#f59e0b", "#0ea5e9", "#10b981", "#6366f1", "#fb7185"];

  return (
    <Card className={props.className}>
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
        {props.title ?? "Spin reward"}
      </div>
      <div className="p-4 space-y-3">
        <div className="text-sm text-slate-700">
          You can spin when a user you invite makes their first approved deposit. Reward is always{" "}
          <span className="font-semibold">80</span> upto <span className="font-semibold">500</span> birr.
        </div>

        <div className="relative mx-auto flex w-full max-w-sm items-center justify-center">
          <div className="relative h-72 w-72">
            <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2">
              <div className="h-0 w-0 border-l-[10px] border-r-[10px] border-b-[18px] border-l-transparent border-r-transparent border-b-slate-900" />
            </div>

            <div className="absolute inset-0 rounded-full border border-slate-200 bg-white shadow-soft" />

            <div
              className="absolute inset-2 rounded-full"
              style={{
                transform: `rotate(${rotationDeg}deg)`,
                transition: isAnimating
                  ? "transform 4.2s cubic-bezier(0.12, 0.7, 0.15, 1)"
                  : "transform 200ms ease-out"
              }}
            >
              <svg viewBox="0 0 100 100" className="h-full w-full rounded-full">
                {wheelSlices.map((v, i) => {
                  const start = i * slice;
                  const end = (i + 1) * slice;
                  const largeArc = end - start > 180 ? 1 : 0;
                  const r = 50;
                  const cx = 50;
                  const cy = 50;

                  const a0 = (Math.PI / 180) * (start - 90);
                  const a1 = (Math.PI / 180) * (end - 90);
                  const x0 = cx + r * Math.cos(a0);
                  const y0 = cy + r * Math.sin(a0);
                  const x1 = cx + r * Math.cos(a1);
                  const y1 = cy + r * Math.sin(a1);

                  const d = `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z`;
                  const fill = colors[i % colors.length];
                  const labelAngle = (start + end) / 2;
                  const la = (Math.PI / 180) * (labelAngle - 90);
                  const lx = cx + 30 * Math.cos(la);
                  const ly = cy + 30 * Math.sin(la);

                  return (
                    <g key={`${v}-${i}`}>
                      <path d={d} fill={fill} opacity={0.95} />
                      <path d={d} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.6" />
                      <text
                        x={lx}
                        y={ly}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="6"
                        fontWeight="700"
                        fill="#fff"
                        style={{ userSelect: "none" }}
                      >
                        {v}
                      </text>
                    </g>
                  );
                })}
                <circle cx="50" cy="50" r="10" fill="#0f172a" opacity="0.85" />
                <circle cx="50" cy="50" r="7" fill="#fff" opacity="0.9" />
              </svg>
            </div>
          </div>
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
