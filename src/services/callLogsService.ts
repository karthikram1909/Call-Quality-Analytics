const BASE_URL = '/call-logs-api/api/call-logs';

export interface CallLog {
  id?: string;
  call_datetime: string;
  staff_name: string;
  sop_score: string | number;
  [key: string]: unknown;
}

interface FetchCallLogsParams {
  date?: string;
  staff_name?: string;
  sop_score?: number;
}

export const fetchCallLogs = async (params?: FetchCallLogsParams): Promise<CallLog[]> => {
  try {
    const urlObj = new URL(BASE_URL, window.location.origin);
    if (params) {
      if (params.date) urlObj.searchParams.append('date', params.date);
      if (params.staff_name) urlObj.searchParams.append('staff_name', params.staff_name);
      if (params.sop_score !== undefined) urlObj.searchParams.append('sop_score', params.sop_score.toString());
    }
    urlObj.searchParams.append('_t', Date.now().toString());

    const response = await fetch(urlObj.toString(), {
      headers: {
        'x-api-key': import.meta.env.VITE_API_KEY
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch call logs: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch (error) {
    console.error('Error fetching call logs:', error);
    throw error;
  }
};

export const getTodayString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export const parseSopScore = (score: string | number): number => {
  if (typeof score === 'number') return score;
  if (!score || score === 'N/A') return 0;

  if (score.includes('/')) {
    const parts = score.split('/');
    const numerator = parseFloat(parts[0].trim());
    const denominator = parseFloat(parts[1].trim());

    // Normalize to 10 if denominator is not 10
    if (denominator && denominator !== 10) {
      return Number(((numerator / denominator) * 10).toFixed(1));
    }
    return numerator;
  }

  return parseFloat(score) || 0;
};
