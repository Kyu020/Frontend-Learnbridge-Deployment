import { Meeting, CreateMeetingData } from '@/interfaces/meeting.interfaces';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const meetingService = {
  async createMeeting(data: CreateMeetingData): Promise<Meeting> {
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create meeting');
    }

    return response.json();
  },

  async getMeeting(id: string): Promise<Meeting> {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get meeting');
    }

    return response.json();
  },

  async getUserMeetings(): Promise<Meeting[]> {
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get meetings');
    }

    return response.json();
  },
};