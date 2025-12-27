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
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "APPROVED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "REJECTED":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "COMPLETED":
        return "bg-blue-50 text-blue-800 border-blue-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row">
        {/* Status Section */}
        <div className="lg:w-1/4 bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex items-center justify-center min-h-[120px]">
          <div className="text-center">
            <div className={`inline-flex rounded-full border px-3 py-2 text-sm font-semibold ${getStatusColor(order.status)}`}>
              {order.status}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:w-3/4 p-4 lg:p-6">
          {/* Blue Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg -m-4 mb-4 lg:-m-6 lg:mb-4">
            <h3 className="text-lg font-semibold">{order.product.name}</h3>
          </div>

          {/* Order Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs sm:text-sm text-blue-600 font-medium">Price</div>
              <div className="text-base sm:text-lg font-bold text-blue-900">ETB {(order.amountCents / 100).toFixed(2)}</div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-xs sm:text-sm text-green-600 font-medium">Date</div>
              <div className="text-base sm:text-lg font-bold text-green-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="text-xs sm:text-sm text-purple-600 font-medium">Order ID</div>
              <div className="text-base sm:text-lg font-bold text-purple-900">
                #{order.id.slice(-8)}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-1">Order Details</div>
            <p className="text-gray-800 text-sm">
              Placed on {new Date(order.createdAt).toLocaleString()} • Status: {order.status}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
