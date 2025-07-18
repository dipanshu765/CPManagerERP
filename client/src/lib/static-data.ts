import type { User, DashboardData } from "@shared/schema";

export const mockUser: User = {
  id: 1,
  username: "mukesh.bafna@wbagro.com",
  password: "", // Not exposed
  name: "Mukesh Bafna",
  role: "Admin",
  organization: "WB Agro Pvt. Ltd",
  branch: "WB Agro Pvt. Ltd - Main Branch",
  isAdmin: true,
};

export const mockDashboardData: DashboardData = {
  id: 1,
  date: "18-07-2025",
  userId: "USR0001",
  totalInwardEntries: 0,
  approvedEntries: 0,
  pendingEntries: 0,
  rejectedEntries: 0,
  consumptionNotes: 0,
  productionNotes: 0,
  brandTransfers: 0,
  stockTransfers: 0,
  tallyRunning: true,
  totalVoucherTypes: 6,
  hamaliEntries: 0,
  hamaliAmount: 0.0,
  tallyItemCount: 1628,
  syncedItemCount: 1628,
  isSynced: true,
};

export const voucherTypes = [
  {
    name: "Sj Consumption [R]",
    count: 0,
    description: "Raw Item to Process Item",
    icon: "minus-circle",
    color: "purple",
  },
  {
    name: "Sj Production [R]",
    count: 0,
    description: "Process Item to Final Item", 
    icon: "plus-circle",
    color: "indigo",
  },
  {
    name: "Sj Brand Transfer",
    count: 0,
    description: "Source to Destination",
    icon: "arrow-right-left",
    color: "teal",
  },
  {
    name: "Sj Stock Transfer",
    count: 0,
    description: "Location Transfer",
    icon: "truck",
    color: "orange",
  },
];

export const sidebarMenuItems = [
  { name: "Dashboard", icon: "gauge", path: "/dashboard", active: true },
  { name: "User List", icon: "users", path: "/users", active: false },
  { name: "Import Data", icon: "upload", path: "/import", active: false },
  { name: "Control Settings", icon: "settings", path: "/settings", active: false },
  { name: "Reports", icon: "bar-chart-3", path: "/reports", active: false },
  { name: "Edit Profile", icon: "user-pen", path: "/profile", active: false },
  { name: "Privacy Policy", icon: "shield-check", path: "/privacy", active: false },
  { name: "Log out", icon: "log-out", path: "/logout", active: false, separator: true },
];
