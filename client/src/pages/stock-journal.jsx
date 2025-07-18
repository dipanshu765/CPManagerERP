import { useState, useEffect } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import Sidebar from "../components/layout/sidebar";
import MobileSidebar from "../components/layout/mobile-sidebar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
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
  Hash
} from "lucide-react";
import Loader from "../components/common/loader";

// Static data based on the API response
const stockJournalData = [
  {
    transaction_id: "TR000011",
    voucher_type_name: "Sj Production [R]",
    voucher_number: "NAV006",
    date: "18-07-2025",
    effective_date: "18-07-2025",
    is_tally_synced: true,
    created_at: "2025-07-18 12:31:53",
    updated_at: "2025-07-18 12:31:53"
  },
  {
    transaction_id: "TR000010",
    voucher_type_name: "Sj Production [R]",
    voucher_number: "NAV005",
    date: "18-07-2025",
    effective_date: "18-07-2025",
    is_tally_synced: true,
    created_at: "2025-07-18 12:27:06",
    updated_at: "2025-07-18 12:27:07"
  },
  {
    transaction_id: "TR000009",
    voucher_type_name: "Sj Production [R]",
    voucher_number: "SHI005",
    date: "18-07-2025",
    effective_date: "18-07-2025",
    is_tally_synced: true,
    created_at: "2025-07-18 12:15:19",
    updated_at: "2025-07-18 12:15:19"
  },
  {
    transaction_id: "TR000008",
    voucher_type_name: "Sj Consumption [R]",
    voucher_number: "NAV004",
    date: "18-07-2025",
    effective_date: "18-07-2025",
    is_tally_synced: true,
    created_at: "2025-07-18 11:51:04",
    updated_at: "2025-07-18 11:51:04"
  },
  {
    transaction_id: "TR000007",
    voucher_type_name: "Sj Consumption [R]",
    voucher_number: "NAV003",
    date: "18-07-2025",
    effective_date: "18-07-2025",
    is_tally_synced: true,
    created_at: "2025-07-18 11:43:19",
    updated_at: "2025-07-18 11:43:19"
  },
  {
    transaction_id: "TR000006",
    voucher_type_name: "Sj Production [R]",
    voucher_number: "SHI004",
    date: "18-07-2025",
    effective_date: "18-07-2025",
    is_tally_synced: true,
    created_at: "2025-07-18 11:41:03",
    updated_at: "2025-07-18 11:41:03"
  },
  {
    transaction_id: "TR000005",
    voucher_type_name: "Sj Consumption [R]",
    voucher_number: "NAV002",
    date: "18-07-2025",
    effective_date: "18-07-2025",
    is_tally_synced: true,
    created_at: "2025-07-18 11:38:45",
    updated_at: "2025-07-18 11:38:45"
  },
  {
    transaction_id: "TR000004",
    voucher_type_name: "Sj Consumption [R]",
    voucher_number: "NAV001",
    date: "18-07-2025",
    effective_date: "18-07-2025",
    is_tally_synced: true,
    created_at: "2025-07-18 11:30:35",
    updated_at: "2025-07-18 11:30:35"
  },
  {
    transaction_id: "TR000003",
    voucher_type_name: "Sj Consumption [R]",
    voucher_number: "SHI003",
    date: "18-07-2025",
    effective_date: "18-07-2025",
    is_tally_synced: true,
    created_at: "2025-07-18 11:30:14",
    updated_at: "2025-07-18 11:30:14"
  },
  {
    transaction_id: "TR000002",
    voucher_type_name: "Sj Consumption [R]",
    voucher_number: "SHI002",
    date: "18-07-2025",
    effective_date: "18-07-2025",
    is_tally_synced: true,
    created_at: "2025-07-18 11:30:11",
    updated_at: "2025-07-18 11:30:11"
  },
  {
    transaction_id: "TR000001",
    voucher_type_name: "Sj Consumption [R]",
    voucher_number: "SHI001",
    date: "18-07-2025",
    effective_date: "18-07-2025",
    is_tally_synced: true,
    created_at: "2025-07-18 10:49:45",
    updated_at: "2025-07-18 10:49:46"
  }
];

// Static detail data based on the API response
const stockJournalDetailData = {
  transaction_id: "TR000001",
  voucher_type_name: "Sj Consumption [R]",
  voucher_number: "SHI001",
  remarks: "",
  date: "2025-07-18",
  effective_date: "2025-07-18",
  destination_godown: "Godown No 1",
  inventory_entries_in: [
    {
      stock_item: "Process Gramdall Loose Rayapur [15.1.24]",
      actual_qty: {
        primary_qty: 250.0,
        primary_unit: "bags",
        secondary_qty: 250.0,
        secondary_unit: "qtl",
        full_text: "250.00 bags = 250.00 qtl"
      },
      batch_allocations: [
        {
          batch_name: "Primary",
          godown: "Godown No 1",
          destination_godown: "Godown No 1",
          actual_qty: {
            primary_qty: 250.0,
            primary_unit: "bags",
            secondary_qty: 250.0,
            secondary_unit: "qtl",
            full_text: "250 bags = 250.0 qtl"
          }
        }
      ]
    },
    {
      stock_item: "Bardan Reject",
      actual_qty: {
        primary_qty: 500.0,
        primary_unit: "pkt",
        secondary_qty: 0.0,
        secondary_unit: "",
        full_text: "500.00 pkt"
      },
      batch_allocations: [
        {
          batch_name: "Primary",
          godown: "A Main Location",
          destination_godown: "A Main Location",
          actual_qty: {
            primary_qty: 500.0,
            primary_unit: "pkt",
            secondary_qty: 0.0,
            secondary_unit: "",
            full_text: "500 pkt"
          }
        }
      ]
    }
  ],
  inventory_entries_out: [
    {
      stock_item: "Raw Turdal Patka [Wb Gold ] New [50kg]",
      actual_qty: {
        primary_qty: 370.0,
        primary_unit: "pkt",
        secondary_qty: 185.0,
        secondary_unit: "qtl",
        full_text: "370.00 pkt = 185.00 qtl"
      },
      batch_allocations: [
        {
          batch_name: "0640/500/KAUSHAL/24.3",
          godown: "Godown No 2",
          destination_godown: "Godown No 2",
          actual_qty: {
            primary_qty: 200.0,
            primary_unit: "pkt",
            secondary_qty: 100.0,
            secondary_unit: "qtl",
            full_text: "200 pkt = 100.0 qtl"
          }
        },
        {
          batch_name: "5004/170/BABA/19.3.25",
          godown: "Godown No 2",
          destination_godown: "Godown No 2",
          actual_qty: {
            primary_qty: 70.0,
            primary_unit: "pkt",
            secondary_qty: 35.0,
            secondary_unit: "qtl",
            full_text: "70 pkt = 35.0 qtl"
          }
        },
        {
          batch_name: "5057/500/KAUSHAL/2.4.25",
          godown: "Godown No 2",
          destination_godown: "Godown No 2",
          actual_qty: {
            primary_qty: 100.0,
            primary_unit: "pkt",
            secondary_qty: 50.0,
            secondary_unit: "qtl",
            full_text: "100 pkt = 50.0 qtl"
          }
        }
      ]
    }
  ],
  created_at: "2025-07-18 10:49:45",
  updated_at: "2025-07-18 10:49:46"
};

export default function StockJournal() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [voucherTypeFilter, setVoucherTypeFilter] = useState("all");
  const [syncFilter, setSyncFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Simulate loading stock journal data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredEntries = stockJournalData.filter(entry => {
    const matchesSearch = entry.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.voucher_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.voucher_type_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesVoucherType = voucherTypeFilter === "all" || entry.voucher_type_name.includes(voucherTypeFilter);
    const matchesSync = syncFilter === "all" || 
                       (syncFilter === "synced" && entry.is_tally_synced) ||
                       (syncFilter === "not_synced" && !entry.is_tally_synced);
    
    return matchesSearch && matchesVoucherType && matchesSync;
  });

  const handleViewDetails = (entry) => {
    setSelectedEntry({...stockJournalDetailData, ...entry});
    setIsDetailModalOpen(true);
  };

  const getVoucherTypeBadge = (voucherType) => {
    if (voucherType.includes("Production")) {
      return <Badge variant="default" className="bg-gradient-to-r from-green-500 to-green-600 text-white border-black border-2 badge-bounce hover:from-green-600 hover:to-green-700 transition-all duration-300">Production</Badge>;
    } else if (voucherType.includes("Consumption")) {
      return <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-black border-2 badge-bounce hover:from-blue-600 hover:to-blue-700 transition-all duration-300">Consumption</Badge>;
    }
    return <Badge variant="secondary" className="border-black border-2">{voucherType}</Badge>;
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

  if (isLoading) {
    return <Loader loadingText="Loading stock journal reports..." />;
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
      <div className="flex-1 flex flex-col overflow-hidden">
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
          <div className="flex flex-col sm:flex-row gap-4">
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
              <Select value={voucherTypeFilter} onValueChange={setVoucherTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Voucher Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Consumption">Consumption</SelectItem>
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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900">
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
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Date:</span>
                            <span className="text-gray-900 dark:text-white">{entry.date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Effective:</span>
                            <span className="text-gray-900 dark:text-white">{entry.effective_date}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-600 dark:text-gray-400">Type:</span>
                            <span className="text-gray-900 dark:text-white">{entry.voucher_type_name}</span>
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
          
          {selectedEntry && (
            <div className="space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg border-2 border-black shadow-xl">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-black dark:text-white">Transaction ID:</span>
                    <span className="text-sm text-black dark:text-white font-bold">{selectedEntry.transaction_id}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-black dark:text-white">Voucher Number:</span>
                    <span className="text-sm text-black dark:text-white font-bold">{selectedEntry.voucher_number}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-black dark:text-white">Date:</span>
                    <span className="text-sm text-black dark:text-white font-bold">{selectedEntry.date}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-black dark:text-white">Voucher Type:</span>
                    <span className="text-sm text-black dark:text-white font-bold">{selectedEntry.voucher_type_name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Warehouse className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-black dark:text-white">Destination Godown:</span>
                    <span className="text-sm text-black dark:text-white font-bold">{selectedEntry.destination_godown}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-black dark:text-white">Tally Sync:</span>
                    {getSyncBadge(selectedEntry.is_tally_synced)}
                  </div>
                </div>
              </div>

              {/* Inventory Entries In */}
              {selectedEntry.inventory_entries_in && selectedEntry.inventory_entries_in.length > 0 && (
                <div style={{animation: 'slide-in-left 0.6s ease-out forwards'}}>
                  <h4 className="flex items-center space-x-2 text-lg font-semibold mb-4 bg-black text-white p-3 rounded-lg border-2 border-green-500 shadow-lg">
                    <ArrowRight className="h-5 w-5 animate-bounce" />
                    <span>Inventory Entries In</span>
                  </h4>
                  <div className="space-y-4">
                    {selectedEntry.inventory_entries_in.map((entry, index) => (
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
                                {entry.actual_qty.full_text}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {entry.batch_allocations.map((batch, batchIndex) => (
                                <div key={batchIndex} className="flex items-center justify-between text-sm bg-white dark:bg-gray-800 text-black dark:text-white p-3 rounded border-2 border-green-500 hover:scale-105 transition-transform duration-300">
                                  <div className="flex items-center space-x-2">
                                    <Package className="h-4 w-4 text-green-400 animate-pulse" />
                                    <span className="font-bold text-black dark:text-white">{batch.batch_name}</span>
                                    <span className="text-green-500">•</span>
                                    <span className="text-black dark:text-white">{batch.godown}</span>
                                  </div>
                                  <span className="font-bold text-black dark:text-white">{batch.actual_qty.full_text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Inventory Entries Out */}
              {selectedEntry.inventory_entries_out && selectedEntry.inventory_entries_out.length > 0 && (
                <div style={{animation: 'slide-in-right 0.6s ease-out forwards'}}>
                  <h4 className="flex items-center space-x-2 text-lg font-semibold mb-4 bg-black text-white p-3 rounded-lg border-2 border-red-500 shadow-lg">
                    <ArrowLeft className="h-5 w-5 animate-bounce" />
                    <span>Inventory Entries Out</span>
                  </h4>
                  <div className="space-y-4">
                    {selectedEntry.inventory_entries_out.map((entry, index) => (
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
                                {entry.actual_qty.full_text}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              {entry.batch_allocations.map((batch, batchIndex) => (
                                <div key={batchIndex} className="flex items-center justify-between text-sm bg-white dark:bg-gray-800 text-black dark:text-white p-3 rounded border-2 border-red-500 hover:scale-105 transition-transform duration-300">
                                  <div className="flex items-center space-x-2">
                                    <Package className="h-4 w-4 text-red-400 animate-pulse" />
                                    <span className="font-bold text-black dark:text-white">{batch.batch_name}</span>
                                    <span className="text-red-500">•</span>
                                    <span className="text-black dark:text-white">{batch.godown}</span>
                                  </div>
                                  <span className="font-bold text-black dark:text-white">{batch.actual_qty.full_text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* Timestamps */}
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Created: {selectedEntry.created_at}</span>
                <span>Updated: {selectedEntry.updated_at}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}