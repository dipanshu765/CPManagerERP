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
import { Search, ChevronLeft, ChevronRight, Warehouse, CheckCircle, XCircle, Menu } from "lucide-react";
import CommonLoader from "@/components/common/loader";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 25;

export default function GodownMasters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const fetchGodowns = async ({ queryKey }) => {
    const [, { search, branch, page }] = queryKey;
    
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (branch && branch !== "All") params.append("branch", branch);
    params.append("page", page.toString());
    params.append("limit", ITEMS_PER_PAGE.toString());

    const token = AuthService.getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8096'}/api/get-godowns/?${params}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/get-godowns', { 
      search: searchTerm, 
      branch: selectedBranch,
      page: currentPage 
    }],
    queryFn: fetchGodowns,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedBranch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading godowns",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const godowns = data?.data || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd-MM-yyyy HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  const branches = ["All", "Rayapur", "Tarihal"];

  if (isLoading) {
    return <CommonLoader text="Loading godown masters..." />;
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
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Godown Masters</h1>
            <div className="w-10" />
          </div>
        )}

        <div className="flex-1 p-6 overflow-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Godown Masters</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage and view all godown information</p>
      </div>

      {/* Filters Section */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Search Godowns
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

            {/* Branch Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Branch
              </label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
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
              <div className="flex items-center space-x-2 h-10 px-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                <Warehouse className="h-4 w-4 text-gray-500" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {totalItems} godowns
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Godowns Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Warehouse className="h-5 w-5" />
            <span>Godown List</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {godowns.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {godowns.map((godown, index) => (
                      <TableRow key={godown.id}>
                        <TableCell className="font-medium">
                          {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {godown.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {godown.company}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-900 dark:text-white">
                            {godown.branch}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={godown.is_active ? "default" : "secondary"}
                            className={godown.is_active ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" : ""}
                          >
                            {godown.is_active ? (
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Active</span>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1">
                                <XCircle className="h-3 w-3" />
                                <span>Inactive</span>
                              </div>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-900 dark:text-white">
                            {formatDate(godown.created_at)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)} to{" "}
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems} results
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
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="w-10"
                          >
                            {page}
                          </Button>
                        );
                      })}
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
              <Warehouse className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No godowns found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                No godowns match your current filters.
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