import { Link } from 'wouter';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { FaCheck, FaUsers, FaShoppingBag, FaGlobe, FaHeadset, FaShieldAlt, FaRegCreditCard } from 'react-icons/fa';

export default function AboutUs() {
  const stats = [
    {
      value: "500+",
      label: "Satisfied Customers"
    },
    {
      value: "300+",
      label: "Orders Completed"
    },
    {
      value: "1",
      label: "Country Served"
    }
  ];

  return (
    <>
      <Header />
      
      <main className="pt-16 pb-20">
        {/* Hero Section */}
        <section className="bg-primary-dark text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-poppins font-bold text-3xl md:text-4xl mb-4">About Miker Market</h1>
            <p className="text-lg max-w-3xl mx-auto">
              Your trusted partner for all digital services in Ethiopia
            </p>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="font-poppins font-bold text-2xl md:text-3xl mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  Miker Market was founded with a simple mission: to make digital services accessible to everyone in Ethiopia.
                  We understand the challenges that come with accessing global digital services in our local context, and we've
                  built a platform that bridges this gap.
                </p>
                <p className="text-gray-700">
                  From social media growth to digital content delivery, we offer a wide range of services with the convenience
                  of local payment methods and dedicated customer support.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800" 
                  alt="Team working together" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-12">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-primary-light text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheck className="text-2xl" />
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-3 text-center">Quality</h3>
                <p className="text-gray-700 text-center">
                  We never compromise on the quality of our services. Every product we offer is thoroughly tested 
                  and verified to ensure it meets our high standards.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-primary-light text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaShoppingBag className="text-2xl" />
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-3 text-center">Reliability</h3>
                <p className="text-gray-700 text-center">
                  We understand the importance of timely delivery. When you place an order with us, 
                  you can count on us to deliver as promised, every time.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-primary-light text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaUsers className="text-2xl" />
                </div>
                <h3 className="font-poppins font-semibold text-xl mb-3 text-center">Customer Satisfaction</h3>
                <p className="text-gray-700 text-center">
                  Your satisfaction is our top priority. We go above and beyond to ensure that every 
                  customer has a positive experience with our services.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-12">Why Choose Us</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start p-4">
                <div className="bg-primary-light text-white h-12 w-12 rounded-full flex items-center justify-center mr-4 shrink-0">
                  <FaGlobe className="text-xl" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-lg mb-2">Comprehensive Service Offerings</h3>
                  <p className="text-gray-700">
                    From social media marketing to game top-ups, we offer a wide range of digital services 
                    to meet all your needs in one place.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4">
                <div className="bg-primary-light text-white h-12 w-12 rounded-full flex items-center justify-center mr-4 shrink-0">
                  <FaRegCreditCard className="text-xl" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-lg mb-2">Competitive Pricing</h3>
                  <p className="text-gray-700">
                    We offer premium services at competitive prices, ensuring you get the best value for your money.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4">
                <div className="bg-primary-light text-white h-12 w-12 rounded-full flex items-center justify-center mr-4 shrink-0">
                  <FaHeadset className="text-xl" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-lg mb-2">24/7 Customer Support</h3>
                  <p className="text-gray-700">
                    Our dedicated support team is available around the clock to assist you with any questions or concerns.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start p-4">
                <div className="bg-primary-light text-white h-12 w-12 rounded-full flex items-center justify-center mr-4 shrink-0">
                  <FaShieldAlt className="text-xl" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-lg mb-2">Secure Transactions</h3>
                  <p className="text-gray-700">
                    We use industry-standard security measures to ensure that all your transactions are safe and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Join Our Community */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-poppins font-bold text-2xl md:text-3xl mb-8">Join Our Community</h2>
            <p className="text-lg max-w-2xl mx-auto mb-10">
              Become a part of the growing Miker Market community and experience the difference in quality and service.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-12">
              <Link href="/" className="inline-block bg-white text-primary font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                Explore Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}