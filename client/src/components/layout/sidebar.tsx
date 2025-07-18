import { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { sidebarMenuItems } from "@/lib/static-data";
import { 
  Gauge, 
  Users, 
  Upload, 
  Plus,
  Settings, 
  BarChart3, 
  UserPen, 
  ShieldCheck, 
  LogOut,
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
  plus: Plus,
  settings: Settings,
  "bar-chart-3": BarChart3,
  "user-pen": UserPen,
  "shield-check": ShieldCheck,
  "log-out": LogOut,
};

const reportSubMenus = [
  { name: "Inward Reports", icon: FileText, path: "/reports/inward" },
  { name: "Stock Journals", icon: BarChart3, path: "/reports/stock-journal" },
  { name: "Machine Performance", icon: Activity, path: "/reports/machine" },
  { name: "Hamali Report", icon: TrendingUp, path: "/reports/hamali" },
  { name: "Attendance Report", icon: Clock, path: "/reports/attendance" },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const handleNavigation = (path: string, name: string) => {
    if (name === "Log out") {
      setLocation("/login");
    } else if (path === "/import") {
      setLocation("/import");
    } else if (path === "/users") {
      setLocation("/users");
    } else if (path === "/dashboard") {
      setLocation("/dashboard");
    } else if (name === "Reports") {
      setIsReportsOpen(!isReportsOpen);
    } else if (path !== "/dashboard") {
      // For now, stay on dashboard for other routes
      console.log(`Navigate to ${path}`);
    }
  };

  return (
    <div className="w-64 sidebar-gradient text-white flex-shrink-0">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">CP Manager ERP</h1>
        <p className="text-gray-300 text-sm mt-1">Enterprise Resource Planning</p>
      </div>
      
      <nav className="mt-6">
        {sidebarMenuItems.map((item, index) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = location === item.path || 
                          (item.name === "Dashboard" && location === "/dashboard") || 
                          (item.name === "Import Data" && location === "/import") ||
                          (item.name === "User List" && location === "/users") ||
                          (item.name === "Add Inward" && location === "/add-inward") ||
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
                          if (subItem.path === '/reports/inward') {
                            setLocation('/reports/inward');
                          } else if (subItem.path === '/reports/stock-journal') {
                            setLocation('/reports/stock-journal');
                          } else {
                            console.log(`Navigate to ${subItem.path}`);
                          }
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
  );
}
