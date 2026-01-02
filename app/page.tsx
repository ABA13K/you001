import { Suspense } from 'react';
import HeroSlider from '@/components/home/hero-slider';
import MainCategoriesServer from '@/components/categories/main-categories-server';
import TopRatedProductsServer from '@/components/products/top-rated-products-server';
import LatestProductsServer from '@/components/products/latest-products-server';
import RandomProductsServer from '@/components/products/random-products-server';
import TopSellingProductsServer from '@/components/products/top-selling-products-server';

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Main Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>}>
          <MainCategoriesServer />
        </Suspense>
      </section>

      {/* Top Rated Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Top Rated Products</h2>
        <Suspense fallback={<ProductsLoading />}>
          <TopRatedProductsServer />
        </Suspense>
      </section>

      {/* Latest Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">New Arrivals</h2>
        <Suspense fallback={<ProductsLoading />}>
          <LatestProductsServer />
        </Suspense>
      </section>

      {/* Random Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Discover Products</h2>
        <Suspense fallback={<ProductsLoading />}>
          <RandomProductsServer />
        </Suspense>
      </section>

      {/* Top Selling Products */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Best Sellers</h2>
        <Suspense fallback={<ProductsLoading />}>
          <TopSellingProductsServer />
        </Suspense>
      </section>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}