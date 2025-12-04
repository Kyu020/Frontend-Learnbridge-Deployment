import { ProgressData } from '@/interfaces/progress.interfaces';

const API_BASE_URL = 'https://backend-learnbridge.onrender.com/api';

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json',
});

export const ProgressService = {
  async getProgressData(): Promise<ProgressData> {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error("No authentication token found. Please log in again.");
    }

    const response = await fetch(`${API_BASE_URL}/analytics/getuseranalytics`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data) {
      throw new Error("No data received from server");
    }

    return data;
  },
};