import { 
  users, 
  categories, 
  services, 
  paymentMethods, 
  testimonials,
  contactInfo,
  orders,
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Service,
  type InsertService,
  type PaymentMethod,
  type InsertPaymentMethod,
  type Testimonial,
  type InsertTestimonial,
  type ContactInfo,
  type InsertContactInfo,
  type Order,
  type InsertOrder
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  
  // Service methods
  getServices(): Promise<Service[]>;
  getServicesByCategory(categoryId: number): Promise<Service[]>;
  getServiceById(id: number): Promise<Service | undefined>;
  getFeaturedServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;
  
  // Payment methods
  getPaymentMethods(): Promise<PaymentMethod[]>;
  getPaymentMethodById(id: number): Promise<PaymentMethod | undefined>;
  createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod>;
  updatePaymentMethod(id: number, method: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined>;
  deletePaymentMethod(id: number): Promise<boolean>;
  
  // Order methods
  getOrders(): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Testimonials
  getTestimonials(): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;

  // Contact Information
  getContactInfo(): Promise<ContactInfo | undefined>;
  createContactInfo(info: InsertContactInfo): Promise<ContactInfo>;
  updateContactInfo(id: number, info: Partial<InsertContactInfo>): Promise<ContactInfo | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private services: Map<number, Service>;
  private paymentMethods: Map<number, PaymentMethod>;
  private testimonials: Map<number, Testimonial>;
  private contactInfo: Map<number, ContactInfo>;
  private orders: Map<number, Order>;
  
  private currentUserId: number;
  private currentCategoryId: number;
  private currentServiceId: number;
  private currentPaymentMethodId: number;
  private currentTestimonialId: number;
  private currentContactInfoId: number;
  private currentOrderId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.services = new Map();
    this.paymentMethods = new Map();
    this.testimonials = new Map();
    this.contactInfo = new Map();
    this.orders = new Map();
    
    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentServiceId = 1;
    this.currentPaymentMethodId = 1;
    this.currentTestimonialId = 1;
    this.currentContactInfoId = 1;
    this.currentOrderId = 1;
    
    // Initialize with seed data
    this.initializeSeedData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, categoryUpdate: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;
    
    const updatedCategory = { ...category, ...categoryUpdate };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }
  
  // Service methods
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getServicesByCategory(categoryId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.categoryId === categoryId,
    );
  }
  
  async getServiceById(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async getFeaturedServices(): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.featured,
    );
  }
  
  async createService(service: InsertService): Promise<Service> {
    const id = this.currentServiceId++;
    const newService: Service = { ...service, id };
    this.services.set(id, newService);
    return newService;
  }
  
  async updateService(id: number, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const service = this.services.get(id);
    if (!service) return undefined;
    
    const updatedService = { ...service, ...serviceUpdate };
    this.services.set(id, updatedService);
    return updatedService;
  }
  
  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }
  
  // Payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return Array.from(this.paymentMethods.values());
  }
  
  async getPaymentMethodById(id: number): Promise<PaymentMethod | undefined> {
    return this.paymentMethods.get(id);
  }
  
  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    const id = this.currentPaymentMethodId++;
    const newMethod: PaymentMethod = { ...method, id };
    this.paymentMethods.set(id, newMethod);
    return newMethod;
  }
  
  async updatePaymentMethod(id: number, methodUpdate: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined> {
    const method = this.paymentMethods.get(id);
    if (!method) return undefined;
    
    const updatedMethod = { ...method, ...methodUpdate };
    this.paymentMethods.set(id, updatedMethod);
    return updatedMethod;
  }
  
  async deletePaymentMethod(id: number): Promise<boolean> {
    return this.paymentMethods.delete(id);
  }
  
  // Order methods
  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    // Add createdAt timestamp
    const newOrder: Order = { 
      ...order, 
      id,
      createdAt: new Date() 
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const newTestimonial: Testimonial = { ...testimonial, id };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }
  
  async updateTestimonial(id: number, testimonialUpdate: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const testimonial = this.testimonials.get(id);
    if (!testimonial) return undefined;
    
    const updatedTestimonial = { ...testimonial, ...testimonialUpdate };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }
  
  // Contact Information methods
  async getContactInfo(): Promise<ContactInfo | undefined> {
    const contacts = Array.from(this.contactInfo.values());
    return contacts.length > 0 ? contacts[0] : undefined;
  }
  
  async createContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    const id = this.currentContactInfoId++;
    const newContactInfo: ContactInfo = { ...info, id };
    this.contactInfo.set(id, newContactInfo);
    return newContactInfo;
  }
  
  async updateContactInfo(id: number, infoUpdate: Partial<InsertContactInfo>): Promise<ContactInfo | undefined> {
    const contactInfo = this.contactInfo.get(id);
    if (!contactInfo) return undefined;
    
    const updatedContactInfo = { ...contactInfo, ...infoUpdate };
    this.contactInfo.set(id, updatedContactInfo);
    return updatedContactInfo;
  }
  
  // Seed data
  private initializeSeedData() {
    // Create initial contact information
    this.createContactInfo({
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
    // Create admin user
    this.createUser({
      username: 'admin',
      password: 'admin123',
      isAdmin: true
    });
    
    // Create categories
    const categoriesData: InsertCategory[] = [
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
    
    categoriesData.forEach(category => {
      this.createCategory(category);
    });
    
    // Create payment methods
    const paymentMethodsData: InsertPaymentMethod[] = [
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
    
    paymentMethodsData.forEach(method => {
      this.createPaymentMethod(method);
    });
    
    // Create services
    const servicesData: InsertService[] = [
      // TikTok Services (Category 1)
      {
        name: 'TikTok Followers (1000)',
        description: 'Get 1000 high-quality TikTok followers.',
        price: 450,
        image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 1,
        featured: true,
        paymentInstructions: 'After payment, send your TikTok username and payment screenshot to our WhatsApp.'
      },
      {
        name: 'TikTok Views (5000)',
        description: 'Increase your TikTok video views by 5000.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 1,
        featured: true,
        paymentInstructions: 'After payment, send your TikTok video link and payment screenshot to our WhatsApp.'
      },
      {
        name: 'TikTok Likes (1000)',
        description: 'Add 1000 real likes to your TikTok video.',
        price: 150,
        image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 1,
        featured: false,
        paymentInstructions: 'After payment, send your TikTok video link and payment screenshot to our WhatsApp.'
      },
      
      // YouTube Services (Category 2)
      {
        name: 'YouTube Subscribers (500)',
        description: 'Gain 500 new YouTube subscribers for your channel.',
        price: 800,
        image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 2,
        featured: true,
        paymentInstructions: 'After payment, send your YouTube channel link and payment screenshot to our WhatsApp.'
      },
      {
        name: 'YouTube Views (5000)',
        description: 'Add 5000 views to your YouTube video.',
        price: 350,
        image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 2,
        featured: true,
        paymentInstructions: 'After payment, send your YouTube video link and payment screenshot to our WhatsApp.'
      },
      {
        name: 'YouTube Comments (50)',
        description: '50 positive comments on your YouTube video.',
        price: 300,
        image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 2,
        featured: false,
        paymentInstructions: 'After payment, send your YouTube video link and payment screenshot to our WhatsApp.'
      },
      
      // Instagram Services (Category 3)
      {
        name: 'Instagram Followers (1000)',
        description: 'Get 1000 high-quality Instagram followers.',
        price: 500,
        image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 3,
        featured: true,
        paymentInstructions: 'After payment, send your Instagram username and payment screenshot to our WhatsApp.'
      },
      {
        name: 'Instagram Likes (1000)',
        description: 'Add 1000 likes to your Instagram post.',
        price: 250,
        image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 3,
        featured: false,
        paymentInstructions: 'After payment, send your Instagram post link and payment screenshot to our WhatsApp.'
      },
      {
        name: 'Instagram Comments (50)',
        description: '50 positive comments on your Instagram post.',
        price: 300,
        image: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 3,
        featured: false,
        paymentInstructions: 'After payment, send your Instagram post link and payment screenshot to our WhatsApp.'
      },
      
      // Facebook Services (Category 4)
      {
        name: 'Facebook Page Likes (500)',
        description: 'Boost your Facebook page with 500 real likes.',
        price: 300,
        image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 4,
        featured: true,
        paymentInstructions: 'After payment, send your Facebook page link and payment screenshot to our WhatsApp.'
      },
      {
        name: 'Facebook Post Likes (300)',
        description: 'Get 300 likes on your Facebook post.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 4,
        featured: false,
        paymentInstructions: 'After payment, send your Facebook post link and payment screenshot to our WhatsApp.'
      },
      {
        name: 'Facebook Group Members (300)',
        description: 'Add 300 members to your Facebook group.',
        price: 400,
        image: 'https://images.unsplash.com/photo-1579869847514-7c1a19d2d2ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 4,
        featured: false,
        paymentInstructions: 'After payment, send your Facebook group link and payment screenshot to our WhatsApp.'
      },
      
      // Twitter Services (Category 5)
      {
        name: 'Twitter Followers (500)',
        description: 'Get 500 Twitter followers for your account.',
        price: 400,
        image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 5,
        featured: true,
        paymentInstructions: 'After payment, send your Twitter username and payment screenshot to our WhatsApp.'
      },
      {
        name: 'Twitter Retweets (100)',
        description: 'Get 100 retweets for your tweet.',
        price: 200,
        image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 5,
        featured: false,
        paymentInstructions: 'After payment, send your tweet link and payment screenshot to our WhatsApp.'
      },
      {
        name: 'Twitter Likes (200)',
        description: 'Get 200 likes on your tweet.',
        price: 180,
        image: 'https://images.unsplash.com/photo-1611605698323-b1e99cfd37ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 5,
        featured: false,
        paymentInstructions: 'After payment, send your tweet link and payment screenshot to our WhatsApp.'
      },
      
      // Subscription Services (Category 6)
      {
        name: 'Netflix Premium (1 Month)',
        description: 'Access to all Netflix content in 4K with 4 screens.',
        price: 450,
        image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 6,
        featured: true,
        paymentInstructions: 'After payment, send your email address for account setup and payment screenshot to our WhatsApp.'
      },
      {
        name: 'Spotify Premium (1 Month)',
        description: 'Ad-free music streaming with offline downloads.',
        price: 250,
        image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 6,
        featured: false,
        paymentInstructions: 'After payment, send your email address for account setup and payment screenshot to our WhatsApp.'
      },
      {
        name: 'Disney+ (1 Month)',
        description: 'Full access to Disney+ streaming service.',
        price: 350,
        image: 'https://images.unsplash.com/photo-1604877701092-4ca8d3eb9d6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 6,
        featured: false,
        paymentInstructions: 'After payment, send your email address for account setup and payment screenshot to our WhatsApp.'
      },
      
      // Gift Cards (Category 7)
      {
        name: 'Amazon Gift Card ($25)',
        description: '$25 Amazon Gift Card code.',
        price: 950,
        image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 7,
        featured: true,
        paymentInstructions: 'After payment, the gift card code will be sent to you via email or WhatsApp.'
      },
      {
        name: 'Google Play Gift Card ($10)',
        description: '$10 Google Play Gift Card code.',
        price: 400,
        image: 'https://images.unsplash.com/photo-1607988795691-3d0147b43231?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 7,
        featured: false,
        paymentInstructions: 'After payment, the gift card code will be sent to you via email or WhatsApp.'
      },
      {
        name: 'iTunes Gift Card ($15)',
        description: '$15 iTunes Gift Card code.',
        price: 600,
        image: 'https://images.unsplash.com/photo-1524072704778-db99d0e434f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        categoryId: 7,
        featured: true,
        paymentInstructions: 'After payment, the gift card code will be sent to you via email or WhatsApp.'
      }
    ];
    
    servicesData.forEach(service => {
      this.createService(service);
    });
    
    // Create testimonials
    const testimonialsData: InsertTestimonial[] = [
      {
        name: 'Sara Abebe',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        rating: 5,
        comment: 'The subscription services work flawlessly. I\'ve been using Netflix through them for months with no issues.'
      },
      {
        name: 'Dawit Haile',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        rating: 4,
        comment: 'I purchased game top-ups for PUBG and received the UC within minutes. Great service and reliable!'
      },
      {
        name: 'Hirut Tadesse',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        rating: 5,
        comment: 'Their SMM services helped me grow my small business Instagram account. The followers are real and engaged!'
      }
    ];
    
    testimonialsData.forEach(testimonial => {
      this.createTestimonial(testimonial);
    });
  }
}

// Import the database storage implementation
import { DatabaseStorage } from './database-storage';

// Use database storage instead of memory storage
export const storage = new MemStorage();
