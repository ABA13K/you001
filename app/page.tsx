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
    <main className="min-h-screen">
      {/* Header is now in the layout, so it will appear above the hero */}
      <HeroSlider />
      <MainCategoriesServer />
      <LatestProductsServer />
      
      <div className="space-y-0">
        {/* <BannerAd size="medium" /> */}
        <RandomProductsServer />
        <TopRatedProductsServer />
        <TopSellingProductsServer />
      </div>
      
      <StaticCategories />
    </main>
  )
}