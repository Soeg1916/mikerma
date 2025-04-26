import { FaMoneyBillWave, FaShieldAlt, FaHeadset } from 'react-icons/fa';

export default function FeaturesSection() {
  const features = [
    {
      icon: <FaMoneyBillWave className="text-2xl" />,
      title: 'Local Currency',
      description: 'All our services are priced in Ethiopian Birr (ETB) for your convenience.'
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: 'Secure Payments',
      description: 'Multiple secure payment options available for all transactions.'
    },
    {
      icon: <FaHeadset className="text-2xl" />,
      title: '24/7 Support',
      description: 'Our customer service team is always ready to assist you.'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-poppins font-bold text-2xl md:text-3xl text-center mb-12">Why Choose Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary-light text-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-poppins font-semibold text-xl mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
