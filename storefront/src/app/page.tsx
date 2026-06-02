import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { CategoriesSection } from '@/components/site/categories-section'
import { FeaturedProducts } from '@/components/site/featured-products'
import { ContractorSection } from '@/components/site/contractor-section'
import { Footer } from '@/components/site/footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategoriesSection />
        <FeaturedProducts />
        <ContractorSection />
      </main>
      <Footer />
    </>
  )
}   