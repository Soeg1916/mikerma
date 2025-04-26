import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Category } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FaTh,
  FaHashtag,
  FaCalendarCheck,
  FaAd,
  FaGamepad,
  FaUsers,
  FaPlay,
  FaGift
} from 'react-icons/fa';

interface CategorySelectorProps {
  activeCategory: string;
  onChange: (category: string) => void;
}

export default function CategorySelector({ activeCategory, onChange }: CategorySelectorProps) {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const getIcon = (icon: string) => {
    switch(icon) {
      case 'hashtag': return <FaHashtag className="text-xl mb-2" />;
      case 'calendar-check': return <FaCalendarCheck className="text-xl mb-2" />;
      case 'ad': return <FaAd className="text-xl mb-2" />;
      case 'gamepad': return <FaGamepad className="text-xl mb-2" />;
      case 'users': return <FaUsers className="text-xl mb-2" />;
      case 'play': return <FaPlay className="text-xl mb-2" />;
      case 'gift': return <FaGift className="text-xl mb-2" />;
      default: return <FaTh className="text-xl mb-2" />;
    }
  };

  if (isLoading) {
    return <CategorySelectorSkeleton />;
  }

  return (
    <section id="services" className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-8">Our Service Categories</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          <button 
            onClick={() => onChange('all')} 
            className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
              activeCategory === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <FaTh className="text-xl mb-2" />
            <span className="font-medium text-sm">All</span>
          </button>
          
          {categories?.map((category) => (
            <button 
              key={category.id}
              onClick={() => onChange(category.slug)} 
              className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                activeCategory === category.slug 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {getIcon(category.icon)}
              <span className="font-medium text-sm">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategorySelectorSkeleton() {
  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <Skeleton className="h-10 w-64 mx-auto mb-8" />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
}
