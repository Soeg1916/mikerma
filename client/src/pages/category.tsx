import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Service, Category } from '@shared/schema';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ServiceCard from '@/components/service-card';
import PaymentModal from '@/components/payment-modal';
import { Skeleton } from '@/components/ui/skeleton';
import { useParams } from 'wouter';
import { getCategoryById } from '@/lib/utils';
import { FaHashtag, FaCalendarCheck, FaAd, FaGamepad, FaUsers, FaPlay, FaGift } from 'react-icons/fa';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Fetch category
  const { data: category, isLoading: isLoadingCategory } = useQuery<Category>({
    queryKey: [`/api/categories/${slug}`],
  });

  // Fetch services for category
  const { data: services, isLoading: isLoadingServices } = useQuery<Service[]>({
    queryKey: [`/api/services/category/${category?.id}`],
    enabled: !!category?.id,
  });

  const openPaymentModal = (service: Service) => {
    setSelectedService(service);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedService(null);
  };

  const getIcon = (icon: string) => {
    switch(icon) {
      case 'hashtag': return <FaHashtag className="text-4xl mb-4 text-primary" />;
      case 'calendar-check': return <FaCalendarCheck className="text-4xl mb-4 text-primary" />;
      case 'ad': return <FaAd className="text-4xl mb-4 text-primary" />;
      case 'gamepad': return <FaGamepad className="text-4xl mb-4 text-primary" />;
      case 'users': return <FaUsers className="text-4xl mb-4 text-primary" />;
      case 'play': return <FaPlay className="text-4xl mb-4 text-primary" />;
      case 'gift': return <FaGift className="text-4xl mb-4 text-primary" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Category Header */}
        <section className="bg-primary py-12">
          <div className="container mx-auto px-4 text-center">
            {isLoadingCategory ? (
              <div className="flex flex-col items-center">
                <Skeleton className="h-16 w-16 rounded-full mb-4" />
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-4 w-96 max-w-full" />
              </div>
            ) : category ? (
              <>
                <div className="inline-block bg-white p-4 rounded-full mb-4">
                  {getIcon(category.icon)}
                </div>
                <h1 className="text-white font-poppins font-bold text-3xl md:text-4xl mb-2">{category.name}</h1>
                <p className="text-white/90 max-w-2xl mx-auto">{category.description}</p>
              </>
            ) : (
              <div className="text-white">
                <h1 className="font-poppins font-bold text-3xl mb-2">Category Not Found</h1>
                <p>The category you're looking for doesn't exist.</p>
              </div>
            )}
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-poppins font-bold text-2xl text-center mb-8">
              {category?.name || 'Services'} Offerings
            </h2>
            
            {isLoadingServices ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-80 rounded-xl" />
                ))}
              </div>
            ) : services && services.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {services.map((service) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    onOrderClick={openPaymentModal}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-lg text-gray-500">No services found in this category.</p>
              </div>
            )}
          </div>
        </section>
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
