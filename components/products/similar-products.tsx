// components/products/similar-products.tsx
import { SimilarProduct } from '@/types/product'
import ProductCard from './product-card'

interface SimilarProductsProps {
  products: SimilarProduct[]
}

export default function SimilarProducts({ products }: SimilarProductsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Similar Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={{
              id: product.id,
              name: product.name,
              original_price: product.original_price,
              discount_percentage: product.discount_percentage.toString(),
              price_after_discount: parseFloat(product.price_after_discount),
              total_rating: product.total_rating,
              image: product.image
            }}
          />
        ))}
      </div>
    </div>
  )
}