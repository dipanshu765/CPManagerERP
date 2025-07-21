import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  mobile: text("mobile").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  roleId: integer("role_id").notNull(),
  role: text("role").notNull(),
  accessToken: text("access_token"),
  tokenType: text("token_type").default("Bearer"),
  lastLogin: text("last_login"),
});

export const dashboardData = pgTable("dashboard_data", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  userId: text("user_id").notNull(),
  totalInwardEntries: integer("total_inward_entries").default(0),
  approvedEntries: integer("approved_entries").default(0),
  pendingEntries: integer("pending_entries").default(0),
  rejectedEntries: integer("rejected_entries").default(0),
  consumptionNotes: integer("consumption_notes").default(0),
  productionNotes: integer("production_notes").default(0),
  brandTransfers: integer("brand_transfers").default(0),
  stockTransfers: integer("stock_transfers").default(0),
  tallyRunning: boolean("tally_running").default(true),
  totalVoucherTypes: integer("total_voucher_types").default(0),
  hamaliEntries: integer("hamali_entries").default(0),
  hamaliAmount: real("hamali_amount").default(0),
  tallyItemCount: integer("tally_item_count").default(0),
  syncedItemCount: integer("synced_item_count").default(0),
  isSynced: boolean("is_synced").default(true),
});

export const loginSchema = z.object({
  mobile: z.string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  mobile: z.string()
    .regex(/^\d{10}$/, "Mobile number must be exactly 10 digits")
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  userId: true,
  mobile: true,
  password: true,
  name: true,
  roleId: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DashboardData = typeof dashboardData.$inferSelect;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
