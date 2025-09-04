"use client"
import DetailsCard from "@/components/app/create/DetailsCard";
import InstantMeeting from "@/components/app/home/InstantMeeting";
import RecentPodcasts from "@/components/app/home/RecentPodcasts";
import ScheduledPodcasts from "@/components/app/home/ScheduledPodcasts";
import { useDetails } from "@/context/ShowDetailsContext";
import { useEffect, useRef } from "react";



export default function Home() {
  const { details,setDetails } = useDetails()
  const detailsRef = useRef<HTMLDivElement>(null)

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        setDetails(undefined)
      }
    }
  
    if (details) {
      document.addEventListener('mousedown', handleClickOutside)
    }
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [details])
  
  return (
   <div className="flex  flex-col w-full h-full ">
    <InstantMeeting/>
    <ScheduledPodcasts/>
   

            {details !== undefined && (
  <div className='fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30'>
    <div ref={detailsRef}>
      <DetailsCard
        email={details.email}
        username={details.username}
        password={details.password}
        invitationLink={details.invitationLink}
      />
    </div>
  </div>
)}
   </div>
  );
}
