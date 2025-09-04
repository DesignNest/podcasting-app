"use client"
import { Video } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, AlertTitle } from '../ui/alert'

const PreviewVideo = ({isVideoOn,setIsVideoOn}:{isVideoOn:boolean,setIsVideoOn:React.Dispatch<React.SetStateAction<boolean>>}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream,setStream] = useState<MediaStream|null>(null)
  const [displayAlert,setDisplayAlert] = useState<boolean>(false)
  useEffect(()=>{
    if(isVideoOn){
        const turnVideoOn = async () => {
            setDisplayAlert(false)
            try {
                 const mediaStream = await navigator.mediaDevices.getUserMedia({video:true})
            if(videoRef.current){
                videoRef.current.srcObject = mediaStream
            }
            setStream(mediaStream)
            }
           
             catch (error) {
                console.log(error)
                setDisplayAlert(true)
                setIsVideoOn(false)
            }
        }

        
        turnVideoOn()
    }   

  },[isVideoOn])
  return (
    <div className='flex items-center justify-center w-full h-full flex-col gap-y-4'>
{isVideoOn ?
<video ref={videoRef} autoPlay playsInline  className='w-[75%] rounded-md h-2/4'/>
:
<div className='flex items-center justify-center w-[80%] h-2/4 rounded-xl bg-gray-900'>
<Video className='w-8 h-8 rounded-full  text-white '/>

    </div>
}

{displayAlert &&
<Alert className='w-1/2 px-4 py-2 font-poppins' variant={'destructive'}>
<AlertTitle><h1 className='text-sm text-black'>Cannot Enable Video</h1></AlertTitle>
</Alert>
}

    </div>
  )
}

export default PreviewVideo