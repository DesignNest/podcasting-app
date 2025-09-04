"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";

interface LoginProps {
  state: AuthType;
  setState: React.Dispatch<React.SetStateAction<AuthType>>;
}

interface ErrorProps {
  message: string;
  field: "email" | "password" | "general";
}

const Login = ({ state, setState }: LoginProps) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<ErrorProps | null>(null);
  const [loading,setLoading] = useState<boolean>(false)
  const [emailVerify,setEmailVerify] = useState<boolean>(false)
  const router = useRouter();

  const buttons = [
    {
      src: "/Assets/Icons/github.png",
      tooltipName: "Login With Github",
      alt: "Github",
      href:`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/api/auth/github/callback&scope=user:email`
    },
    {
      src: "/Assets/Icons/google.png",
      tooltipName: "Login With Google",
      alt: "Google",
      href:"/api/auth/google/login"
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { success, message } = response.data;

      if (success) {
        router.push(`/verify?email=${email}`);
      } else {
        if (message.toLowerCase().includes("email") && message !== "Email Not Verified") {
          setError({ message, field: "email" });
        } else if (message.toLowerCase().includes("password")) {
          setError({ message, field: "password" });
        }
        else if(message == "Email Not Verified"){
setEmailVerify(true)
        } else {
          setError({ message, field: "general" });
        }
      }
    } catch (err) {
      setError({
        message: "Something went wrong. Please try again.",
        field: "general",
      });
    }finally{
      setLoading(false)
    }
  };
 
    if (emailVerify)
      return (
        <div className='flex flex-col items-start w-full h-fit font-poppins gap-y-12'>
          <div className='w-full flex flex-col items-center justify-center gap-y-4'>
            <Mail className='w-12 h-12 bg-blue-500 text-white px-4 py-4 rounded-full' />
            <h1 className='font-normal text-lg text-center'>
              A Verification Link Was Sent To Your Email
            </h1>
          </div>
  
          <div className='flex w-full flex-col items-center justify-center gap-y-4'>
            <p className='text-sm '>Didn't Receive Verification Link?</p>
            <Button className='bg-blue-500 hover:bg-blue-600 text-white text-xs' variant={'default'} size={'lg'}>
              Resend Verification Link
            </Button>
          </div>
        </div>
      );
  return (
    <div className="flex flex-col items-start w-full h-fit font-poppins gap-y-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start justify-start w-full h-full gap-y-4"
      >
        {/* General Error */}
        {error?.field === "general" && (
          <p className="text-sm text-red-500">{error.message}</p>
        )}

        {/* Email Input */}
        <div className="w-full ">
          <Input
            type="email"
            placeholder="Email"
            className={`outline-none focus:ring-gray-300 ${
              error?.field === "email" ? "border border-red-500 mb-2" : ""
            }`}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          {error?.field === "email" && (
            <p className="text-sm text-red-500">{error.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="w-full">
          <Input
            type="password"
            placeholder="Password"
            className={`outline-none focus:ring-gray-300 ${
              error?.field === "password" ? "border border-red-500 mb-2" : ""
            }`}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          {error?.field === "password" && (
            <p className="text-sm text-red-500">{error.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          variant="default"
          className="w-full bg-blue-500 hover:bg-blue-600"
          size="lg"
          type="submit"
          disabled={loading}
        >
          Login
        </Button>

        {/* Social Login */}
        <Separator className="w-full text-gray-400" />
        <div className="w-full flex justify-start items-start gap-x-4">
          {buttons.map((btn, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  className="w-full flex items-center justify-center"
                  variant="outline"
                  onClick={()=>router.push(btn.href)}
                >
                  <Image
                    src={btn.src}
                    alt={btn.alt}
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{btn.tooltipName}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </form>

      {/* Switch to Register */}
      <div className="w-full">
        <p className="text-sm">
          Don't Have An Account?{" "}
          <span
            className="text-blue-500 hover:text-blue-600 cursor-pointer"
            onClick={() => setState("Register")}
          >
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
