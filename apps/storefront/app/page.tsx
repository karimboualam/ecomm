import { Suspense } from 'react';
import { HeroSection } from './components/hero-section';
import { FeaturedProducts } from './components/featured-products';
import { CategoryGrid } from './components/category-grid';
import { Header } from './components/header';
import { Footer } from './components/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <HeroSection />
        
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <CategoryGrid />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <FeaturedProducts />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
}