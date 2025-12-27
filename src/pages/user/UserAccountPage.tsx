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

  const referralCode = me.data?.user?.referralCode ?? authUser?.referralCode ?? null;
  const points = me.data?.user?.points ?? authUser?.points ?? 0;
  const balanceCents = me.data?.user?.balanceCents ?? 0;
  const teamCount = me.data?.teamCount ?? 0;

  const referralLink = useMemo(() => {
    if (!referralCode) return "";
    return `${window.location.origin}/register?ref=${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  const [copied, setCopied] = useState(false);

  return (
    <div className="-mx-4 -mt-6 md:mx-0 md:mt-0">
      <div className="bg-brand-700 px-4 pb-4 pt-4 text-white md:rounded-2xl md:px-6 md:pt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Account</div>
            <div className="mt-1 text-xs text-white/80">{authUser?.email ?? ""}</div>
          </div>
          <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">VIP-1</div>
        </div>

        <div className="mt-4 rounded-2xl bg-white p-4 text-slate-900 shadow-soft">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500">ID</div>
                <div className="text-sm font-semibold text-slate-900">{referralCode ?? "—"}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-slate-500">Points</div>
              <div className="text-sm font-semibold text-slate-900">{points}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <TopMetric title="Recharge wallet" value="0" />
          <TopMetric title="Balance wallet" value={(balanceCents / 100).toFixed(2)} />
          <TopMetric title="Team" value={String(teamCount)} />
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 pb-6 pt-4 md:px-0">
        <div className="grid grid-cols-3 gap-3">
          <ActionShortcut 
            title="Recharge" 
            color="bg-rose-50 text-rose-700" 
            icon={<Wallet className="h-5 w-5" />} 
            onClick={() => navigate("/app/recharge")}
          />
          <ActionShortcut
            title="Withdraw"
            color="bg-violet-50 text-violet-700"
            icon={<CreditCard className="h-5 w-5" />}
            onClick={() => navigate("/app/withdraw")}
          />
          <ActionShortcut
            title="Send Money"
            color="bg-sky-50 text-sky-700"
            icon={<Wallet className="h-5 w-5" />}
            onClick={() => navigate("/app/send-money")}
          />
          <ActionShortcut
            title={copied ? "Copied!" : "Refer Friends"}
            color={copied ? "bg-green-50 text-green-700" : "bg-sky-50 text-sky-700"}
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

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-soft">
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

        {me.isLoading ? <div className="mt-3 text-sm text-slate-600">Loading…</div> : null}
      </div>
    </div>
  );
}

function TopMetric(props: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-2 py-2">
      <div className="text-[11px] font-semibold text-slate-500">{props.title}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{props.value}</div>
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
      className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-soft"
      onClick={props.onClick}
    >
      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${props.color}`}>{props.icon}</div>
      <div className="text-xs font-semibold text-slate-800">{props.title}</div>
    </button>
  );
}

function MenuItem(props: { title: string; icon: ReactNode; onClick?: () => void; danger?: boolean }) {
  return (
    <button
      type="button"
      className={
        "flex w-full items-center justify-between px-4 py-3 text-sm font-semibold " +
        (props.danger
          ? "text-rose-700 hover:bg-rose-50"
          : "text-slate-800 hover:bg-slate-50")
      }
      onClick={props.onClick}
    >
      <span className="inline-flex items-center gap-2">
        <span className={props.danger ? "text-rose-700" : "text-slate-600"}>{props.icon}</span>
        {props.title}
      </span>
      <span className="text-slate-400">›</span>
    </button>
  );
}
