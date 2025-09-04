'use client';

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Loader2, Mic, Video } from 'lucide-react';
import { MeetingDetails } from '@/types/MeetingDetails';
import { UserType } from '@/types/UsetType';
import { useRouter } from 'next/navigation';
import axios from 'axios';
const VideoOptions = ({
  isVideoOn,
  setIsVideoOn,
  loading,
  podcast,
  email,
  isAudioOn,
  setIsAudioOn,
  hasUsers,
  users,
  name,
  profilePhotoColor
}: {
  isVideoOn: boolean;
  setIsVideoOn: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  podcast: MeetingDetails;
  email: string;
  isAudioOn:boolean;
  setIsAudioOn: React.Dispatch<React.SetStateAction<boolean>>;
  hasUsers:boolean;
  users:UserType[];
  name:string;
  profilePhotoColor:string;
}) => {


  if (loading || !podcast) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 font-poppins">
        <h1 className="text-2xl text-gray-700 animate-pulse">Getting Ready...</h1>
      </div>
    );
  }

  const now = new Date();
  const podcastDate = new Date(podcast.date);
  const hoursDiff = (now.getTime() - podcastDate.getTime()) / (1000 * 60 * 60);
  const isExpired = hoursDiff > 24;
  const [isLoading,setIsLoading] = useState<boolean>(false)
  const router = useRouter();
  let actionLabel: string;
  if (isExpired) {
    actionLabel = 'Podcast is expired';
  } else if (hasUsers) {
    actionLabel = 'Join Now';
  } else {
    actionLabel = email === podcast.email ? 'Start Now' : 'Join Anyways';
  }
  const joinPodcast = async  () => {
  
    setIsLoading(true)
    try {
      const { data }= await axios.post('/api/meeting/generateToken', {podcast,isVideoOn,isAudioOn,email,profilePhotoColor,name})
      if(data.success){
        window.location.href=`/meeting/${podcast.username}?token=${data.message}`
      }
    } catch (error) {
      console.log(error)
    }finally{
      setIsLoading(false)
    }
  }
  return (
    <div className="w-full h-full flex flex-col items-center justify-center font-poppins ">
      <div className=" backdrop-blur-xl shadow-xl rounded-xl p-8 w-[90%] max-w-md text-center border border-gray-200 space-y-6 transition-all duration-300 ease-in-out">
        <h1 className="text-3xl font-semibold text-gray-800">Ready to Join?</h1>
                {hasUsers ? (
          <div className="flex items-center justify-center gap-2">
            {users.slice(0, 3).map((user, index) => (
              <div
                key={index}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: user.profilePhotoColor }}
              >
                {user.name.charAt(0).toUpperCase()}
              </div>
            ))}
            {users.length > 3 && (
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-gray-800 font-semibold">
                +{users.length - 3}
              </div>
            )}
          </div>
        )    : (
          <p className="text-gray-600">
            {(() => {
              const now = new Date();
              const podcastDate = new Date(podcast.date);
              const diffMs = podcastDate.getTime() - now.getTime();
              const diffMinutes = Math.floor(diffMs / (1000 * 60));
              const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
              const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

              if (diffMinutes < 60 && diffMinutes > 0) {
                return `Podcast begins in ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
              } else if (diffHours < 24 && diffHours > 0) {
                return `Podcast begins in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
              } else if (diffDays < 7 && diffDays > 0) {
                return `Podcast begins in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
              } else if (diffDays >= 7) {
                return `Podcast scheduled for ${podcastDate.toLocaleDateString()}`;
              } else {
                return `Podcast is currently active`;
              }
            })()}
          </p>
        )}

        <div className="flex items-center justify-center gap-x-6">
          <button
            className={`w-16 h-16 flex items-center justify-center rounded-full border transition-all duration-200 ${
              isVideoOn
                ? 'bg-white border-green-600 text-green-600 hover:bg-green-50'
                : 'bg-red-600 text-white border-red-700 hover:bg-red-700'
            }`}
            onClick={() => setIsVideoOn(!isVideoOn)}
          >
            <Video className="w-6 h-6" />
          </button>

          <button className={`w-16 h-16 flex items-center justify-center rounded-full ${
              isAudioOn
                ? 'bg-white border-green-600 text-green-600 hover:bg-green-50'
                : 'bg-red-600 text-white border-red-700 hover:bg-red-700'
            } transition-all duration-200`}
          onClick={()=>{isAudioOn ? setIsAudioOn(false) : setIsAudioOn(true)}}
          >
            <Mic className="w-6 h-6" />
          </button>
        </div>

        {!isExpired ? (
          <Button
            variant="default"
            className="w-full py-3 text-base rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
            onClick={()=>joinPodcast()}
          >
            {isLoading ? <Loader2 className='w-4 h-4 text-white animate-spin'/>: actionLabel}
          </Button>
        ) : (
          <p className="text-sm text-red-600 font-medium">{actionLabel}</p>
        )}
      </div>
    </div>
  );
};

export default VideoOptions;
