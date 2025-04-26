import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Service, Category } from '@shared/schema';
import ServiceCard from '@/components/service-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaGamepad,
  FaCommentDots,
  FaTv,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
  FaPlay
} from 'react-icons/fa';

interface CategoryServicesProps {
  onOrderClick: (service: Service) => void;
}

export default function CategoryServices({ onOrderClick }: CategoryServicesProps) {
  // State to track which categories are expanded to show services
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});

  // Fetch all services
  const { data: allServices, isLoading: isLoadingServices } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  // Fetch all categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Helper function to get the appropriate icon based on category name
  const getCategoryIcon = (categoryName: string) => {
    switch(categoryName) {
      case 'SMM Services': return <FaInstagram className="text-white text-xl" />;
      case 'Subscription Services': return <FaTwitter className="text-white text-xl" />;
      case 'Ads Services': return <FaFacebook className="text-white text-xl" />;
      case 'Game Top-up': return <FaGamepad className="text-white text-xl" />;
      case 'Social - Buy & Sell': return <FaCommentDots className="text-white text-xl" />;
      case 'Streaming Services': return <FaTv className="text-white text-xl" />;
      case 'TikTok': return <FaInstagram className="text-white text-xl" />;
      case 'YouTube': return <FaPlay className="text-white text-xl" />;
      case 'Facebook': return <FaFacebook className="text-white text-xl" />;
      case 'Instagram': return <FaInstagram className="text-white text-xl" />;
      case 'Twitter': return <FaTwitter className="text-white text-xl" />;
      default: return <FaInstagram className="text-white text-xl" />;
    }
  };

  // Helper function to get the background color for icon based on category
  const getIconBgColor = (categoryName: string) => {
    switch(categoryName) {
      case 'SMM Services': return 'bg-pink-500';
      case 'Subscription Services': return 'bg-blue-500';
      case 'Ads Services': return 'bg-blue-600';
      case 'Game Top-up': return 'bg-green-500';
      case 'Social - Buy & Sell': return 'bg-yellow-500';
      case 'Streaming Services': return 'bg-red-500';
      case 'TikTok': return 'bg-pink-500';
      case 'YouTube': return 'bg-red-600';
      case 'Facebook': return 'bg-blue-600';
      case 'Instagram': return 'bg-purple-500';
      case 'Twitter': return 'bg-sky-500';
      default: return 'bg-gray-500';
    }
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  if (isLoadingServices || isLoadingCategories) {
    return <CategoryServicesSkeleton />;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-8">
          Our Services
        </h2>
        <p className="text-gray-600 text-center mb-12">All prices are listed in Ethiopian Birr (ETB)</p>
        
        <div className="space-y-12">
          {categories?.map((category) => {
            // Get services for this category
            const categoryServices = allServices?.filter(
              service => service.categoryId === category.id
            ) || [];
            
            // Only display categories that have services
            if (categoryServices.length === 0) return null;
            
            const isExpanded = expandedCategories[category.id] || false;
            
            return (
              <div key={category.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`rounded-lg p-3 ${getIconBgColor(category.name)}`}>
                    {getCategoryIcon(category.name)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-poppins font-semibold text-xl">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.description || 'Explore our services'}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCategory(category.id)}
                    className="ml-auto text-primary hover:bg-primary/5 flex items-center gap-2"
                  >
                    {isExpanded ? 'Hide Services' : 'View Services'}
                    {isExpanded ? <FaChevronUp className="h-3 w-3" /> : <FaChevronDown className="h-3 w-3" />}
                  </Button>
                </div>
                
                {isExpanded && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-4 border-t border-gray-100">
                    {categoryServices.map((service) => (
                      <ServiceCard 
                        key={service.id} 
                        service={service}
                        onOrderClick={onOrderClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CategoryServicesSkeleton() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />
        <Skeleton className="h-6 w-96 mx-auto mb-12" />
        
        <div className="space-y-12">
          {Array.from({ length: 3 }).map((_, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton className="h-12 w-12 rounded-lg" />
                <div>
                  <Skeleton className="h-6 w-40 mb-2" />
                  <Skeleton className="h-4 w-60" />
                </div>
                <Skeleton className="h-8 w-24 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}