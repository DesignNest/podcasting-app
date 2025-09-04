import type { Metadata } from "next";
import "../globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";




export const metadata: Metadata = {
  title: "EchoVault - Auth",
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
      <TooltipProvider>
        {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
