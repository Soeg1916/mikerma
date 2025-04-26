import { useQuery } from '@tanstack/react-query';
import { Service, Category } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import AdminLayout from '@/components/layout/admin-layout';

export default function AdminDashboard() {
  const { data: services } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });
  
  // Simple metrics calculations
  const totalServices = services?.length || 0;
  const totalCategories = categories?.length || 0;
  const totalRevenue = services?.reduce((sum, service) => sum + service.price, 0) || 0;
  const avgServicePrice = totalServices > 0 ? totalRevenue / totalServices : 0;

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{totalServices}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{totalCategories}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-3xl font-bold">{formatPrice(avgServicePrice)}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services?.slice(0, 5).map(service => (
                <div key={service.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{service.name}</p>
                    <p className="text-sm text-gray-500">Category: {categories?.find(c => c.id === service.categoryId)?.name || 'Unknown'}</p>
                  </div>
                  <span className="font-semibold">{formatPrice(service.price)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Categories Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories?.map(category => {
                const categoryServices = services?.filter(s => s.categoryId === category.id) || [];
                const count = categoryServices.length;
                
                return (
                  <div key={category.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-sm text-gray-500">{count} services</p>
                    </div>
                    <span className="py-1 px-2 bg-primary/10 text-primary rounded text-sm">
                      {count} items
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
