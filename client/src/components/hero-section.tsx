import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function HeroSection() {
  return (
    <section className="bg-primary-light py-16 md:py-24 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="font-poppins font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              Miker Market - Digital Services Marketplace
            </h1>
            <p className="text-lg mb-6">
              From social media marketing to gift cards, subscriptions, and more. All available in Ethiopian Birr (ETB).
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#services" onClick={(e) => {
                e.preventDefault();
                const servicesSection = document.getElementById('services');
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                <Button variant="secondary" size="lg" className="font-poppins font-medium">
                  Explore Services
                </Button>
              </a>
              <Link href="/contact">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border border-white hover:bg-white hover:text-primary font-poppins font-medium"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Digital Services" 
              className="rounded-lg shadow-lg w-full max-w-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
