import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/home/Navbar";



export const metadata: Metadata = {
  title: "EchoVault - Capturing Voices, preserving ideas",
  description: "This is an app created using next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full h-screen flex flex-col items-start justify-start">
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
