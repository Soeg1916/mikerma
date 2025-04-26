import { useQuery } from '@tanstack/react-query';
import { Testimonial } from '@shared/schema';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';

export default function TestimonialsSection() {
  const { data: testimonials, isLoading } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  if (isLoading) {
    return <TestimonialsSkeleton />;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-12">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials?.map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-poppins font-semibold">{testimonial.name}</h4>
                  <div className="flex text-secondary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>
                        {i < Math.floor(testimonial.rating) ? (
                          <FaStar />
                        ) : i < Math.ceil(testimonial.rating) && testimonial.rating % 1 !== 0 ? (
                          <FaStarHalfAlt />
                        ) : null}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600">{testimonial.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSkeleton() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Skeleton className="h-10 w-64 mx-auto mb-12" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <Skeleton className="w-12 h-12 rounded-full mr-4" />
                <div className="w-full">
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
