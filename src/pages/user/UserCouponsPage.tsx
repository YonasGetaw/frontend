import { Card } from "../../ui/Card";

export function UserCouponsPage() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-semibold text-slate-900">My Coupons</div>
        <div className="mt-1 text-sm text-slate-600">View and manage your available coupons.</div>
      </div>

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">Available Coupons</div>
        <div className="p-4 text-sm text-slate-600">
          No coupons available at the moment. Check back later for special offers and discounts!
        </div>
      </Card>

      <Card>
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">How to Get Coupons</div>
        <div className="p-4 text-sm text-slate-700 space-y-2">
          <div>• Participate in promotional events</div>
          <div>• Refer friends and earn bonus coupons</div>
          <div>• Watch for special holiday offers</div>
          <div>• Check your email for exclusive deals</div>
        </div>
      </Card>
    </div>
  );
}
