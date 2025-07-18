import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Menu, 
  Plus, 
  Truck, 
  User, 
  FileText, 
  Weight, 
  Package,
  Building2,
  Users,
  Hash,
  Trash2,
  Save,
  Calendar,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/common/loader";

// Static data for dropdowns based on your JSON structure
const partyOptions = [
  { id: 1, name: "ABC Agro Limited" },
  { id: 2, name: "XYZ Trading Company" },
  { id: 3, name: "Global Imports Ltd" },
  { id: 4, name: "Local Suppliers Co" },
  { id: 5, name: "Premium Goods Inc" }
];

const brokerOptions = [
  { id: 1, name: "Naveen" },
  { id: 2, name: "Rakesh" },
  { id: 3, name: "Suresh" },
  { id: 4, name: "Mahesh" },
  { id: 5, name: "Dinesh" }
];

const stockItemOptions = [
  { id: 4496, name: "Raw Turdal Patka [Wb Gold] New [50kg]" },
  { id: 4497, name: "Process Gramdall Loose Rayapur [15.1.24]" },
  { id: 4498, name: "Bardan Reject" },
  { id: 4499, name: "Premium Rice Grade A [25kg]" },
  { id: 4500, name: "Standard Wheat [40kg]" }
];

const qualityOptions = [
  { id: 1, name: "Grade A" },
  { id: 2, name: "Grade B" },
  { id: 3, name: "Grade C" },
  { id: 4, name: "Premium" },
  { id: 5, name: "Standard" }
];

export default function AddInward() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Form state based on JSON structure
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Current date
    party_name: "",
    vehicle_no: "",
    bill_no: "",
    broker_name: "",
    gross_weight: "",
    tare_weight: "",
    net_weight: "",
    items: []
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      stock_item: "",
      quality: "",
      brand: "",
      our_brand: "",
      number_of_bags: "",
      total_weight: "",
      moisture: "",
      damaged_broken_grains: "",
      discoloured_grains: "",
      remarks: ""
    };
    
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }));
  };

  const updateItem = (itemId, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Success",
        description: "Inward entry saved successfully",
      });
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        party_name: "",
        vehicle_no: "",
        bill_no: "",
        broker_name: "",
        gross_weight: "",
        tare_weight: "",
        net_weight: "",
        items: []
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save inward entry",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader loadingText="Loading add inward form..." />;
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
                  <Plus className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                  <div>
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Add Inward Entry
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create new inward stock entry
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white border-2 border-black transition-all duration-300"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Form Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Basic Information */}
            <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-black to-gray-800 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Date</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                      className="border-2 border-gray-300 focus:border-black"
                    />
                  </div>

                  {/* Party Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="party" className="text-sm font-medium flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>Party</span>
                    </Label>
                    <Select value={formData.party_name} onValueChange={(value) => setFormData(prev => ({...prev, party_name: value}))}>
                      <SelectTrigger className="border-2 border-gray-300 focus:border-black">
                        <SelectValue placeholder="Select party" />
                      </SelectTrigger>
                      <SelectContent>
                        {partyOptions.map(party => (
                          <SelectItem key={party.id} value={party.name}>
                            {party.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Vehicle Number */}
                  <div className="space-y-2">
                    <Label htmlFor="vehicle_no" className="text-sm font-medium flex items-center space-x-1">
                      <Truck className="h-4 w-4" />
                      <span>Vehicle Number</span>
                    </Label>
                    <Input
                      id="vehicle_no"
                      placeholder="KA25 U 2832"
                      value={formData.vehicle_no}
                      onChange={(e) => setFormData(prev => ({...prev, vehicle_no: e.target.value}))}
                      className="border-2 border-gray-300 focus:border-black"
                    />
                  </div>

                  {/* Bill Number */}
                  <div className="space-y-2">
                    <Label htmlFor="bill_no" className="text-sm font-medium flex items-center space-x-1">
                      <Hash className="h-4 w-4" />
                      <span>Bill Number</span>
                    </Label>
                    <Input
                      id="bill_no"
                      placeholder="BILL001"
                      value={formData.bill_no}
                      onChange={(e) => setFormData(prev => ({...prev, bill_no: e.target.value}))}
                      className="border-2 border-gray-300 focus:border-black"
                    />
                  </div>

                  {/* Broker Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="broker" className="text-sm font-medium flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Broker</span>
                    </Label>
                    <Select value={formData.broker_name} onValueChange={(value) => setFormData(prev => ({...prev, broker_name: value}))}>
                      <SelectTrigger className="border-2 border-gray-300 focus:border-black">
                        <SelectValue placeholder="Select broker" />
                      </SelectTrigger>
                      <SelectContent>
                        {brokerOptions.map(broker => (
                          <SelectItem key={broker.id} value={broker.name}>
                            {broker.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Gross Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="gross_weight" className="text-sm font-medium flex items-center space-x-1">
                      <Weight className="h-4 w-4" />
                      <span>Gross Weight</span>
                    </Label>
                    <Input
                      id="gross_weight"
                      placeholder="1700"
                      type="number"
                      value={formData.gross_weight}
                      onChange={(e) => setFormData(prev => ({...prev, gross_weight: e.target.value}))}
                      className="border-2 border-gray-300 focus:border-black"
                    />
                  </div>

                  {/* Tare Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="tare_weight" className="text-sm font-medium flex items-center space-x-1">
                      <Weight className="h-4 w-4" />
                      <span>Tare Weight</span>
                    </Label>
                    <Input
                      id="tare_weight"
                      placeholder="200.00"
                      type="number"
                      step="0.01"
                      value={formData.tare_weight}
                      onChange={(e) => setFormData(prev => ({...prev, tare_weight: e.target.value}))}
                      className="border-2 border-gray-300 focus:border-black"
                    />
                  </div>

                  {/* Net Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="net_weight" className="text-sm font-medium flex items-center space-x-1">
                      <Weight className="h-4 w-4" />
                      <span>Net Weight</span>
                    </Label>
                    <Input
                      id="net_weight"
                      placeholder="1500.00"
                      type="number"
                      step="0.01"
                      value={formData.net_weight}
                      onChange={(e) => setFormData(prev => ({...prev, net_weight: e.target.value}))}
                      className="border-2 border-gray-300 focus:border-black"
                    />
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* Items Section */}
            <Card className="border-2 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-black to-gray-800 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Items</span>
                    <Badge variant="outline" className="bg-white text-black border-white">
                      {formData.items.length} items
                    </Badge>
                  </CardTitle>
                  <Button
                    onClick={addNewItem}
                    variant="outline"
                    size="sm"
                    className="bg-white text-black border-white hover:bg-gray-100"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                
                {formData.items.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No items added
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Add items to this inward entry to get started.
                    </p>
                    <Button onClick={addNewItem} className="bg-gradient-to-r from-black to-gray-800 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Item
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formData.items.map((item, itemIndex) => (
                      <Card key={item.id} className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4" />
                              <span className="font-medium">Item {itemIndex + 1}</span>
                            </div>
                            <Button
                              onClick={() => removeItem(item.id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          
                          {/* Item Details Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            
                            {/* Stock Item */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Stock Item</Label>
                              <Select 
                                value={item.stock_item} 
                                onValueChange={(value) => updateItem(item.id, 'stock_item', value)}
                              >
                                <SelectTrigger className="border-2 border-gray-300 focus:border-black">
                                  <SelectValue placeholder="Select stock item" />
                                </SelectTrigger>
                                <SelectContent>
                                  {stockItemOptions.map(stockItem => (
                                    <SelectItem key={stockItem.id} value={stockItem.name}>
                                      {stockItem.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Quality */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Quality</Label>
                              <Select 
                                value={item.quality} 
                                onValueChange={(value) => updateItem(item.id, 'quality', value)}
                              >
                                <SelectTrigger className="border-2 border-gray-300 focus:border-black">
                                  <SelectValue placeholder="Select quality" />
                                </SelectTrigger>
                                <SelectContent>
                                  {qualityOptions.map(quality => (
                                    <SelectItem key={quality.id} value={quality.name}>
                                      {quality.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Brand */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Brand</Label>
                              <Input
                                placeholder="Binmark"
                                value={item.brand}
                                onChange={(e) => updateItem(item.id, 'brand', e.target.value)}
                                className="border-2 border-gray-300 focus:border-black"
                              />
                            </div>

                            {/* Our Brand */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Our Brand</Label>
                              <Input
                                placeholder="WB GOLD"
                                value={item.our_brand}
                                onChange={(e) => updateItem(item.id, 'our_brand', e.target.value)}
                                className="border-2 border-gray-300 focus:border-black"
                              />
                            </div>

                            {/* Number of Bags */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Number of Bags</Label>
                              <Input
                                placeholder="30"
                                type="number"
                                value={item.number_of_bags}
                                onChange={(e) => updateItem(item.id, 'number_of_bags', e.target.value)}
                                className="border-2 border-gray-300 focus:border-black"
                              />
                            </div>

                            {/* Total Weight */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Total Weight</Label>
                              <Input
                                placeholder="1500.00"
                                type="number"
                                step="0.01"
                                value={item.total_weight}
                                onChange={(e) => updateItem(item.id, 'total_weight', e.target.value)}
                                className="border-2 border-gray-300 focus:border-black"
                              />
                            </div>

                            {/* Moisture */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Moisture (%)</Label>
                              <Input
                                placeholder="8.5"
                                type="number"
                                step="0.1"
                                value={item.moisture}
                                onChange={(e) => updateItem(item.id, 'moisture', e.target.value)}
                                className="border-2 border-gray-300 focus:border-black"
                              />
                            </div>

                            {/* Damaged/Broken Grains */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Damaged/Broken Grains (%)</Label>
                              <Input
                                placeholder="1.2"
                                type="number"
                                step="0.1"
                                value={item.damaged_broken_grains}
                                onChange={(e) => updateItem(item.id, 'damaged_broken_grains', e.target.value)}
                                className="border-2 border-gray-300 focus:border-black"
                              />
                            </div>

                            {/* Discoloured Grains */}
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">Discoloured Grains (%)</Label>
                              <Input
                                placeholder="0.8"
                                type="number"
                                step="0.1"
                                value={item.discoloured_grains}
                                onChange={(e) => updateItem(item.id, 'discoloured_grains', e.target.value)}
                                className="border-2 border-gray-300 focus:border-black"
                              />
                            </div>

                          </div>

                          {/* Remarks */}
                          <div className="space-y-2 md:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium">Remarks</Label>
                            <Textarea
                              placeholder="Full Body - 14%, Half Body - 34%"
                              value={item.remarks}
                              onChange={(e) => updateItem(item.id, 'remarks', e.target.value)}
                              className="border-2 border-gray-300 focus:border-black min-h-[100px]"
                            />
                          </div>

                        </CardContent>
                      </Card>
                    ))}
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