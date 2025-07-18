import { Card, CardContent } from "@/components/ui/card";
import { MinusCircle, PlusCircle, ArrowRightLeft, Truck } from "lucide-react";
import type { DashboardData } from "@shared/schema";

interface VoucherTypesMetricsProps {
  data: DashboardData;
}

export default function VoucherTypesMetrics({ data }: VoucherTypesMetricsProps) {
  const voucherTypes = [
    {
      title: "Consumption Note",
      value: data.consumptionNotes,
      description: "Raw to Process Items",
      icon: MinusCircle,
      borderColor: "border-purple-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "Production Note",
      value: data.productionNotes,
      description: "Process to Final Items",
      icon: PlusCircle,
      borderColor: "border-indigo-500",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      title: "Brand Transfer",
      value: data.brandTransfers,
      description: "Source to Destination",
      icon: ArrowRightLeft,
      borderColor: "border-teal-500",
      iconBg: "bg-teal-100",
      iconColor: "text-teal-600",
    },
    {
      title: "Stock Transfer",
      value: data.stockTransfers,
      description: "Location Transfer",
      icon: Truck,
      borderColor: "border-orange-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Voucher Types Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {voucherTypes.map((voucher, index) => {
          const Icon = voucher.icon;
          return (
            <Card
              key={index}
              className={`shadow-sm border-l-4 ${voucher.borderColor} hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{voucher.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{voucher.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{voucher.description}</p>
                  </div>
                  <div className={`${voucher.iconBg} p-3 rounded-lg`}>
                    <Icon className={`${voucher.iconColor} h-5 w-5`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
