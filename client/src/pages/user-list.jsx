import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/layout/sidebar";
import MobileSidebar from "@/components/layout/mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Menu, Search, Plus, Edit, Trash2, User, Phone, Mail, Building, Calendar, Users } from "lucide-react";
import Loader from "@/components/common/loader";

export default function UserList() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();

  // Simulate loading user data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  // Static user data based on API response
  const userData = [
    {
      user_id: "USR0003",
      name: "Deep",
      mobile: "8888888888",
      email: "",
      role_name: "Lab Technician",
      branch_name: "WB Agro Pvt. Ltd - Main Branch - WB Agro Pvt. Ltd",
      created_at: "16-07-2025"
    },
    {
      user_id: "USR0004",
      name: "Naveen",
      mobile: "9845294229",
      email: null,
      role_name: "Supervisor",
      branch_name: "Rayapur - WB Agro Pvt. Ltd",
      created_at: "16-07-2025"
    },
    {
      user_id: "USR0006",
      name: "Raghavendra",
      mobile: "7022261890",
      email: null,
      role_name: "Supervisor",
      branch_name: "Rayapur - WB Agro Pvt. Ltd",
      created_at: "16-07-2025"
    },
    {
      user_id: "USR0007",
      name: "Santosh Kumbar",
      mobile: "7022261909",
      email: "",
      role_name: "Supervisor",
      branch_name: "Rayapur - WB Agro Pvt. Ltd",
      created_at: "16-07-2025"
    },
    {
      user_id: "USR0008",
      name: "Shivaji",
      mobile: "8431759614",
      email: "",
      role_name: "Supervisor",
      branch_name: "Rayapur - WB Agro Pvt. Ltd",
      created_at: "17-07-2025"
    },
    {
      user_id: "USR0005",
      name: "Shivanand",
      mobile: "7353353327",
      email: null,
      role_name: "Supervisor",
      branch_name: "Rayapur - WB Agro Pvt. Ltd",
      created_at: "16-07-2025"
    },
    {
      user_id: "USR0002",
      name: "Supervisor 1",
      mobile: "9999999991",
      email: "",
      role_name: "Supervisor",
      branch_name: "WB Agro Pvt. Ltd - Main Branch - WB Agro Pvt. Ltd",
      created_at: "16-07-2025"
    }
  ];

  // Filter users based on search term
  const filteredUsers = userData.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile.includes(searchTerm)
  );

  const getRoleColor = (role) => {
    switch (role) {
      case "Lab Technician":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Supervisor":
        return "bg-green-100 text-green-800 border-green-200";
      case "Admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getBranchShortName = (branchName) => {
    if (branchName.includes("Main Branch")) {
      return "Main Branch";
    } else if (branchName.includes("Rayapur")) {
      return "Rayapur";
    }
    return branchName.split(" - ")[0] || branchName;
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
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-black to-gray-600 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                  <p className="text-sm text-gray-600">Manage system users and their roles</p>
                </div>
              </div>
            </div>
            
            <Button className="bg-gradient-to-r from-black to-gray-600 hover:from-gray-800 hover:to-gray-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm mb-1">Total Users</p>
                      <p className="text-3xl font-bold">{userData.length}</p>
                    </div>
                    <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm mb-1">Supervisors</p>
                      <p className="text-3xl font-bold">{userData.filter(u => u.role_name === "Supervisor").length}</p>
                    </div>
                    <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm mb-1">Lab Technicians</p>
                      <p className="text-3xl font-bold">{userData.filter(u => u.role_name === "Lab Technician").length}</p>
                    </div>
                    <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm mb-1">Active Today</p>
                      <p className="text-3xl font-bold">{userData.filter(u => u.created_at === "17-07-2025").length}</p>
                    </div>
                    <div className="bg-orange-400 bg-opacity-30 p-3 rounded-lg">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search users by name, ID, role, or mobile..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    Showing {filteredUsers.length} of {userData.length} users
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="shadow-sm border border-gray-200">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user, index) => (
                        <tr key={user.user_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-black to-gray-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.user_id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                {user.mobile}
                              </div>
                              {user.email && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                  {user.email}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={`${getRoleColor(user.role_name)} font-medium`}>
                              {user.role_name}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Building className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="truncate max-w-32" title={user.branch_name}>
                                {getBranchShortName(user.branch_name)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {user.created_at}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm" className="hover:bg-blue-50 hover:text-blue-600">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {filteredUsers.length === 0 && (
              <Card className="shadow-sm border border-gray-200">
                <CardContent className="p-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or add a new user.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
      
      {/* Loader */}
      <Loader isLoading={isLoading} text="Loading user list" />
    </div>
  );
}