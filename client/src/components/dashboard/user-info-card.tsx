import { Card, CardContent } from "@/components/ui/card";
import type { User } from "@shared/schema";

interface UserInfoCardProps {
  user: User;
  tallyRunning: boolean;
}

export default function UserInfoCard({ user, tallyRunning }: UserInfoCardProps) {
  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">User Information</h2>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full animate-pulse-custom ${tallyRunning ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${tallyRunning ? 'text-green-600' : 'text-red-600'}`}>
              {tallyRunning ? 'Tally Running' : 'Tally Stopped'}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Name</p>
            <p className="font-semibold text-gray-900">{user.name}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Role</p>
            <p className="font-semibold text-gray-900">{user.role}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Organization</p>
            <p className="font-semibold text-gray-900">{user.organization}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Branch</p>
            <p className="font-semibold text-gray-900">{user.branch}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
