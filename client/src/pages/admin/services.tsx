import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Service, Category, insertServiceSchema } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { formatPrice } from '@/lib/utils';
import { FaTh, FaEdit, FaTrash, FaPlus, FaSignOutAlt, FaTimes, FaCheck } from 'react-icons/fa';

type ServiceFormData = z.infer<typeof serviceFormSchema>;

// Extended schema with validation
const serviceFormSchema = insertServiceSchema.extend({
  price: z.number().min(1, "Price must be at least 1 ETB"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export default function AdminServices() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      image: '',
      categoryId: 1,
      featured: false,
      paymentInstructions: '',
    }
  });

  const { data: services, isLoading: isLoadingServices } = useQuery<Service[]>({
    queryKey: ['/api/services'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormData) => {
      const res = await apiRequest('POST', '/api/admin/services', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: 'Success',
        description: 'Service created successfully',
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create service: ${error.toString()}`,
        variant: 'destructive',
      });
    }
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ServiceFormData> }) => {
      const res = await apiRequest('PUT', `/api/admin/services/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: 'Success',
        description: 'Service updated successfully',
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update service: ${error.toString()}`,
        variant: 'destructive',
      });
    }
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/services/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/services'] });
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setServiceToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete service: ${error.toString()}`,
        variant: 'destructive',
      });
    }
  });

  const openCreateModal = () => {
    setEditingService(null);
    reset({
      name: '',
      description: '',
      price: 0,
      image: '',
      categoryId: 1,
      featured: false,
      paymentInstructions: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    reset({
      name: service.name,
      description: service.description,
      price: service.price,
      image: service.image || '',
      categoryId: service.categoryId,
      featured: service.featured || false,
      paymentInstructions: service.paymentInstructions || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const openDeleteDialog = (service: Service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: ServiceFormData) => {
    if (editingService) {
      updateServiceMutation.mutate({ id: editingService.id, data });
    } else {
      createServiceMutation.mutate(data);
    }
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      deleteServiceMutation.mutate(serviceToDelete.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="bg-primary text-white w-64 flex-shrink-0 hidden md:block">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <FaTh className="text-secondary text-2xl mr-2" />
            <span className="font-poppins font-bold text-xl">Admin Panel</span>
          </div>
          
          <nav className="space-y-1">
            <Link href="/admin/dashboard" className="block">
              <a className="flex items-center py-3 px-4 rounded-lg transition-colors hover:bg-white/5">
                <FaTh className="mr-3" /> Dashboard
              </a>
            </Link>
            
            <button 
              className="w-full text-left flex items-center py-3 px-4 rounded-lg transition-colors bg-white/10 font-medium"
            >
              <FaTh className="mr-3" /> Services
            </button>
            
            <Link href="/admin/categories" className="block">
              <a className="flex items-center py-3 px-4 rounded-lg transition-colors hover:bg-white/5">
                <FaTh className="mr-3" /> Categories
              </a>
            </Link>
            
            <Link href="/admin/payments" className="block">
              <a className="flex items-center py-3 px-4 rounded-lg transition-colors hover:bg-white/5">
                <FaTh className="mr-3" /> Payment Methods
              </a>
            </Link>
          </nav>
        </div>
        
        <div className="p-4 mt-auto border-t border-white/10">
          <button className="flex items-center text-white/80 hover:text-white transition-colors">
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow overflow-auto">
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h1 className="font-poppins font-bold text-xl">Services Management</h1>
            
            <Button onClick={openCreateModal} className="flex items-center">
              <FaPlus className="mr-2" /> Add Service
            </Button>
          </div>
        </header>
        
        <main className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>All Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Featured</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {services?.map(service => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{service.id}</td>
                        <td className="px-4 py-3 text-sm">{service.name}</td>
                        <td className="px-4 py-3 text-sm">
                          {categories?.find(c => c.id === service.categoryId)?.name || 'Unknown'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{formatPrice(service.price)}</td>
                        <td className="px-4 py-3 text-sm">
                          {service.featured ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <FaCheck className="w-3 h-3 mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <FaTimes className="w-3 h-3 mr-1" /> No
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEditModal(service)}
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Edit</span>
                              <FaEdit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openDeleteDialog(service)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                            >
                              <span className="sr-only">Delete</span>
                              <FaTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
      
      {/* Service Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingService ? `Edit Service: ${editingService.name}` : 'Create New Service'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Service Name</label>
                <Input
                  id="name"
                  placeholder="Enter service name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  placeholder="Enter service description"
                  rows={3}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="price" className="text-sm font-medium">Price (ETB)</label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="category" className="text-sm font-medium">Category</label>
                  <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">Image URL</label>
                <Input
                  id="image"
                  placeholder="Enter image URL"
                  {...register("image")}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="paymentInstructions" className="text-sm font-medium">Payment Instructions</label>
                <Textarea
                  id="paymentInstructions"
                  placeholder="Enter payment instructions"
                  rows={3}
                  {...register("paymentInstructions")}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="featured"
                    />
                  )}
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Featured Service
                </label>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createServiceMutation.isPending || updateServiceMutation.isPending}
              >
                {editingService ? 'Update Service' : 'Create Service'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the service <span className="font-medium">{serviceToDelete?.name}</span>?</p>
            <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={deleteServiceMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
