import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PaymentMethod, insertPaymentMethodSchema } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { FaTh, FaEdit, FaTrash, FaPlus, FaSignOutAlt } from 'react-icons/fa';

type PaymentMethodFormData = z.infer<typeof paymentMethodFormSchema>;

// Extended schema with validation
const paymentMethodFormSchema = insertPaymentMethodSchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").optional().or(z.literal('')),
  instructions: z.string().min(10, "Instructions must be at least 10 characters").optional().or(z.literal('')),
});

export default function AdminPayments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<PaymentMethod | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodFormSchema),
    defaultValues: {
      name: '',
      description: '',
      instructions: '',
      icon: 'credit-card',
    }
  });

  const { data: paymentMethods, isLoading: isLoadingPaymentMethods } = useQuery<PaymentMethod[]>({
    queryKey: ['/api/payment-methods'],
  });

  const createPaymentMethodMutation = useMutation({
    mutationFn: async (data: PaymentMethodFormData) => {
      const res = await apiRequest('POST', '/api/admin/payment-methods', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      toast({
        title: 'Success',
        description: 'Payment method created successfully',
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create payment method: ${error.toString()}`,
        variant: 'destructive',
      });
    }
  });

  const updatePaymentMethodMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<PaymentMethodFormData> }) => {
      const res = await apiRequest('PUT', `/api/admin/payment-methods/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      toast({
        title: 'Success',
        description: 'Payment method updated successfully',
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update payment method: ${error.toString()}`,
        variant: 'destructive',
      });
    }
  });

  const deletePaymentMethodMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/payment-methods/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/payment-methods'] });
      toast({
        title: 'Success',
        description: 'Payment method deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setPaymentMethodToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete payment method: ${error.toString()}`,
        variant: 'destructive',
      });
    }
  });

  const openCreateModal = () => {
    setEditingPaymentMethod(null);
    reset({
      name: '',
      description: '',
      instructions: '',
      icon: 'credit-card',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (paymentMethod: PaymentMethod) => {
    setEditingPaymentMethod(paymentMethod);
    reset({
      name: paymentMethod.name,
      description: paymentMethod.description || '',
      instructions: paymentMethod.instructions || '',
      icon: paymentMethod.icon,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPaymentMethod(null);
  };

  const openDeleteDialog = (paymentMethod: PaymentMethod) => {
    setPaymentMethodToDelete(paymentMethod);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: PaymentMethodFormData) => {
    if (editingPaymentMethod) {
      updatePaymentMethodMutation.mutate({ id: editingPaymentMethod.id, data });
    } else {
      createPaymentMethodMutation.mutate(data);
    }
  };

  const confirmDelete = () => {
    if (paymentMethodToDelete) {
      deletePaymentMethodMutation.mutate(paymentMethodToDelete.id);
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
            
            <Link href="/admin/services" className="block">
              <a className="flex items-center py-3 px-4 rounded-lg transition-colors hover:bg-white/5">
                <FaTh className="mr-3" /> Services
              </a>
            </Link>
            
            <Link href="/admin/categories" className="block">
              <a className="flex items-center py-3 px-4 rounded-lg transition-colors hover:bg-white/5">
                <FaTh className="mr-3" /> Categories
              </a>
            </Link>
            
            <button 
              className="w-full text-left flex items-center py-3 px-4 rounded-lg transition-colors bg-white/10 font-medium"
            >
              <FaTh className="mr-3" /> Payment Methods
            </button>
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
            <h1 className="font-poppins font-bold text-xl">Payment Methods Management</h1>
            
            <Button onClick={openCreateModal} className="flex items-center">
              <FaPlus className="mr-2" /> Add Payment Method
            </Button>
          </div>
        </header>
        
        <main className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>All Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Icon</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paymentMethods?.map(method => (
                      <tr key={method.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{method.id}</td>
                        <td className="px-4 py-3 text-sm">{method.name}</td>
                        <td className="px-4 py-3 text-sm">{method.description}</td>
                        <td className="px-4 py-3 text-sm">{method.icon}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openEditModal(method)}
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Edit</span>
                              <FaEdit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openDeleteDialog(method)}
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
      
      {/* Payment Method Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingPaymentMethod ? `Edit Payment Method: ${editingPaymentMethod.name}` : 'Create New Payment Method'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Payment Method Name</label>
                <Input
                  id="name"
                  placeholder="Enter payment method name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  id="description"
                  placeholder="Enter short description"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="instructions" className="text-sm font-medium">Payment Instructions</label>
                <Textarea
                  id="instructions"
                  placeholder="Enter detailed payment instructions"
                  rows={4}
                  {...register("instructions")}
                />
                {errors.instructions && (
                  <p className="text-sm text-red-500">{errors.instructions.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="icon" className="text-sm font-medium">Icon Name</label>
                <Input
                  id="icon"
                  placeholder="Enter icon name"
                  {...register("icon")}
                />
                <p className="text-xs text-gray-500">Available icons: credit-card, mobile-alt, university</p>
              </div>
            </div>
            
            <DialogFooter className="flex space-x-3 mt-6">
              <Button 
                variant="outline" 
                onClick={closeModal}
                type="button"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createPaymentMethodMutation.isPending || updatePaymentMethodMutation.isPending}
              >
                {editingPaymentMethod ? 'Update Payment Method' : 'Create Payment Method'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => !open && setIsDeleteDialogOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-500">Confirm Deletion</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Are you sure you want to delete the payment method <span className="font-medium">{paymentMethodToDelete?.name}</span>?</p>
            <p className="text-gray-500 text-sm mt-2">This action cannot be undone.</p>
          </div>
          
          <DialogFooter className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
              disabled={deletePaymentMethodMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}