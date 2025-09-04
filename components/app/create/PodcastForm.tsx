"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DetailsCard from './DetailsCard'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Loader2 } from 'lucide-react'

const PodcastForm = () => {
  const [isDescriptionActive, setIsDescriptionActive] = useState(false)
  const [topic, setTopic] = useState("My Meeting")
  const [description, setDescription] = useState("")
  const now = new Date()
const [date, setDate] = useState(now.toISOString().split('T')[0])
const [time, setTime] = useState(now.toTimeString().slice(0, 5))
  const [email, setEmail] = useState("")
  const [showDetails, setShowDetails] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [invitationLink, setInvitationLink] = useState("")
  const detailsRef = useRef<HTMLDivElement>(null)
  const [loaading,setIsloading] = useState<boolean>(false)
  useEffect(() => {
    const getToken = async () => {
      try {
        const { data } = await axios.get('/api/app/getToken')
        if (data.success) {
          const decodedToken = jwtDecode(data.message.value)
          setEmail(decodedToken.email)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getToken()
  }, [])
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
      setShowDetails(false)
    }
  }

  if (showDetails) {
    document.addEventListener('mousedown', handleClickOutside)
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside)
  }
}, [showDetails])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsloading(true)
    try {
      const fullDate = new Date(`${date}T${time}:00`)
      const { data } = await axios.post('/api/app/createPodcast', {
        email,
        description: description || undefined,
        date: fullDate,
        title: topic
      })
      if (data.success) {
        setUsername(data.username)
        setPassword(data.password)
        setInvitationLink(data.invitationLink)
        setShowDetails(true)
      } else {
        setIsDescriptionActive(false)
        setTopic("My Meeting")
        setDate("2025-08-01")
        setTime("18:00")
      }
    } catch (error) {
      console.log(error)
    }finally{
      setIsloading(false)
    }
  }

  return (
    <div className='relative w-full'>
      <form className='w-full' onSubmit={handleSubmit} >
        <div className='flex flex-col w-full items-start justify-start gap-y-6'>
          {/* Topic */}
          <div className='flex flex-col w-full'>
            <label htmlFor='title' className='font-poppins text-sm mb-1'>Topic</label>
            <Input
              type='text'
              placeholder='My Meeting'
              className='w-full px-3 py-2 text-sm'
              id='title'
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loaading}
            />
          </div>

          {/* Add Description Toggle */}
          <div className='flex flex-col w-full'>
            <a
              className='text-blue-500 text-sm cursor-pointer'
              onClick={() => setIsDescriptionActive(prev => !prev)}
            >
              {isDescriptionActive ? "Remove Description" : "+ Add Description"}
            </a>
          </div>

          {/* Description */}
          {isDescriptionActive && (
            <div className='flex flex-col w-full'>
              <label htmlFor='description' className='font-poppins text-sm mb-1'>Description</label>
              <textarea
                id='description'
                placeholder='Description'
                className='w-full px-3 py-2 text-sm border rounded-md resize-none'
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loaading}
              />
            </div>
          )}

          {/* Date and Time */}
        {/* Date and Time */}
<div className='flex flex-col w-full'>
  <label className='font-poppins text-sm mb-1'>When</label>
  <div className='flex gap-x-4'>
    <Input
      type='date'
      className='px-3 py-2 text-sm'
      value={date}
      min={new Date().toISOString().split('T')[0]} // restrict to today or later
      onChange={(e) => setDate(e.target.value)}
      disabled={loaading}
    />
    <Input
      type='time'
      className='px-3 py-2 text-sm'
      value={time}
      min={date === new Date().toISOString().split('T')[0] ? new Date().toTimeString().slice(0, 5) : undefined}
      onChange={(e) => setTime(e.target.value)}
      disabled={loaading}
    />
  </div>
</div>

          {/* Important Note */}
          <div className='flex w-full px-4 py-4 bg-yellow-100 rounded-md font-poppins'>
            <p className='text-xs text-gray-600'>
              Once your podcast is scheduled, a unique link will be automatically generated and shared with all participants. Please review your topic, date, and time carefully before confirming, as changes may affect notifications and availability. After scheduling, you’ll receive tools to manage your recording, invite guests, and track engagement.
            </p>
          </div>

          {/* Submit Buttons */}
          <div className='flex items-start justify-start gap-x-4'>
            <Button className='bg-blue-500 hover:bg-blue-600 text-xs font-normal' type='submit' disabled={loaading}>{loaading ? <Loader2 className='w-4 h-4 animate-spin'/> : "Create"}</Button>
            <Button variant={'outline'} className='text-xs font-normal' type='button' onClick={()=>{
              setTopic("My Meeting")
              setTime(now.toTimeString().slice(0, 5))
              setDate(now.toISOString().split('T')[0])
              setDescription("")
              setIsDescriptionActive(false)
              

            }} disabled={loaading}>Cancel</Button>
          </div>
        </div>
      </form>

      {/* Show DetailsCard in center */}
  {showDetails && (
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
)}
    </div>
  )
}

export default PodcastForm