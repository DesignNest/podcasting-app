// CreatePodcast.tsx
import React from 'react'
import PodcastForm from './PodcastForm'

const CreatePodcast = () => {
  return (
    <div className='flex px-8 py-8 flex-col items-start justify-start font-poppins w-full'>
      <h1 className='text-xl font-semibold mb-6'>Schedule Podcast</h1>
      <PodcastForm />
    </div>
  )
}

export default CreatePodcast