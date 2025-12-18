import { useState } from 'react';
import { Table, Eye } from 'lucide-react';
import { CallLog, parseSopScore } from '../services/callLogsService';
import CallSummaryModal from './CallSummaryModal';

interface CallLogsTableProps {
  logs: CallLog[];
}

export default function CallLogsTable({ logs }: CallLogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
  
  // Sort logs by newest first
  // Sort logs by newest entry (ID) first, then by date
  const sortedLogs = [...logs].sort((a, b) => {
     // If both have IDs, sort by ID descending (Creation Order)
     if (a.id && b.id) {
        // Try numeric comparison first
        const idA = Number(a.id);
        const idB = Number(b.id);
        if (!isNaN(idA) && !isNaN(idB)) {
          return idB - idA;
        }
        // Fallback to string comparison (e.g. for MongoDB ObjectIDs)
        return String(b.id).localeCompare(String(a.id));
     }
     // Fallback to Date if IDs are missing
     return new Date(b.call_datetime).getTime() - new Date(a.call_datetime).getTime();
  });

  const getScoreBadgeColor = (rawScore: string | number) => {
    const score = parseSopScore(rawScore);
    if (score >= 8) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 4) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex items-center gap-2 p-6 border-b border-gray-200">
        <Table className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Call Logs</h2>
        <span className="ml-auto text-sm text-gray-500">
          {logs.length} {logs.length === 1 ? 'record' : 'records'}
        </span>
      </div>

      <div className="overflow-x-auto">
        {logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No call logs found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Staff Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  SOP Score
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedLogs.map((log, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(log.call_datetime).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-3">
                        {log.staff_name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {log.staff_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getScoreBadgeColor(log.sop_score)}`}>
                      {log.sop_score}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedLog && (
        <CallSummaryModal
          log={selectedLog}
          onClose={() => setSelectedLog(null)}
        />
      )}
    </div>
  );
}
