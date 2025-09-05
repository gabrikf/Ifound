import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Medicines table
export const medicines = sqliteTable("medicines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  category: text("category"),
  expiryDate: integer("expiry_date", { mode: "timestamp" }),
  quantity: integer("quantity").default(1),
  notes: text("notes"),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  medicines: many(medicines),
}));

export const medicinesRelations = relations(medicines, ({ one }) => ({
  user: one(users, {
    fields: [medicines.userId],
    references: [users.id],
  }),
}));

// Custom Zod schemas for validation
export const insertUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .describe("User's email address"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .describe("User's full name"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .describe("User's password"),
});

export const loginUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .describe("User's email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .describe("User's password"),
});

export const selectUserSchema = createSelectSchema(users).omit({
  passwordHash: true,
});

export const insertMedicineSchema = z.object({
  name: z.string().min(2, "Medicine name must be at least 2 characters"),
  description: z.string().nullable().optional(),
  location: z.string().min(2, "Location must be at least 2 characters"),
  category: z.string().nullable().optional(),
  expiryDate: z.coerce.date().nullable().optional(),
  quantity: z.number().positive("Quantity must be positive").optional(),
  notes: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
});

export const selectMedicineSchema = createSelectSchema(medicines);

export const updateMedicineSchema = insertMedicineSchema.partial();

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Medicine = typeof medicines.$inferSelect;
export type NewMedicine = typeof medicines.$inferInsert;
