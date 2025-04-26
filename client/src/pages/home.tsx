import { useState } from 'react';
import { Service } from '@shared/schema';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/hero-section';
import CategoryServices from '@/components/category-services';
import FeaturesSection from '@/components/features-section';
import TestimonialsSection from '@/components/testimonials-section';
import CTASection from '@/components/cta-section';
import StatsSection from '@/components/stats-section';
import PaymentModal from '@/components/payment-modal';

export default function Home() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const openPaymentModal = (service: Service) => {
    setSelectedService(service);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedService(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Display services grouped by categories */}
        <CategoryServices onOrderClick={openPaymentModal} />
        
        {/* Stats section with animated cards */}
        <StatsSection />
        
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      
      <Footer />
      
      <PaymentModal 
        service={selectedService} 
        isOpen={showPaymentModal} 
        onClose={closePaymentModal} 
      />
    </div>
  );
}
