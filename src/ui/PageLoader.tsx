export function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-white p-8 shadow-premium-lg text-center">
        <div className="mx-auto h-10 w-10 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 shadow-md shadow-teal-600/20 flex items-center justify-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </div>
        <div className="mt-4 text-sm font-medium text-slate-700">Loading session</div>
        <div className="mt-1 text-xs text-slate-400">Please wait a moment...</div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div className="h-1.5 w-2/3 animate-pulse rounded-full bg-gradient-to-r from-teal-500 to-teal-600" />
        </div>
      </div>
    </div>
  );
}
