"use client";

import MeetingButtons from "@/components/meeting/MeetingButtons";
import MeetingNavbar from "@/components/meeting/MeetingNavbar";
import VideoDisplay from "@/components/meeting/VideoDisplay";
import { usePeer } from "@/context/PeerContext";
import { DataType } from "@/types/DataType";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {  useSearchParams } from "next/navigation";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";

export default function Home() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [otherUser, setOtherUser] = useState("");
  const [otherProfilePhotoColor, setOtherProfilePhotoColor] = useState("");
  const [otherUserAudioOn, setOtherUserAudioOn] = useState(false);
  const [otherUserVideoOn, setOtherUserVideoOn] = useState(false);
  const [leaveMeeting,setLeaveMeeting] = useState<boolean>(false)
 

  const emailRef = useRef("");
  const usernameRef = useRef("");
  const nameRef = useRef("");
  const invitationLinkRef = useRef("")
  const passwordRef = useRef("")
  const profilePhotoColorRef = useRef("");

    const {
    peer,
    createOffer,
    createAnswer,
    acceptAnswer,
    localStream,
    setLocalStream,
    sendStream,
    getTracks,
    pendingCandidates
  } = usePeer();

  const socketRef = useRef<Socket | null>(null);
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
 
  // Init socket once
  useEffect(() => {
    socketRef.current = io(backendURL ? backendURL : "http://localhost:4000")
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ''; 
    const leaveMeeting = async ()=>{
  const  info = {
    email:emailRef.current,
    username:usernameRef.current
  } 
  setLeaveMeeting(true)
  const { data } = await axios.get('/api/meeting/deleteToken')
  if(data.success) return window.location.href = '/dashboard'
  
 
}
leaveMeeting()
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);
  // Join meeting
  useEffect(() => {
    if (!token || !socketRef.current) return;
    const data: DataType = jwtDecode(token);

    setIsAudioOn(data.isAudioOn);
    setIsVideoOn(data.isVideoOn);

    emailRef.current = data.email;
    usernameRef.current = data.podcast.username;
    nameRef.current = data.name;
    profilePhotoColorRef.current = data.profilePhotoColor;
    invitationLinkRef.current = data.podcast.invitationLink;
    passwordRef.current = data.podcast.password
    setIsAudioOn(data.isAudioOn)
    setIsVideoOn(data.isVideoOn)
    socketRef.current.emit("joinMeeting", {
      username: data?.podcast.username,
      name: data?.name,
      email: data?.email,
      profilePhotoColor: data?.profilePhotoColor,
          isAudioOn: data?.isAudioOn, 
    isVideoOn: data?.isVideoOn,
    });
    return ()=>{
    socketRef.current?.off("joinMeeting")
    }
  }, [token]);

  // ---- Signaling handlers ----
 const sendOffer = useCallback(
  async ({
    name,
    profilePhotoColor,
    email,
  }: {
    name: string;
    profilePhotoColor: string;
    email: string;
  }) => {
    if (email === emailRef.current) return;

    const offer = await createOffer();
    const data = {
      from: emailRef.current,
      to: email,
      offer,
      username: usernameRef.current,
      isAudioOn,
      isVideoOn, // ✅ include video state
    };

    socketRef.current?.emit("sendOffer", data);
    setOtherProfilePhotoColor(profilePhotoColor);
    setOtherUser(email);
    console.log("Offer sent:", data);
  },
  [createOffer, isAudioOn, isVideoOn]
);

const sendAnswer = useCallback(
  async ({
    from,
    offer,
    isAudioOn,
    isVideoOn, // ✅ also receive video state
  }: {
    from: string;
    offer: RTCSessionDescriptionInit;
    isAudioOn: boolean;
    isVideoOn: boolean;
  }) => {
    const answer = await createAnswer(offer);
    const data = {
      answer,
      to: from,
      from: emailRef.current,
      username: usernameRef.current,
      isAudioOn,
      isVideoOn, // ✅ pass it forward
    };
    setOtherUserAudioOn(isAudioOn);
    setOtherUserVideoOn(isVideoOn); // ✅ set remote video state
    setOtherUser(from);

    socketRef.current?.emit("sendAnswer", data);

    console.log("Answer sent:", data);
  },
  [createAnswer]
);

useEffect(() => {
  if (!socketRef.current) return;
  const socket = socketRef.current;

  socket.on("userJoined", (data) => {
    console.log("User joined:", data);
    sendOffer(data);
  });

  socket.on("offerSent", (data) => {
    console.log("Offer received:", data);
    sendAnswer(data);
  });

  socket.on("answerRecieved", (data) => {
    console.log("Answer received:", data.answer);
    setOtherUserAudioOn(data.isAudioOn);
    setOtherUserVideoOn(data.isVideoOn); // ✅ update state
    acceptAnswer(data.answer);

    if (otherUserAudioOn || otherUserVideoOn) {
      getUserMedia();
    }
  });

  socket.on("leftMeeting", (data) => {
    setOtherUser("");
    console.log("Deleted Other User", otherUser);
  });

  // 🔹 Listen for mute/unmute + video toggle from others
  socket.on("userAudioToggled", ({ email, isAudioOn }) => {
    if (email !== emailRef.current) {
      setOtherUserAudioOn(isAudioOn);
      if(otherUserAudioOn){
        getTracks()
      }
    }
  });

  socket.on("userVideoToggled", ({ email, isVideoOn }) => {
    if (email !== emailRef.current) {
      setOtherUserVideoOn(isVideoOn);
      if(otherUserVideoOn){
        getTracks()
      }
    }
  });

  return () => {
    socket.off("userJoined");
    socket.off("offerSent");
    socket.off("answerRecieved");
    socket.off("userAudioToggled");
    socket.off("userVideoToggled");
    socket.off("leftMeeting");
  };
}, [sendOffer, sendAnswer, acceptAnswer]);
  
  useEffect(()=>{
    const socket = socketRef.current;
    const data = {email:emailRef.current,
      username:usernameRef.current
    }
    if(leaveMeeting){
    socket?.emit('leaveMeeting', data)
    }
  },[leaveMeeting])
  // Media setup
 // Media setup
const getUserMedia = async () => {
  if (isVideoOn || isAudioOn) {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: isVideoOn,
    });

    // Respect toggle state
    stream.getAudioTracks().forEach(track => (track.enabled = isAudioOn));
    stream.getVideoTracks().forEach(track => (track.enabled = isVideoOn));

    setLocalStream(stream);
    sendStream(stream);
    console.log("User Media Toggled")
  } else {
    setLocalStream(null);
  }
};

  useEffect(() => {
    getUserMedia();
  }, [isAudioOn, isVideoOn]);

  // 🔹 Emit events when toggled
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit("toggleAudio", {
        email: emailRef.current,
        isAudioOn,
      });
    }
  }, [isAudioOn]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.emit("toggleVideo", {
        email: emailRef.current,
        isVideoOn,
      });
    }
  }, [isVideoOn]);

  useEffect(() => {
  if (!socketRef.current || !peer) return;
  const socket = socketRef.current;


  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("iceCandidate", {
        candidate: event.candidate,
        from: emailRef.current,
        to: otherUser,
        username: usernameRef.current,
      });
    }
  };



socket.on("iceCandidate", async ({ candidate, from }) => {
  
    if (peer?.remoteDescription && peer.remoteDescription.type) {
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("ICE candidate added:", candidate);
      } catch (err) {
        console.error("Error adding ICE candidate:", err);
      }
    
  }
});



  return () => {
    socket.off("iceCandidate");
  };
}, [peer, otherUser]);

useEffect(() => {
  console.log("UseEffect Entered My Boy!")
  if (!peer || !socketRef.current) return;
  const socket = socketRef.current;

  // 🔹 When peer needs renegotiation (track added/replaced)
// 🔹 When peer needs renegotiation (track added/replaced)
peer.onnegotiationneeded = async () => {
  try {
    if (peer.signalingState !== "stable") {
      console.warn("Skip renegotiation: signaling state not stable", peer.signalingState);
      return;
    }

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    socket.emit("renegotiateOffer", {
      from: emailRef.current,
      to: otherUser,
      offer,
      username: usernameRef.current,
    });

    console.log("Renegotiation offer sent");
  } catch (err) {
    console.error("Error during renegotiation:", err);
  }
};

// 🔹 Listen for renegotiation offer
socket.on("renegotiateOfferSent", async ({ from, offer }) => {
  try {
    if (peer.signalingState !== "stable") {
      console.warn("Skip handling renegotiation offer, state:", peer.signalingState);
      return;
    }

    await peer.setRemoteDescription(offer);

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("renegotiateAnswer", {
      from: emailRef.current,
      to: from,
      answer,
      username: usernameRef.current,
    });

    console.log("Renegotiation answer sent");
  } catch (err) {
    console.error("Error handling renegotiation offer:", err);
  }
});

// 🔹 Listen for renegotiation answer
socket.on("renegotiateAnswerSent", async ({ from, answer }) => {
  try {
    if (peer.signalingState === "have-local-offer") {
      await peer.setRemoteDescription(answer);
      console.log("Renegotiation answer applied");
    } else {
      console.warn("Skipping renegotiation answer, state:", peer.signalingState);
    }
  } catch (err) {
    console.error("Error applying renegotiation answer:", err);
  }
});


  return () => {
    socket.off("renegotiateOffer");
    socket.off("renegotiateAnswer");
  };
}, [otherUserVideoOn,peer]);

  return (
    <div className="flex flex-col w-full h-fit">
      <MeetingNavbar />
      <VideoDisplay
        email={emailRef.current}
        otherUser={otherUser}
        profilePhotoColor={profilePhotoColorRef.current}
        otherProfilePhotoColor={otherProfilePhotoColor}
        otherUserAudioOn={otherUserAudioOn}
        otherUserVideoOn={otherUserVideoOn}
        isVideoOn={isVideoOn}
      />
      <MeetingButtons
        isVideoOn={isVideoOn}
        isAudioOn={isAudioOn}
        setIsVideoOn={setIsVideoOn}
        setIsAudioOn={setIsAudioOn}
        email={emailRef.current}
        password={passwordRef.current}
        invitationLink={invitationLinkRef.current}
        username={usernameRef.current} 
        setLeaveMeeting={setLeaveMeeting}
      />
    </div>
  );
}
