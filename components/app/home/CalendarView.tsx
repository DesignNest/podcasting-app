'use client';
import React, { useState } from 'react';
import { Meeting } from '@/types/Meeting';
import CalendarDay from './CalendarDay';
import { MoveLeft, MoveRight } from 'lucide-react';


interface Props {
  meetings: Meeting[];
  email:string;
}

const CalendarView: React.FC<Props> = ({ meetings,email }) => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleBoxCount = 21;

  // Utility: get a specific date offset from today
  const getDateFromToday = (offset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return date;
  };

  const visibleDays: Date[] = Array.from({ length: visibleBoxCount }, (_, i) =>
    getDateFromToday(startIndex + i)
  );

  const weekDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (

    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {visibleDays.length > 0 &&
            `${visibleDays[0].toLocaleString('default', { month: 'long' })} ${visibleDays[0].getFullYear()}`}
        </h2>
        <div className="flex gap-2">
          <button
            className="text-sm px-2 py-1 border rounded disabled:opacity-50"
            onClick={() => setStartIndex(prev => Math.max(prev - visibleBoxCount, 0))}
            disabled={startIndex === 0}
          >
            <MoveLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            className="text-sm px-2 py-1 border rounded"
            onClick={() => setStartIndex(prev => prev + visibleBoxCount)}
          >
            <MoveRight className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-left text-xs text-muted-foreground font-medium">
        {visibleDays.slice(0, 7).map((day, idx) => (
          <div key={idx}>{weekDayNames[day.getDay()]}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 ">
        {visibleDays.map((date, idx) => (
          <CalendarDay key={idx} date={date} meetings={meetings} email={email}/>
        ))}
      </div>
    </div>

  );
};

export default CalendarView;
