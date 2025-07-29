import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useIsMobile } from "../hooks/use-mobile";
import Sidebar from "../components/layout/sidebar";
import MobileSidebar from "../components/layout/mobile-sidebar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog";
import { 
  Menu, 
  ArrowLeft,
  FileText, 
  Calendar,
  Users,
  Weight,
  Package,
  DollarSign,
  MapPin,
  Truck,
  User,
  Building,
  Eye,
  CheckCircle,
  Clock
} from "lucide-react";
import { AuthService } from "../lib/auth";
import { apiRequest } from "../lib/queryClient";
import Loader from "../components/common/loader";

const API_BASE_URL = "http://127.0.0.1:8096";

export default function HamaliDetails() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [, params] = useRoute("/reports/hamali/:id");
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  
  const entryId = params?.id;

  // Fetch hamali entry details from API
  const { data: hamaliDetails, isLoading, error } = useQuery({
    queryKey: [`${API_BASE_URL}/api/process/get-hamali/${entryId}/`],
    queryFn: async () => {
      const response = await apiRequest('GET', `${API_BASE_URL}/api/process/get-hamali/${entryId}/`);
      const data = await response.json();
      return data.data || null;
    },
    enabled: !!entryId,
  });

  // Fetch entry details for popup
  const { data: entryDetails, isLoading: isLoadingDetails } = useQuery({
    queryKey: [`${API_BASE_URL}/api/process/entry-details/${selectedEntryId}/`],
    queryFn: async () => {
      const response = await apiRequest('GET', `${API_BASE_URL}/api/process/entry-details/${selectedEntryId}/`);
      const data = await response.json();
      return data.data || null;
    },
    enabled: !!selectedEntryId,
  });

  const handleBack = () => {
    setLocation('/reports/hamali');
  };

  const handleViewDetails = (entryDetailId) => {
    setSelectedEntryId(entryDetailId);
    setIsDetailModalOpen(true);
  };

  if (isLoading) {
    return <Loader text="Loading Hamali details..." />;
  }

  if (!hamaliDetails) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Hamali details not found</p>
          <Button variant="outline" onClick={handleBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
        </div>
      </div>
    );
  }

  const { date, summary_stats, entry_details } = hamaliDetails;

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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="mr-4 flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <FileText className="h-8 w-8 text-gray-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Hamali Details</h1>
                <p className="text-sm text-gray-500">Date: {date}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Details</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary_stats.total_details}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary_stats.completed_details}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Packets</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary_stats.total_packets}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Weight</CardTitle>
                  <Weight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary_stats.total_weight}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹{parseFloat(summary_stats.total_amount).toLocaleString()}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Labours</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary_stats.total_labours}</div>
                </CardContent>
              </Card>
            </div>

            {/* Entry Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Entry Details
                  <Badge variant="secondary" className="ml-2">
                    {entry_details.length} entries
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {entry_details.map((entry) => (
                    <Card key={entry.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Voucher Number</span>
                              <p className="text-lg font-semibold">{entry.voucher_no}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Hamali Type</span>
                              <p className="text-sm">{entry.hamali_type.name}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Supervised By</span>
                              <p className="text-sm">{entry.supervised_by}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Labour Count</span>
                              <p className="text-sm font-semibold">{entry.labour_count}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Total Packets</span>
                              <p className="text-sm font-semibold">{entry.total_packets}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Total Weight</span>
                              <p className="text-sm font-semibold">{entry.total_weight}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <span className="text-sm font-medium text-gray-500">Hamali Amount</span>
                              <p className="text-lg font-semibold text-green-600">₹{parseFloat(entry.hamali_amount).toLocaleString()}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-500">Applied Rate</span>
                              <p className="text-sm font-semibold">₹{entry.applied_rate} per {entry.per_unit.name}</p>
                            </div>
                          </div>
                        </div>

                        {/* View Details Button */}
                        <div className="mt-6 pt-4 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(entry.id)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Entry Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hamali Entry Details</DialogTitle>
            <DialogDescription>
              Detailed information for entry ID: {selectedEntryId}
            </DialogDescription>
          </DialogHeader>
          
          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <Loader text="Loading entry details..." />
            </div>
          ) : entryDetails ? (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Voucher Number</span>
                  <p className="text-lg font-semibold">{entryDetails.voucher_no}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <Badge variant={entryDetails.is_completed ? "default" : "secondary"}>
                    {entryDetails.status}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Hamali Type</span>
                  <p className="text-sm">{entryDetails.hamali_type.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Applied Rate</span>
                  <p className="text-sm">₹{entryDetails.applied_rate} per {entryDetails.per_unit.name}</p>
                </div>
              </div>

              {/* Transfer Information */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold mb-3">Transfer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Type</span>
                    <p className="text-sm">{entryDetails.transfer_info.type_display}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">From Location</span>
                    <p className="text-sm">{entryDetails.transfer_info.from_location}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">To Location</span>
                    <p className="text-sm">{entryDetails.transfer_info.to_location}</p>
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold mb-3">Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <Package className="h-6 w-6 mx-auto mb-1 text-blue-600" />
                    <p className="text-xl font-bold">{entryDetails.total_packets}</p>
                    <p className="text-sm text-gray-600">Total Packets</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <Weight className="h-6 w-6 mx-auto mb-1 text-green-600" />
                    <p className="text-xl font-bold">{entryDetails.total_weight_display}</p>
                    <p className="text-sm text-gray-600">Total Weight</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <DollarSign className="h-6 w-6 mx-auto mb-1 text-yellow-600" />
                    <p className="text-xl font-bold">₹{parseFloat(entryDetails.hamali_amount).toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Hamali Amount</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded">
                    <Users className="h-6 w-6 mx-auto mb-1 text-purple-600" />
                    <p className="text-xl font-bold">{entryDetails.total_labours_count}</p>
                    <p className="text-sm text-gray-600">Labour Count</p>
                  </div>
                </div>
              </div>

              {/* Stock Items */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-semibold mb-3">Stock Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-700">Item Name</th>
                        <th className="text-center p-3 font-medium text-gray-700">Packets</th>
                        <th className="text-center p-3 font-medium text-gray-700">Weight/Packet</th>
                        <th className="text-center p-3 font-medium text-gray-700">Total Weight</th>
                        <th className="text-left p-3 font-medium text-gray-700">Remarks</th>
                        <th className="text-center p-3 font-medium text-gray-700">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entryDetails.stock_items.map((item) => (
                        <tr key={item.id} className="border-t hover:bg-gray-50">
                          <td className="p-3 font-medium">{item.item_name}</td>
                          <td className="p-3 text-center">{item.packets_count}</td>
                          <td className="p-3 text-center">{item.weight_per_packet}</td>
                          <td className="p-3 text-center font-medium">{item.total_weight}</td>
                          <td className="p-3 text-gray-600">{item.item_remarks}</td>
                          <td className="p-3 text-center text-xs text-gray-500">{item.created_at}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Remarks */}
              {entryDetails.remarks && (
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold mb-2">Remarks</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{entryDetails.remarks}</p>
                </div>
              )}

              {/* Work Description */}
              {entryDetails.work_description && (
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold mb-2">Work Description</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{entryDetails.work_description}</p>
                </div>
              )}

              <div className="border-t pt-4 text-xs text-gray-500">
                <p>Created: {entryDetails.created_at} | Updated: {entryDetails.updated_at}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Entry details not found</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}