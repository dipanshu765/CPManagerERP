import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useIsMobile } from "../hooks/use-mobile";
import Sidebar from "../components/layout/sidebar";
import MobileSidebar from "../components/layout/mobile-sidebar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
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

  const handleBack = () => {
    setLocation('/reports/hamali');
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
                      <CardHeader>
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div>
                              <h3 className="text-lg font-semibold">Voucher: {entry.voucher_no}</h3>
                              <p className="text-sm text-gray-600">{entry.hamali_type.name}</p>
                            </div>
                            <Badge variant={entry.is_completed ? "default" : "secondary"}>
                              {entry.is_completed ? (
                                <><CheckCircle className="h-3 w-3 mr-1" />{entry.status}</>
                              ) : (
                                <><Clock className="h-3 w-3 mr-1" />Pending</>
                              )}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline">
                              <Package className="h-3 w-3 mr-1" />
                              {entry.total_packets} packets
                            </Badge>
                            <Badge variant="outline">
                              <Weight className="h-3 w-3 mr-1" />
                              {entry.total_weight}
                            </Badge>
                            <Badge variant="outline">
                              <DollarSign className="h-3 w-3 mr-1" />
                              ₹{parseFloat(entry.hamali_amount).toLocaleString()}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">Supervised by:</span>
                              <span className="text-sm">{entry.supervised_by}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">Transfer:</span>
                              <span className="text-sm">{entry.transfer_info.type} - {entry.transfer_info.from_location} → {entry.transfer_info.to_location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">Labour Count:</span>
                              <span className="text-sm">{entry.labour_count}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Weight className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">Applied Rate:</span>
                              <span className="text-sm">₹{entry.applied_rate} per {entry.per_unit.name}</span>
                            </div>
                            {entry.vehicle_number && (
                              <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium">Vehicle:</span>
                                <span className="text-sm">{entry.vehicle_number}</span>
                              </div>
                            )}
                            {entry.driver_name && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium">Driver:</span>
                                <span className="text-sm">{entry.driver_name}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Stock Items */}
                        <div className="border-t pt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Stock Items</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left p-2 font-medium text-gray-700">Item Name</th>
                                  <th className="text-center p-2 font-medium text-gray-700">Packets</th>
                                  <th className="text-center p-2 font-medium text-gray-700">Weight/Packet</th>
                                  <th className="text-center p-2 font-medium text-gray-700">Total Weight</th>
                                  <th className="text-left p-2 font-medium text-gray-700">Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {entry.stock_items.map((item) => (
                                  <tr key={item.id} className="border-b">
                                    <td className="p-2 font-medium">{item.item_name}</td>
                                    <td className="p-2 text-center">{item.packets_count}</td>
                                    <td className="p-2 text-center">{item.weight_per_packet}</td>
                                    <td className="p-2 text-center font-medium">{item.total_weight}</td>
                                    <td className="p-2 text-gray-600">{item.item_remarks}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Remarks */}
                        {entry.remarks && (
                          <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Remarks</h4>
                            <p className="text-sm text-gray-600">{entry.remarks}</p>
                          </div>
                        )}

                        {/* View Details Button */}
                        <div className="border-t pt-4 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled
                            className="flex items-center gap-1 opacity-60 cursor-not-allowed"
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
    </div>
  );
}