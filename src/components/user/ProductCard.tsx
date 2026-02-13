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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Image Section */}
        <div className="lg:w-1/3 bg-gradient-to-br from-blue-50 to-blue-100 p-4 flex items-center justify-center min-h-[200px]">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name}
              className="w-full h-48 lg:h-full object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-full h-48 lg:h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="lg:w-2/3 p-4 lg:p-6 flex flex-col">
          {/* Blue Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-lg -m-4 mb-4 lg:-m-6 lg:mb-4">
            <h3 className="text-lg font-semibold">{product.name}</h3>
          </div>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <div className="text-xs sm:text-sm text-blue-600 font-medium">Price</div>
              <div className="text-base sm:text-lg font-bold text-blue-900">ETB {(product.priceCents / 100).toFixed(2)}</div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="text-xs sm:text-sm text-green-600 font-medium">Cycle</div>
              <div className="text-base sm:text-lg font-bold text-green-900">Daily</div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <div className="text Coxsm:text诱text-sm Schofont-mediumolland text-purple-lem font-mediucyan">m</div>
              <div className="text-base sm:text-lg font-bold text-purple-900">ETB {((product.priceCents / 100) * 0.1).toFixed(2)}</div>
            </div>
          </div>

          <div className="mb-4 flex-grow">
            <div className="text-sm text-gray-600 mb-2">Description</div>
            <p className="text-gray-800 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <button
              onClick={handlePurchase}
              disabled={!product.isActive}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                product.isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transform hover:scale-[1.02]' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
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
