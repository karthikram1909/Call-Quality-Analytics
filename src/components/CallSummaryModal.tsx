import { X } from 'lucide-react';
import { CallLog } from '../services/callLogsService';

interface CallSummaryModalProps {
  log: CallLog;
  onClose: () => void;
}

export default function CallSummaryModal({ log, onClose }: CallSummaryModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-bold text-gray-800">Call Summary</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Staff Name</p>
              <p className="font-medium text-gray-900">{log.staff_name}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Date Time</p>
              <p className="font-medium text-gray-900">
                {new Date(log.call_datetime).toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
             <p className="text-sm text-gray-500 mb-1">SOP Score</p>
             <div className="flex items-center gap-3">
                 <span className={`text-2xl font-bold ${
                     log.sop_score === 'N/A' || log.sop_score === 'n/a' ? 'text-gray-500' : 'text-blue-600'
                 }`}>
                     {log.sop_score}
                 </span>
             </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Call Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.entries(log)
                .filter(([key]) => !['id', 'staff_name', 'call_datetime', 'sop_score', 'customer_number'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="font-medium text-gray-800 break-words">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
