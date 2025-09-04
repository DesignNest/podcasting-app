import React from 'react'
import { Button } from '../ui/button'

const Navbar = () => {

    const links = [{
        id:1,
        name:"Our Product",
    },
    {
        id:2,
        name:"Pricing"
    },
    {
        id:3,
        name:"Contact Us"
    }
]
  return (
    <div className='flex w-full items-start justify-between px-12 py-6 '>
        {/* Logo */}
        <div className='font-poppins text-xl font-bold text-slate-900'>
EchoVault
        </div>

{/* Links */}
        <div className='flex gap-8'>
{links.map((link)=>(

    <div key={link.id}>

        <h1 className='font-poppins text-slate-900 text-sm font-normal cursor-pointer hover:text-black'>{link.name}</h1>
        </div>
)

)}

        </div>
{/* 
Buttons */}
        <div className='flex gap-4'>
<Button variant={'link'} className='text-blue-600 font-poppins  text-xs' >
    Log In
</Button>

<Button variant={'default'} className='text-white bg-blue-600 font-poppins rounded-sm hover:bg-blue-700  px-8 text-xs  font-light ' >
    Get Started
</Button>
        </div>
    </div>
  )
}

export default Navbar