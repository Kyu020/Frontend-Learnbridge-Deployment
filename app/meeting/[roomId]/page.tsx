'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import CustomJitsiMeeting from '@/components/JitsiMeeting';

export default function MeetingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const roomId = params.roomId as string;
  const displayName = searchParams.get('displayName') || 'User';

  if (!isClient) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <CustomJitsiMeeting
        roomName={roomId}
        userInfo={{
          displayName: displayName,
          email: '',
        }}
        onMeetingEnd={() => window.close()}
      />
    </div>
  );
}