import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/app/Navbar";
import Sidebar from "@/components/app/Sidebar";
import { TabProvider } from "@/context/ActiveTabContext";
import { ShowDetailsProvider } from "@/context/ShowDetailsContext";

export const metadata: Metadata = {
  title: "EchoVault - Dashboard",
  description: "This is an app created using next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full h-[100vh] flex flex-col items-start justify-start  " suppressHydrationWarning>
        <TabProvider>
          <ShowDetailsProvider>
          <Navbar />
          <div className="flex w-full items-start h-[100%] justify-start">
            <Sidebar />
            {children}
          </div>
          </ShowDetailsProvider>
        </TabProvider>
      </body>
    </html>
  );
}