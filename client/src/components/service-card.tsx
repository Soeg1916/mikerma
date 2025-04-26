import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { Service } from '@shared/schema';
import { FaArrowRight } from 'react-icons/fa';

interface ServiceCardProps {
  service: Service;
  onOrderClick: (service: Service) => void;
}

export default function ServiceCard({ service, onOrderClick }: ServiceCardProps) {
  return (
    <Card className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <h3 className="font-poppins font-semibold text-lg mb-2">{service.name}</h3>
        
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-primary font-semibold">
            {formatPrice(service.price)}
          </span>
          
          <Button 
            onClick={() => onOrderClick(service)} 
            variant="outline"
            size="sm"
            className="text-primary border-primary hover:bg-primary/5 flex items-center gap-2"
          >
            View Service
            <FaArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
