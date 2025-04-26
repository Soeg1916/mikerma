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
import { db } from "./db";
import { eq } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Category methods
  async getCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }
  
  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }
  
  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updatedCategory] = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory || undefined;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id));
    return !!result;
  }
  
  // Service methods
  async getServices(): Promise<Service[]> {
    return db.select().from(services);
  }
  
  async getServicesByCategory(categoryId: number): Promise<Service[]> {
    return db
      .select()
      .from(services)
      .where(eq(services.categoryId, categoryId));
  }
  
  async getServiceById(id: number): Promise<Service | undefined> {
    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id));
    return service || undefined;
  }
  
  async getFeaturedServices(): Promise<Service[]> {
    return db
      .select()
      .from(services)
      .where(eq(services.featured, true));
  }
  
  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db
      .insert(services)
      .values(service)
      .returning();
    return newService;
  }
  
  async updateService(id: number, serviceUpdate: Partial<InsertService>): Promise<Service | undefined> {
    const [updatedService] = await db
      .update(services)
      .set(serviceUpdate)
      .where(eq(services.id, id))
      .returning();
    return updatedService || undefined;
  }
  
  async deleteService(id: number): Promise<boolean> {
    const result = await db
      .delete(services)
      .where(eq(services.id, id));
    return !!result;
  }
  
  // Payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return db.select().from(paymentMethods);
  }
  
  async getPaymentMethodById(id: number): Promise<PaymentMethod | undefined> {
    const [method] = await db
      .select()
      .from(paymentMethods)
      .where(eq(paymentMethods.id, id));
    return method || undefined;
  }
  
  async createPaymentMethod(method: InsertPaymentMethod): Promise<PaymentMethod> {
    const [newMethod] = await db
      .insert(paymentMethods)
      .values(method)
      .returning();
    return newMethod;
  }
  
  async updatePaymentMethod(id: number, methodUpdate: Partial<InsertPaymentMethod>): Promise<PaymentMethod | undefined> {
    const [updatedMethod] = await db
      .update(paymentMethods)
      .set(methodUpdate)
      .where(eq(paymentMethods.id, id))
      .returning();
    return updatedMethod || undefined;
  }
  
  async deletePaymentMethod(id: number): Promise<boolean> {
    const result = await db
      .delete(paymentMethods)
      .where(eq(paymentMethods.id, id));
    return !!result;
  }
  
  // Order methods
  async getOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, id));
    return order || undefined;
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db
      .insert(orders)
      .values(order)
      .returning();
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }
  
  // Testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials);
  }
  
  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id));
    return testimonial || undefined;
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return newTestimonial;
  }
  
  async updateTestimonial(id: number, testimonialUpdate: Partial<InsertTestimonial>): Promise<Testimonial | undefined> {
    const [updatedTestimonial] = await db
      .update(testimonials)
      .set(testimonialUpdate)
      .where(eq(testimonials.id, id))
      .returning();
    return updatedTestimonial || undefined;
  }
  
  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id));
    return !!result;
  }
  
  // Contact Information methods
  async getContactInfo(): Promise<ContactInfo | undefined> {
    const [contact] = await db.select().from(contactInfo);
    return contact || undefined;
  }
  
  async createContactInfo(info: InsertContactInfo): Promise<ContactInfo> {
    const [newContactInfo] = await db
      .insert(contactInfo)
      .values(info)
      .returning();
    return newContactInfo;
  }
  
  async updateContactInfo(id: number, infoUpdate: Partial<InsertContactInfo>): Promise<ContactInfo | undefined> {
    const [updatedContactInfo] = await db
      .update(contactInfo)
      .set(infoUpdate)
      .where(eq(contactInfo.id, id))
      .returning();
    return updatedContactInfo || undefined;
  }
}