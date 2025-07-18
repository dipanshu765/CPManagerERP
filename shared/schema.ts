import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  organization: text("organization").notNull(),
  branch: text("branch").notNull(),
  isAdmin: boolean("is_admin").default(false),
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
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  organization: true,
  branch: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DashboardData = typeof dashboardData.$inferSelect;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
