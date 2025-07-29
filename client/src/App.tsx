import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthService } from "@/lib/auth";
import Login from "@/pages/login.jsx";
import ForgotPassword from "@/pages/forgot-password.tsx";
import Dashboard from "@/pages/dashboard.tsx";
import ImportData from "@/pages/import-data.jsx";
import UserList from "@/pages/user-list.jsx";
import GodownMasters from "@/pages/godown-masters.jsx";
import ItemMasters from "@/pages/item-masters.jsx";
import ItemsMapping from "@/pages/items-mapping.jsx";
import VoucherSettings from "@/pages/voucher-settings.jsx";
import AddInward from "@/pages/add-inward.jsx";
import InwardReports from "@/pages/inward-reports.jsx";
import StockJournal from "@/pages/stock-journal.jsx";
import HamaliReports from "@/pages/hamali-reports.jsx";
import HamaliDetails from "@/pages/hamali-details.jsx";
import NotFound from "@/pages/not-found.tsx";

// Protected route wrapper
function ProtectedRoute({ component: Component, ...props }: any) {
  const isAuthenticated = AuthService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return <Component {...props} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/import">
        <ProtectedRoute component={ImportData} />
      </Route>
      <Route path="/users">
        <ProtectedRoute component={UserList} />
      </Route>
      <Route path="/godown-masters">
        <ProtectedRoute component={GodownMasters} />
      </Route>
      <Route path="/item-masters">
        <ProtectedRoute component={ItemMasters} />
      </Route>
      <Route path="/items-mapping">
        <ProtectedRoute component={ItemsMapping} />
      </Route>
      <Route path="/voucher-settings">
        <ProtectedRoute component={VoucherSettings} />
      </Route>
      <Route path="/add-inward">
        <ProtectedRoute component={AddInward} />
      </Route>
      <Route path="/reports/inward">
        <ProtectedRoute component={InwardReports} />
      </Route>
      <Route path="/reports/stock-journal">
        <ProtectedRoute component={StockJournal} />
      </Route>
      <Route path="/reports/hamali">
        <ProtectedRoute component={HamaliReports} />
      </Route>
      <Route path="/reports/hamali/:id">
        <ProtectedRoute component={HamaliDetails} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
