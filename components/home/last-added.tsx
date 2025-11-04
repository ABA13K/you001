// components/home/last-added.tsx
import ProductCard from '@/components/ui/product-card'

// Mock data - replace with actual API call
const lastAddedProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    price: 99.99,
    originalPrice: 129.99,
    image: '/images/products/headphones.jpg',
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
    image: '/images/products/smartwatch.jpg',
    category: 'Electronics',
    rating: 4.3,
    reviewCount: 89,
    isNew: true,
    slug: 'smart-fitness-watch'
  },
  {
    id: 3,
    name: 'Organic Cotton T-Shirt',
    price: 29.99,
    image: '/images/products/tshirt.jpg',
    category: 'Fashion',
    rating: 4.7,
    reviewCount: 256,
    isNew: true,
    slug: 'organic-cotton-tshirt'
  },
  {
    id: 4,
    name: 'Stainless Steel Water Bottle',
    price: 24.99,
    originalPrice: 34.99,
    image: '/images/products/water-bottle.jpg',
    category: 'Home',
    rating: 4.4,
    reviewCount: 167,
    isNew: true,
    slug: 'stainless-steel-water-bottle'
  },
  {
    id: 5,
    name: 'Programming Book Bundle',
    price: 49.99,
    image: '/images/products/books.jpg',
    category: 'Books',
    rating: 4.8,
    reviewCount: 73,
    isNew: true,
    slug: 'programming-book-bundle'
  },
  {
    id: 6,
    name: 'Gaming Mouse',
    price: 79.99,
    image: '/images/products/gaming-mouse.jpg',
    category: 'Electronics',
    rating: 4.6,
    reviewCount: 194,
    isNew: true,
    slug: 'gaming-mouse'
  }
]

export default function LastAdded() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
        <a
          href="/new-arrivals"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {lastAddedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}