"use client";

import { Tab } from "@/types/TabType";
import React, { createContext, useContext, useState } from "react";

interface TabType {
  currentTab: Tab;
  setCurrentTab: React.Dispatch<React.SetStateAction<Tab>>;
}

const TabContext = createContext<TabType | undefined>(undefined);

export const TabProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTab, setCurrentTab] = useState<Tab>("Home");

  return (
    <TabContext.Provider value={{ currentTab, setCurrentTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTab = () => {
  const context = useContext(TabContext);
  if (!context) throw new Error("Tab Context must be used within a provider!");
  return context;
};