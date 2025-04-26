import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category, insertCategorySchema } from '@shared/schema';
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
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import AdminLayout from '@/components/layout/admin-layout';

type CategoryFormData = z.infer<typeof categoryFormSchema>;

// Extended schema with validation
const categoryFormSchema = insertCategorySchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").optional().or(z.literal('')),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
});

export default function AdminCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      description: '',
      slug: '',
      icon: 'th',
    }
  });

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      const res = await apiRequest('POST', '/api/admin/categories', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create category: ${error.toString()}`,
        variant: 'destructive',
      });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CategoryFormData> }) => {
      const res = await apiRequest('PUT', `/api/admin/categories/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update category: ${error.toString()}`,
        variant: 'destructive',
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to delete category: ${error.toString()}`,
        variant: 'destructive',
      });
    }
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    reset({
      name: '',
      description: '',
      slug: '',
      icon: 'th',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      icon: category.icon,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = (data: CategoryFormData) => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data });
    } else {
      createCategoryMutation.mutate(data);
    }
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id);
    }
  };

  const addCategoryButton = (
    <Button onClick={openCreateModal} className="flex items-center">
      <FaPlus className="mr-2" /> Add Category
    </Button>
  );

  return (
    <AdminLayout title="Categories Management" actionButton={addCategoryButton}>
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-4 sm:-mx-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 hidden sm:table-cell">Slug</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 hidden md:table-cell">Icon</th>
                  <th className="px-2 sm:px-4 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {categories?.map(category => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm">{category.id}</td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium">{category.name}</td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{category.slug}</td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-500 hidden md:table-cell">{category.icon}</td>
                    <td className="px-2 sm:px-4 py-3 text-xs sm:text-sm whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openEditModal(category)}
                          className="h-7 w-7 p-0"
                        >
                          <span className="sr-only">Edit</span>
                          <FaEdit className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => openDeleteDialog(category)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          <span className="sr-only">Delete</span>
                          <FaTrash className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {(!categories || categories.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                      No categories found. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Category Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Category Name</label>
                <Input
                  id="name"
                  placeholder="Enter category name"
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
                  placeholder="Enter category description"
                  rows={3}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="slug" className="text-sm font-medium">Slug</label>
                  <Input
                    id="slug"
                    placeholder="Enter slug (e.g., social-media)"
                    {...register("slug")}
                  />
                  {errors.slug && (
                    <p className="text-sm text-red-500">{errors.slug.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="icon" className="text-sm font-medium">Icon Name</label>
                  <Input
                    id="icon"
                    placeholder="Enter icon name (e.g., 'hashtag')"
                    {...register("icon")}
                  />
                  <p className="text-xs text-gray-500">Available icons: hashtag, calendar-check, ad, gamepad, users, play, gift</p>
                </div>
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
                disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
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
            <p>Are you sure you want to delete the category <span className="font-medium">{categoryToDelete?.name}</span>?</p>
            <p className="text-gray-500 text-sm mt-2">This action cannot be undone and may affect services using this category.</p>
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
              disabled={deleteCategoryMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}