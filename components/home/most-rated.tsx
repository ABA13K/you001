// components/home/most-rated.tsx
import ProductCard from '@/components/ui/product-card'

// Mock data - replace with actual API call
const mostRatedProducts = [
  {
    id: 13,
    name: '4K Ultra HD TV',
    price: 699.99,
    originalPrice: 899.99,
    image: '/images/products/tv.jpg',
    category: 'Electronics',
    rating: 4.9,
    reviewCount: 892,
    isFeatured: true,
    slug: '4k-ultra-hd-tv'
  },
  {
    id: 14,
    name: 'Designer Handbag',
    price: 299.99,
    image: '/images/products/handbag.jpg',
    category: 'Fashion',
    rating: 4.8,
    reviewCount: 445,
    isFeatured: true,
    slug: 'designer-handbag'
  },
  {
    id: 15,
    name: 'Air Fryer',
    price: 129.99,
    image: '/images/products/air-fryer.jpg',
    category: 'Home',
    rating: 4.7,
    reviewCount: 678,
    isFeatured: true,
    slug: 'air-fryer'
  },
  {
    id: 16,
    name: 'Gaming Chair',
    price: 249.99,
    image: '/images/products/gaming-chair.jpg',
    category: 'Furniture',
    rating: 4.6,
    reviewCount: 334,
    isFeatured: true,
    slug: 'gaming-chair'
  },
  {
    id: 17,
    name: 'Skincare Set',
    price: 89.99,
    image: '/images/products/skincare.jpg',
    category: 'Beauty',
    rating: 4.8,
    reviewCount: 567,
    isFeatured: true,
    slug: 'skincare-set'
  },
  {
    id: 18,
    name: 'Drone with Camera',
    price: 499.99,
    originalPrice: 599.99,
    image: '/images/products/drone.jpg',
    category: 'Electronics',
    rating: 4.5,
    reviewCount: 278,
    isFeatured: true,
    slug: 'drone-with-camera'
  }
]

export default function MostRated() {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Top Rated</h2>
        <a
          href="/top-rated"
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {mostRatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}