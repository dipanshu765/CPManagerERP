import { Card, CardContent } from "@/components/ui/card";
import type { DashboardData } from "@shared/schema";

interface StockSyncStatusProps {
  data: DashboardData;
}

export default function StockSyncStatus({ data }: StockSyncStatusProps) {
  const syncStatus = data.isSynced ? 'Synced' : 'Out of Sync';
  const difference = data.tallyItemCount - data.syncedItemCount;

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Synchronization</h3>
        
        <div className="space-y-4">
          <div className={`flex items-center justify-between p-4 rounded-lg border ${
            data.isSynced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                data.isSynced ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className={`font-medium ${
                data.isSynced ? 'text-green-800' : 'text-red-800'
              }`}>
                Sync Status
              </span>
            </div>
            <span className={`font-semibold ${
              data.isSynced ? 'text-green-600' : 'text-red-600'
            }`}>
              {syncStatus}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Tally Items</p>
              <p className="text-2xl font-bold text-gray-900">{data.tallyItemCount.toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Synced Items</p>
              <p className="text-2xl font-bold text-gray-900">{data.syncedItemCount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className={`rounded-lg p-4 border ${
            difference === 0 ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-medium ${
                difference === 0 ? 'text-blue-800' : 'text-yellow-800'
              }`}>
                Difference
              </span>
              <span className={`font-semibold ${
                difference === 0 ? 'text-blue-600' : 'text-yellow-600'
              }`}>
                {difference}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
