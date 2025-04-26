import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ContactInfo } from '@shared/schema';
import AdminLayout from '@/components/layout/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

export default function AdminContact() {
  const { toast } = useToast();
  
  const { data: contactInfo, isLoading } = useQuery<ContactInfo>({
    queryKey: ['/api/contact-info'],
  });
  
  const [formData, setFormData] = useState<{
    address: string;
    phone: string;
    telegramLink: string;
    telegramUsername: string;
    facebookLink: string;
    instagramLink: string;
    twitterLink: string;
    showSocialIcons: boolean;
    weekdayHours: string;
    weekendHours: string;
    timeZone: string;
  }>({
    address: '',
    phone: '',
    telegramLink: '',
    telegramUsername: '',
    facebookLink: '',
    instagramLink: '',
    twitterLink: '',
    showSocialIcons: false,
    weekdayHours: 'Monday - Saturday: 9:00 AM - 8:00 PM',
    weekendHours: 'Sunday: 10:00 AM - 6:00 PM',
    timeZone: 'East Africa Time (EAT)',
  });
  
  // Update form data when contact info is loaded
  useEffect(() => {
    if (contactInfo) {
      setFormData({
        address: contactInfo.address,
        phone: contactInfo.phone,
        telegramLink: contactInfo.telegramLink,
        telegramUsername: contactInfo.telegramUsername,
        facebookLink: contactInfo.facebookLink || '',
        instagramLink: contactInfo.instagramLink || '',
        twitterLink: contactInfo.twitterLink || '',
        showSocialIcons: contactInfo.showSocialIcons || false,
        weekdayHours: contactInfo.weekdayHours || 'Monday - Saturday: 9:00 AM - 8:00 PM',
        weekendHours: contactInfo.weekendHours || 'Sunday: 10:00 AM - 6:00 PM',
        timeZone: contactInfo.timeZone || 'East Africa Time (EAT)',
      });
    }
  }, [contactInfo]);
  
  const updateContactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      return apiRequest(
        `/api/admin/contact-info/${contactInfo?.id}`, 
        'PUT',
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact-info'] });
      toast({
        title: 'Contact information updated',
        description: 'The contact information has been updated successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update contact information',
        variant: 'destructive',
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactMutation.mutate(formData);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  return (
    <AdminLayout title="Manage Contact Information">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Edit Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <div className="animate-pulse">Loading contact information...</div>
            </div>
          ) : contactInfo ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telegramLink">Telegram Link</Label>
                <Input
                  id="telegramLink"
                  name="telegramLink"
                  value={formData.telegramLink}
                  onChange={handleChange}
                  placeholder="https://t.me/username"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telegramUsername">Telegram Username Display</Label>
                <Input
                  id="telegramUsername"
                  name="telegramUsername"
                  value={formData.telegramUsername}
                  onChange={handleChange}
                  placeholder="@username on Telegram"
                  required
                />
              </div>

              <div className="mt-6 mb-2">
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <p className="text-sm text-gray-500">Only Telegram is displayed by default. Other social icons can be enabled with the toggle below.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showSocialIcons"
                    checked={formData.showSocialIcons}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, showSocialIcons: checked }))
                    }
                  />
                  <Label htmlFor="showSocialIcons">Show Facebook, Instagram and Twitter icons</Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facebookLink">Facebook Link (optional)</Label>
                <Input
                  id="facebookLink"
                  name="facebookLink"
                  value={formData.facebookLink}
                  onChange={handleChange}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagramLink">Instagram Link (optional)</Label>
                <Input
                  id="instagramLink"
                  name="instagramLink"
                  value={formData.instagramLink}
                  onChange={handleChange}
                  placeholder="https://instagram.com/yourusername"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitterLink">Twitter/X Link (optional)</Label>
                <Input
                  id="twitterLink"
                  name="twitterLink"
                  value={formData.twitterLink}
                  onChange={handleChange}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>

              <div className="mt-6 mb-2">
                <h3 className="text-lg font-semibold">Business Hours</h3>
                <p className="text-sm text-gray-500">Set your business hours to display on the contact page.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekdayHours">Weekday Hours</Label>
                <Input
                  id="weekdayHours"
                  name="weekdayHours"
                  value={formData.weekdayHours}
                  onChange={handleChange}
                  placeholder="Monday - Saturday: 9:00 AM - 8:00 PM"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekendHours">Weekend Hours</Label>
                <Input
                  id="weekendHours"
                  name="weekendHours"
                  value={formData.weekendHours}
                  onChange={handleChange}
                  placeholder="Sunday: 10:00 AM - 6:00 PM"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeZone">Time Zone</Label>
                <Input
                  id="timeZone"
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleChange}
                  placeholder="East Africa Time (EAT)"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={updateContactMutation.isPending}
                  className="mt-4"
                >
                  {updateContactMutation.isPending ? 'Updating...' : 'Update Contact Information'}
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-center p-4">
              Contact information not found. Please create one.
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}