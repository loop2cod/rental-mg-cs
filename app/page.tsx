'use client'
import CallToAction from '@/components/Website/call-to-action';
import Faq from '@/components/Website/faq';
import Footer from '@/components/Website/footer';
import Header from '@/components/Website/header'
import Hero from '@/components/Website/hero';
import Categories from '@/components/Website/projects';
import Services from '@/components/Website/services';
import AdditionalCategories from '@/components/Website/additional-categories';
import EventRentals from '@/components/Website/event-rentals';

function Home() {

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container pt-4 mx-auto px-2">
        <Hero />
        <Categories />
        <AdditionalCategories />
        <EventRentals />
        <Services />
        <Faq />
        <CallToAction />
      </div>
      <Footer />
    </main>
  );
}

export default Home;
