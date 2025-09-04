import { Info, Mic, MicOff, Users, Video, VideoOff } from 'lucide-react';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import DetailsCard from '../app/create/DetailsCard';
import { Socket } from 'socket.io-client';
import axios from 'axios';

const MeetingButtons = ({
  isAudioOn,
  isVideoOn,
  setIsVideoOn,
  setIsAudioOn,
  email,
  username,
  password,
  invitationLink,
  setLeaveMeeting
}: {
  isAudioOn: boolean;
  isVideoOn: boolean;
  setIsVideoOn:React.Dispatch<SetStateAction<boolean>>
  setIsAudioOn:React.Dispatch<SetStateAction<boolean>>
  email:string;
  username:string;
  password:string;
  invitationLink:string;
  setLeaveMeeting:React.Dispatch<SetStateAction<boolean>>
}) => {

  const detailsRef = useRef<HTMLDivElement>(null)
  const btnClassname = "w-4 h-4";
  const [isOpen,setIsOpen] = useState<boolean>(false)
  const buttons = [
    {
      icon: isAudioOn ? (
        <Mic className={`${btnClassname} text-blue-600`} />
      ) : (
        <MicOff className={`${btnClassname} text-white`} />
      ),
      isOn: isAudioOn,
      name: "Mic",
      onClick: () => setIsAudioOn(isAudioOn ? false : true),
    },
    {
      icon: isVideoOn ? (
        <Video className={`${btnClassname} text-blue-600`} />
      ) : (
        <VideoOff className={`${btnClassname} text-white`} />
      ),
      isOn: isVideoOn,
      name: "Video",
      onClick: () => setIsVideoOn(isVideoOn ? false : true),
    },
  
    {
      icon: <Info className={`${btnClassname} text-white`} />,
      isOn: false,
      name: "Details",
      onClick: () => isOpen ? setIsOpen(false) : setIsOpen(true),
    },
  ];
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  if (isOpen) {
    document.addEventListener('mousedown', handleClickOutside)
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}, [isOpen])
const leaveMeeting = async ()=>{
  const  info = {
    email:email,
    username:username
  } 
  setLeaveMeeting(true)
  const { data } = await axios.get('/api/meeting/deleteToken')
  if(data.success) return window.location.href = '/dashboard'
  
 
}
  return (
    <div className="flex w-full items-center justify-center px-8 py-4 gap-x-8 font-poppins border-t border-solid border-t-gray-200 bg-white">
      {/* Control Buttons */}
      <div className="flex gap-x-4">
        {buttons.map((button, id) => (
          <div
            key={id}
            onClick={button.onClick}
            className={`rounded-md px-3 py-3 flex items-center justify-center cursor-pointer transition-all duration-200
              ${button.isOn ? "bg-transparent border border-solid border-blue-600 " : "bg-blue-600 hover:bg-blue-600 border border-solid border-blue-600"}
            `}
            title={button.name}
          >
            {button.icon}
          </div>
        ))}
      </div>
 
      {/* Leave Meeting */}
      <Button
        variant="destructive"
        size="lg"
        className="text-xs rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
        onClick={()=>leaveMeeting()}
      >
        Leave Meeting
      </Button>
      {isOpen &&
       <div className='fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30'>
    <div ref={detailsRef}>
      <DetailsCard
        email={email}
        username={username}
        password={password}
        invitationLink={invitationLink}
      />
    </div>
  </div>
      }
    </div>
  );
};

export default MeetingButtons;
