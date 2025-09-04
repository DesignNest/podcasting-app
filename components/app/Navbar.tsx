import React from 'react'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { LogOut, Settings } from 'lucide-react'

const Navbar = () => {
  return (
    <nav className='w-full h-fit px-16 py-4 border-b border-solid border-b-gray-300 flex justify-between items-center'>
        {/* Heading */}
<div className='font-poppins'>
    <h1 className='text-xl font-bold text-slate-900 '>EchoVault.</h1>
</div>
{/* Account Profile */}
<div>
<Popover>
    <PopoverTrigger>
<Button className='font-poppins text-white text-xs w-6 h-6 rounded-full px-4 py-4 bg-blue-600 hover:bg-blue-600' >M</Button>
</PopoverTrigger>

<PopoverContent className="w-fit bg-white shadow-lg rounded-md border border-gray-200 p-4 px-8">
  <div className="flex flex-col gap-2 font-poppins items-start">

    <div className='flex w-full justify-start gap-x-2 items-start border-b border-b-gray-200 border-solid pb-2'>
{/* Profile Photo Color */}
<Button className='font-poppins text-white text-xs w-6 h-6 rounded-full px-4 py-4 bg-blue-600 hover:bg-blue-600 '>
    M
</Button>

<div className='flex flex-col h-full items-start  f'>
<h1 className='font-poppins text-black  text-md '>Mustansir</h1>
<p className='text-gray-400 font-light font-poppins text-sm '>covids262010@gmail.com</p>
    </div>
    </div>
    <Button
      variant="ghost"
      className="w-full flex items-start justify-start gap-2 text-sm text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </Button>
    <Button
      variant="ghost"
      className="w-full flex items-start justify-start gap-2 text-sm text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-md"
    >
      <Settings className="w-4 h-4" />
      Manage Account
    </Button>
  </div>
</PopoverContent>

</Popover>
</div>
    </nav>
  )
}

export default Navbar