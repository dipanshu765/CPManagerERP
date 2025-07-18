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
  totalInwardEntries: 47,
  approvedEntries: 28,
  pendingEntries: 12,
  rejectedEntries: 7,
  consumptionNotes: 156,
  productionNotes: 89,
  brandTransfers: 34,
  stockTransfers: 67,
  tallyRunning: true,
  totalVoucherTypes: 6,
  hamaliEntries: 23,
  hamaliAmount: 15750.50,
  tallyItemCount: 1628,
  syncedItemCount: 1628,
  isSynced: true,
};

export const voucherTypes = [
  {
    name: "Sj Consumption [R]",
    count: 156,
    description: "Raw Item to Process Item",
    icon: "minus-circle",
    color: "purple",
  },
  {
    name: "Sj Production [R]",
    count: 89,
    description: "Process Item to Final Item", 
    icon: "plus-circle",
    color: "indigo",
  },
  {
    name: "Sj Brand Transfer",
    count: 34,
    description: "Source to Destination",
    icon: "arrow-right-left",
    color: "teal",
  },
  {
    name: "Sj Stock Transfer",
    count: 67,
    description: "Location Transfer",
    icon: "truck",
    color: "orange",
  },
];

// Inward entries data from API response
export const inwardEntriesData = [
  {
    id: 20,
    sl_no: "IW/2025/0013",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "rejected",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Mukesh Bafna",
    test_date: "17-07-2025 17:33:39",
    created_at: "17-07-2025 17:33:39"
  },
  {
    id: 18,
    sl_no: "IW/2025/0012",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "rejected",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Mukesh Bafna",
    test_date: "17-07-2025 17:30:56",
    created_at: "17-07-2025 17:30:56"
  },
  {
    id: 16,
    sl_no: "IW/2025/0011",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "approved",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Mukesh Bafna",
    test_date: "17-07-2025 17:22:55",
    created_at: "17-07-2025 17:22:55"
  },
  {
    id: 13,
    sl_no: "IW/2025/0010",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "approved",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Mukesh Bafna",
    test_date: "17-07-2025 17:11:14",
    created_at: "17-07-2025 17:11:14"
  },
  {
    id: 12,
    sl_no: "IW/2025/0009",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "rejected",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Mukesh Bafna",
    test_date: "17-07-2025 17:11:13",
    created_at: "17-07-2025 17:11:13"
  },
  {
    id: 11,
    sl_no: "IW/2025/0008",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "rejected",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Mukesh Bafna",
    test_date: "17-07-2025 17:11:11",
    created_at: "17-07-2025 17:11:11"
  },
  {
    id: 10,
    sl_no: "IW/2025/0007",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "approved",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Mukesh Bafna",
    test_date: "17-07-2025 17:11:10",
    created_at: "17-07-2025 17:11:10"
  },
  {
    id: 9,
    sl_no: "IW/2025/0006",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "approved",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Mukesh Bafna",
    test_date: "17-07-2025 17:06:08",
    created_at: "17-07-2025 17:06:08"
  },
  {
    id: 8,
    sl_no: "IW/2025/0005",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "approved",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Mukesh Bafna",
    test_date: "17-07-2025 17:06:00",
    created_at: "17-07-2025 17:06:00"
  },
  {
    id: 7,
    sl_no: "IW/2025/0004",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "rejected",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Mukesh Bafna",
    test_date: "17-07-2025 17:05:58",
    created_at: "17-07-2025 17:05:58"
  },
  {
    id: 6,
    sl_no: "IW/2025/0003",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "approved",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Deep",
    test_date: "17-07-2025 13:28:41",
    created_at: "16-07-2025 17:28:41"
  },
  {
    id: 5,
    sl_no: "IW/2025/0002",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "rejected",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Deep",
    test_date: "17-07-2025 12:28:30",
    created_at: "16-07-2025 17:28:30"
  },
  {
    id: 4,
    sl_no: "IW/2025/0001",
    date: "17-07-2025",
    party_name: "ABC Agro Limited",
    vehicle_no: "KA25 U 2832",
    bill_no: "BILL001",
    broker_name: "Naveen",
    status: "approved",
    item_count: 0,
    total_bags: 0,
    net_weight: "1500.00",
    tested_by: "Deep",
    test_date: "17-07-2025 13:28:22",
    created_at: "16-07-2025 17:28:22"
  }
];

// Sample detail for inward entry
export const inwardEntryDetail = {
  id: 20,
  sl_no: "IW/2025/0013",
  date: "17-07-2025",
  party: "ABC Agro Limited",
  broker: "Naveen",
  vehicle_no: "KA25 U 2832",
  bill_no: "BILL001",
  loading_at: "",
  unloading_at: "",
  gross_weight: "1700.00",
  tare_weight: "200.00",
  net_weight: "1500.00",
  tested_by: "Mukesh Bafna",
  test_date: "17-07-2025 17:33:39",
  status: "rejected",
  total_items: 0,
  total_bags: 0,
  total_weight: "0",
  status_summary: {
    approved_items: 0,
    rejected_items: 0,
    pending_items: 0
  },
  stock_items: [],
  created_at: "17-07-2025 17:33:39",
  updated_at: "17-07-2025 17:33:39"
};

// Supervisor list for approval workflow
export const supervisorList = [
  { id: 1, name: "Mukesh Bafna", designation: "Senior Supervisor" },
  { id: 2, name: "Deep Sharma", designation: "Quality Supervisor" },
  { id: 3, name: "Rajesh Kumar", designation: "Floor Supervisor" },
  { id: 4, name: "Priya Singh", designation: "Warehouse Supervisor" }
];

// Godown list for approval workflow
export const godownList = [
  { id: 1, name: "Main Warehouse", location: "Ground Floor" },
  { id: 2, name: "Cold Storage", location: "Section A" },
  { id: 3, name: "Raw Material Store", location: "Section B" },
  { id: 4, name: "Finished Goods", location: "Section C" },
  { id: 5, name: "Quality Hold", location: "Section D" }
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
