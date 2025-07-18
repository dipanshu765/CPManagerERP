import { Card } from "@/components/ui/card";
import { Inbox, CheckCircle, Clock, XCircle } from "lucide-react";
import type { DashboardData } from "@shared/schema";

interface InwardEntriesMetricsProps {
  data: DashboardData;
}

export default function InwardEntriesMetrics({ data }: InwardEntriesMetricsProps) {
  const metrics = [
    {
      title: "Total Entries",
      value: data.totalInwardEntries,
      icon: Inbox,
      gradient: "from-blue-500 to-blue-600",
      textColor: "text-blue-100",
      bgColor: "bg-blue-400",
    },
    {
      title: "Approved",
      value: data.approvedEntries,
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
      textColor: "text-green-100",
      bgColor: "bg-green-400",
    },
    {
      title: "Pending",
      value: data.pendingEntries,
      icon: Clock,
      gradient: "from-yellow-500 to-yellow-600",
      textColor: "text-yellow-100",
      bgColor: "bg-yellow-400",
    },
    {
      title: "Rejected",
      value: data.rejectedEntries,
      icon: XCircle,
      gradient: "from-red-500 to-red-600",
      textColor: "text-red-100",
      bgColor: "bg-red-400",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Inward Entries Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className={`bg-gradient-to-br ${metric.gradient} shadow-lg p-6 text-white border-0`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${metric.textColor} text-sm mb-1`}>{metric.title}</p>
                  <p className="text-3xl font-bold">{metric.value}</p>
                </div>
                <div className={`${metric.bgColor} bg-opacity-30 p-3 rounded-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
