
import type { Metadata } from "next";
import "../globals.css";
import { PeerProvider } from "@/context/PeerContext";





export const metadata: Metadata = {
  title: "EchoVault - Meeting",
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
     <PeerProvider>
        {children}
        </PeerProvider>
      </body>
    </html>
  );
}
