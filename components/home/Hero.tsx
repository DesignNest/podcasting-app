import React from 'react'
import { Button } from '../ui/button'

const Hero = () => {
  return (
    <div className='w-full h-[85vh] px-8 flex flex-col items-center justify-center py-6 gap-y-4 font-poppins '>
  
        {/* Heading */}
        <div>
            <h1 className='font-poppins text-6xl font-bold text-center'>Record. Upload. Share. Be Heard.</h1>
        </div>

        {/* Sub Heading */}
        <div className='flex items-center justify-center'>
            <h1 className='font-poppins text-2xl font-normal text-center text-gray-800 w-3/4'>Create, share, and grow your audience with our intuitive podcast hosting solution.</h1>
        </div>

        {/* Call To Action */}

        <div className='w-full flex items-center justify-center gap-x-4'>
<Button className='px-8 text-lg bg-blue-600 hover:bg-blue-700 py-6'>Start Your Podcast Today</Button>
<Button className='px-8 text-lg text-black py-6' variant={'outline'}>See Pricing </Button>
        </div>
        
    </div>
  )
}

export default Hero 