import { Card } from "../../ui/Card";

type Order = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED";
  createdAt: string;
  amountCents: number;
  product: { name: string };
};

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "APPROVED":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "COMPLETED":
        return "bg-teal-50 text-teal-700 border-teal-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusAccent = (status: Order["status"]) => {
    switch (status) {
      case "PENDING": return "border-l-amber-400";
      case "APPROVED": return "border-l-teal-500";
      case "REJECTED": return "border-l-rose-400";
      case "COMPLETED": return "border-l-teal-600";
      default: return "border-l-slate-300";
    }
  };

  return (
    <Card className={`overflow-hidden p-0 border-l-4 ${getStatusAccent(order.status)}`}>
      <div className="p-5 lg:p-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">{order.product.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusColor(order.status)}`}>
            {order.status}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-100">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-teal-600">Amount</div>
            <div className="text-base font-bold text-teal-900 mt-0.5">ETB {(order.amountCents / 100).toFixed(2)}</div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Date</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Order ID</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              #{order.id.slice(-8)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
