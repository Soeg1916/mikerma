// Simplified handler for Vercel
import express from 'express';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import { createServer } from 'http';
import * as schema from '../shared/schema.js';
import ws from 'ws';

// Configure Neon database
const neonConfig = require('@neondatabase/serverless').neonConfig;
neonConfig.webSocketConstructor = ws;

// Create Express app
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Create simple DB storage class  
class DatabaseStorage {
  // User methods
  async getUser(id) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username) {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user || undefined;
  }

  // Category methods
  async getCategories() {
    return db.select().from(schema.categories);
  }

  async getCategoryBySlug(slug) {
    const [category] = await db.select().from(schema.categories).where(eq(schema.categories.slug, slug));
    return category || undefined;
  }

  // Services methods
  async getServices() {
    return db.select().from(schema.services);
  }

  async getServicesByCategory(categoryId) {
    return db.select().from(schema.services).where(eq(schema.services.categoryId, categoryId));
  }

  async getServiceById(id) {
    const [service] = await db.select().from(schema.services).where(eq(schema.services.id, id));
    return service || undefined;
  }

  async getFeaturedServices() {
    return db.select().from(schema.services).where(eq(schema.services.featured, true));
  }

  // Payment methods
  async getPaymentMethods() {
    return db.select().from(schema.paymentMethods);
  }

  // Orders
  async getOrders() {
    return db.select().from(schema.orders);
  }

  async getOrderById(id) {
    const [order] = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
    return order || undefined;
  }

  async updateOrderStatus(id, status) {
    const [updatedOrder] = await db.update(schema.orders).set({ status }).where(eq(schema.orders.id, id)).returning();
    return updatedOrder || undefined;
  }

  // Testimonials
  async getTestimonials() {
    return db.select().from(schema.testimonials);
  }

  // Contact Info
  async getContactInfo() {
    const [contact] = await db.select().from(schema.contactInfo);
    return contact || undefined;
  }
}

const storage = new DatabaseStorage();

// Register API routes
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await storage.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/services", async (req, res) => {
  try {
    const services = await storage.getServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/services/featured", async (req, res) => {
  try {
    const services = await storage.getFeaturedServices();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/services/category/:categoryId", async (req, res) => {
  try {
    const categoryId = parseInt(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    const services = await storage.getServicesByCategory(categoryId);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/payment-methods", async (req, res) => {
  try {
    const methods = await storage.getPaymentMethods();
    res.json(methods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await storage.getTestimonials();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/contact-info", async (req, res) => {
  try {
    const contactInfo = await storage.getContactInfo();
    res.json(contactInfo || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
app.get("/api/admin/orders", async (req, res) => {
  try {
    const orders = await storage.getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/admin/orders/:id/status", async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a basic HTTP server
const server = createServer(app);

// Export the Express API
export default app;