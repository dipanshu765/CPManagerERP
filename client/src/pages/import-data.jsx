import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, Database, Building2, Layers, Tags, Package, FileType, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/lib/auth";
import Loader from "@/components/common/loader";

export default function ImportData() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Simulate loading import options
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  const importOptions = [
    {
      title: "Import Unit Master",
      description: "Import measurement units and conversions",
      icon: Database,
      gradient: "from-blue-500 to-blue-600",
      textColor: "text-blue-100",
      bgColor: "bg-blue-400",
      action: "unit-master"
    },
    {
      title: "Godown Master",
      description: "Import warehouse and storage locations",
      icon: Building2,
      gradient: "from-green-500 to-green-600",
      textColor: "text-green-100",
      bgColor: "bg-green-400",
      action: "godown-master"
    },
    {
      title: "Stock Groups",
      description: "Import stock classification groups",
      icon: Layers,
      gradient: "from-purple-500 to-purple-600",
      textColor: "text-purple-100",
      bgColor: "bg-purple-400",
      action: "stock-groups"
    },
    {
      title: "Stock Category",
      description: "Import product categories and types",
      icon: Tags,
      gradient: "from-indigo-500 to-indigo-600",
      textColor: "text-indigo-100",
      bgColor: "bg-indigo-400",
      action: "stock-category"
    },
    {
      title: "Stock Item Master",
      description: "Import complete stock item details",
      icon: Package,
      gradient: "from-teal-500 to-teal-600",
      textColor: "text-teal-100",
      bgColor: "bg-teal-400",
      action: "stock-item-master"
    },
    {
      title: "Voucher Type Masters",
      description: "Import transaction voucher types",
      icon: FileType,
      gradient: "from-orange-500 to-orange-600",
      textColor: "text-orange-100",
      bgColor: "bg-orange-400",
      action: "voucher-types"
    }
  ];

  const handleImportClick = (action, title) => {
    toast({
      title: "Import Started",
      description: `${title} import process initiated`,
    });
    console.log(`Importing: ${action}`);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type (XML)
    const allowedTypes = ['.xml', 'text/xml', 'application/xml'];
    const fileExtension = file.name.toLowerCase().split('.').pop();
    const isValidType = fileExtension === 'xml' || allowedTypes.includes(file.type);

    if (!isValidType) {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid XML file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);

    try {
      // Get authentication token
      const token = AuthService.getAccessToken();
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to API
      const response = await fetch('http://127.0.0.1:8096/api/upload-xml/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      toast({
        title: "Upload Successful",
        description: `File "${file.name}" uploaded successfully. ${result.message || ''}`,
        variant: "default",
      });

      console.log("Upload successful:", result);
      
      // Reset file input
      event.target.value = '';
      setSelectedFile(null);

    } catch (error) {
      console.error("Upload error:", error);
      
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      
      // Reset file input on error
      event.target.value = '';
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
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
              <h1 className="text-2xl font-bold text-gray-900">Import Data</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-8">
              {/* Import Masters Section */}
              <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Master Data Import</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {importOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <Card
                      key={index}
                      className={`bg-gradient-to-br ${option.gradient} shadow-lg border-0 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group`}
                      onClick={() => handleImportClick(option.action, option.title)}
                    >
                      <CardContent className="p-6 text-white">
                        <div className="flex flex-col items-center text-center space-y-4">
                          <div className={`${option.bgColor} bg-opacity-30 p-4 rounded-full group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-8 w-8 animate-pulse" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                            <p className={`${option.textColor} text-sm`}>{option.description}</p>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-white border-opacity-50 transition-all duration-300"
                          >
                            Import Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* File Upload Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">File Upload</h2>
              <Card className="shadow-lg border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-300">
                <CardContent className="p-8">
                  <div className="text-center space-y-6">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center animate-bounce">
                      <Upload className="h-10 w-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Upload Stock Item Master
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Upload XML file containing stock item master data
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        Supported format: .xml (Max size: 10MB)
                      </p>
                    </div>
                    <div className="space-y-4">
                      {selectedFile && !isUploading && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              File selected: {selectedFile.name}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {isUploading && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                            <span className="text-sm font-medium text-blue-800">
                              Uploading {selectedFile?.name}...
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <label
                        htmlFor="file-upload"
                        className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-all duration-300 transform hover:scale-105 ${
                          isUploading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-black to-gray-600 hover:from-gray-800 hover:to-gray-700 cursor-pointer'
                        }`}
                      >
                        {isUploading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-5 w-5" />
                            Choose XML File
                          </>
                        )}
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".xml,text/xml,application/xml"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500">
                        Or drag and drop your XML file here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instructions Section */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Instructions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Master Data Import</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Click on any import card to start the process</li>
                      <li>• Data will be synchronized with Tally automatically</li>
                      <li>• Existing records will be updated if duplicates found</li>
                      <li>• Import process runs in background</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">XML File Upload Guidelines</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Ensure XML file structure is correct</li>
                      <li>• File size must be less than 10MB</li>
                      <li>• Only XML format is supported</li>
                      <li>• Upload will be processed immediately</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </main>
      </div>
      
      {/* Loader */}
      <Loader isLoading={isLoading} text="Loading import options" />
    </div>
  );
}