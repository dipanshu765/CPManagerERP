import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/login.jsx";
import ForgotPassword from "@/pages/forgot-password.tsx";
import Dashboard from "@/pages/dashboard.tsx";
import ImportData from "@/pages/import-data.jsx";
import UserList from "@/pages/user-list.jsx";
import GodownMasters from "@/pages/godown-masters.jsx";
import ItemMasters from "@/pages/item-masters.jsx";
import VoucherSettings from "@/pages/voucher-settings.jsx";
import AddInward from "@/pages/add-inward.jsx";
import InwardReports from "@/pages/inward-reports.jsx";
import StockJournal from "@/pages/stock-journal.jsx";
import NotFound from "@/pages/not-found.tsx";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/login" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/import" component={ImportData} />
      <Route path="/users" component={UserList} />
      <Route path="/godown-masters" component={GodownMasters} />
      <Route path="/item-masters" component={ItemMasters} />
      <Route path="/voucher-settings" component={VoucherSettings} />
      <Route path="/add-inward" component={AddInward} />
      <Route path="/reports/inward" component={InwardReports} />
      <Route path="/reports/stock-journal" component={StockJournal} />
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
