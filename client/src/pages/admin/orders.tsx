import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FaTh, FaEye, FaExclamationTriangle, FaCheck, FaSignOutAlt } from 'react-icons/fa';
import AdminLayout from '@/components/layout/admin-layout';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Order } from '@shared/schema';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function AdminOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const { toast } = useToast();
  
  // Fetch real orders from API
  const { data: orders, isLoading, isError } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
  });

  // Mutations for updating order status
  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest('PUT', `/api/admin/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      toast({
        title: "Order Updated",
        description: "The order status has been successfully updated.",
      });
      closeChangeStatusModal();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Failed to update order: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const openViewModal = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const openChangeStatusModal = (order: Order) => {
    setSelectedOrder(order);
    setIsChangeStatusModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedOrder(null);
  };

  const closeChangeStatusModal = () => {
    setIsChangeStatusModalOpen(false);
  };

  const approveOrder = () => {
    if (selectedOrder) {
      updateOrderStatus.mutate({ id: selectedOrder.id, status: 'approved' });
    }
  };

  const rejectOrder = () => {
    if (selectedOrder) {
      updateOrderStatus.mutate({ id: selectedOrder.id, status: 'rejected' });
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'approved') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FaCheck className="mr-1" size={10} />
          Approved
        </span>
      );
    }
    
    if (status === 'rejected') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FaExclamationTriangle className="mr-1" size={10} />
          Rejected
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Pending
      </span>
    );
  };

  return (
    <AdminLayout title="Order Management">
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Method</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                      Loading orders...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-red-500">
                      Failed to load orders. Please try again.
                    </td>
                  </tr>
                ) : !orders || orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{order.id}</td>
                      <td className="px-4 py-3 text-sm font-medium">{order.serviceName}</td>
                      <td className="px-4 py-3 text-sm">{order.customerPhone}</td>
                      <td className="px-4 py-3 text-sm">ETB {order.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">{order.paymentMethod}</td>
                      <td className="px-4 py-3 text-sm">
                        {format(new Date(order.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => openViewModal(order)}
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">View Payment</span>
                            <FaEye className="h-4 w-4" />
                          </Button>
                          
                          {order.status === 'pending' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => openChangeStatusModal(order)}
                              className="h-8 px-2 text-xs"
                            >
                              Change Status
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* View Payment Screenshot Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={(open) => !open && closeViewModal()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Payment Proof for Order #{selectedOrder?.id}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Service</p>
                <p className="font-medium">{selectedOrder?.serviceName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Customer Phone</p>
                <p>{selectedOrder?.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Amount</p>
                <p className="font-medium">ETB {selectedOrder?.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Payment Method</p>
                <p>{selectedOrder?.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date</p>
                <p>{selectedOrder?.createdAt && format(new Date(selectedOrder.createdAt), 'yyyy-MM-dd HH:mm:ss')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <StatusBadge status={selectedOrder?.status || 'pending'} />
              </div>
              
              {selectedOrder?.customerTelegram && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Telegram</p>
                  <p>{selectedOrder.customerTelegram}</p>
                </div>
              )}
              
              {selectedOrder?.platformUsername && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Platform Username</p>
                  <p>{selectedOrder.platformUsername}</p>
                </div>
              )}
              
              {selectedOrder?.targetUrl && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Target URL</p>
                  <p className="truncate">{selectedOrder.targetUrl}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-500 mb-2">Payment Screenshot</p>
              <div className="border rounded-lg overflow-hidden">
                {selectedOrder?.screenshotUrl ? (
                  <>
                    {/* Check if this is a data URL (base64) */}
                    {selectedOrder.screenshotUrl.startsWith('data:image') ? (
                      <div className="flex flex-col items-center p-4">
                        <p className="text-gray-500 text-sm mb-2">Base64 Image Preview:</p>
                        <div className="w-full max-h-60 overflow-hidden border rounded-md">
                          <img 
                            src={selectedOrder.screenshotUrl} 
                            alt="Payment Screenshot" 
                            className="w-full h-auto object-contain mx-auto"
                            onError={() => {
                              toast({
                                title: "Error displaying image",
                                description: "The base64 image data may be corrupted or too large to display.",
                                variant: "destructive"
                              });
                            }}
                          />
                        </div>
                        <Button 
                          className="mt-4" 
                          variant="outline"
                          onClick={() => {
                            // Open the image in a new tab
                            const newWindow = window.open();
                            if (newWindow) {
                              newWindow.document.write(`
                                <html>
                                  <head>
                                    <title>Payment Screenshot</title>
                                    <style>
                                      body { 
                                        margin: 0; 
                                        display: flex; 
                                        justify-content: center; 
                                        align-items: center; 
                                        min-height: 100vh;
                                        background-color: #f5f5f5;
                                      }
                                      img { 
                                        max-width: 100%; 
                                        max-height: 100vh;
                                        object-fit: contain;
                                        border: 1px solid #e0e0e0;
                                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <img src="${selectedOrder.screenshotUrl}" alt="Payment Screenshot" />
                                  </body>
                                </html>
                              `);
                            }
                          }}
                        >
                          View Full Screenshot
                        </Button>
                      </div>
                    ) : (
                      // For normal URLs, we'll display the image as usual
                      <img 
                        src={selectedOrder.screenshotUrl} 
                        alt="Payment Screenshot" 
                        className="w-full h-auto max-h-96 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/600x400?text=Payment+Screenshot+Error";
                          toast({
                            title: "Error loading image",
                            description: "The payment screenshot could not be loaded. It may be too large or in an unsupported format.",
                            variant: "destructive"
                          });
                        }}
                      />
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-gray-100 text-gray-500">
                    No screenshot available
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex space-x-3 mt-6">
            <Button 
              variant="outline" 
              onClick={closeViewModal}
            >
              Close
            </Button>
            
            {selectedOrder?.status === 'pending' && (
              <>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    closeViewModal();
                    openChangeStatusModal(selectedOrder);
                  }}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => {
                    closeViewModal();
                    openChangeStatusModal(selectedOrder);
                  }}
                >
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Change Status Modal */}
      <Dialog open={isChangeStatusModalOpen} onOpenChange={(open) => !open && closeChangeStatusModal()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>Change status for order <span className="font-medium">#{selectedOrder?.id}</span>?</p>
            <p className="text-gray-500 text-sm mt-2">Select the new status for this order.</p>
          </div>
          
          <DialogFooter className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={closeChangeStatusModal}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={rejectOrder}
              className="bg-red-500 hover:bg-red-600"
              disabled={updateOrderStatus.isPending}
            >
              {updateOrderStatus.isPending ? 'Rejecting...' : 'Reject Order'}
            </Button>
            <Button 
              onClick={approveOrder}
              disabled={updateOrderStatus.isPending}
            >
              {updateOrderStatus.isPending ? 'Approving...' : 'Approve Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}