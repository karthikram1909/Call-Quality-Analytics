import { useState, useEffect } from 'react';
import { Phone, RefreshCw } from 'lucide-react';
import Filters from './components/Filters';
import AnalyticsCards from './components/AnalyticsCards';
import SopScoreChart from './components/SopScoreChart';
import CallLogsTable from './components/CallLogsTable';
import { fetchCallLogs, getTodayString, CallLog, parseSopScore } from './services/callLogsService';

function App() {
  const [allLogs, setAllLogs] = useState<CallLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<CallLog[]>([]);
  const [todayLogs, setTodayLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);

  const [dateFilter, setDateFilter] = useState('');
  const [staffNameFilter, setStaffNameFilter] = useState('');
  const [sopScoreFilter, setSopScoreFilter] = useState('');

  const loadCallLogs = async () => {
    setLoading(true);
    const logs = await fetchCallLogs();
    setAllLogs(logs);
    setFilteredLogs(logs);

    const today = getTodayString();
    const todayData = logs.filter(log => log.call_datetime.startsWith(today));
    setTodayLogs(todayData);
    setLoading(false);
  };

  useEffect(() => {
    loadCallLogs();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...allLogs];

      if (dateFilter) {
        filtered = filtered.filter((log) => log.call_datetime.startsWith(dateFilter));
      }

      if (staffNameFilter) {
        const query = staffNameFilter.toLowerCase();
        filtered = filtered.filter((log) =>
          log.staff_name.toLowerCase().includes(query)
        );
      }

      if (sopScoreFilter) {
        const score = parseInt(sopScoreFilter);
        filtered = filtered.filter((log) => Math.floor(parseSopScore(log.sop_score)) === score);
      }

      setFilteredLogs(filtered);
    };

    applyFilters();
  }, [dateFilter, staffNameFilter, sopScoreFilter, allLogs]);

  const handleReset = () => {
    setDateFilter('');
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
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading call logs...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Filters
              date={dateFilter}
              staffName={staffNameFilter}
              sopScore={sopScoreFilter}
              onDateChange={setDateFilter}
              onStaffNameChange={setStaffNameFilter}
              onSopScoreChange={setSopScoreFilter}
              onReset={handleReset}
            />

            <AnalyticsCards todayLogs={todayLogs} />

            <SopScoreChart todayLogs={todayLogs} />

            <CallLogsTable logs={filteredLogs} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
