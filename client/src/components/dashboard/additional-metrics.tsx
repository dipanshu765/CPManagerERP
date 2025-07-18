import { Card, CardContent } from "@/components/ui/card";
import { FileText, Coins, IndianRupee } from "lucide-react";
import type { DashboardData } from "@shared/schema";

interface AdditionalMetricsProps {
  data: DashboardData;
}

export default function AdditionalMetrics({ data }: AdditionalMetricsProps) {
  const metrics = [
    {
      title: "Total Voucher Types",
      value: data.totalVoucherTypes,
      icon: FileText,
    },
    {
      title: "Hamali Entries",
      value: data.hamaliEntries,
      icon: Coins,
    },
    {
      title: "Hamali Amount",
      value: `₹${data.hamaliAmount.toFixed(2)}`,
      icon: IndianRupee,
    },
  ];

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-gray-600 h-6 w-6" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{metric.title}</h4>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
