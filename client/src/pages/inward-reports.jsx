import { useState } from "react";
import { useIsMobile } from "../hooks/use-mobile";
import Sidebar from "../components/layout/sidebar";
import MobileSidebar from "../components/layout/mobile-sidebar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { 
  Menu, 
  Search, 
  Eye, 
  FileText, 
  Calendar,
  Truck,
  Weight,
  User,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Package
} from "lucide-react";
import { inwardEntriesData, inwardEntryDetail, supervisorList, godownList } from "../lib/static-data";

export default function InwardReports() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [selectedSupervisor, setSelectedSupervisor] = useState("");
  const [selectedGodown, setSelectedGodown] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const isMobile = useIsMobile();

  const filteredEntries = inwardEntriesData.filter(entry => {
    const matchesSearch = entry.sl_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.party_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.vehicle_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.broker_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (entry) => {
    setSelectedEntry({...inwardEntryDetail, ...entry});
    setIsDetailModalOpen(true);
  };

  const handleStatusChange = (item, status) => {
    setSelectedItem(item);
    setNewStatus(status);
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = () => {
    // Here you would normally make an API call to update the status
    console.log("Status updated:", {
      item: selectedItem,
      status: newStatus,
      supervisor: selectedSupervisor,
      godown: selectedGodown,
      reason: rejectionReason
    });
    
    // Reset form
    setIsStatusModalOpen(false);
    setSelectedItem(null);
    setNewStatus("");
    setSelectedSupervisor("");
    setSelectedGodown("");
    setRejectionReason("");
  };

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
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
              <div className="flex items-center space-x-2">
                <FileText className="h-6 w-6 text-gray-600" />
                <h1 className="text-2xl font-bold text-gray-900">Inward Reports</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">18-07-2025</span>
              </div>
            </div>
          </div>
        </header>

        {/* Reports Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters & Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by Serial No, Party, Vehicle, Broker..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Approved</p>
                      <p className="text-2xl font-bold text-green-900">
                        {inwardEntriesData.filter(e => e.status === 'approved').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Rejected</p>
                      <p className="text-2xl font-bold text-red-900">
                        {inwardEntriesData.filter(e => e.status === 'rejected').length}
                      </p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {inwardEntriesData.filter(e => e.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Total</p>
                      <p className="text-2xl font-bold text-blue-900">{inwardEntriesData.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Inward Entries List */}
            <Card>
              <CardHeader>
                <CardTitle>Inward Entries ({filteredEntries.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                      onClick={() => handleViewDetails(entry)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="font-mono">
                              {entry.sl_no}
                            </Badge>
                            <Badge variant={getStatusBadgeVariant(entry.status)} className="flex items-center space-x-1">
                              {getStatusIcon(entry.status)}
                              <span className="capitalize">{entry.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                            <div className="flex items-center space-x-2">
                              <Building className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{entry.party_name}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Truck className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{entry.vehicle_no}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Weight className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{entry.net_weight} KG</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">{entry.tested_by}</span>
                            </div>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Created: {entry.created_at} | Test Date: {entry.test_date}
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="self-start">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredEntries.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No inward entries found matching your criteria.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Inward Entry Details - {selectedEntry?.sl_no}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedEntry && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Serial No.</p>
                        <p className="font-semibold">{selectedEntry.sl_no}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-semibold">{selectedEntry.date}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Party</p>
                        <p className="font-semibold">{selectedEntry.party}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Broker</p>
                        <p className="font-semibold">{selectedEntry.broker}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Vehicle No.</p>
                        <p className="font-semibold">{selectedEntry.vehicle_no}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bill No.</p>
                        <p className="font-semibold">{selectedEntry.bill_no}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weight Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Gross Weight</p>
                        <p className="font-semibold">{selectedEntry.gross_weight} KG</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tare Weight</p>
                        <p className="font-semibold">{selectedEntry.tare_weight} KG</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Net Weight</p>
                        <p className="font-semibold text-blue-600">{selectedEntry.net_weight} KG</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <Badge variant={getStatusBadgeVariant(selectedEntry.status)} className="flex items-center space-x-1">
                          {getStatusIcon(selectedEntry.status)}
                          <span className="capitalize">{selectedEntry.status}</span>
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Test Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Test Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tested By</p>
                      <p className="font-semibold">{selectedEntry.tested_by}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Test Date</p>
                      <p className="font-semibold">{selectedEntry.test_date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Created At</p>
                      <p className="font-semibold">{selectedEntry.created_at}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Items Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Stock Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedEntry.stock_items && selectedEntry.stock_items.length > 0 ? (
                    <div className="space-y-4">
                      {selectedEntry.stock_items.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <div className="flex space-x-2">
                              {item.status === 'pending' ? (
                                <>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(item, 'approved');
                                    }}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(item, 'rejected');
                                    }}
                                  >
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              ) : (
                                <Badge variant={getStatusBadgeVariant(item.status)} className="flex items-center space-x-1">
                                  {getStatusIcon(item.status)}
                                  <span className="capitalize">{item.status}</span>
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No stock items found for this entry.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Change Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {newStatus === 'approved' ? 'Approve Item' : 'Reject Item'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {newStatus === 'approved' && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Select Supervisor</label>
                  <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisorList.map(supervisor => (
                        <SelectItem key={supervisor.id} value={supervisor.id.toString()}>
                          {supervisor.name} - {supervisor.designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Select Godown</label>
                  <Select value={selectedGodown} onValueChange={setSelectedGodown}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a godown" />
                    </SelectTrigger>
                    <SelectContent>
                      {godownList.map(godown => (
                        <SelectItem key={godown.id} value={godown.id.toString()}>
                          {godown.name} - {godown.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            {newStatus === 'rejected' && (
              <div>
                <label className="text-sm font-medium text-gray-700">Rejection Reason</label>
                <Textarea
                  placeholder="Please provide reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
            
            <div className="flex space-x-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsStatusModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStatusSubmit}
                disabled={
                  (newStatus === 'approved' && (!selectedSupervisor || !selectedGodown)) ||
                  (newStatus === 'rejected' && !rejectionReason)
                }
                className="flex-1"
              >
                {newStatus === 'approved' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}