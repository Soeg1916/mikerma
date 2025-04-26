import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Phone, MapPin, Send, Facebook, Instagram, Twitter } from 'lucide-react';
import { FaTelegram } from 'react-icons/fa';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { ContactInfo } from '@shared/schema';

export default function ContactPage() {
  // Fetch contact info
  const { data: contactInfo, isLoading } = useQuery<ContactInfo>({
    queryKey: ['/api/contact-info'],
  });

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-8 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
            Contact Us
          </h1>

          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Contact Information */}
              <div className="bg-primary p-8 text-white md:w-2/5">
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                <p className="mb-8">
                  Have questions about our services? We're here to help. Contact us through any of these channels:
                </p>

                {isLoading ? (
                  <div className="space-y-4">
                    <div className="h-6 bg-primary-light/30 rounded animate-pulse"></div>
                    <div className="h-6 bg-primary-light/30 rounded animate-pulse"></div>
                    <div className="h-6 bg-primary-light/30 rounded animate-pulse"></div>
                  </div>
                ) : contactInfo ? (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 mt-0.5 text-secondary" />
                      <span>{contactInfo.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-secondary" />
                      <span>{contactInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FaTelegram className="w-5 h-5 text-secondary" />
                      <a
                        href={contactInfo.telegramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-secondary transition-colors"
                      >
                        {contactInfo.telegramUsername}
                      </a>
                    </div>
                    
                    {contactInfo.showSocialIcons && (
                      <div className="flex space-x-4 mt-8">
                        {contactInfo.facebookLink && (
                          <a
                            href={contactInfo.facebookLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-secondary transition-colors"
                            aria-label="Facebook"
                          >
                            <Facebook className="w-6 h-6" />
                          </a>
                        )}
                        {contactInfo.instagramLink && (
                          <a
                            href={contactInfo.instagramLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-secondary transition-colors"
                            aria-label="Instagram"
                          >
                            <Instagram className="w-6 h-6" />
                          </a>
                        )}
                        {contactInfo.twitterLink && (
                          <a
                            href={contactInfo.twitterLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-secondary transition-colors"
                            aria-label="Twitter"
                          >
                            <Twitter className="w-6 h-6" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Contact information not available</p>
                )}
              </div>

              {/* Direct Contact Info */}
              <div className="p-8 md:w-3/5">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Reach Us</h2>
                <p className="text-gray-600 mb-6">
                  The fastest way to get in touch with us is through Telegram. Our support team is available 
                  to assist you with any questions or concerns you may have.
                </p>
                
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Contact</h3>
                  {contactInfo && (
                    <a 
                      href={contactInfo.telegramLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                      <FaTelegram className="mr-2" />
                      Chat on Telegram
                    </a>
                  )}
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Hours</h3>
                  {contactInfo ? (
                    <p className="text-gray-600">
                      {contactInfo.weekdayHours}<br />
                      {contactInfo.weekendHours}<br />
                      {contactInfo.timeZone}
                    </p>
                  ) : (
                    <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}