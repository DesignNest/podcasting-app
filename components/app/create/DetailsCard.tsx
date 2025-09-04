import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PodcastDetail } from '@/types/podcastDetails'
import { Check, Clipboard } from 'lucide-react'
import React, { useState } from 'react'

interface Copied {
  label: string
  value: string
}

const DetailsCard = ({ email, username, password, invitationLink }: PodcastDetail) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const details = [
    { label: 'Username', value: username },
    { label: 'Password', value: password },
    { label: 'Invitation Link', value: `${baseUrl}/api/meeting/invitationLink?link=${invitationLink}` }
  ]

  const [isCopied, setIsCopied] = useState<string | null>(null)

  const copyFunctionality = ({ value, label }: Copied) => {
    navigator.clipboard.writeText(value)
    setIsCopied(label)
    setTimeout(() => {
      setIsCopied(null)
    }, 1000)
  }

  return (
    <Card className='flex items-center justify-center flex-col px-8 py-6 font-poppins z-50 backdrop-blur-md bg-white rounded-xl shadow-lg'>
      <CardHeader className='w-full flex items-start'>
        <CardTitle className='text-xl font-semibold'>Podcast Info</CardTitle>
      </CardHeader>

      <CardContent className='w-full'>
        <div className='flex flex-col items-start justify-start w-full gap-y-4'>
          {details.map(({ label, value }) => (
            <div key={label} className='flex flex-col w-full'>
              <h1 className='text-md font-normal'>{label}</h1>
              <div className='flex justify-between items-center w-full gap-x-6'>
                <p className='text-xs text-gray-700 break-all'>{value}</p>
                {isCopied === label ? (
                  <Check className='w-4 h-4 text-green-600' />
                ) : (
                  <Clipboard
                    className='w-4 h-4 text-gray-700 cursor-pointer hover:text-gray-800'
                    onClick={() => copyFunctionality({ label, value })}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default DetailsCard