// components/home/static-categories.tsx
import Image from 'next/image'

const staticCategories = [
  {
    id: 1,
    name: 'New Arrivals',
    image: '/images/static/new-arrivals.jpg',
    description: 'Fresh products just arrived',
    link: '/new-arrivals',
    buttonText: 'Explore New'
  },
  {
    id: 2,
    name: 'Sale',
    image: '/images/static/sale.jpg',
    description: 'Up to 70% off',
    link: '/sale',
    buttonText: 'Shop Sale'
  },
  {
    id: 3,
    name: 'Best Sellers',
    image: '/images/static/best-sellers.jpg',
    description: 'Most popular items',
    link: '/best-sellers',
    buttonText: 'View All'
  }
]

export default function StaticCategories() {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Collections</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {staticCategories.map((category) => (
            <div
              key={category.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-lg mb-4 opacity-90">{category.description}</p>
                  <a
                    href={category.link}
                    className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {category.buttonText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}