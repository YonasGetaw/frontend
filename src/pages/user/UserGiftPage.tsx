import { Card } from "../../ui/Card";

export function UserGiftPage() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">Gifts</div>
        <div className="mt-1 text-sm text-slate-600">View available gifts and rewards.</div>
      </div>

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Available Gifts</div>
        <div className="p-4 text-sm text-slate-600">
          No gifts available at the moment. Keep earning points and participating in activities to unlock special rewards!
        </div>
      </Card>

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">How to Earn Gifts</div>
        <div className="p-4 text-sm text-slate-700 space-y-2">
          <div>• Accumulate points through purchases</div>
          <div>• Refer new members to the platform</div>
          <div>• Complete daily tasks and challenges</div>
          <div>• Participate in special events</div>
        </div>
      </Card>
    </div>
  );
}
