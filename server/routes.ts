import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { DatabaseStorage } from "./database-storage";
const storage = new DatabaseStorage();
import { z } from "zod";
import { 
  insertServiceSchema, 
  insertCategorySchema, 
  insertPaymentMethodSchema, 
  insertTestimonialSchema, 
  insertContactInfoSchema,
  insertOrderSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories endpoints
  app.get("/api/categories", async (req: Request, res: Response) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });
  
  app.get("/api/categories/:slug", async (req: Request, res: Response) => {
    const { slug } = req.params;
    const category = await storage.getCategoryBySlug(slug);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json(category);
  });
  
  // Services endpoints
  app.get("/api/services", async (req: Request, res: Response) => {
    const services = await storage.getServices();
    res.json(services);
  });
  
  app.get("/api/services/featured", async (req: Request, res: Response) => {
    const services = await storage.getFeaturedServices();
    res.json(services);
  });
  
  app.get("/api/services/category/:categoryId", async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.categoryId);
    
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    
    const services = await storage.getServicesByCategory(categoryId);
    res.json(services);
  });
  
  app.get("/api/services/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }
    
    const service = await storage.getServiceById(id);
    
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.json(service);
  });
  
  // Payment methods
  app.get("/api/payment-methods", async (req: Request, res: Response) => {
    const paymentMethods = await storage.getPaymentMethods();
    res.json(paymentMethods);
  });
  
  // Testimonials
  app.get("/api/testimonials", async (req: Request, res: Response) => {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  });
  
  // Contact Information
  app.get("/api/contact-info", async (req: Request, res: Response) => {
    const contactInfo = await storage.getContactInfo();
    if (!contactInfo) {
      return res.status(404).json({ message: "Contact information not found" });
    }
    res.json(contactInfo);
  });
  
  // Order endpoints
  app.get("/api/orders", async (req: Request, res: Response) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.get("/api/orders/:id", async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    const order = await storage.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  });

  app.post("/api/orders", async (req: Request, res: Response) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });
  
  // Admin routes
  const adminAuthMiddleware = async (req: Request, res: Response, next: Function) => {
    // For development/demo purposes, we're allowing admin access without authentication
    // In a production environment, proper authentication would be implemented
    next();
  };
  
  // Categories admin endpoints
  app.post("/api/admin/categories", adminAuthMiddleware, async (req: Request, res: Response) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });
  
  app.put("/api/admin/categories/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    
    try {
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, validatedData);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update category" });
    }
  });
  
  app.delete("/api/admin/categories/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    
    const deleted = await storage.deleteCategory(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.status(204).send();
  });
  
  // Services admin endpoints
  app.post("/api/admin/services", adminAuthMiddleware, async (req: Request, res: Response) => {
    try {
      const validatedData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validatedData);
      res.status(201).json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create service" });
    }
  });
  
  app.put("/api/admin/services/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }
    
    try {
      const validatedData = insertServiceSchema.partial().parse(req.body);
      const service = await storage.updateService(id, validatedData);
      
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      res.json(service);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid service data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update service" });
    }
  });
  
  app.delete("/api/admin/services/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }
    
    const deleted = await storage.deleteService(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }
    
    res.status(204).send();
  });
  
  // Payment methods admin endpoints
  app.post("/api/admin/payment-methods", adminAuthMiddleware, async (req: Request, res: Response) => {
    try {
      const validatedData = insertPaymentMethodSchema.parse(req.body);
      const method = await storage.createPaymentMethod(validatedData);
      res.status(201).json(method);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment method data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create payment method" });
    }
  });
  
  app.put("/api/admin/payment-methods/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid payment method ID" });
    }
    
    try {
      const validatedData = insertPaymentMethodSchema.partial().parse(req.body);
      const method = await storage.updatePaymentMethod(id, validatedData);
      
      if (!method) {
        return res.status(404).json({ message: "Payment method not found" });
      }
      
      res.json(method);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid payment method data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update payment method" });
    }
  });
  
  app.delete("/api/admin/payment-methods/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid payment method ID" });
    }
    
    const deleted = await storage.deletePaymentMethod(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Payment method not found" });
    }
    
    res.status(204).send();
  });
  
  // Testimonials admin endpoints
  app.post("/api/admin/testimonials", adminAuthMiddleware, async (req: Request, res: Response) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });
  
  app.put("/api/admin/testimonials/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid testimonial ID" });
    }
    
    try {
      const validatedData = insertTestimonialSchema.partial().parse(req.body);
      const testimonial = await storage.updateTestimonial(id, validatedData);
      
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found" });
      }
      
      res.json(testimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid testimonial data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });
  
  app.delete("/api/admin/testimonials/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid testimonial ID" });
    }
    
    const deleted = await storage.deleteTestimonial(id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    
    res.status(204).send();
  });
  
  // Contact Information admin endpoints
  app.put("/api/admin/contact-info/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid contact info ID" });
    }
    
    try {
      const validatedData = insertContactInfoSchema.partial().parse(req.body);
      const contactInfo = await storage.updateContactInfo(id, validatedData);
      
      if (!contactInfo) {
        return res.status(404).json({ message: "Contact information not found" });
      }
      
      res.json(contactInfo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contact information data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update contact information" });
    }
  });
  
  // Orders admin endpoints
  app.get("/api/admin/orders", adminAuthMiddleware, async (req: Request, res: Response) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });
  
  app.get("/api/admin/orders/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    const order = await storage.getOrderById(id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  });
  
  app.put("/api/admin/orders/:id/status", adminAuthMiddleware, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    
    const { status } = req.body;
    
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const order = await storage.updateOrderStatus(id, status);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(order);
  });

  const httpServer = createServer(app);
  return httpServer;
}
