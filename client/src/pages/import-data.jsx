import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Menu, Database, Building2, Layers, Tags, Package, FileType, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ImportData() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      toast({
        title: "File Upload",
        description: `Selected file: ${file.name}`,
      });
      console.log("File selected:", file.name);
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
              <h1 className="text-2xl font-bold text-gray-900">Import Data</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
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
                        Upload Excel or CSV file containing stock item master data
                      </p>
                      <p className="text-sm text-gray-500 mb-6">
                        Supported formats: .xlsx, .xls, .csv (Max size: 10MB)
                      </p>
                    </div>
                    <div className="space-y-4">
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-black to-gray-600 hover:from-gray-800 hover:to-gray-700 cursor-pointer transition-all duration-300 transform hover:scale-105"
                      >
                        <Upload className="mr-2 h-5 w-5" />
                        Choose File
                      </label>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-gray-500">
                        Or drag and drop your file here
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
                    <h4 className="font-medium text-gray-900 mb-2">File Upload Guidelines</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Use the provided template for best results</li>
                      <li>• Ensure all required fields are filled</li>
                      <li>• Check data format before uploading</li>
                      <li>• Large files may take longer to process</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}