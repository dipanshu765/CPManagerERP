import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { sidebarMenuItems } from "@/lib/static-data";
import { 
  Gauge, 
  Users, 
  Upload, 
  Settings, 
  BarChart3, 
  UserPen, 
  ShieldCheck, 
  LogOut,
  X,
  ChevronDown,
  ChevronRight,
  FileText,
  Activity,
  Clock,
  TrendingUp
} from "lucide-react";

const iconMap = {
  gauge: Gauge,
  users: Users,
  upload: Upload,
  settings: Settings,
  "bar-chart-3": BarChart3,
  "user-pen": UserPen,
  "shield-check": ShieldCheck,
  "log-out": LogOut,
};

const reportSubMenus = [
  { name: "Inward Reports", icon: FileText, path: "/reports/inward" },
  { name: "Stock Journals", icon: BarChart3, path: "/reports/stock" },
  { name: "Machine Performance", icon: Activity, path: "/reports/machine" },
  { name: "Hamali Report", icon: TrendingUp, path: "/reports/hamali" },
  { name: "Attendance Report", icon: Clock, path: "/reports/attendance" },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const [location, setLocation] = useLocation();
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const handleNavigation = (path: string, name: string) => {
    if (name === "Log out") {
      setLocation("/login");
      onClose();
    } else if (path === "/import") {
      setLocation("/import");
      onClose();
    } else if (path === "/users") {
      setLocation("/users");
      onClose();
    } else if (name === "Reports") {
      setIsReportsOpen(!isReportsOpen);
    } else if (path !== "/dashboard") {
      // For now, stay on dashboard for other routes
      console.log(`Navigate to ${path}`);
      onClose();
    } else {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed left-0 top-0 h-full w-64 sidebar-gradient text-white transform transition-transform">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h1 className="text-2xl font-bold text-white">CP Manager ERP</h1>
            <p className="text-gray-300 text-sm mt-1">Enterprise Resource Planning</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6">
          {sidebarMenuItems.map((item, index) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap];
            const isActive = location === item.path || 
                            (item.name === "Dashboard" && location === "/dashboard") || 
                            (item.name === "Import Data" && location === "/import") ||
                            (item.name === "User List" && location === "/users") ||
                            (item.name === "Reports" && location.startsWith("/reports"));
            
            return (
              <div key={index}>
                {item.separator && <div className="border-t border-gray-700 mt-4" />}
                <button
                  onClick={() => handleNavigation(item.path, item.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-all text-left",
                    isActive && "border-r-4 border-white bg-gray-700 text-white"
                  )}
                >
                  <div className="flex items-center">
                    <Icon className="mr-3 h-5 w-5" />
                    <span>{item.name}</span>
                  </div>
                  {item.name === "Reports" && (
                    <div className="ml-2">
                      {isReportsOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </div>
                  )}
                </button>
                
                {/* Reports Submenu */}
                {item.name === "Reports" && isReportsOpen && (
                  <div className="bg-gray-800 border-l-4 border-gray-600 ml-6">
                    {reportSubMenus.map((subItem, subIndex) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = location === subItem.path;
                      
                      return (
                        <button
                          key={subIndex}
                          onClick={() => {
                            console.log(`Navigate to ${subItem.path}`);
                            onClose();
                          }}
                          className={cn(
                            "w-full flex items-center px-6 py-2 text-gray-400 hover:bg-gray-700 hover:text-white transition-all text-left text-sm",
                            isSubActive && "bg-gray-700 text-white"
                          )}
                        >
                          <SubIcon className="mr-3 h-4 w-4" />
                          <span>{subItem.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
