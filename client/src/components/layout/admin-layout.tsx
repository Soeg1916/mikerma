import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  FaTh,
  FaShoppingCart,
  FaTags,
  FaCreditCard,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaAddressBook
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  actionButton?: React.ReactNode;
}

export default function AdminLayout({ children, title, actionButton }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    
    setTimeout(() => {
      setLocation('/');
    }, 1000);
  };

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: <FaTh className="mr-3" /> },
    { path: '/admin/services', label: 'Services', icon: <FaShoppingCart className="mr-3" /> },
    { path: '/admin/categories', label: 'Categories', icon: <FaTags className="mr-3" /> },
    { path: '/admin/payments', label: 'Payment Methods', icon: <FaCreditCard className="mr-3" /> },
    { path: '/admin/orders', label: 'Orders & Payments', icon: <FaUsers className="mr-3" /> },
    { path: '/admin/contact', label: 'Contact Info', icon: <FaAddressBook className="mr-3" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile menu toggle */}
      <div className="md:hidden fixed top-0 right-0 p-4 z-30">
        <Button
          variant="outline"
          size="sm"
          className="bg-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </Button>
      </div>

      {/* Sidebar - Desktop */}
      <div className="bg-primary text-white w-64 flex-shrink-0 hidden md:flex md:flex-col">
        <div className="p-6 flex-grow">
          <div className="flex items-center mb-8">
            <FaTh className="text-secondary text-2xl mr-2" />
            <span className="font-poppins font-bold text-xl">Admin Panel</span>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <a className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
                  isActive(item.path) ? 'bg-white/10 font-medium' : 'hover:bg-white/5'
                }`}>
                  {item.icon} {item.label}
                </a>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center text-white/80 hover:text-white transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
      
      {/* Sidebar - Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar - Mobile */}
      <div 
        className={`fixed top-0 bottom-0 left-0 w-64 bg-primary text-white z-20 transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center mb-8">
            <FaTh className="text-secondary text-2xl mr-2" />
            <span className="font-poppins font-bold text-xl">Admin Panel</span>
          </div>
          
          <nav className="space-y-1 flex-grow">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <a className={`flex items-center py-3 px-4 rounded-lg transition-colors ${
                  isActive(item.path) ? 'bg-white/10 font-medium' : 'hover:bg-white/5'
                }`}>
                  {item.icon} {item.label}
                </a>
              </Link>
            ))}
          </nav>
          
          <div className="pt-4 border-t border-white/10 mt-auto">
            <button 
              onClick={handleLogout}
              className="flex items-center text-white/80 hover:text-white transition-colors"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4 md:sticky md:top-0 z-10">
          <div className="flex justify-between items-center">
            <h1 className="font-poppins font-bold text-xl">{title}</h1>
            
            {actionButton && (
              <div>
                {actionButton}
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-grow p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}