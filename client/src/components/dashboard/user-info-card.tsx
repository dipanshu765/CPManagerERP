import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface UserInfo {
  user_id: string;
  name: string;
  admin_id: string;
  role_id: number;
  role: string;
  is_admin: boolean;
  organization: string;
  branch: string;
}

interface UserInfoCardProps {
  user?: UserInfo;
  tallyRunning?: boolean;
}

export default function UserInfoCard({ user, tallyRunning = false }: UserInfoCardProps) {
  if (!user) {
    return (
      <Card className="shadow-lg border-2 border-gray-200 bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading user information...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Animated border effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-800 to-black rounded-lg animate-pulse opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black rounded-lg animate-pulse opacity-10" style={{animationDelay: '0.5s'}}></div>
      
      <Card className="relative shadow-lg border-2 border-black/20 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* User Information */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-black to-gray-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-black to-gray-600 rounded-full opacity-30 animate-pulse"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                  {user.name}
                </h2>
                <p className="text-gray-600 font-medium">{user.role}</p>
                <p className="text-sm text-gray-500">{user.organization}</p>
                <p className="text-sm text-gray-500">{user.branch}</p>
              </div>
            </div>

            {/* Status Information */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
                <div className={`w-3 h-3 rounded-full ${tallyRunning ? 'bg-green-500' : 'bg-red-500'} animate-pulse shadow-sm`}></div>
                <span className="text-sm font-medium text-gray-700">
                  Tally Server: {tallyRunning ? 'Running' : 'Stopped'}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-mono">
                  ID: {user.user_id}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
