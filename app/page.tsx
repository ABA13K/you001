// src/app/page.tsx
import HeroSlider from '@/components/home/hero-slider'
import CategoriesSlider from '@/components/home/categories-slider'
import StaticCategories from '@/components/home/static-categories'
import MostSelled from '@/components/home/most-selled'
import MostRated from '@/components/home/most-rated'
import LastAdded from '@/components/home/last-added'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSlider />
      <CategoriesSlider />
      <StaticCategories />
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        <LastAdded />
        <MostSelled />
        <MostRated />
      </div>
    </main>
  )
}