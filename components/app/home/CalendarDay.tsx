'use client';
import React, { useRef, useState } from 'react';
import { Info, Loader2, MoreVertical, Trash } from 'lucide-react';
import { Meeting } from '@/types/Meeting';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import DetailsCard from '../create/DetailsCard';
import { useDetails } from '@/context/ShowDetailsContext';
import axios from 'axios';

interface CalendarDayProps {
  date: Date;
  meetings: Meeting[];
  email:string;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ date, meetings, email }) => {
  const formatted = date.toDateString();
  const { setDetails } = useDetails();
  const [loading, setLoading] = useState<boolean>(false);


  const [localMeetings, setLocalMeetings] = useState<Meeting[]>(meetings);


  const matchedMeetings = localMeetings.filter(m => {
    const [day, month, year] = m.date.split('/').map(Number);
    const targetDate = new Date(2000 + year, month - 1, day);
    return targetDate.toDateString() === formatted;
  });

  const deletePodcast = async (email: string, username: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await axios.post('/api/app/deletePodcast', {
        email,
        username,
        password,
      });

      if (data.success) {
      
        setLocalMeetings(prev =>
          prev.filter(m => m.username !== username || m.password !== password)
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 border rounded-md relative h-24 font-poppins bg-gray-50  overflow-x-auto  ">
      <div className="text-sm font-semibold">{date.getDate()}</div>
      {matchedMeetings.map((meeting, idx) => (
        <div key={idx} className="relative group bg-blue-100 text-blue-900 mt-1 px-4 py-2 text-xs rounded">
          {meeting.title}
          <div className="absolute top-[50%] translate-y-[-50%] right-2 opacity-0 group-hover:opacity-100 cursor-pointer pointer-events-auto">
            <Popover >
                <PopoverTrigger>
            <MoreVertical size={12} className="text-gray-600" />
            </PopoverTrigger>

            <PopoverContent className='w-full px-2 py-2 z-40' side='bottom' align='end'>
                <div className='w-full flex flex-col gap-y font-poppins items-start justify-start'>
                    <Button variant={"ghost"} size={'sm'} className='flex items-center justify-center gap-x-2'  onClick={()=>setDetails({email:email,username:meeting.username,password:meeting.password,invitationLink:meeting.invitationLink})}><Info className='w-2 h-2 text-gray-700'/> Details</Button>
                    <Button variant={"ghost"} size={'sm'} className='flex items-center justify-center gap-x-2' onClick={()=>deletePodcast(email,meeting.username,meeting.password)}> {loading ? <Loader2 className='w-4 h-4 text-gray-700 animate-spin'/> : <><Trash className='w-2 h-2 text-gray-700'/> Delete </>}</Button>
                </div>
            </PopoverContent>
            </Popover>


          </div>
        </div>
      ))}


    </div>
  );
};

export default CalendarDay;
