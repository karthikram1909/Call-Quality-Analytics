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
    let url = BASE_URL;

    if (params) {
      const queryParams = new URLSearchParams();
      if (params.date) queryParams.append('date', params.date);
      if (params.staff_name) queryParams.append('staff_name', params.staff_name);
      if (params.sop_score !== undefined) queryParams.append('sop_score', params.sop_score.toString());

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch call logs');
    }

    const json = await response.json();
    return Array.isArray(json) ? json : (json.data || []);
  } catch (error) {
    console.error('Error fetching call logs:', error);
    return [];
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
