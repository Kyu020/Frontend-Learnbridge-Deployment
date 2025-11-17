'use client';

import { useState } from 'react';
import { meetingService } from '@/services/meeting.service';

export function CreateMeetingForm() {
  const [title, setTitle] = useState('');

  const handleCreateMeeting = async () => {
    try {
      const meeting = await meetingService.createMeeting({
        title,
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour later
        participants: [],
      });

      // Redirect to meeting room
      window.open(`/meeting/${meeting.roomId}`, '_blank');
    } catch (error) {
      console.error('Failed to create meeting:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Meeting title"
      />
      <button onClick={handleCreateMeeting}>
        Start Meeting
      </button>
    </div>
  );
}