import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  description: text("description"),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  icon: true,
  description: true,
});

// Services schema
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // Price in ETB
  image: text("image"),
  categoryId: integer("category_id").notNull(),
  featured: boolean("featured").default(false),
  paymentInstructions: text("payment_instructions"),
});

export const insertServiceSchema = createInsertSchema(services).pick({
  name: true,
  description: true,
  price: true,
  image: true,
  categoryId: true,
  featured: true,
  paymentInstructions: true,
});

// Payment methods schema
export const paymentMethods = pgTable("payment_methods", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  description: text("description"),
  instructions: text("instructions"),
});

export const insertPaymentMethodSchema = createInsertSchema(paymentMethods).pick({
  name: true,
  icon: true,
  description: true,
  instructions: true,
});

// Orders schema
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id").notNull(),
  serviceName: text("service_name").notNull(),
  paymentMethodId: integer("payment_method_id").notNull(),
  paymentMethod: text("payment_method").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  screenshotUrl: text("screenshot_url").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerTelegram: text("customer_telegram"),
  platformUsername: text("platform_username"),
  targetUrl: text("target_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  serviceId: true,
  serviceName: true,
  paymentMethodId: true,
  paymentMethod: true,
  amount: true,
  status: true,
  screenshotUrl: true,
  customerPhone: true,
  customerTelegram: true,
  platformUsername: true,
  targetUrl: true,
});

// Testimonials schema
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  image: text("image"),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  image: true,
  rating: true,
  comment: true,
});

// Users schema (for admin access)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

// Type exports
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertPaymentMethod = z.infer<typeof insertPaymentMethodSchema>;
export type PaymentMethod = typeof paymentMethods.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Contact information schema
export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  telegramLink: text("telegram_link").notNull(),
  telegramUsername: text("telegram_username").notNull(),
  facebookLink: text("facebook_link").default("").notNull(),
  instagramLink: text("instagram_link").default("").notNull(),
  twitterLink: text("twitter_link").default("").notNull(),
  showSocialIcons: boolean("show_social_icons").default(false).notNull(),
  // Business hours fields
  weekdayHours: text("weekday_hours").default("Monday - Saturday: 9:00 AM - 8:00 PM").notNull(),
  weekendHours: text("weekend_hours").default("Sunday: 10:00 AM - 6:00 PM").notNull(),
  timeZone: text("time_zone").default("East Africa Time (EAT)").notNull(),
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).pick({
  address: true,
  phone: true,
  telegramLink: true,
  telegramUsername: true,
  facebookLink: true,
  instagramLink: true,
  twitterLink: true,
  showSocialIcons: true,
  weekdayHours: true,
  weekendHours: true,
  timeZone: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;
