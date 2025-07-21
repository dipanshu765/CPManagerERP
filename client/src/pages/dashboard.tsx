import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Menu, Calendar, Filter, Loader2 } from "lucide-react";
import { AuthService } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import Loader from "@/components/common/loader";

const API_BASE_URL = "http://127.0.0.1:8096";

interface DashboardAPIResponse {
  status: number;
  message: string;
  data: {
    date: string;
    user_info: {
      user_id: string;
      name: string;
      admin_id: string;
      role_id: number;
      role: string;
      is_admin: boolean;
      organization: string;
      branch: string;
    };
    voucher_summary: {
      voucher_types: Array<{
        voucher_type_name: string;
        total_transaction_count: number;
        user_transaction_count: number;
        is_batch: boolean;
        is_bardan: boolean;
        in_source: boolean;
        in_destination: boolean;
        source_alias: string;
        destination_alias: string;
      }>;
      total_voucher_types: number;
      total_organization_transactions: number;
      total_user_transactions: number;
    };
    hamali_summary: {
      total_hamali_entries: number;
      total_hamali_amount: number;
      transfer_types: Array<{
        transfer_type: string;
        transfer_type_display: string;
      }>;
    };
    stock_items_summary: {
      is_synced: boolean;
      difference: number;
      tally_item_count: number;
      synced_item_count: number;
    };
    inward_entries_summary: {
      total_count: number;
      approved_count: number;
      pending_count: number;
      rejected_count: number;
      error: null | string;
    };
    tally_running_status: boolean;
  };
  filters_applied: {
    date: string;
    branch: string;
  };
}

export default function Dashboard() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const isMobile = useIsMobile();

  // Fetch dashboard data from API
  const { data: dashboardData, isLoading, error, refetch } = useQuery({
    queryKey: [`${API_BASE_URL}/api/dashboard/`, selectedDate],
    queryFn: async () => {
      const url = `${API_BASE_URL}/api/dashboard/?date=${selectedDate}`;
      const response = await apiRequest('GET', url);
      const data: DashboardAPIResponse = await response.json();
      return data;
    },
    enabled: !!AuthService.getAccessToken(),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

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
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
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
              {/* Date Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <Label htmlFor="dateFilter" className="sr-only">Filter by date</Label>
                <Input
                  id="dateFilter"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="w-40 text-sm"
                />
                {isLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-600" />}
              </div>
              
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {dashboardData?.data?.date || format(new Date(), 'dd-MM-yyyy')}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-black to-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {dashboardData?.data?.user_info?.name?.split(" ").map(n => n[0]).join("") || "U"}
                  </span>
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">
                  {dashboardData?.data?.user_info?.name || "User"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {error ? (
              <div className="text-center py-12">
                <div className="text-red-600 mb-4">
                  <p className="text-lg font-semibold">Failed to load dashboard data</p>
                  <p className="text-sm">{error.message}</p>
                </div>
                <Button onClick={() => refetch()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* User Information Card */}
                <UserInfoCard 
                  user={dashboardData?.data?.user_info} 
                  tallyRunning={dashboardData?.data?.tally_running_status} 
                />
                
                {/* Inward Entries Metrics */}
                <InwardEntriesMetrics data={dashboardData?.data?.inward_entries_summary} />
                
                {/* Voucher Types Metrics */}
                <VoucherTypesMetrics data={dashboardData?.data?.voucher_summary} />
                
                {/* Charts and Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TransactionChart data={dashboardData?.data?.voucher_summary} />
                  <StockSyncStatus data={dashboardData?.data?.stock_items_summary} />
                </div>
                
                {/* Additional Metrics */}
                <AdditionalMetrics data={dashboardData?.data?.hamali_summary} />
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Loader */}
      <Loader isLoading={isLoading} text="Loading dashboard data" />
    </div>
  );
}
