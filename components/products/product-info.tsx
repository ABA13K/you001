import { Product } from '@/types/product';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 mb-4">{product.description}</p>
      
      <div className="mb-6">
        <div className="flex items-center gap-2">
          {product.discount_percentage > 0 ? (
            <>
              <span className="text-3xl font-bold text-red-600">
                ${product.price_after_discount}
              </span>
              <span className="text-lg line-through text-gray-500">
                ${product.original_price}
              </span>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                -{product.discount_percentage}%
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold">
              ${product.original_price}
            </span>
          )}
        </div>
      </div>
      
      {/* Rating */}
      <div className="flex items-center gap-2 mb-6">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-xl ${
                i < Math.floor(product.total_rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-gray-600">({product.total_rating})</span>
      </div>
      
      {/* Add to cart button */}
      <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Add to Cart
      </button>
    </div>
  );
}