import React, { useEffect, useRef } from "react";
import { MicOff } from "lucide-react";
import { usePeer } from "@/context/PeerContext";

const VideoDisplay = ({
  email,
  otherUser,
  profilePhotoColor,
  otherProfilePhotoColor,
  otherUserAudioOn,
  otherUserVideoOn,
  isVideoOn,
}: {
  email:string
  otherUser: string;
  profilePhotoColor: string;
  otherProfilePhotoColor: string;
  otherUserAudioOn: boolean;
  otherUserVideoOn: boolean;
  isVideoOn: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const { localStream, remoteStream } = usePeer();

  // Attach local stream
  useEffect(() => {
    if (videoRef.current && localStream) {
      videoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream (for both video & audio)
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="w-full flex items-start justify-start px-6 py-4 gap-y-4 bg-white h-[82.5vh] gap-x-8">
      {/* My Stream */}
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md">
        {localStream && isVideoOn ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full bg-black flex items-center justify-center text-white text-xl"
            style={{ backgroundColor: profilePhotoColor }}
          >
            {email[0]}
          </div>
        )}
      </div>

      {/* Remote Stream */}
      {otherUser !== "" && (
        <div className="relative w-full h-full rounded-xl overflow-hidden shadow-md">
          {remoteStream && otherUserVideoOn ? (
            <video
              ref={(el) => {
                if (el) {
                  remoteVideoRef.current = el;
                  if (remoteStream) {
                    el.srcObject = remoteStream;
                  }
                }
              }}
              autoPlay
              playsInline
              muted={!otherUserAudioOn}
              className="w-full h-full object-cover bg-black"
            />
          ) : (
            <>
              {/* Black screen with initials */}
              <div
                className="w-full h-full bg-black flex items-center justify-center text-white text-xl"
                style={{ backgroundColor: otherProfilePhotoColor }}
              >
                {otherUser[0]}
              </div>

              {/* Audio player (only plays sound, hidden visually) */}
              {otherUserAudioOn && !otherUserVideoOn && (
                <audio
                  ref={(el)=>{if(el) {remoteAudioRef.current =el; if(remoteStream){
                    el.srcObject = remoteStream
                  }}}}
                  autoPlay
                  playsInline
                  className="hidden"
                />
              )}
            </>
          )}

          {/* Mic Icon */}
          {!otherUserAudioOn && (
            <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 p-2 rounded-full">
              <MicOff className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoDisplay;
