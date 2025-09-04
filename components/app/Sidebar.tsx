"use client"
import { Home, Link, Plus, User } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from '../ui/button'
import { useTab } from '@/context/ActiveTabContext'
import { usePathname, useRouter } from 'next/navigation'
import { Tab } from '@/types/TabType'

const Sidebar = () => {
  const {currentTab,setCurrentTab} = useTab()
  const activeTab = currentTab;
  const router = useRouter();
  const buttons = [
    {
      name: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      name: 'Create',
      icon: <Plus className="w-5 h-5" />,
    },
    {
      name: 'Manage',
      icon: <User className="w-5 h-5" />,
    },
    {
      name: 'Join',
      icon: <Link className="w-5 h-5" />,
    },
  ]

  const pathname = usePathname();
const navigate = ({name} : {name:any}) => {
setCurrentTab(name)
if(name!=="Home"){
router.push(`/${name.toLowerCase()}`);  
}else{
  router.push('/dashboard')
}
}

useEffect(()=>{
  if(pathname.startsWith('/create')){
    setCurrentTab("Create")
  }else if(pathname.startsWith('/manage')){
setCurrentTab("Manage")
  }else if(pathname.startsWith('/join')){
    setCurrentTab("Join")
  }
},[])
  return (
    <aside className="flex flex-col h-screen w-[220px] bg-white border-r border-gray-200 px-4 py-6 shadow-sm">
   
      {/* Navigation Buttons */}
      <nav className="flex flex-col gap-1">
        {buttons.map((button, idx) => {
          const isActive = activeTab === button.name
          return (
            <Button
              key={idx}
              variant="ghost"
              size="lg"
              onClick={()=>navigate({name:button.name})}
              className={`w-full flex items-center justify-start gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {button.icon}
              {button.name}
            </Button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
