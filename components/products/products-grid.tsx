// components/products/products-grid.tsx
import ProductCard from '@/components/ui/product-card'

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  reviewCount: number
  isNew?: boolean
  isBestSeller?: boolean
  isFeatured?: boolean
  slug: string
}

interface ProductsGridProps {
  products: Product[]
}

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    originalPrice: 129.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    category: 'Electronics',
    rating: 4.5,
    reviewCount: 128,
    isNew: true,
    slug: 'wireless-bluetooth-headphones'
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    category: 'Electronics',
    rating: 4.3,
    reviewCount: 89,
    isNew: true,
    slug: 'smart-fitness-watch'
  },
  // Add more mock products as needed
]

export default function ProductsGrid({ products = mockProducts }: ProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="text-gray-400 text-6xl mb-4">😔</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 text-center">
          Try adjusting your filters to find what you&apos;re looking for.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}