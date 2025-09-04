"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { Loader2, Video } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const InstantMeeting = () => {
  const [title,setTitle] = useState("")
  const [email,setEmail] = useState("")
  const [loading,setLoading] = useState<boolean>(false)
  useEffect(()=>{

    const getToken = async () => {
          const { data : tokenData } = await axios.get("/api/app/getToken");
        if (tokenData.success) {
          const decodedToken = jwtDecode(tokenData.message.value);
          setEmail(decodedToken.email);
        }
    }

    getToken()
  },[])

  const createPodcast = async () => {
    setLoading(true)
    try {
       const { data } = await axios.post('/api/app/createPodcast', {email:email,title:title || "Untitled", date:Date.now(),isInstant:true}) 

       if(data.success){
        window.location.href = '/setupMeeting'
       }
    } catch (error) {
        console.log(error)
    }finally{
        setLoading(false)
    }
  }
  return (
    <div className='px-8 py-8 font-poppins flex items-start justify-center flex-col gap-y-4 rounded-xl bg-gray-50 border border-gray-200 mx-8 my-8'>
        {/* Heading */}
        <h1 className='text-sm font-medium'>New Podcast</h1>

        {/* Instant Meeting Button */}
        <Button variant={'outline'} size={'lg'} className='flex items-center justify-start text-left rounded-xl font-normal text-sm' onClick={()=>createPodcast()}>
            {loading ? <Loader2 className='w-4 h-4 animate-spin text-gray-700'/>: <><Video className='w-4 h-4 text-gray-700'/> Instant Podcast</>}</Button>



        {/* Title Input */}
       <div className='flex flex-col gap-y-2 items-start justify-start w-full'>
        <label className='text-xs text-gray-700'>Name Your Podcast (Optional)</label>
        <Input type='text' className='w-3/4 px-4 py-2 rounded-lg bg-white border-none  outline-none shadow-sm' placeholder='Podcast Title' onChange={(e)=>setTitle(e.target.value)}/>
        </div>
    </div>
  )
}

export default InstantMeeting