import { useMemo, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BadgePercent,
  Check,
  CreditCard,
  Gift,
  Headset,
  KeyRound,
  Link as LinkIcon,
  LogOut,
  ShieldCheck,
  Users,
  Wallet
} from "lucide-react";

import { http } from "../../api/http";
import { useAuthStore } from "../../state/auth";

export function UserAccountPage() {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const authUser = useAuthStore((s) => s.user);

  const me = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await http.get("/me");
      return res.data as { user: { referralCode: string | null; points: number | null; balanceCents: number | null }; teamCount: number };
    }
  });

  const stats = useQuery({
    queryKey: ["account-stats"],
    queryFn: async () => {
      const res = await http.get("/me/account-stats");
      return res.data as {
        totalRechargeCents: number;
        totalWithdrawCents: number;
        totalAssetsCents: number;
        todayIncomeCents: number;
        teamIncomeCents: number;
        totalIncomeCents: number;
      };
    }
  });

  const referralCode = me.data?.user?.referralCode ?? authUser?.referralCode ?? null;
  const points = me.data?.user?.points ?? authUser?.points ?? 0;
  const balanceCents = me.data?.user?.balanceCents ?? 0;
  const teamCount = me.data?.teamCount ?? 0;
  const vipLevel = (me.data as any)?.user?.vipLevel ?? (authUser as any)?.vipLevel ?? 1;

  const referralLink = useMemo(() => {
    if (!referralCode) return "";
    return `${window.location.origin}/register?ref=${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  const [copied, setCopied] = useState(false);

  return (
    <div className="-mx-4 -mt-6 md:mx-0 md:mt-0">
      <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 px-4 pb-5 pt-5 text-white md:rounded-2xl md:px-6 md:pt-6 relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '20px 20px'}} />
        
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold tracking-tight">Account</div>
              <div className="mt-1 text-xs text-teal-200">{authUser?.email ?? ""}</div>
            </div>
            <div className="rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-white shadow-sm">VIP-{vipLevel}</div>
          </div>

          <div className="mt-4 rounded-2xl bg-white/95 p-4 text-slate-900 shadow-premium-lg backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">ID</div>
                  <div className="text-sm font-bold text-slate-900">{referralCode ?? "\u2014"}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Points</div>
                <div className="text-sm font-bold text-slate-900">{points}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <TopMetric title="Total recharge" value={stats.data ? String(Math.round(stats.data.totalRechargeCents / 100)) : "0"} />
            <TopMetric title="Total withdraw" value={stats.data ? String(Math.round(stats.data.totalWithdrawCents / 100)) : "0"} />
            <TopMetric title="Total assets" value={stats.data ? String(Math.round(stats.data.totalAssetsCents / 100)) : "0"} />
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-6 pt-4 md:px-0">
        <div className="grid grid-cols-3 gap-3 text-center">
          <TopMetric title="Today's income" value={stats.data ? (stats.data.todayIncomeCents / 100).toFixed(2) : "0"} />
          <TopMetric title="Team income" value={stats.data ? (stats.data.teamIncomeCents / 100).toFixed(2) : "0"} />
          <TopMetric title="Total income" value={stats.data ? (stats.data.totalIncomeCents / 100).toFixed(2) : "0"} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ActionShortcut 
            title="Recharge" 
            color="bg-teal-50 text-teal-700" 
            icon={<Wallet className="h-5 w-5" />} 
            onClick={() => navigate("/app/recharge")}
          />
          <ActionShortcut
            title="Withdraw"
            color="bg-amber-50 text-amber-600"
            icon={<CreditCard className="h-5 w-5" />}
            onClick={() => navigate("/app/withdraw")}
          />
          <ActionShortcut
            title="Send Money"
            color="bg-teal-50 text-teal-700"
            icon={<Wallet className="h-5 w-5" />}
            onClick={() => navigate("/app/send-money")}
          />
          <ActionShortcut
            title={copied ? "Copied!" : "Refer Friends"}
            color={copied ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-600"}
            icon={copied ? <Check className="h-5 w-5" /> : <Users className="h-5 w-5" />}
            onClick={async () => {
              if (!referralLink) return;
              try {
                await navigator.clipboard.writeText(referralLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {
                setCopied(false);
              }
            }}
          />
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white shadow-premium divide-y divide-slate-100">
          <MenuItem title="My Order" icon={<CreditCard className="h-4 w-4" />} onClick={() => navigate("/app/orders")} />
          <MenuItem title="Transaction" icon={<CreditCard className="h-4 w-4" />} onClick={() => navigate("/app/transactions")} />
          <MenuItem title="My coupon" icon={<BadgePercent className="h-4 w-4" />} onClick={() => navigate("/app/coupons")} />
          <MenuItem title="My team" icon={<Users className="h-4 w-4" />} onClick={() => navigate("/app/team")} />
          <MenuItem title="Gift" icon={<Gift className="h-4 w-4" />} onClick={() => navigate("/app/gift")} />
          <MenuItem title="Online service" icon={<Headset className="h-4 w-4" />} onClick={() => navigate("/app/online-service")} />
          <MenuItem title="Referral Bonuses" icon={<Gift className="h-4 w-4" />} onClick={() => navigate("/app/referral-bonuses")} />
          <MenuItem title="Withdraw password" icon={<ShieldCheck className="h-4 w-4" />} onClick={() => navigate("/app/withdraw-password")} />
          <MenuItem title="Change Password" icon={<KeyRound className="h-4 w-4" />} onClick={() => navigate("/app/change-password")} />
          <MenuItem
            title={copied ? "Referral link copied!" : "Copy referral link"}
            icon={copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
            onClick={async () => {
              if (!referralLink) return;
              try {
                await navigator.clipboard.writeText(referralLink);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {
                setCopied(false);
              }
            }}
          />
          <MenuItem
            title="Log Out"
            icon={<LogOut className="h-4 w-4" />}
            onClick={async () => {
              await logout();
              navigate("/login", { replace: true });
            }}
            danger
          />
        </div>

        {me.isLoading || stats.isLoading ? <div className="mt-3 text-sm text-slate-600">Loading…</div> : null}
      </div>
    </div>
  );
}

function TopMetric(props: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur px-2 py-2.5 ring-1 ring-white/10">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-teal-200">{props.title}</div>
      <div className="mt-1 text-sm font-bold text-white">{props.value}</div>
    </div>
  );
}

function ActionShortcut(props: {
  title: string;
  icon: ReactNode;
  color: string;
  onClick?: () => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200/80 bg-white px-3 py-3.5 shadow-premium transition-all duration-200 hover:shadow-premium-hover active:scale-[0.97]"
      onClick={props.onClick}
    >
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${props.color}`}>{props.icon}</div>
      <div className="text-xs font-semibold text-slate-700">{props.title}</div>
    </button>
  );
}

function MenuItem(props: { title: string; icon: ReactNode; onClick?: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      className={
        "flex w-full items-center justify-between px-4 py-3.5 text-sm font-medium transition-colors duration-150 " +
        (props.danger
          ? "text-rose-600 hover:bg-rose-50"
          : "text-slate-700 hover:bg-slate-50")
      }
      onClick={props.onClick}
    >
      <span className="inline-flex items-center gap-3">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${props.danger ? "bg-rose-50 text-rose-500" : "bg-slate-100 text-slate-500"}`}>{props.icon}</span>
        {props.title}
      </span>
      <svg className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
