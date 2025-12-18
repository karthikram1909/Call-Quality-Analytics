import { useState, useEffect } from 'react';
import { Phone, RefreshCw } from 'lucide-react';
import Filters from './components/Filters';
import AnalyticsCards from './components/AnalyticsCards';
import SopScoreChart from './components/SopScoreChart';
import CallLogsTable from './components/CallLogsTable';
import { fetchCallLogs, CallLog, parseSopScore } from './services/callLogsService';

function App() {
  const [allLogs, setAllLogs] = useState<CallLog[]>([]);

  const [filteredLogs, setFilteredLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [staffNameFilter, setStaffNameFilter] = useState('');
  const [sopScoreFilter, setSopScoreFilter] = useState('');

  const loadCallLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const logs = await fetchCallLogs();
      setAllLogs(logs);
      setFilteredLogs(logs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load call logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCallLogs();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...allLogs];

      if (fromDate) {
        filtered = filtered.filter((log) => {
          const logDateObj = new Date(log.call_datetime);
          const logDate = `${logDateObj.getFullYear()}-${String(logDateObj.getMonth() + 1).padStart(2, '0')}-${String(logDateObj.getDate()).padStart(2, '0')}`;
          return logDate >= fromDate;
        });
      }

      if (toDate) {
        filtered = filtered.filter((log) => {
          const logDateObj = new Date(log.call_datetime);
          const logDate = `${logDateObj.getFullYear()}-${String(logDateObj.getMonth() + 1).padStart(2, '0')}-${String(logDateObj.getDate()).padStart(2, '0')}`;
          return logDate <= toDate;
        });
      }

      if (staffNameFilter) {
        const query = staffNameFilter.toLowerCase();
        filtered = filtered.filter((log) =>
          log.staff_name.toLowerCase().includes(query)
        );
      }

      if (sopScoreFilter) {
        filtered = filtered.filter((log) => {
          const score = parseSopScore(log.sop_score);
          return score.toString().includes(sopScoreFilter);
        });
      }

      setFilteredLogs(filtered);
    };

    applyFilters();
  }, [fromDate, toDate, staffNameFilter, sopScoreFilter, allLogs]);

  const handleReset = () => {
    setFromDate('');
    setToDate('');
    setStaffNameFilter('');
    setSopScoreFilter('');
    setFilteredLogs(allLogs);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Call Quality Analytics</h1>
                <p className="text-gray-500 mt-1">Monitor and analyze call performance</p>
                <p className="text-xs text-gray-400">Debug: All: {allLogs.length} | Filt: {filteredLogs.length} | First: {allLogs[0]?.call_datetime}</p>
              </div>
            </div>
            <button
              onClick={loadCallLogs}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center text-red-600 bg-red-50 p-8 rounded-lg shadow-sm">
              <p className="text-lg font-semibold mb-2">Error Loading Data</p>
              <p>{error}</p>
              <button
                onClick={loadCallLogs}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading call logs...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Filters
              fromDate={fromDate}
              toDate={toDate}
              staffName={staffNameFilter}
              sopScore={sopScoreFilter}
              onFromDateChange={setFromDate}
              onToDateChange={setToDate}
              onStaffNameChange={setStaffNameFilter}
              onSopScoreChange={setSopScoreFilter}
              onReset={handleReset}
            />

            <AnalyticsCards logs={filteredLogs} />

            <SopScoreChart logs={filteredLogs} />

            <CallLogsTable logs={filteredLogs} />


          </div>
        )}
      </main>
    </div>
  );
}

export default App;
