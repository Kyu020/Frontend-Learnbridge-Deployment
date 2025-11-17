'use client';

import { JitsiMeeting } from '@jitsi/react-sdk';
import { useAuth } from '@/contexts/authContext';

interface JitsiMeetingProps {
  roomName: string;
  userInfo: {
    displayName: string;
    email: string;
  };
  onMeetingEnd?: () => void;
  isAudioMuted?: boolean;
  isVideoMuted?: boolean;
}

export default function CustomJitsiMeeting({
  roomName,
  userInfo,
  onMeetingEnd,
  isAudioMuted = false,
  isVideoMuted = false
}: JitsiMeetingProps) {
  return (
    <div className="w-full h-full">
      <JitsiMeeting
        domain="meet.jit.si" // Or your self-hosted Jitsi domain
        roomName={roomName}
        configOverwrite={{
          startWithAudioMuted: isAudioMuted,
          startWithVideoMuted: isVideoMuted,
          prejoinPageEnabled: false,
          disableModeratorIndicator: false,
          startScreenSharing: false,
          enableEmailInStats: false,
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
        }}
        userInfo={{
          displayName: userInfo.displayName,
          email: userInfo.email,
        }}
        onApiReady={(externalApi) => {
          console.log('Jitsi Meeting API Ready');
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
        onReadyToClose={onMeetingEnd}
      />
    </div>
  );
}