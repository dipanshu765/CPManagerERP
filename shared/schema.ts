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

// Stock Journal schemas
export const stockJournalSchema = z.object({
  transaction_id: z.string(),
  voucher_type_name: z.string(),
  voucher_number: z.string(),
  remarks: z.string().optional(),
  date: z.string(),
  effective_date: z.string(),
  is_tally_synced: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const voucherTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  is_active: z.boolean(),
  is_batch: z.boolean(),
  add_bardan: z.boolean(),
  in_source: z.boolean(),
  in_destination: z.boolean(),
  source_alias: z.string(),
  destination_alias: z.string(),
  parent: z.string(),
  created_at: z.string(),
});

export const stockJournalDetailSchema = z.object({
  transaction_id: z.string(),
  voucher_type_name: z.string(),
  voucher_number: z.string(),
  remarks: z.string().optional(),
  date: z.string(),
  effective_date: z.string(),
  is_tally_synced: z.boolean(),
  destination_godown: z.string().optional(),
  inventory_entries_in: z.array(z.any()).optional(),
  inventory_entries_out: z.array(z.any()).optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const stockJournalFiltersSchema = z.object({
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  voucher_type: z.string().optional(),
});

export const syncRequestSchema = z.object({
  transaction_id: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type DashboardData = typeof dashboardData.$inferSelect;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type StockJournal = z.infer<typeof stockJournalSchema>;
export type VoucherType = z.infer<typeof voucherTypeSchema>;
export type StockJournalDetail = z.infer<typeof stockJournalDetailSchema>;
export type StockJournalFilters = z.infer<typeof stockJournalFiltersSchema>;
// Godown Masters schema
export const godownSchema = z.object({
  id: z.number(),
  company: z.string(),
  name: z.string(),
  branch: z.string(),
  guid: z.string(),
  parent: z.string(),
  is_active: z.boolean(),
  created_at: z.string(),
  has_no_space: z.boolean(),
  has_no_stock: z.boolean(),
});

export const godownFiltersSchema = z.object({
  search: z.string().optional(),
  branch: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type Godown = z.infer<typeof godownSchema>;
export type GodownFilters = z.infer<typeof godownFiltersSchema>;
export type SyncRequest = z.infer<typeof syncRequestSchema>;
