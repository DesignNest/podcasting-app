'use client';
import React, { useEffect, useState } from 'react';
import { Meeting } from '@/types/Meeting';
import CalendarView from './CalendarView';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Loader2 } from 'lucide-react';

const ScheduledPodcasts: React.FC = () => {
 const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [scheduled, setScheduled] = useState<Meeting[]>([]);

  useEffect(() => {
    const getTokenAndData = async () => {
      try {
        setLoading(true);

    
        const { data : tokenData } = await axios.get("/api/app/getToken");
        if (tokenData.success) {
          const decodedToken = jwtDecode(tokenData.message.value);
          setEmail(decodedToken.email);


          const { data } = await axios.post("/api/app/getPodcast", {
            email: decodedToken.email,
          });

          if (data.success && Array.isArray(data.message)) {
            const transformed: Meeting[] = data.message.map((item: any) => {
              const scheduledAt = new Date(item.date);

              const date = scheduledAt.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              });

              const time = scheduledAt.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return {
                title: item.title ,
                date,
                time,
                description: item.description || "",
                username: item.username,
                password: item.password,
                invitationLink: item.invitationLink,
              };
            });

            setScheduled(transformed);
          }
        }
      } catch (error) {
        console.error("Error fetching token or podcast:", error);
      } finally {
        setLoading(false);
      }
    };

    getTokenAndData();
  }, []);

  if(loading) return (
    <div className='w-full flex flex-col px-4 sm:px-8 py-8 gap-y-6 font-poppins items-center justify-center'>
<Loader2 className='w-6 h-6 animate-spin '/>
    </div>
  )
  return (
    <div className="w-full flex flex-col px-4 sm:px-8 py-8 gap-y-6 font-poppins">
      <h1 className="text-xl font-semibold">Scheduled Podcasts</h1>
      <div className="rounded-xl bg-card text-card-foreground shadow p-4">
        
        <CalendarView meetings={scheduled} email={email}/>
      </div>
    </div>
  );
};

export default ScheduledPodcasts;
