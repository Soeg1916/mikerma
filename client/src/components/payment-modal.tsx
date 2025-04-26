import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/utils';
import { Service, PaymentMethod } from '@shared/schema';
import { FaMobileAlt, FaUniversity, FaCreditCard, FaInfoCircle, FaTimes, FaUpload, FaCheck } from 'react-icons/fa';
import { FaInstagram, FaTelegram, FaPhone, FaTwitter } from 'react-icons/fa';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ service, isOpen, onClose }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<'initial' | 'uploading' | 'complete'>('initial');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Contact information state variables
  const [instagramUsername, setInstagramUsername] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: paymentMethods } = useQuery<PaymentMethod[]>({
    queryKey: ['/api/payment-methods'],
  });
  
  // Order submission mutation
  const submitOrder = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(`API error: ${response.status} ${errorData}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Submitted!",
        description: "Your order has been received. We'll process it shortly.",
        variant: "default",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit your order. Please try again.",
        variant: "destructive",
      });
      console.error('Order submission error:', error);
    },
  });

  // Reset selected method, screenshot, and contact info when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMethod(null);
      setScreenshot(null);
      setUploadStep('initial');
      setInstagramUsername('');
      setTelegramUsername('');
      setPhoneNumber('');
      setTargetUrl('');
    }
  }, [isOpen]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);
      setUploadStep('complete');
      
      // In a real app, we would create a FormData object and send it to the server
      // This is just a simulation to show what would happen
      console.log('Screenshot file ready for upload:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`
      });
      
      // The actual upload would happen when the user clicks the "Submit Order" button
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getIcon = (icon: string) => {
    switch(icon) {
      case 'mobile-alt': return <FaMobileAlt className="text-blue-600" />;
      case 'university': return <FaUniversity className="text-green-600" />;
      case 'credit-card': return <FaCreditCard className="text-yellow-600" />;
      default: return null;
    }
  };

  const getIconBgColor = (icon: string) => {
    switch(icon) {
      case 'mobile-alt': return 'bg-blue-100';
      case 'university': return 'bg-green-100';
      case 'credit-card': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" aria-describedby="payment-modal-description">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-2">
          <DialogTitle className="font-poppins font-bold text-xl">
            {service?.name}
          </DialogTitle>
        </DialogHeader>
        <p id="payment-modal-description" className="sr-only">Payment details and options for the selected service.</p>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-2">{service?.description}</p>
          <div className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
            <span className="font-medium">Price:</span>
            <span className="font-poppins font-semibold text-lg">
              {service && formatPrice(service.price)}
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-poppins font-semibold text-lg mb-3">Payment Methods</h4>
          <div className="space-y-3">
            {paymentMethods?.map((method) => (
              <div
                key={method.id}
                className={`border rounded-lg p-3 hover:bg-gray-50 cursor-pointer ${
                  selectedMethod === method.id ? 'border-primary ring-1 ring-primary' : ''
                }`}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex items-center">
                  <div className={`h-10 w-10 flex items-center justify-center ${getIconBgColor(method.icon)} rounded-full mr-3`}>
                    {getIcon(method.icon)}
                  </div>
                  <div>
                    <h5 className="font-medium">{method.name}</h5>
                    <p className="text-sm text-gray-600">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h4 className="font-poppins font-semibold mb-2 flex items-center text-primary">
            <FaInfoCircle className="mr-2" />
            How To Pay
          </h4>
          
          {selectedMethod !== null && paymentMethods ? (
            <div className="text-sm text-gray-700">
              <ol className="list-decimal pl-5 space-y-1">
                <li>Send {service && formatPrice(service.price)} to account below</li>
                <li>Take a screenshot of payment</li>
                <li>Upload the screenshot</li>
                <li>Click "Submit Order"</li>
              </ol>
              <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                {paymentMethods.find(m => m.id === selectedMethod)?.instructions || 
                  'Please select a payment method to see account details.'}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-700">
              <p className="mb-2">Please select a payment method to continue.</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Choose payment method above</li>
                <li>Make payment</li>
                <li>Take screenshot</li>
                <li>Upload screenshot</li>
              </ol>
            </div>
          )}
          
          {service?.paymentInstructions && (
            <div className="mt-3 pt-3 border-t border-gray-300">
              <p className="font-medium text-xs text-primary mb-1">Service-specific:</p>
              <p className="text-xs text-gray-700">{service.paymentInstructions}</p>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="mb-6">
          <h4 className="font-poppins font-semibold text-lg mb-3">Contact Information</h4>
          <div className="space-y-4">
            {/* Phone Number (Always shown) */}
            <div>
              <Label htmlFor="phone-number" className="flex items-center text-sm mb-1.5">
                <FaPhone className="mr-1.5 text-green-600" />
                Phone Number
              </Label>
              <Input
                id="phone-number"
                type="tel"
                placeholder="Your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full"
                required
              />
            </div>
            
            {/* Telegram Username (Always shown) */}
            <div>
              <Label htmlFor="telegram-username" className="flex items-center text-sm mb-1.5">
                <FaTelegram className="mr-1.5 text-blue-500" />
                Telegram Username
              </Label>
              <Input
                id="telegram-username"
                type="text"
                placeholder="Your Telegram username"
                value={telegramUsername}
                onChange={(e) => setTelegramUsername(e.target.value)}
                className="w-full"
              />
            </div>
            
            {/* Service-specific Username (Only shown for follower services except YouTube subscribers) */}
            {(service?.name?.toLowerCase().includes("followers") || 
             (service?.name?.toLowerCase().includes("subscribers") && service?.categoryId !== 2) || 
             service?.name?.toLowerCase().includes("members")) ? (
              <div>
                <Label htmlFor="username" className="flex items-center text-sm mb-1.5">
                  {service?.categoryId === 1 ? <FaMobileAlt className="mr-1.5 text-red-500" /> : 
                   service?.categoryId === 3 ? <FaInstagram className="mr-1.5 text-pink-600" /> :
                   service?.categoryId === 4 ? <FaCreditCard className="mr-1.5 text-blue-600" /> :
                   service?.categoryId === 5 ? <FaTwitter className="mr-1.5 text-blue-400" /> :
                   <FaInfoCircle className="mr-1.5 text-gray-600" />}
                  {service?.categoryId === 1 ? "TikTok Username" : 
                   service?.categoryId === 3 ? "Instagram Username" :
                   service?.categoryId === 4 ? "Facebook Username/ID" :
                   service?.categoryId === 5 ? "Twitter/X Username" :
                   "Account Username"}
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder={`Your ${
                    service?.categoryId === 1 ? "TikTok" : 
                    service?.categoryId === 2 ? "YouTube" :
                    service?.categoryId === 3 ? "Instagram" :
                    service?.categoryId === 4 ? "Facebook" :
                    service?.categoryId === 5 ? "Twitter/X" :
                    "account"
                  } username`}
                  value={instagramUsername}
                  onChange={(e) => setInstagramUsername(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            ) : null}
            
            {/* Channel URL for YouTube subscribers */}
            {service?.name?.toLowerCase().includes("subscribers") && 
             service?.categoryId === 2 ? (
              <div>
                <Label htmlFor="channel-url" className="flex items-center text-sm mb-1.5">
                  <FaUniversity className="mr-1.5 text-red-600" />
                  YouTube Channel URL
                </Label>
                <Input
                  id="channel-url"
                  type="text"
                  placeholder="URL of your YouTube channel"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            ) : null}
            
            {/* Target URL (Shown for likes, views, comments services, Twitter services, and not for followers or gift cards) */}
            {((service?.name?.toLowerCase().includes("likes") || 
              service?.name?.toLowerCase().includes("views") || 
              service?.name?.toLowerCase().includes("comments")) || 
              service?.categoryId === 5) && 
              service?.categoryId !== 7 ? (
              <div>
                <Label htmlFor="target-url" className="flex items-center text-sm mb-1.5">
                  {service?.categoryId === 1 ? <FaMobileAlt className="mr-1.5 text-red-500" /> : 
                   service?.categoryId === 2 ? <FaUniversity className="mr-1.5 text-red-600" /> :
                   service?.categoryId === 3 ? <FaInstagram className="mr-1.5 text-pink-600" /> :
                   service?.categoryId === 4 ? <FaCreditCard className="mr-1.5 text-blue-600" /> :
                   service?.categoryId === 5 ? <FaTwitter className="mr-1.5 text-blue-400" /> :
                   <FaInfoCircle className="mr-1.5 text-primary" />}
                  {service?.categoryId === 1 ? "TikTok Video URL" : 
                   service?.categoryId === 2 ? "YouTube Video URL" :
                   service?.categoryId === 3 ? "Instagram Post URL" :
                   service?.categoryId === 4 ? "Facebook Post/Page URL" :
                   service?.categoryId === 5 ? "Twitter/X Post URL" :
                   "Content URL"}
                </Label>
                <Input
                  id="target-url"
                  type="text"
                  placeholder={`URL of the ${
                    service?.categoryId === 1 ? "TikTok video" : 
                    service?.categoryId === 2 ? "YouTube video" :
                    service?.categoryId === 3 ? "Instagram post" :
                    service?.categoryId === 4 ? "Facebook post/page" :
                    service?.categoryId === 5 ? "Twitter/X post" :
                    "content"
                  }`}
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            ) : null}
            
            {/* Email (Only shown for gift cards) */}
            {service?.categoryId === 7 && (
              <div>
                <Label htmlFor="email" className="flex items-center text-sm mb-1.5">
                  <FaUniversity className="mr-1.5 text-green-600" />
                  Email for Gift Card Delivery
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email to receive gift card"
                  value={targetUrl} /* Reusing targetUrl field for email */
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
            )}
          </div>
        </div>

        {/* Payment Screenshot Upload */}
        <div className="mb-4">
          <h4 className="font-poppins font-semibold text-md mb-2">Upload Payment Screenshot</h4>
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          
          {screenshot ? (
            <div className="border rounded-lg p-2 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-600">
                  <FaCheck className="mr-2" />
                  <span className="font-medium text-sm">Screenshot uploaded</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setScreenshot(null);
                    setUploadStep('initial');
                  }}
                  className="h-7 w-7 p-0 text-gray-500 hover:text-red-500"
                >
                  <FaTimes size={14} />
                </Button>
              </div>
              <p className="text-xs text-gray-600 truncate">
                {screenshot.name}
              </p>
            </div>
          ) : (
            <div 
              onClick={triggerFileInput}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
            >
              <FaUpload className="mx-auto text-gray-400 text-xl mb-1" />
              <p className="font-medium text-sm text-gray-700">Click to upload screenshot</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 font-medium"
          >
            Cancel
          </Button>
          <Button 
            className="flex-1"
            disabled={
              // Disable when submitting
              isSubmitting ||
              
              // Basic requirements for all services
              selectedMethod === null || 
              !screenshot || 
              !phoneNumber || 
              
              // Category-specific requirements
              
              // Follower services (except YouTube) need username
              (service?.name?.toLowerCase().includes("followers") && !instagramUsername) || 
              
              // YouTube Subscribers need channel URL (captured in targetUrl), others need username
              (service?.name?.toLowerCase().includes("subscribers") && 
                ((service?.categoryId === 2 && !targetUrl) || // YouTube needs channel URL
                 (service?.categoryId !== 2 && !instagramUsername))) || // Other platforms need username
              
              // Member services need username
              (service?.name?.toLowerCase().includes("members") && !instagramUsername) ||
              
              // Engagement services and Twitter services need URL
              (((service?.name?.toLowerCase().includes("likes") || 
                service?.name?.toLowerCase().includes("views") || 
                service?.name?.toLowerCase().includes("comments")) || 
                service?.categoryId === 5) && !targetUrl) ||
                
              // Gift cards need email (stored in targetUrl)
              (service?.categoryId === 7 && !targetUrl)
            }
            onClick={() => {
              // Make sure we have all required fields
              if (screenshot && service && selectedMethod && phoneNumber && 
                 // Special check for YouTube subscribers
                 ((service.name.toLowerCase().includes("subscribers") && service.categoryId === 2) ? targetUrl : true) &&
                 // Check for followers, members, and non-YouTube subscribers
                 ((service.name.toLowerCase().includes("followers") || 
                   (service.name.toLowerCase().includes("subscribers") && service.categoryId !== 2) || 
                   service.name.toLowerCase().includes("members")) ? instagramUsername : true) &&
                 // Check for likes, views, comments and Twitter services
                 (((service.name.toLowerCase().includes("likes") || 
                   service.name.toLowerCase().includes("views") || 
                   service.name.toLowerCase().includes("comments")) || 
                   service.categoryId === 5) ? targetUrl : true) &&
                 // Check gift cards need email
                 (service.categoryId === 7 ? targetUrl : true)) {
                
                setIsSubmitting(true);
                
                // Convert screenshot to base64 string for storage
                const reader = new FileReader();
                reader.onloadend = () => {
                  try {
                    const base64String = reader.result as string;
                    
                    // Show toast to let user know order is being submitted
                    toast({
                      title: "Processing Order",
                      description: "Please wait while we process your payment screenshot...",
                    });
                    
                    const selectedPaymentMethod = paymentMethods?.find(m => m.id === selectedMethod);
                    
                    const orderData = {
                      serviceId: service.id,
                      serviceName: service.name,
                      paymentMethodId: selectedMethod,
                      paymentMethod: selectedPaymentMethod?.name || '',
                      amount: service.price,
                      screenshotUrl: base64String,
                      customerPhone: phoneNumber,
                      customerTelegram: telegramUsername || null,
                      platformUsername: instagramUsername || null,
                      targetUrl: targetUrl || null,
                      status: 'pending',
                    };
                    
                    // Submit the order using direct fetch rather than the apiRequest function
                    fetch('/api/orders', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(orderData)
                    })
                    .then(response => {
                      if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                      }
                      return response.json();
                    })
                    .then(data => {
                      // Success
                      toast({
                        title: "Order Submitted!",
                        description: "Your order has been received. We'll process it shortly.",
                        variant: "default",
                      });
                      onClose();
                    })
                    .catch(error => {
                      console.error('Error submitting order:', error);
                      toast({
                        title: "Error",
                        description: "Failed to submit your order. Please try again with a smaller screenshot.",
                        variant: "destructive",
                      });
                    })
                    .finally(() => {
                      setIsSubmitting(false);
                    });
                  } catch (err) {
                    console.error('Error processing order:', err);
                    toast({
                      title: "Error",
                      description: "Failed to process your order. Please try again.",
                      variant: "destructive",
                    });
                    setIsSubmitting(false);
                  }
                };
                
                reader.readAsDataURL(screenshot);
              }
            }}
          >
            {(() => {
              // Check if all required fields are filled
              const allRequiredFieldsFilled = 
                // Basic requirements
                phoneNumber && 
                screenshot && 
                selectedMethod !== null &&
                
                // Special check for YouTube subscribers
                !((service?.name?.toLowerCase().includes("subscribers") && service?.categoryId === 2) && !targetUrl) &&
                
                // Check for followers, members, and non-YouTube subscribers
                !((service?.name?.toLowerCase().includes("followers") || 
                  (service?.name?.toLowerCase().includes("subscribers") && service?.categoryId !== 2) || 
                  service?.name?.toLowerCase().includes("members")) && !instagramUsername) &&
                  
                // Check for likes, views, comments and Twitter services
                !(((service?.name?.toLowerCase().includes("likes") || 
                  service?.name?.toLowerCase().includes("views") || 
                  service?.name?.toLowerCase().includes("comments")) || 
                  service?.categoryId === 5) && !targetUrl) &&
                  
                // Check gift cards need email
                !(service?.categoryId === 7 && !targetUrl);
              
              if (isSubmitting) return 'Submitting...';
              return allRequiredFieldsFilled ? 'Submit Order' : 'Please Fill Required Fields';
            })()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
