import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { useLocation } from "wouter";
import { useIsMobile } from "../hooks/use-mobile";
import Sidebar from "../components/layout/sidebar";
import MobileSidebar from "../components/layout/mobile-sidebar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { 
  Menu, 
  Search, 
  Eye, 
  FileText, 
  Calendar,
  CalendarDays,
  Filter,
  Users,
  Weight,
  Package,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import { AuthService } from "../lib/auth";
import { apiRequest } from "../lib/queryClient";
import Loader from "../components/common/loader";

const API_BASE_URL = "http://127.0.0.1:8096";

export default function HamaliReports() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [toDate, setToDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const isMobile = useIsMobile();
  const [, setLocation] = useLocation();

  // Fetch hamali entries from API
  const { data: hamaliEntries = [], isLoading, error, refetch } = useQuery({
    queryKey: [`${API_BASE_URL}/api/process/get-hamali/`],
    queryFn: async () => {
      const response = await apiRequest('GET', `${API_BASE_URL}/api/process/get-hamali/`);
      const data = await response.json();
      return data.data || [];
    },
  });

  // Filter entries based on search term and date range
  const filteredEntries = hamaliEntries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.hamali_types_used.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Simple date filtering (you might want to improve this based on actual date format)
    const entryDate = new Date(entry.date.split('-').reverse().join('-')); // Convert DD-MM-YYYY to YYYY-MM-DD
    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);
    
    const matchesDateRange = entryDate >= fromDateObj && entryDate <= toDateObj;
    
    return matchesSearch && matchesDateRange;
  });

  const handleViewEntries = (entryId) => {
    setLocation(`/reports/hamali/${entryId}`);
  };

  if (isLoading) {
    return <Loader text="Loading Hamali reports..." />;
  }

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
              <FileText className="h-8 w-8 text-gray-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Hamali Reports</h1>
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Search
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Search by date or hamali type..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <div>
                <Label htmlFor="fromDate" className="text-sm font-medium text-gray-700">
                  From Date
                </Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="toDate" className="text-sm font-medium text-gray-700">
                  To Date
                </Label>
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredEntries.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{filteredEntries.reduce((sum, entry) => sum + parseFloat(entry.total_hamali || 0), 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Packets</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredEntries.reduce((sum, entry) => sum + (entry.total_packets || 0), 0).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
                  <Weight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {filteredEntries.reduce((sum, entry) => {
                      const weight = parseFloat(entry.total_weight?.split(' ')[0] || 0);
                      return sum + weight;
                    }, 0).toFixed(2)} Qtl
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hamali Entries Table */}
            <Card className="border-2 border-black shadow-lg">
              <CardHeader className="bg-gray-50 border-b-2 border-black">
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <FileText className="h-6 w-6 text-black" />
                  Hamali Daily Entries
                  <Badge variant="secondary" className="ml-2 bg-black text-white">
                    {filteredEntries.length} entries
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hamali entries found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-medium text-gray-900">Date</th>
                          <th className="text-left p-4 font-medium text-gray-900">Entries</th>
                          <th className="text-left p-4 font-medium text-gray-900">Amount</th>
                          <th className="text-left p-4 font-medium text-gray-900">Packets</th>
                          <th className="text-left p-4 font-medium text-gray-900">Weight</th>
                          <th className="text-left p-4 font-medium text-gray-900">Status</th>
                          <th className="text-center p-4 font-medium text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEntries.map((entry) => (
                          <tr key={entry.id} className="border-b-2 border-gray-200 hover:bg-gray-50 hover:border-black transition-colors">
                            <td className="p-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="font-medium">{entry.date}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                <span>{entry.completed_details}/{entry.total_details}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                                <span className="font-medium">₹{parseFloat(entry.total_hamali).toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <Package className="h-4 w-4 text-gray-400 mr-2" />
                                <span>{entry.total_packets}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center">
                                <Weight className="h-4 w-4 text-gray-400 mr-2" />
                                <span>{entry.total_weight}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge variant={entry.is_finalized ? "default" : "secondary"}>
                                {entry.is_finalized ? (
                                  <><CheckCircle className="h-3 w-3 mr-1" />Finalized</>
                                ) : (
                                  <><Clock className="h-3 w-3 mr-1" />Pending</>
                                )}
                              </Badge>
                            </td>
                            <td className="p-4 text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewEntries(entry.id)}
                                className="flex items-center gap-1 border-2 border-black hover:bg-black hover:text-white transition-colors font-semibold"
                              >
                                <Eye className="h-4 w-4" />
                                View Entries
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}