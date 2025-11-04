// components/home/most-selled.tsx
import ProductCard from '@/components/ui/product-card'

// Mock data - replace with actual API call
const mostSelledProducts = [
  {
    id: 7,
    name: 'Wireless Earbuds',
    price: 79.99,
    originalPrice: 99.99,
    image: '/images/products/earbuds.jpg',
    category: 'Electronics',
    rating: 4.4,
    reviewCount: 342,
    isBestSeller: true,
    slug: 'wireless-earbuds'
  },
  {
    id: 8,
    name: 'Yoga Mat Premium',
    price: 39.99,
    image: '/images/products/yoga-mat.jpg',
    category: 'Sports',
    rating: 4.7,
    reviewCount: 189,
    isBestSeller: true,
    slug: 'yoga-mat-premium'
  },
  {
    id: 9,
    name: 'Coffee Maker',
    price: 89.99,
    originalPrice: 119.99,
    image: '/images/products/coffee-maker.jpg',
    category: 'Home',
    rating: 4.5,
    reviewCount: 267,
    isBestSeller: true,
    slug: 'coffee-maker'
  },
  {
    id: 10,
    name: 'Running Shoes',
    price: 129.99,
    image: '/images/products/running-shoes.jpg',
    category: 'Sports',
    rating: 4.6,
    reviewCount: 423,
    isBestSeller: true,
    slug: 'running-shoes'
  },
  {
    id: 11,
    name: 'Backpack',
    price: 49.99,
    image: '/images/products/backpack.jpg',
    category: 'Fashion',
    rating: 4.3,
    reviewCount: 156,
    isBestSeller: true,
    slug: 'backpack'
  },
  {
    id: 12,
    name: 'Smartphone Case',
    price: 19.99,
    image: '/images/products/phone-case.jpg',
    category: 'Electronics',
    rating: 4.2,
    reviewCount: 534,
    isBestSeller: true,
    slug: 'smartphone-case'
  }
]

export default function MostSelled() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
        <a
          href="/best-sellers"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {mostSelledProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}