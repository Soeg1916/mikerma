import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { FaGlobe, FaBars, FaTimes } from 'react-icons/fa';
import { cn } from '@/lib/utils';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  // Set scroll position to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Contact', href: '/contact', external: false },
  ];

  return (
    <header className="bg-primary shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <FaGlobe className="text-secondary text-2xl mr-2" />
              <span className="text-white font-poppins font-bold text-xl">
                Miker<span className="text-secondary">Market</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              item.external ? (
                <a 
                  key={item.name} 
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-secondary transition-colors font-medium"
                >
                  {item.name}
                </a>
              ) : (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={cn(
                    "text-white hover:text-secondary transition-colors font-medium",
                    location === item.href && "text-secondary"
                  )}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
          
          <button 
            onClick={toggleMobileMenu} 
            className="md:hidden text-white focus:outline-none"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <FaTimes className="text-xl" />
            ) : (
              <FaBars className="text-xl" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary-dark">
          <div className="px-4 py-2 space-y-3">
            {navigation.map((item) => (
              item.external ? (
                <a 
                  key={item.name} 
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-white hover:text-secondary transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ) : (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={cn(
                    "block text-white hover:text-secondary transition-colors font-medium",
                    location === item.href && "text-secondary"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
