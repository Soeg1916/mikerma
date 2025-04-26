// Production server for Render
import express from 'express';
import { createServer } from 'http';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { eq } from 'drizzle-orm';
import * as schema from './shared/schema.js';
import path from 'path';
import { fileURLToPath } from 'url';
import ws from 'ws';

// Config for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Neon database
const neonConfig = (await import('@neondatabase/serverless')).neonConfig;
neonConfig.webSocketConstructor = ws;

// Setup Express app
const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Serve static files from dist folder
app.use(express.static(path.join(__dirname, 'dist')));

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// DB Storage class
class DatabaseStorage {
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

  async createOrder(order) {
    const [newOrder] = await db.insert(schema.orders).values(order).returning();
    return newOrder;
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

// API Routes
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await storage.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/categories/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await storage.getCategoryBySlug(slug);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
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

app.get("/api/services/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid service ID" });
    }
    const service = await storage.getServiceById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
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

app.post("/api/orders", async (req, res) => {
  try {
    const order = req.body;
    const newOrder = await storage.createOrder(order);
    res.status(201).json(newOrder);
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

app.get("/api/admin/orders/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }
    const order = await storage.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
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

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  // If it's not an API route
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});