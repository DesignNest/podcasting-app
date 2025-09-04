"use client"
import PreviewVideo from "@/components/meeting/PreviewVideo";
import VideoOptions from "@/components/meeting/VideoOptions";
import { MeetingDetails } from "@/types/MeetingDetails";
import { UserType } from "@/types/UsetType";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client'



export default function Home() {
  const [isVideoOn,setIsVideoOn] = useState<boolean>(false)
  const [meetingDetails,setMeetingDetails] = useState<MeetingDetails>()
  const [loading,setLoading] = useState<boolean>(false)
  const [email,setEmail] = useState<string>("")
  const [isAudioOn,setIsAudioOn] = useState<boolean>(false)
  const [hasUsers,setHasUsers] = useState<boolean>(false)
  const [users,setUsers] = useState<UserType[]>([])
  const [profilePhotoColor,setProfilePhotoColor] = useState("")
  const [name,setName] = useState("")
  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const socket = io(backendURL ? backendURL : "http://localhost:4000")
  useEffect(()=>{
    const getEmail = async ()=>{
      setLoading(true)
      try {
        const { data } = await axios.get('/api/app/getToken')
        if(data.success){
          const token = jwtDecode(data.message.value)
          setEmail(token.email)
          setName(token.username)
          setProfilePhotoColor(token.profilePhotoColor)
          socket.emit('join', token.email)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getEmail()
    const getToken  = async  ()=>{
      
       try {
        const { data } = await axios.get('/api/meeting/getToken');
        if(data.success){
          const token = jwtDecode(data.message.value)
          
          setMeetingDetails(token)
          
        }
       } catch (error) {
        console.log(error)
    
       }finally{
        setLoading(false)
       }
    }
    getToken()
    
  }, [])

  useEffect(()=>{
    socket.emit("getUsers", {
      username:meetingDetails?.username,
      myEmail:email
    })
  },[socket])

  useEffect(()=>{
       socket.on("UsersList", (data)=>{
        const { users,hasUsers } = data;
        setHasUsers(hasUsers)
        setUsers[users]
        console.log(data)
       })
  },[])
  return (
   <div className="flex items-start justify-start w-full h-full ">
     <div className="w-1/2 h-full">
         <PreviewVideo isVideoOn={isVideoOn} setIsVideoOn={setIsVideoOn}/>
     </div>

     <div className="w-1/2 h-full">
       <VideoOptions isVideoOn={isVideoOn} setIsVideoOn={setIsVideoOn} loading={loading} podcast={meetingDetails} email={email} isAudioOn={isAudioOn} setIsAudioOn={setIsAudioOn} hasUsers={hasUsers} users={users} profilePhotoColor={profilePhotoColor} name={name}/>   
     </div>
   </div>
  );
}
