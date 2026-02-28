import { Card } from "../../ui/Card";

import type { ReactNode } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

interface ProductCardProps {
  product: Product;
  onPurchase: (productId: string) => void;
  details?: ReactNode;
}

export function ProductCard({ product, onPurchase, details }: ProductCardProps) {
  const handlePurchase = () => {
    onPurchase(product.id);
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Image Section */}
        <div className="lg:w-1/3 bg-gradient-to-br from-slate-50 to-teal-50/30 p-4 flex items-center justify-center min-h-[200px]">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-48 lg:h-full object-cover rounded-xl shadow-premium"
            />
          ) : (
            <div className="w-full h-48 lg:h-full bg-slate-100 rounded-xl flex items-center justify-center">
              <span className="text-slate-400 text-sm">No Image</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:w-2/3 p-5 lg:p-6 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{product.name}</h3>
            {!product.isActive && (
              <span className="inline-flex mt-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">Unavailable</span>
            )}
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-teal-50/70 p-3 rounded-xl border border-teal-100">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-teal-600">Price</div>
              <div className="text-base sm:text-lg font-bold text-teal-900 mt-0.5">ETB {(product.priceCents / 100).toFixed(2)}</div>
            </div>
            
            <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-600">Cycle</div>
              <div className="text-base sm:text-lg font-bold text-amber-900 mt-0.5">Daily</div>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">Return</div>
              <div className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">ETB {((product.priceCents / 100) * 0.1).toFixed(2)}</div>
            </div>
          </div>

          <div className="mb-4 flex-grow">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">Description</div>
            <p className="text-slate-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <button
              onClick={handlePurchase}
              disabled={!product.isActive}
              className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                product.isActive 
                  ? 'bg-teal-700 text-white shadow-md shadow-teal-700/20 hover:bg-teal-800 hover:shadow-lg active:scale-[0.98]' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {product.isActive ? 'Purchase Now' : 'Unavailable'}
            </button>
          </div>

          {details ? <div className="mt-4">{details}</div> : null}
        </div>
      </div>
    </Card>
  );
}
