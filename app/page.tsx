// app/page.tsx
import HeroSlider from '@/components/home/hero-slider'
import MainCategoriesServer from '@/components/categories/main-categories-server'
import LatestProductsServer from '@/components/products/latest-products-server'
import RandomProductsServer from '@/components/products/random-products-server'
import TopRatedProductsServer from '@/components/products/top-rated-products-server'
import TopSellingProductsServer from '@/components/products/top-selling-products-server'
import StaticCategories from '@/components/home/static-categories'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
      {/* Header is now in the layout, so it will appear above the hero */}
      <div className="bg-gradient-to-r from-blue-600 to-sky-600">
        <HeroSlider />
      </div>
      
      <div className="relative">
        {/* Main Categories with gradient background */}
        <div className="bg-gradient-to-b from-white/80 to-blue-50/50 backdrop-blur-sm">
          <MainCategoriesServer />
        </div>

        {/* Latest Products with subtle gradient */}
        <div className="bg-gradient-to-b from-blue-50/30 to-white/50">
          <LatestProductsServer />
        </div>
        
        <div className="space-y-0">
          {/* <BannerAd size="medium" /> */}
          
          {/* Random Products */}
          <div className="bg-gradient-to-b from-white/50 to-sky-50/30">
            <RandomProductsServer />
          </div>
          
          {/* Top Rated Products */}
          <div className="bg-gradient-to-b from-sky-50/30 to-blue-50/30">
            <TopRatedProductsServer />
          </div>
          
          {/* Top Selling Products */}
          <div className="bg-gradient-to-b from-blue-50/30 to-cyan-50/20">
            <TopSellingProductsServer />
          </div>
        </div>
        
        {/* Static Categories with strong gradient */}
        <div className="bg-gradient-to-r from-blue-600/5 via-sky-600/5 to-cyan-600/5">
          <StaticCategories />
        </div>
      </div>
    </main>
  )
}