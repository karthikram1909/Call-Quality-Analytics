import { TrendingUp, TrendingDown, Award } from 'lucide-react';
import { CallLog } from '../services/callLogsService';
import { useState } from 'react';

interface AnalyticsCardsProps {
  logs: CallLog[];
}

export default function AnalyticsCards({ logs }: AnalyticsCardsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'service'>('all');

  // Filter logs by type and valid score
  const getFilteredLogs = (type: 'all' | 'new' | 'service') => {
    return logs.filter(log => {
      const score = String(log.sop_score);
      if (score.toUpperCase() === 'N/A' || score.toUpperCase() === 'NA') return false;
      
      const parts = score.split('/');
      if (parts.length === 2) {
        const denominator = parts[1].trim();
        if (type === 'all') return true;
        if (type === 'new') return denominator === '16';
        if (type === 'service') return denominator === '13';
      }
      return false;
    });
  };

  const currentLogs = getFilteredLogs(activeTab);
  
  const getPercentage = (scoreStr: string | number) => {
    if (typeof scoreStr === 'number') return 0;
    const parts = String(scoreStr).split('/');
    if (parts.length === 2) {
      const num = parseFloat(parts[0].trim());
      const den = parseFloat(parts[1].trim());
      if (den === 0) return 0;
      return (num / den) * 100;
    }
    return 0;
  };



  const getTopScorer = () => {
    if (currentLogs.length === 0) return null;
    return currentLogs.reduce((max, log) =>
      getPercentage(log.sop_score) > getPercentage(max.sop_score) ? log : max
    );
  };

  const getLowestScorer = () => {
    if (currentLogs.length === 0) return null;
    return currentLogs.reduce((min, log) =>
      getPercentage(log.sop_score) < getPercentage(min.sop_score) ? log : min
    );
  };

  const getAverageScore = () => {
    if (currentLogs.length === 0) return 0;
    const sum = currentLogs.reduce((acc, log) => acc + getPercentage(log.sop_score), 0);
    return (sum / currentLogs.length).toFixed(1);
  };

  const topScorer = getTopScorer();
  const lowestScorer = getLowestScorer();
  const averageScore = getAverageScore();

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            activeTab === 'all'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All Calls
        </button>
        <button
          onClick={() => setActiveTab('new')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            activeTab === 'new'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          New Calls (16 pts)
        </button>
        <button
          onClick={() => setActiveTab('service')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            activeTab === 'service'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Service Calls (13 pts)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-green-700">Highest Score</span>
          </div>
          {topScorer ? (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {topScorer.staff_name}
              </h3>
              <p className="text-3xl font-bold text-green-600">
                {topScorer.sop_score}
              </p>
            </>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-md p-6 border border-red-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-500 p-3 rounded-lg">
              <TrendingDown className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-red-700">Lowest Score</span>
          </div>
          {lowestScorer ? (
            <>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">
                {lowestScorer.staff_name}
              </h3>
              <p className="text-3xl font-bold text-red-600">
                {lowestScorer.sop_score}
              </p>
            </>
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-blue-700">Average Score</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-1">
            Team Performance
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {activeTab === 'all' 
              ? `${averageScore}%`
              : `${averageScore}/${activeTab === 'new' ? 16 : 13}`
            }
          </p>
        </div>
      </div>
    </div>
  );
}
