import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { 
  Menu, 
  Search, 
  Eye, 
  FileText, 
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Warehouse,
  ArrowRight,
  ArrowLeft,
  Building2,
  Hash,
  CalendarIcon,
  RotateCw,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Loader from "@/components/common/loader";
import { AuthService } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
// Note: Type imports are commented out since this is a JSX file
// import { StockJournal, VoucherType, StockJournalDetail, StockJournalFilters } from "@shared/schema";

// Helper function to format date for display
const formatDateForApi = (date) => {
  return date ? format(new Date(date), "dd-MM-yyyy") : "";
};

// Voucher types will be fetched from API

export default function StockJournal() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [voucherTypeFilter, setVoucherTypeFilter] = useState("all");
  const [syncFilter, setSyncFilter] = useState("all");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState({ from: false, to: false });
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();

  // Build API query parameters
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append('page', currentPage.toString());
    
    if (fromDate) {
      params.append('from_date', formatDateForApi(fromDate));
    }
    if (toDate) {
      params.append('to_date', formatDateForApi(toDate));
    }
    if (voucherTypeFilter && voucherTypeFilter !== "all") {
      params.append('voucher_type', voucherTypeFilter);
    }
    if (syncFilter && syncFilter !== "all") {
      params.append('is_tally_synced', syncFilter === "synced" ? "true" : "false");
    }
    
    return params.toString();
  };

  // Fetch stock journals from API
  const { data: stockJournalsData, isLoading, error, refetch } = useQuery({
    queryKey: ["http://127.0.0.1:8096/api/get-stock-journals/", currentPage, fromDate, toDate, voucherTypeFilter, syncFilter],
    queryFn: async () => {
      const queryParams = buildQueryParams();
      const url = `http://127.0.0.1:8096/api/get-stock-journals/?${queryParams}`;
      const response = await fetch(url, {
        headers: AuthService.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stock journals: ${response.statusText}`);
      }
      
      return await response.json();
    },
    enabled: AuthService.isAuthenticated()
  });

  // Fetch voucher types from API
  const { data: voucherTypesData } = useQuery({
    queryKey: ["http://127.0.0.1:8096/api/get-voucher-types/"],
    queryFn: async () => {
      const response = await fetch("http://127.0.0.1:8096/api/get-voucher-types/?is_active=true", {
        headers: AuthService.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch voucher types: ${response.statusText}`);
      }
      
      return await response.json();
    },
    enabled: AuthService.isAuthenticated()
  });

  // Fetch stock journal details for modal
  const { data: detailData, isLoading: isDetailLoading } = useQuery({
    queryKey: ["http://127.0.0.1:8096/api/get-stock-journals-detail/", selectedTransactionId],
    queryFn: async () => {
      const response = await fetch(`http://127.0.0.1:8096/api/get-stock-journals-detail/${selectedTransactionId}/`, {
        headers: AuthService.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stock journal detail: ${response.statusText}`);
      }
      
      return await response.json();
    },
    enabled: AuthService.isAuthenticated() && !!selectedTransactionId
  });

  // Sync function using API
  const syncMutation = useMutation({
    mutationFn: async (transactionId) => {
      const response = await fetch("http://127.0.0.1:8096/api/process/sync-to-tally/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...AuthService.getAuthHeaders(),
        },
        body: JSON.stringify({
          transaction_id: transactionId
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to sync to Tally: ${response.statusText}`);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction synced to Tally successfully",
      });
      refetch(); // Refresh the main data
      // Close modal and show success
      setIsDetailModalOpen(false);
      setSelectedEntry(null);
      setSelectedTransactionId(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sync to Tally",
        variant: "destructive",
      });
    }
  });

  // Filter stock journals based on search only (API handles other filters)
  const stockJournals = stockJournalsData?.data || [];
  const filteredEntries = stockJournals.filter(entry => {
    const matchesSearch = !searchTerm || (
      entry.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.voucher_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.voucher_type_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return matchesSearch;
  });

  // Pagination data
  const pagination = stockJournalsData?.pagination || {
    current_page: 1,
    page_size: 50,
    total_count: 0,
    total_pages: 1,
    has_next: false,
    has_previous: false
  };

  const handleViewDetails = async (entry) => {
    setSelectedTransactionId(entry.transaction_id);
    setSelectedEntry(entry);
    setIsDetailModalOpen(true);
  };

  const handleSyncToTally = (transactionId) => {
    syncMutation.mutate(transactionId);
  };

  const handleClearFilters = () => {
    setFromDate(null);
    setToDate(null);
    setVoucherTypeFilter("all");
    setSyncFilter("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getVoucherTypeBadge = (voucherType) => {
    return <Badge variant="secondary" className="text-black dark:text-white font-normal">{voucherType}</Badge>;
  };

  const getSyncBadge = (isSynced) => {
    return isSynced ? (
      <Badge variant="default" className="bg-gradient-to-r from-black to-gray-800 text-white border-green-400 border-2 pulse-glow">
        <CheckCircle className="mr-1 h-3 w-3 animate-pulse" />
        Synced
      </Badge>
    ) : (
      <Badge variant="default" className="bg-gradient-to-r from-red-600 to-red-700 text-white border-black border-2 animate-pulse">
        <XCircle className="mr-1 h-3 w-3" />
        Not Synced
      </Badge>
    );
  };

  // Get voucher types
  const voucherTypes = voucherTypesData?.data || [];

  // Show loading state
  if (isLoading || syncMutation.isPending) {
    return <Loader loadingText="Loading stock journal reports..." />;
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-6 text-center">
              <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Failed to load stock journals
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {error.message}
              </p>
              <Button onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMobileSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-2">
                  <FileText className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Stock Journal Reports
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Manage production and consumption entries
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {filteredEntries.length} entries
                </Badge>
              </div>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
          <div className="space-y-4">
            {/* Search and Filter Actions Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by transaction ID, voucher number, or type..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="whitespace-nowrap"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Clear Filters
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Date Range Filters */}
              <div className="flex gap-2">
                <Popover 
                  open={isDatePickerOpen.from} 
                  onOpenChange={(open) => setIsDatePickerOpen(prev => ({ ...prev, from: open }))}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-40 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fromDate ? formatDateForApi(fromDate) : "From Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={fromDate}
                      onSelect={(date) => {
                        setFromDate(date);
                        setIsDatePickerOpen(prev => ({ ...prev, from: false }));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover 
                  open={isDatePickerOpen.to} 
                  onOpenChange={(open) => setIsDatePickerOpen(prev => ({ ...prev, to: open }))}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-40 justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {toDate ? formatDateForApi(toDate) : "To Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={toDate}
                      onSelect={(date) => {
                        setToDate(date);
                        setIsDatePickerOpen(prev => ({ ...prev, to: false }));
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Dropdown Filters */}
              <div className="flex gap-2">
                <Select value={voucherTypeFilter} onValueChange={setVoucherTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select Voucher Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Voucher Types</SelectItem>
                    {voucherTypes.map((type) => (
                        <SelectItem key={type.id} value={type.name}>
                          {type.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>

                <Select value={syncFilter} onValueChange={setSyncFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Sync Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="synced">Synced</SelectItem>
                    <SelectItem value="not_synced">Not Synced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-4">
              {filteredEntries.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No stock journal entries found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your search criteria or filters.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredEntries.map((entry, index) => (
                <Card 
                  key={entry.transaction_id} 
                  className="card-hover-effect border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-500 transform hover:scale-[1.02]"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fade-in-up 0.6s ease-out forwards'
                  }}
                >
                  <CardContent className="p-6 relative overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -skew-y-1 transform scale-110 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <Hash className="h-4 w-4 text-gray-500" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {entry.transaction_id}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {entry.voucher_number}
                            </span>
                          </div>
                          {getVoucherTypeBadge(entry.voucher_type_name)}
                          {getSyncBadge(entry.is_tally_synced)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Date:</span>
                            <span className="text-gray-900 dark:text-white">{entry.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Type:</span>
                            <span className="text-gray-900 dark:text-white font-bold">{entry.voucher_type_name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(entry)}
                          className="flex items-center space-x-1 bg-gradient-to-r from-black to-gray-800 text-white border-2 border-black hover:from-gray-800 hover:to-black hover:scale-110 transition-all duration-300 hover:shadow-xl hover:shadow-black/50"
                        >
                          <Eye className="h-4 w-4 animate-pulse" />
                          <span className="font-semibold">View Details</span>
                        </Button>
                      </div>
                    </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            
            {/* Pagination */}
            {filteredEntries.length > 0 && (
              <Card className="mt-6">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>
                        Showing {filteredEntries.length} of {pagination.total_count} entries
                      </span>
                      <span>•</span>
                      <span>
                        Page {pagination.current_page} of {pagination.total_pages}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.current_page - 1)}
                        disabled={!pagination.has_previous}
                        className="flex items-center space-x-1"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </Button>
                      
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                          const pageNum = Math.max(1, pagination.current_page - 2) + i;
                          if (pageNum > pagination.total_pages) return null;
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={pageNum === pagination.current_page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={!pagination.has_next}
                        className="flex items-center space-x-1"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            </div>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Stock Journal Details - {selectedEntry?.transaction_id}</span>
            </DialogTitle>
            <DialogDescription>
              Detailed view of inventory entries for voucher {selectedEntry?.voucher_number}
            </DialogDescription>
          </DialogHeader>
          
          {isDetailLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader loadingText="Loading transaction details..." />
            </div>
          ) : selectedEntry && detailData?.data ? (
            <div className="space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-black shadow-xl">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-black dark:text-white">Transaction ID:</span>
                    <span className="text-sm text-black dark:text-white font-bold">{detailData.data.transaction_id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-black dark:text-white">Voucher Number:</span>
                    <span className="text-sm text-black dark:text-white font-bold">{detailData.data.voucher_number}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-black dark:text-white">Date:</span>
                    <span className="text-sm text-black dark:text-white font-bold">{detailData.data.date}</span>
                  </div>
                  {detailData?.data?.remarks && (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-black dark:text-white">Remarks:</span>
                      <span className="text-sm text-black dark:text-white font-bold">{detailData.data.remarks}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-black dark:text-white">Voucher Type:</span>
                    <span className="text-sm text-black dark:text-white font-bold">{detailData.data.voucher_type_name}</span>
                  </div>
                  {detailData?.data?.destination_godown && (
                    <div className="flex items-center space-x-2">
                      <Warehouse className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-black dark:text-white">Destination Godown:</span>
                      <span className="text-sm text-black dark:text-white font-bold">{detailData.data.destination_godown}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-black dark:text-white">Tally Sync:</span>
                      {getSyncBadge(selectedEntry.is_tally_synced)}
                    </div>
                    {!selectedEntry.is_tally_synced && (
                      <Button
                        onClick={() => handleSyncToTally(selectedEntry.transaction_id)}
                        disabled={syncMutation.isPending}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        size="sm"
                      >
                        {syncMutation.isPending ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RotateCw className="h-4 w-4 mr-2" />
                        )}
                        Sync Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Inventory Entries In */}
              {detailData.data.inventory_entries_in && detailData.data.inventory_entries_in.length > 0 && (
                <div style={{animation: 'slide-in-left 0.6s ease-out forwards'}}>
                  <h4 className="flex items-center space-x-2 text-lg font-semibold mb-4 bg-black text-white p-3 rounded-lg border-2 border-green-500 shadow-lg">
                    <ArrowRight className="h-5 w-5 animate-bounce" />
                    <span>Inventory Entries In</span>
                  </h4>
                  <div className="space-y-4">
                    {detailData.data.inventory_entries_in.map((entry, index) => (
                      <Card 
                        key={index} 
                        className="bg-white dark:bg-gray-900 border-2 border-green-500 card-hover-effect transform transition-all duration-500 hover:scale-105"
                        style={{
                          animationDelay: `${index * 200}ms`,
                          animation: 'fade-in-up 0.6s ease-out forwards'
                        }}
                      >
                        <CardContent className="p-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/10 to-transparent -skew-y-1 transform scale-110 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-bold text-black dark:text-white text-lg">
                                {entry.stock_item}
                              </h5>
                              <Badge variant="outline" className="bg-white text-black border-green-500 border-2 font-bold text-lg px-3 py-1 pulse-glow">
                                {entry.actual_qty?.full_text || 'N/A'}
                              </Badge>
                            </div>
                            {entry.batch_allocations && entry.batch_allocations.length > 0 && (
                              <div className="space-y-2">
                                {entry.batch_allocations.map((batch, batchIndex) => (
                                  <div key={batchIndex} className="flex items-center justify-between text-sm bg-white dark:bg-gray-800 text-black dark:text-white p-3 rounded border-2 border-green-500 hover:scale-105 transition-transform duration-300">
                                    <div className="flex items-center space-x-2">
                                      <Package className="h-4 w-4 text-green-400 animate-pulse" />
                                      <span className="font-bold text-black dark:text-white">{batch.batch_name}</span>
                                      <span className="text-green-500">•</span>
                                      <span className="text-black dark:text-white">{batch.godown}</span>
                                    </div>
                                    <span className="font-bold text-black dark:text-white">{batch.actual_qty?.full_text || 'N/A'}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Inventory Entries Out */}
              {detailData.data.inventory_entries_out && detailData.data.inventory_entries_out.length > 0 && (
                <div style={{animation: 'slide-in-right 0.6s ease-out forwards'}}>
                  <h4 className="flex items-center space-x-2 text-lg font-semibold mb-4 bg-black text-white p-3 rounded-lg border-2 border-red-500 shadow-lg">
                    <ArrowLeft className="h-5 w-5 animate-bounce" />
                    <span>Inventory Entries Out</span>
                  </h4>
                  <div className="space-y-4">
                    {detailData.data.inventory_entries_out.map((entry, index) => (
                      <Card 
                        key={index} 
                        className="bg-white dark:bg-gray-900 border-2 border-red-500 card-hover-effect transform transition-all duration-500 hover:scale-105"
                        style={{
                          animationDelay: `${index * 200}ms`,
                          animation: 'fade-in-up 0.6s ease-out forwards'
                        }}
                      >
                        <CardContent className="p-4 relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent -skew-y-1 transform scale-110 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-bold text-black dark:text-white text-lg">
                                {entry.stock_item}
                              </h5>
                              <Badge variant="outline" className="bg-white text-black border-red-500 border-2 font-bold text-lg px-3 py-1 pulse-glow">
                                {entry.actual_qty?.full_text || 'N/A'}
                              </Badge>
                            </div>
                            {entry.batch_allocations && entry.batch_allocations.length > 0 && (
                              <div className="space-y-2">
                                {entry.batch_allocations.map((batch, batchIndex) => (
                                  <div key={batchIndex} className="flex items-center justify-between text-sm bg-white dark:bg-gray-800 text-black dark:text-white p-3 rounded border-2 border-red-500 hover:scale-105 transition-transform duration-300">
                                    <div className="flex items-center space-x-2">
                                      <Package className="h-4 w-4 text-red-400 animate-pulse" />
                                      <span className="font-bold text-black dark:text-white">{batch.batch_name}</span>
                                      <span className="text-red-500">•</span>
                                      <span className="text-black dark:text-white">{batch.godown}</span>
                                    </div>
                                    <span className="font-bold text-black dark:text-white">{batch.actual_qty?.full_text || 'N/A'}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Timestamps */}
              {(detailData.data.created_at || detailData.data.updated_at) && (
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  {detailData.data.created_at && <span>Created: {detailData.data.created_at}</span>}
                  {detailData.data.updated_at && <span>Updated: {detailData.data.updated_at}</span>}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">No details available for this transaction.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}