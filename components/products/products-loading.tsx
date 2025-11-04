// components/products/products-loading.tsx
export function ProductsLoading({ count = 5 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-square bg-gray-200 rounded-t-lg mb-3"></div>
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title Skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            
            {/* Rating Skeleton */}
            <div className="flex items-center space-x-1">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="w-3 h-3 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
            
            {/* Price Skeleton */}
            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Alternative: Individual product loading card
export function ProductLoadingCard() {
  return (
    <div className="animate-pulse bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category Skeleton */}
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
        
        {/* Title Skeleton */}
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        
        {/* Rating Skeleton */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="w-3 h-3 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-3 bg-gray-200 rounded w-12"></div>
        </div>
        
        {/* Price Skeleton */}
        <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  )
}

// For search results loading
export function SearchResultsLoading({ count = 12 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {/* Results header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Products grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <ProductLoadingCard key={index} />
        ))}
      </div>
    </div>
  )
}

// For homepage sections loading
export function SectionLoading({ title = true }: { title?: boolean }) {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        {title && (
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        )}
        <ProductsLoading count={5} />
      </div>
    </section>
  )
}

export default ProductsLoading