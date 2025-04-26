import { useState } from 'react';
import { useLocation } from 'wouter';
import { Link } from 'wouter';
import { FaFacebookF, FaInstagram, FaTwitter, FaTelegram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { serviceCategories } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { ContactInfo } from '@shared/schema';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: contactInfo, isLoading } = useQuery<ContactInfo>({
    queryKey: ['/api/contact-info'],
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Special admin email check
    if (email.trim().toLowerCase() === 'mikerm9292928@gmail.com') {
      toast({
        title: "Admin access granted",
        description: "Redirecting to admin panel",
      });
      setTimeout(() => {
        setLocation('/admin/dashboard');
      }, 1000);
      return;
    }
    
    // Regular newsletter subscription
    toast({
      title: "Thank you for subscribing!",
      description: "You have been added to our newsletter.",
    });
    setEmail('');
  };

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 mb-8">
          {/* Company info */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Miker Market</h3>
            <p className="text-gray-400 mb-4">Your one-stop destination for all digital services in Ethiopia.</p>
            <div className="flex space-x-4">
              {contactInfo && (
                <>
                  {/* Always show Telegram */}
                  <a 
                    href={contactInfo.telegramLink}
                    className="text-gray-400 hover:text-white transition-colors" 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Telegram"
                  >
                    <FaTelegram />
                  </a>
                  
                  {/* Only show these if showSocialIcons is true and links are provided */}
                  {contactInfo.showSocialIcons && contactInfo.facebookLink && (
                    <a 
                      href={contactInfo.facebookLink}
                      className="text-gray-400 hover:text-white transition-colors" 
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                    >
                      <FaFacebookF />
                    </a>
                  )}
                  
                  {contactInfo.showSocialIcons && contactInfo.instagramLink && (
                    <a 
                      href={contactInfo.instagramLink}
                      className="text-gray-400 hover:text-white transition-colors" 
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <FaInstagram />
                    </a>
                  )}
                  
                  {contactInfo.showSocialIcons && contactInfo.twitterLink && (
                    <a 
                      href={contactInfo.twitterLink}
                      className="text-gray-400 hover:text-white transition-colors" 
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Twitter"
                    >
                      <FaTwitter />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <a href="https://t.me/Miker_mike" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>
          
          {/* Newsletter and Contact Info */}
          <div>
            <h3 className="font-poppins font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest updates and offers.</p>
            
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-secondary"
                />
                <Button type="submit" variant="secondary" size="sm" className="px-3">
                  <FaPaperPlane />
                </Button>
              </div>
            </form>
            
            <h3 className="font-poppins font-semibold text-lg mb-4">Contact Us</h3>
            {isLoading ? (
              <div className="text-gray-400">Loading contact information...</div>
            ) : contactInfo ? (
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaMapMarkerAlt className="mt-1 mr-3 text-secondary" />
                  <span className="text-gray-400">{contactInfo.address}</span>
                </li>
                <li className="flex items-center">
                  <FaPhoneAlt className="mr-3 text-secondary" />
                  <span className="text-gray-400">{contactInfo.phone}</span>
                </li>
                <li className="flex items-center">
                  <FaTelegram className="mr-3 text-secondary" />
                  <a href={contactInfo.telegramLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">{contactInfo.telegramUsername}</a>
                </li>
              </ul>
            ) : (
              <div className="text-gray-400">Contact information not available</div>
            )}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Miker Market. All rights reserved.</p>
          <div className="mt-2">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
