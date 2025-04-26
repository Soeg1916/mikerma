// Simple seed script for Vercel deployment
import { DatabaseStorage } from './server/database-storage';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    const storage = new DatabaseStorage();
    
    // Create admin user
    await storage.createUser({
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    });
    
    console.log('Created admin user');
    
    // Create contact info
    await storage.createContactInfo({
      address: 'Bole, Addis Ababa, Ethiopia',
      phone: '+251 91 234 5678',
      telegramLink: 'https://t.me/Miker_mike',
      telegramUsername: '@Miker_mike on Telegram',
      facebookLink: '',
      instagramLink: '',
      twitterLink: '',
      showSocialIcons: false,
      weekdayHours: 'Monday - Saturday: 9:00 AM - 8:00 PM',
      weekendHours: 'Sunday: 10:00 AM - 6:00 PM',
      timeZone: 'East Africa Time (EAT)'
    });
    
    console.log('Created contact info');
    
    // Add categories
    const categories = [
      { 
        name: 'TikTok', 
        slug: 'tiktok', 
        icon: 'hashtag',
        description: 'TikTok followers, likes, views and more' 
      },
      { 
        name: 'YouTube', 
        slug: 'youtube', 
        icon: 'play',
        description: 'YouTube subscribers, views, and engagement services' 
      },
      { 
        name: 'Instagram', 
        slug: 'instagram', 
        icon: 'hashtag',
        description: 'Instagram followers, likes and engagement services' 
      },
      { 
        name: 'Facebook', 
        slug: 'facebook', 
        icon: 'users',
        description: 'Facebook page likes, followers and engagement' 
      },
      { 
        name: 'Twitter/X', 
        slug: 'twitter', 
        icon: 'hashtag',
        description: 'Twitter followers, retweets, and engagement' 
      },
      { 
        name: 'Subscription Services', 
        slug: 'subscription', 
        icon: 'calendar-check',
        description: 'Premium subscriptions for streaming platforms' 
      },
      { 
        name: 'Gift Cards', 
        slug: 'giftcards', 
        icon: 'gift',
        description: 'Digital gift cards for various platforms' 
      }
    ];
    
    for (const category of categories) {
      await storage.createCategory(category);
    }
    
    console.log('Created categories');
    
    // Add payment methods
    const paymentMethods = [
      {
        name: 'Telebirr',
        icon: 'mobile-alt',
        description: 'Pay using Telebirr mobile money',
        instructions: '1. Open Telebirr app\n2. Select "Pay" option\n3. Enter our merchant ID: 123456\n4. Enter the amount\n5. Complete the payment\n6. Take a screenshot of the confirmation'
      },
      {
        name: 'Bank Transfer',
        icon: 'university',
        description: 'Direct bank transfer to our account',
        instructions: '1. Transfer the amount to our bank account:\n   - Bank: Commercial Bank of Ethiopia\n   - Account Name: Miker Market\n   - Account Number: 1000123456789\n2. Take a screenshot of the transfer confirmation'
      },
      {
        name: 'Amole',
        icon: 'credit-card',
        description: 'Pay via Amole digital wallet',
        instructions: '1. Open Amole app\n2. Select "Pay Merchant"\n3. Enter merchant code: MIKER2023\n4. Enter the amount\n5. Complete the payment\n6. Take a screenshot of the confirmation'
      }
    ];
    
    for (const method of paymentMethods) {
      await storage.createPaymentMethod(method);
    }
    
    console.log('Created payment methods');
    
    // Add a test service
    await storage.createService({
      name: 'TikTok Followers (1000)',
      description: 'Get 1000 high-quality TikTok followers.',
      price: 450,
      image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      categoryId: 1,
      featured: true,
      paymentInstructions: 'After payment, send your TikTok username and payment screenshot to our WhatsApp.'
    });
    
    console.log('Created initial services');
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();