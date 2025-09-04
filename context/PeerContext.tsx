"use client";

import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type PeerContextType = {
  peer: RTCPeerConnection | null;
  createOffer: () => Promise<RTCSessionDescriptionInit>;
  createAnswer: (
    offer: RTCSessionDescriptionInit
  ) => Promise<RTCSessionDescriptionInit>;
  acceptAnswer: (answer: RTCSessionDescriptionInit) => Promise<void>;
  localStream: MediaStream | null;
  setLocalStream: React.Dispatch<SetStateAction<MediaStream | null>>;
  remoteStream: MediaStream | null;
  setRemoteStream: React.Dispatch<SetStateAction<MediaStream | null>>;
  sendStream: (stream: MediaStream) => void;
  getTracks: () => void;
  pendingCandidates:React.MutableRefObject<RTCIceCandidateInit[]>;
};

const PeerContext = createContext<PeerContextType | null>(null);

export const PeerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [peer, setPeer] = useState<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const pendingCandidates = useRef<RTCIceCandidateInit[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const newPeer = new RTCPeerConnection({
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
      });

      newPeer.addEventListener("track", (ev) => {
        const stream = ev.streams;
        setRemoteStream(stream[0]);
      });

   

      setPeer(newPeer);
    }
  }, []);

  const getTracks = () => {
    if (!peer) throw new Error("Peer not initialized");
    peer.addEventListener("track", (ev) => {
      const stream = ev.streams;
      setRemoteStream(stream[0]);
    });
  };

  const createOffer = async (): Promise<RTCSessionDescriptionInit> => {
    
    if (!peer) throw new Error("Peer not initialized");
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

 const createAnswer = async (offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {
  if (!peer) throw new Error("Peer not initialized");
  await peer.setRemoteDescription(offer);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);

  // 🔹 Apply pending candidates
  while (pendingCandidates.current.length > 0) {
  const candidate = pendingCandidates.current.shift();
  if (candidate) {
    try {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Error applying queued candidate:", err);
    }
  }
}

  return answer;
};


 const acceptAnswer = async (answer: RTCSessionDescriptionInit): Promise<void> => {
  if (!peer) throw new Error("Peer not initialized");
  if (peer.signalingState !== "have-local-offer") return;

  await peer.setRemoteDescription(answer);

  // 🔹 Apply pending candidates after remote desc is set
 while (pendingCandidates.current.length > 0) {
  const candidate = pendingCandidates.current.shift();
  if (candidate) {
    try {
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("Error applying queued candidate:", err);
    }
  }
}
};


  const sendStream = (stream?: MediaStream): void => {
        console.log("O My Good")
    if (!peer) return;
    const activeStream = stream;

    if (!activeStream) return;

    // ✅ Remove old senders before re-adding to avoid duplicates
    const senders = peer.getSenders();
    activeStream.getTracks().forEach((track) => {
      const sender = senders.find((s) => s.track?.kind === track.kind);
      if (sender) {
        sender.replaceTrack(track); // replace if exists
      } else {
        peer.addTrack(track, activeStream);
      }
    });
  };

  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        acceptAnswer,
        localStream,
        setLocalStream,
        sendStream,
        remoteStream,
        setRemoteStream,
        getTracks,
        pendingCandidates
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};

export const usePeer = (): PeerContextType => {
  const context = useContext(PeerContext);
  if (!context) throw new Error("Please wrap context within a PeerProvider!");
  return context;
};