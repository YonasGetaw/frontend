import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-stretch">
        <div className="hidden w-1/2 flex-col justify-between p-10 md:flex">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-soft">
              <div className="h-2 w-2 rounded-full bg-brand-600" />
              <div className="text-sm font-semibold text-slate-900">Vestoria</div>
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900">
              A modern commerce platform with fintech-grade control.
            </h1>
            <p className="max-w-md text-slate-600">
              Manage products, accept payments, and track orders with a secure role-based dashboard designed for speed,
              clarity, and growth.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-soft backdrop-blur">
            <div className="text-sm font-medium text-slate-900">Security</div>
            <div className="mt-1 text-sm text-slate-600">
              Role-based access, refresh-token sessions, and admin-controlled payment settings.
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center p-6 md:w-1/2 md:p-10">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-soft md:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
