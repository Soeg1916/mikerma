import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

export default function CTASection() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-poppins font-bold text-2xl md:text-3xl text-white mb-4">Ready to Get Started?</h2>
        <p className="text-white text-lg mb-8 max-w-2xl mx-auto">
          Explore our wide range of digital services and find what you need. All services come with secure payment options and fast delivery.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="#services">
            <Button 
              variant="secondary" 
              size="lg"
              className="inline-block bg-secondary hover:bg-secondary-dark text-primary font-poppins font-medium"
            >
              Browse Services
            </Button>
          </Link>
          <Link href="/contact">
            <Button 
              variant="outline" 
              size="lg"
              className="border border-white hover:bg-white hover:text-primary font-poppins font-medium text-white"
            >
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
