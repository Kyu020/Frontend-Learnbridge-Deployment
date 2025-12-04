'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestJitsi() {
  const [roomId, setRoomId] = useState('');
  const [displayName, setDisplayName] = useState('Test User');
  const router = useRouter();

  const joinMeeting = () => {
    if (!roomId.trim()) {
      alert('Please enter a room ID');
      return;
    }
    router.push(`/meeting/${roomId}?displayName=${encodeURIComponent(displayName)}`);
  };

  const testWithBackend = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in first');
        return;
      }

      // Create a test meeting via backend
      const response = await fetch('https://backend-learnbridge.onrender.com/api/meetings/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: 'Automated Test Meeting',
          description: 'Testing Jitsi integration',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
          participants: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        setRoomId(data.meeting.roomId);
        alert(`Meeting created! Room ID: ${data.meeting.roomId}`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to create meeting:', error);
      alert('Failed to create meeting. Check console for details.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Jitsi Integration</h1>
      
      <div className="space-y-4">
        {/* Manual Test */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Manual Test</h2>
          <input
            type="text"
            placeholder="Enter any room name"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={joinMeeting}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Join Meeting (Manual)
          </button>
        </div>

        {/* Backend Integration Test */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Backend Integration Test</h2>
          <button
            onClick={testWithBackend}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Create Meeting via Backend
          </button>
        </div>

        {/* Quick Test Buttons */}
        <div className="border p-4 rounded">
          <h2 className="font-semibold mb-2">Quick Test</h2>
          <div className="space-y-2">
            <button
              onClick={() => setRoomId('test-room-' + Date.now())}
              className="w-full bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
            >
              Generate Random Room
            </button>
            <button
              onClick={() => router.push('/meeting/learnbridge-test-room')}
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            >
              Join "learnbridge-test-room"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}