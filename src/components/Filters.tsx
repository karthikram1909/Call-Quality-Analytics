import { Search, Filter } from 'lucide-react';

interface FiltersProps {
  date: string;
  staffName: string;
  sopScore: string;
  onDateChange: (date: string) => void;
  onStaffNameChange: (name: string) => void;
  onSopScoreChange: (score: string) => void;
  onReset: () => void;
}

export default function Filters({
  date,
  staffName,
  sopScore,
  onDateChange,
  onStaffNameChange,
  onSopScoreChange,
  onReset,
}: FiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Staff Name
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={staffName}
              onChange={(e) => onStaffNameChange(e.target.value)}
              placeholder="Search by staff name"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SOP Score
          </label>
          <input
            type="number"
            value={sopScore}
            onChange={(e) => onSopScoreChange(e.target.value)}
            placeholder="Filter by score"
            min="0"
            max="10"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
