"use client"
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const JoinPodcast = () => {
  const [loading,setLoading] = useState<boolean>(false)
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const router = useRouter()
  const [error,setError] = useState("")
  const handleSubmit = async (e:React.FormEvent)=>{
   e.preventDefault()
   setLoading(true)
   try {
    const { data } = await axios.post('/api/app/joinPodcast', {username:username,password:password})
    if(data.success){
        window.location.href = '/setupMeeting'
    }else{
        setError(data.message)
    }
   } catch (error) {
    console.log(error)
    setError("An Unexpected Error Occurred")
   }finally{
    setLoading(false)
   }
  }
  return (
    <div className='w-full h-[80%] flex flex-col items-center justify-center font-poppins overflow-hidden gap-y-6'>

<h1 className='font-poppins text-2xl font-normal'>Join a Podcast</h1>

{/* Input */}
<form className='flex flex-col gap-y-2 w-full items-center justify-center' onSubmit={(e)=>handleSubmit(e)}>
<Input type='text' className='px-4 py-6 rounded-md w-[30%] text-black outline-none' placeholder='Username' onChange={(e)=>setUsername(e.target.value)} disabled={loading}/>
<Input type='passsword' className='px-4 py-6 rounded-md w-[30%] text-black outline-none ' placeholder='Password'onChange={(e)=>setPassword(e.target.value)} disabled={loading}/>
{error && 
<Alert variant={'destructive'} className='w-[30%] flex items-center justify-center px-4 py-2'>
    <AlertTitle className='text-xs'>{error}</AlertTitle>
    </Alert>}
<Button className='w-[30%] py-4 bg-blue-500 rounded-md text-white hover:bg-blue-600 hover:text-white' variant={'outline'} size={'lg'} disabled={loading}>
    {loading ? <Loader2 className='w-4 h-4 text-gray-700 animate-spin'/> : "Join"}

</Button>
</form>
    </div>
  )
}

export default JoinPodcast