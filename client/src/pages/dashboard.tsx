import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import UserInfoCard from "@/components/dashboard/user-info-card";
import InwardEntriesMetrics from "@/components/dashboard/inward-entries-metrics";
import VoucherTypesMetrics from "@/components/dashboard/voucher-types-metrics";
import TransactionChart from "@/components/dashboard/transaction-chart";
import StockSyncStatus from "@/components/dashboard/stock-sync-status";
import AdditionalMetrics from "@/components/dashboard/additional-metrics";
import { Button } from "@/components/ui/button";
import { Menu, Calendar } from "lucide-react";
import { mockUser, mockDashboardData } from "@/lib/static-data";

export default function Dashboard() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}
      
      {/* Mobile Sidebar */}
      {isMobile && (
        <MobileSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-4"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              )}
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{mockDashboardData.date}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-black to-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {mockUser.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {mockUser.name}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* User Information Card */}
            <UserInfoCard user={mockUser} tallyRunning={mockDashboardData.tallyRunning} />
            
            {/* Inward Entries Metrics */}
            <InwardEntriesMetrics data={mockDashboardData} />
            
            {/* Voucher Types Metrics */}
            <VoucherTypesMetrics data={mockDashboardData} />
            
            {/* Charts and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionChart data={mockDashboardData} />
              <StockSyncStatus data={mockDashboardData} />
            </div>
            
            {/* Additional Metrics */}
            <AdditionalMetrics data={mockDashboardData} />
          </div>
        </main>
      </div>
    </div>
  );
}
