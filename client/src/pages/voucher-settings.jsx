import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/lib/auth";
import { Search, ChevronLeft, ChevronRight, Settings, Menu, CheckCircle, XCircle, Building2, Calendar, Package2, GitBranch, ArrowRightLeft, ArrowLeftRight, Target } from "lucide-react";
import CommonLoader from "@/components/common/loader";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 50;

export default function VoucherSettings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchVouchers = async ({ queryKey }) => {
    const [, { search, status, page }] = queryKey;
    
    const token = AuthService.getAccessToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (status !== "All") {
      params.append("is_active", status === "Active" ? "true" : "false");
    }
    params.append("page", page.toString());
    params.append("limit", ITEMS_PER_PAGE.toString());

    const url = `http://127.0.0.1:8096/api/get-voucher-types/${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Calculate pagination based on filtered data
    const allVouchers = data.data || [];
    const totalItems = allVouchers.length;
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = allVouchers.slice(startIndex, endIndex);
    
    return {
      data: paginatedData,
      total: totalItems,
      page: page,
      totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE)
    };
  };

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/get-voucher-types', { search: searchTerm, status: selectedStatus, page: currentPage }],
    queryFn: fetchVouchers,
    enabled: !!AuthService.getAccessToken(),
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading voucher settings",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const vouchers = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd-MM-yyyy");
    } catch (error) {
      return dateString?.split('T')[0] || "-";
    }
  };

  const statusOptions = ["All", "Active", "Inactive"];

  if (isLoading) {
    return <CommonLoader text="Loading voucher settings..." />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {!isMobile && <Sidebar />}
      <MobileSidebar 
        isOpen={isMobileSidebarOpen} 
        onClose={() => setIsMobileSidebarOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        {isMobile && (
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b p-4 flex items-center justify-between">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Voucher Settings</h1>
            <div className="w-10" />
          </div>
        )}

        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Voucher Settings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and view all voucher type configurations</p>
          </div>

          {/* Filters Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Search Vouchers
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="Select status" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Total Count */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Count
                  </label>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-blue-500" />
                    <Badge variant="secondary" className="text-lg font-semibold">
                      {totalItems} vouchers
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vouchers Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Voucher List</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vouchers.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Parent</TableHead>
                          <TableHead>Is Active</TableHead>
                          <TableHead>Is Batch</TableHead>
                          <TableHead>Add Bardan</TableHead>
                          <TableHead>In Source</TableHead>
                          <TableHead>In Destination</TableHead>
                          <TableHead>Created At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vouchers.map((voucher) => (
                          <TableRow key={voucher.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center space-x-2">
                                <Settings className="h-4 w-4 text-blue-500" />
                                <span>{voucher.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Building2 className="h-4 w-4 text-gray-500" />
                                <span>{voucher.parent || "-"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={voucher.is_active ? "default" : "secondary"}>
                                <div className="flex items-center space-x-1">
                                  {voucher.is_active ? (
                                    <CheckCircle className="h-3 w-3" />
                                  ) : (
                                    <XCircle className="h-3 w-3" />
                                  )}
                                  <span>{voucher.is_active ? "Active" : "Inactive"}</span>
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={voucher.is_batch ? "default" : "outline"}>
                                <div className="flex items-center space-x-1">
                                  <Package2 className="h-3 w-3" />
                                  <span>{voucher.is_batch ? "Yes" : "No"}</span>
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={voucher.add_bardan ? "default" : "outline"}>
                                <div className="flex items-center space-x-1">
                                  <GitBranch className="h-3 w-3" />
                                  <span>{voucher.add_bardan ? "Yes" : "No"}</span>
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={voucher.in_source ? "default" : "outline"}>
                                <div className="flex items-center space-x-1">
                                  <ArrowRightLeft className="h-3 w-3" />
                                  <span>{voucher.in_source ? "Yes" : "No"}</span>
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={voucher.in_destination ? "default" : "outline"}>
                                <div className="flex items-center space-x-1">
                                  <Target className="h-3 w-3" />
                                  <span>{voucher.in_destination ? "Yes" : "No"}</span>
                                </div>
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <span>{formatDate(voucher.created_at)}</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-gray-500">
                        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} vouchers
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = i + 1;
                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            );
                          })}
                          {totalPages > 5 && (
                            <>
                              <span className="px-2">...</span>
                              <Button
                                variant={currentPage === totalPages ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(totalPages)}
                              >
                                {totalPages}
                              </Button>
                            </>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Settings className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No vouchers found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No vouchers match your current filters.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}