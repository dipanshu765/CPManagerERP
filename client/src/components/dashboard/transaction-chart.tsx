import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardData } from "@shared/schema";

interface TransactionChartProps {
  data: DashboardData;
}

export default function TransactionChart({ data }: TransactionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const loadChart = async () => {
      if (!canvasRef.current) return;

      // Dynamic import of Chart.js
      const { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } = await import('chart.js');
      
      Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

      // Destroy existing chart if it exists
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Consumption', 'Production', 'Brand Transfer', 'Stock Transfer'],
          datasets: [{
            label: 'Transaction Count',
            data: [
              data.consumptionNotes,
              data.productionNotes,
              data.brandTransfers,
              data.stockTransfers
            ],
            backgroundColor: [
              'rgba(147, 51, 234, 0.8)', // Purple
              'rgba(99, 102, 241, 0.8)', // Indigo
              'rgba(20, 184, 166, 0.8)', // Teal
              'rgba(249, 115, 22, 0.8)'  // Orange
            ],
            borderColor: [
              'rgba(147, 51, 234, 1)',
              'rgba(99, 102, 241, 1)',
              'rgba(20, 184, 166, 1)',
              'rgba(249, 115, 22, 1)'
            ],
            borderWidth: 2,
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    };

    loadChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Overview</h3>
        <div className="h-64">
          <canvas ref={canvasRef} />
        </div>
      </CardContent>
    </Card>
  );
}
