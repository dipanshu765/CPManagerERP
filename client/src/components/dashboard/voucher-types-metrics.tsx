import { Card, CardContent } from "@/components/ui/card";
import { MinusCircle, PlusCircle, ArrowRightLeft, Truck, FileText, Package } from "lucide-react";

interface VoucherType {
  voucher_type_name: string;
  total_transaction_count: number;
  user_transaction_count: number;
  is_batch: boolean;
  is_bardan: boolean;
  in_source: boolean;
  in_destination: boolean;
  source_alias: string;
  destination_alias: string;
}

interface VoucherSummary {
  voucher_types: VoucherType[];
  total_voucher_types: number;
  total_organization_transactions: number;
  total_user_transactions: number;
}

interface VoucherTypesMetricsProps {
  data?: VoucherSummary;
}

export default function VoucherTypesMetrics({ data }: VoucherTypesMetricsProps) {
  const getIconForVoucherType = (voucherName: string) => {
    if (voucherName.toLowerCase().includes('consumption')) return MinusCircle;
    if (voucherName.toLowerCase().includes('production')) return PlusCircle;
    if (voucherName.toLowerCase().includes('brand')) return ArrowRightLeft;
    if (voucherName.toLowerCase().includes('stock')) return Truck;
    return FileText;
  };

  const getColorForVoucherType = (index: number) => {
    const colors = [
      { borderColor: "border-purple-500", iconBg: "bg-purple-100", iconColor: "text-purple-600" },
      { borderColor: "border-indigo-500", iconBg: "bg-indigo-100", iconColor: "text-indigo-600" },
      { borderColor: "border-teal-500", iconBg: "bg-teal-100", iconColor: "text-teal-600" },
      { borderColor: "border-orange-500", iconBg: "bg-orange-100", iconColor: "text-orange-600" },
      { borderColor: "border-green-500", iconBg: "bg-green-100", iconColor: "text-green-600" },
      { borderColor: "border-blue-500", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    ];
    return colors[index % colors.length];
  };

  if (!data || !data.voucher_types) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Voucher Types Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border-l-4 border-gray-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading voucher data...</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Voucher Types Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.voucher_types.map((voucher, index) => {
          const Icon = getIconForVoucherType(voucher.voucher_type_name);
          const colors = getColorForVoucherType(index);
          return (
            <Card
              key={index}
              className={`shadow-sm border-l-4 ${colors.borderColor} hover:shadow-md transition-shadow`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{voucher.voucher_type_name}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {voucher.user_transaction_count}/{voucher.total_transaction_count}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {voucher.source_alias} → {voucher.destination_alias}
                    </p>
                  </div>
                  <div className={`${colors.iconBg} p-3 rounded-lg`}>
                    <Icon className={`${colors.iconColor} h-5 w-5`} />
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
