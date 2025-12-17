import { TrendingUp, TrendingDown, Award } from 'lucide-react';
import { CallLog } from '../services/callLogsService';

interface AnalyticsCardsProps {
  todayLogs: CallLog[];
}

export default function AnalyticsCards({ todayLogs }: AnalyticsCardsProps) {
  const getTopScorer = () => {
    if (todayLogs.length === 0) return null;
    return todayLogs.reduce((max, log) =>
      log.sop_score > max.sop_score ? log : max
    );
  };

  const getLowestScorer = () => {
    if (todayLogs.length === 0) return null;
    return todayLogs.reduce((min, log) =>
      log.sop_score < min.sop_score ? log : min
    );
  };

  const getAverageScore = () => {
    if (todayLogs.length === 0) return 0;
    const sum = todayLogs.reduce((acc, log) => acc + log.sop_score, 0);
    return (sum / todayLogs.length).toFixed(1);
  };

  const topScorer = getTopScorer();
  const lowestScorer = getLowestScorer();
  const averageScore = getAverageScore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-500 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-green-700">Highest Today</span>
        </div>
        {topScorer ? (
          <>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {topScorer.staff_name}
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {topScorer.sop_score}/10
            </p>
          </>
        ) : (
          <p className="text-gray-500">No data for today</p>
        )}
      </div>

      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border border-red-200">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-red-500 p-3 rounded-lg">
            <TrendingDown className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-red-700">Lowest Today</span>
        </div>
        {lowestScorer ? (
          <>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {lowestScorer.staff_name}
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {lowestScorer.sop_score}/10
            </p>
          </>
        ) : (
          <p className="text-gray-500">No data for today</p>
        )}
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-500 p-3 rounded-lg">
            <Award className="w-6 h-6 text-white" />
          </div>
          <span className="text-sm font-medium text-blue-700">Average Today</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-1">
          Team Performance
        </h3>
        <p className="text-3xl font-bold text-blue-600">
          {averageScore}/10
        </p>
      </div>
    </div>
  );
}
