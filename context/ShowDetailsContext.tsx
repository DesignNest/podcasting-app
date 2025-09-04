"use client";

import React, { createContext, useContext, useState } from "react";


interface MeetingType {
  email: string;
  username: string;
  password: string;
  invitationLink: string;
}


interface ShowDetailsContextType {
  details: MeetingType | undefined;
  setDetails: React.Dispatch<React.SetStateAction<MeetingType | undefined>>;
}


const ShowDetailsContext = createContext<ShowDetailsContextType | undefined>(undefined);


export const ShowDetailsProvider = ({ children }: { children: React.ReactNode }) => {
  const [details, setDetails] = useState<MeetingType | undefined>(undefined);

  return (
    <ShowDetailsContext.Provider value={{ details, setDetails }}>
      {children}
    </ShowDetailsContext.Provider>
  );
};


export const useDetails = () => {
  const context = useContext(ShowDetailsContext);
  if (!context) throw new Error("useDetails must be used within a ShowDetailsProvider");
  return context;
};