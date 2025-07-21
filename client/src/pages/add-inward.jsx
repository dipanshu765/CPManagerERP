import { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { AuthService } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import Loader from "@/components/common/loader";

const API_BASE_URL = "http://127.0.0.1:8096";

// Form validation schema
const jaliDetailSchema = z.object({
  jali_number: z.string().min(1, "Jali number is required"),
  weight_type: z.enum(["up", "down"]),
  weight_value: z.string().min(1, "Weight value is required"),
  bags_count: z.number().min(1, "Bags count must be at least 1"),
  remarks: z.string().optional(),
});

const itemSchema = z.object({
  item_id: z.number().min(1, "Stock item is required"),
  quality_id: z.number().min(1, "Quality is required"),
  brand: z.string().min(1, "Brand is required"),
  our_brand: z.string().min(1, "Our brand is required"),
  number_of_bags: z.number().min(1, "Number of bags is required"),
  total_weight: z.string().min(1, "Total weight is required"),
  moisture: z.string().min(1, "Moisture is required"),
  damaged_broken_grains: z.string().min(1, "Damaged/broken grains is required"),
  discoloured_grains: z.string().min(1, "Discoloured grains is required"),
  remarks: z.string().optional(),
  jali_details: z.array(jaliDetailSchema).min(1, "At least one jali detail is required"),
});

const addInwardSchema = z.object({
  party_id: z.number().min(1, "Party is required"),
  vehicle_no: z.string().min(1, "Vehicle number is required"),
  bill_no: z.string().min(1, "Bill number is required"),
  broker_id: z.number().min(1, "Broker is required"),
  gross_weight: z.string().min(1, "Gross weight is required"),
  tare_weight: z.string().min(1, "Tare weight is required"),
  items: z.array(itemSchema).min(1, "At least one item is required"),
});

export default function AddInward() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(addInwardSchema),
    defaultValues: {
      party_id: 0,
      vehicle_no: "",
      bill_no: "",
      broker_id: 0,
      gross_weight: "",
      tare_weight: "",
      items: [{
        item_id: 0,
        quality_id: 0,
        brand: "",
        our_brand: "",
        number_of_bags: 1,
        total_weight: "",
        moisture: "",
        damaged_broken_grains: "",
        discoloured_grains: "",
        remarks: "",
        jali_details: [{
          jali_number: "",
          weight_type: "up",
          weight_value: "",
          bags_count: 1,
          remarks: "",
        }]
      }]
    },
  });

  const { fields: itemFields, append: appendItem, remove: removeItem } = useFieldArray({
    control: form.control,
    name: "items"
  });

  // Fetch parties
  const { data: parties = [], isLoading: partiesLoading } = useQuery({
    queryKey: [`${API_BASE_URL}/api/report/party/`],
    enabled: !!AuthService.getAccessToken(),
  });

  // Fetch brokers
  const { data: brokers = [], isLoading: brokersLoading } = useQuery({
    queryKey: [`${API_BASE_URL}/api/report/broker/`],
    enabled: !!AuthService.getAccessToken(),
  });

  // Fetch quality types
  const { data: qualityTypes = [], isLoading: qualityLoading } = useQuery({
    queryKey: [`${API_BASE_URL}/api/process/get-quality-types/`],
    enabled: !!AuthService.getAccessToken(),
  });

  // Fetch stock items
  const { data: stockItems = [], isLoading: stockItemsLoading } = useQuery({
    queryKey: [`${API_BASE_URL}/api/get-stock-items/`],
    queryFn: async () => {
      const response = await apiRequest('POST', `${API_BASE_URL}/api/get-stock-items/`, {
        search: "",
        type: "",
        stock_group: "",
        godown: ""
      });
      const data = await response.json();
      return data.data || [];
    },
    enabled: !!AuthService.getAccessToken(),
  });

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest('POST', `${API_BASE_URL}/api/report/add-inventory/`, data);
      return response;
    },
    onSuccess: (response) => {
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Inward entry created successfully",
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create inward entry",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      console.error("Submit error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create inward entry",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const addNewItem = () => {
    appendItem({
      item_id: 0,
      quality_id: 0,
      brand: "",
      our_brand: "",
      number_of_bags: 1,
      total_weight: "",
      moisture: "",
      damaged_broken_grains: "",
      discoloured_grains: "",
      remarks: "",
      jali_details: [{
        jali_number: "",
        weight_type: "up",
        weight_value: "",
        bags_count: 1,
        remarks: "",
      }]
    });
  };

  const addJaliDetail = (itemIndex) => {
    const currentJaliDetails = form.getValues(`items.${itemIndex}.jali_details`) || [];
    form.setValue(`items.${itemIndex}.jali_details`, [
      ...currentJaliDetails,
      {
        jali_number: "",
        weight_type: "up",
        weight_value: "",
        bags_count: 1,
        remarks: "",
      }
    ]);
  };

  const removeJaliDetail = (itemIndex, jaliIndex) => {
    const currentJaliDetails = form.getValues(`items.${itemIndex}.jali_details`) || [];
    if (currentJaliDetails.length > 1) {
      const updatedJaliDetails = currentJaliDetails.filter((_, index) => index !== jaliIndex);
      form.setValue(`items.${itemIndex}.jali_details`, updatedJaliDetails);
    }
  };

  const onSubmit = async (data) => {
    try {
      await submitMutation.mutateAsync(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {!isMobile && <Sidebar />}
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={() => setIsMobileSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <div className="flex items-center space-x-4">
            {isMobile && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add Inward Entry</h1>
              <p className="text-gray-600">Create new inward inventory entry</p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date().toLocaleDateString()}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="party_id">Party</Label>
                    <Controller
                      name="party_id"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select party" />
                          </SelectTrigger>
                          <SelectContent>
                            {partiesLoading ? (
                              <SelectItem value="loading" disabled>Loading...</SelectItem>
                            ) : (
                              parties.map((party) => (
                                <SelectItem key={party.id} value={party.id.toString()}>
                                  {party.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.party_id && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.party_id.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="broker_id">Broker</Label>
                    <Controller
                      name="broker_id"
                      control={form.control}
                      render={({ field }) => (
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select broker" />
                          </SelectTrigger>
                          <SelectContent>
                            {brokersLoading ? (
                              <SelectItem value="loading" disabled>Loading...</SelectItem>
                            ) : (
                              brokers.map((broker) => (
                                <SelectItem key={broker.id} value={broker.id.toString()}>
                                  {broker.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.broker_id && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.broker_id.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="vehicle_no">Vehicle Number</Label>
                    <Input
                      id="vehicle_no"
                      placeholder="Enter vehicle number"
                      {...form.register("vehicle_no")}
                    />
                    {form.formState.errors.vehicle_no && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.vehicle_no.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bill_no">Bill Number</Label>
                    <Input
                      id="bill_no"
                      placeholder="Enter bill number"
                      {...form.register("bill_no")}
                    />
                    {form.formState.errors.bill_no && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.bill_no.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="gross_weight">Gross Weight</Label>
                    <Input
                      id="gross_weight"
                      placeholder="Enter gross weight"
                      {...form.register("gross_weight")}
                    />
                    {form.formState.errors.gross_weight && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.gross_weight.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tare_weight">Tare Weight</Label>
                    <Input
                      id="tare_weight"
                      placeholder="Enter tare weight"
                      {...form.register("tare_weight")}
                    />
                    {form.formState.errors.tare_weight && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.tare_weight.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5" />
                    <span>Items</span>
                  </div>
                  <Button type="button" onClick={addNewItem} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {itemFields.map((item, itemIndex) => (
                  <div key={item.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Item {itemIndex + 1}</h4>
                      {itemFields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(itemIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label>Stock Item</Label>
                        <Controller
                          name={`items.${itemIndex}.item_id`}
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              value={field.value?.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select stock item" />
                              </SelectTrigger>
                              <SelectContent>
                                {stockItemsLoading ? (
                                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                                ) : (
                                  stockItems.map((stockItem) => (
                                    <SelectItem key={stockItem.id} value={stockItem.id.toString()}>
                                      {stockItem.name}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <Label>Quality</Label>
                        <Controller
                          name={`items.${itemIndex}.quality_id`}
                          control={form.control}
                          render={({ field }) => (
                            <Select
                              value={field.value?.toString()}
                              onValueChange={(value) => field.onChange(parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select quality" />
                              </SelectTrigger>
                              <SelectContent>
                                {qualityLoading ? (
                                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                                ) : (
                                  qualityTypes.map((quality) => (
                                    <SelectItem key={quality.id} value={quality.id.toString()}>
                                      {quality.name} ({quality.grade})
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>

                      <div>
                        <Label>Brand</Label>
                        <Input
                          placeholder="Enter brand"
                          {...form.register(`items.${itemIndex}.brand`)}
                        />
                      </div>

                      <div>
                        <Label>Our Brand</Label>
                        <Input
                          placeholder="Enter our brand"
                          {...form.register(`items.${itemIndex}.our_brand`)}
                        />
                      </div>

                      <div>
                        <Label>Number of Bags</Label>
                        <Input
                          type="number"
                          placeholder="Enter number of bags"
                          {...form.register(`items.${itemIndex}.number_of_bags`, { valueAsNumber: true })}
                        />
                      </div>

                      <div>
                        <Label>Total Weight</Label>
                        <Input
                          placeholder="Enter total weight"
                          {...form.register(`items.${itemIndex}.total_weight`)}
                        />
                      </div>

                      <div>
                        <Label>Moisture</Label>
                        <Input
                          placeholder="Enter moisture"
                          {...form.register(`items.${itemIndex}.moisture`)}
                        />
                      </div>

                      <div>
                        <Label>Damaged/Broken Grains</Label>
                        <Input
                          placeholder="Enter damaged/broken grains"
                          {...form.register(`items.${itemIndex}.damaged_broken_grains`)}
                        />
                      </div>

                      <div>
                        <Label>Discoloured Grains</Label>
                        <Input
                          placeholder="Enter discoloured grains"
                          {...form.register(`items.${itemIndex}.discoloured_grains`)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Remarks</Label>
                      <Textarea
                        placeholder="Enter remarks"
                        {...form.register(`items.${itemIndex}.remarks`)}
                      />
                    </div>

                    {/* Jali Details */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">Jali Details</h5>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addJaliDetail(itemIndex)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Jali
                        </Button>
                      </div>

                      {form.watch(`items.${itemIndex}.jali_details`)?.map((jali, jaliIndex) => (
                        <div key={jaliIndex} className="border rounded p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Jali {jaliIndex + 1}</span>
                            {form.watch(`items.${itemIndex}.jali_details`)?.length > 1 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeJaliDetail(itemIndex, jaliIndex)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            <div>
                              <Label>Jali Number</Label>
                              <Input
                                placeholder="Enter jali number"
                                {...form.register(`items.${itemIndex}.jali_details.${jaliIndex}.jali_number`)}
                              />
                            </div>

                            <div>
                              <Label>Weight Type</Label>
                              <Controller
                                name={`items.${itemIndex}.jali_details.${jaliIndex}.weight_type`}
                                control={form.control}
                                render={({ field }) => (
                                  <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select weight type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="up">Up</SelectItem>
                                      <SelectItem value="down">Down</SelectItem>
                                    </SelectContent>
                                  </Select>
                                )}
                              />
                            </div>

                            <div>
                              <Label>Weight Value</Label>
                              <Input
                                placeholder="Enter weight value"
                                {...form.register(`items.${itemIndex}.jali_details.${jaliIndex}.weight_value`)}
                              />
                            </div>

                            <div>
                              <Label>Bags Count</Label>
                              <Input
                                type="number"
                                placeholder="Enter bags count"
                                {...form.register(`items.${itemIndex}.jali_details.${jaliIndex}.bags_count`, { valueAsNumber: true })}
                              />
                            </div>

                            <div className="md:col-span-2">
                              <Label>Remarks</Label>
                              <Input
                                placeholder="Enter remarks"
                                {...form.register(`items.${itemIndex}.jali_details.${jaliIndex}.remarks`)}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Reset
              </Button>
              <Button 
                type="submit" 
                disabled={submitMutation.isPending}
                className="bg-black hover:bg-gray-800"
              >
                {submitMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Entry
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}