import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { CallLog, parseSopScore } from '../services/callLogsService';

interface SopScoreChartProps {
  todayLogs: CallLog[];
}

export default function SopScoreChart({ todayLogs }: SopScoreChartProps) {
  // Aggregate scores by staff
  const staffPerformance = todayLogs.reduce((acc, log) => {
    if (!acc[log.staff_name]) {
      acc[log.staff_name] = { total: 0, count: 0 };
    }
    acc[log.staff_name].total += parseSopScore(log.sop_score);
    acc[log.staff_name].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const chartData = Object.entries(staffPerformance)
    .map(([name, { total, count }]) => ({
      name,
      score: Number((total / count).toFixed(1)),
      calls: count,
    }))
    .sort((a, b) => b.score - a.score);

  const getBarColor = (score: number) => {
    if (score >= 8) return '#22c55e'; // green-500
    if (score >= 6) return '#eab308'; // yellow-500
    if (score >= 4) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">
          Today's Average SOP Score
        </h2>
      </div>

      {chartData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No data available for today</p>
        </div>
      ) : (
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
                        <p className="font-semibold text-gray-800">{data.name}</p>
                        <p className="text-sm text-gray-600">
                          Average Score: <span className="font-bold">{data.score}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          Based on {data.calls} calls
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="score"
                radius={[0, 4, 4, 0]}
                barSize={32}
                background={{ fill: '#f3f4f6' }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
