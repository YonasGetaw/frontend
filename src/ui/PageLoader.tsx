export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-2 w-1/2 animate-pulse rounded-full bg-brand-600" />
        </div>
        <div className="mt-3 text-sm text-slate-600">Loading session…</div>
      </div>
    </div>
  );
}
