import { Outlet } from "react-router-dom";
import { Shield, Zap, TrendingUp } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-amber-50/10">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-stretch">
        {/* Left Panel - Brand Showcase */}
        <div className="hidden w-1/2 flex-col justify-between p-12 lg:flex">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-xl bg-white/90 px-4 py-2.5 shadow-premium backdrop-blur">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-teal-700 shadow-sm shadow-teal-600/30">
                <span className="text-xs font-bold text-white">V</span>
              </div>
              <div className="text-sm font-bold text-slate-900 tracking-wide">Vestoria</div>
            </div>
            <h1 className="text-4xl font-bold leading-tight text-slate-900 text-balance">
              A modern commerce platform with fintech-grade control.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-slate-500">
              Manage products, accept payments, and track orders with a secure role-based dashboard designed for speed,
              clarity, and growth.
            </p>
          </div>

          {/* Feature Pills */}
          <div className="space-y-3">
            <FeaturePill
              icon={<Shield className="h-4 w-4" />}
              title="Bank-grade security"
              desc="Role-based access with encrypted sessions"
              color="teal"
            />
            <FeaturePill
              icon={<Zap className="h-4 w-4" />}
              title="Instant settlements"
              desc="Fast payment processing and verification"
              color="amber"
            />
            <FeaturePill
              icon={<TrendingUp className="h-4 w-4" />}
              title="Growth tools"
              desc="Referral rewards and team management"
              color="teal"
            />
          </div>
        </div>

        {/* Right Panel - Form Area */}
        <div className="flex w-full items-center justify-center p-6 md:w-1/2 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 flex items-center gap-2.5 lg:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-teal-600 to-teal-700 shadow-sm shadow-teal-600/30">
                <span className="text-sm font-bold text-white">V</span>
              </div>
              <div className="text-base font-bold text-slate-900 tracking-wide">Vestoria</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-7 shadow-premium-lg md:p-9">
              <Outlet />
            </div>

            <div className="mt-4 text-center text-xs text-slate-400">
              Protected by 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeaturePill(props: { icon: React.ReactNode; title: string; desc: string; color: "teal" | "amber" }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200/80 bg-white/80 px-5 py-4 shadow-premium backdrop-blur transition-all duration-200 hover:shadow-premium-hover">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          props.color === "teal"
            ? "bg-teal-50 text-teal-700"
            : "bg-amber-50 text-amber-600"
        }`}
      >
        {props.icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-slate-900">{props.title}</div>
        <div className="text-xs text-slate-500">{props.desc}</div>
      </div>
    </div>
  );
}
