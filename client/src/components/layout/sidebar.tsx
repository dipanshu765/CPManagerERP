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
  LogOut 
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

export default function Sidebar() {
  const [location, setLocation] = useLocation();

  const handleNavigation = (path: string, name: string) => {
    if (name === "Log out") {
      setLocation("/login");
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
          const isActive = location === item.path || (item.name === "Dashboard" && location === "/dashboard");
          
          return (
            <div key={index}>
              {item.separator && <div className="border-t border-gray-700 mt-4" />}
              <button
                onClick={() => handleNavigation(item.path, item.name)}
                className={cn(
                  "w-full flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-all text-left",
                  isActive && "border-r-4 border-white bg-gray-700 text-white"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                <span>{item.name}</span>
              </button>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
