"use client";
import { Separator } from '@radix-ui/react-separator';
import { Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';
import { Input } from '../ui/input';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface RegisterProps {
  state: AuthType;
  setState: React.Dispatch<AuthType>;
}

interface ErrorProps {
  message: string;
  field: "email" | "username" | "password" | "general";
}

const Register = ({ state, setState }: RegisterProps) => {
  const buttons = [
    {
      src: "/Assets/Icons/github.png",
      tooltipName: "Login With Github",
      alt: "Github",
      href: `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&redirect_uri=http://localhost:3000/api/auth/github/callback&scope=user:email`
    },
    {
      src: "/Assets/Icons/google.png",
      tooltipName: "Login With Google",
      alt: "Google",
      href:"/api/auth/google/login"
    }
  ];
  const router = useRouter()
  const [verifyingEmail, setVerifyingEmail] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<ErrorProps | null>(null);
  const [loading,setLoading] = useState<boolean>(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        username,
        password
      });

      const { success, message } = response.data;

      if (success) {
        setVerifyingEmail(true);
      } else {
        if (message.toLowerCase().includes("email")) {
          setError({ message, field: "email" });
        } else if (message.toLowerCase().includes("username")) {
          setError({ message, field: "username" });
        } else if (message.toLowerCase().includes("password")) {
          setError({ message, field: "password" });
        } else {
          setError({ message, field: "general" });
        }
      }
    } catch (err: any) {
      setError({ message: "Something went wrong", field: "general" });
    }finally{
      setLoading(false)
    }
  };

  if (verifyingEmail)
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
    <div className='flex flex-col items-start w-full h-fit font-poppins gap-y-4'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col items-start justify-start w-full h-full gap-y-4'
        
      >
        {error?.field === "general" && (
          <p className="text-sm text-red-500">{error.message}</p>
        )}

        <div className='w-full'>
          <Input
            type="email"
            placeholder="Email"
            className={`outline-none focus:ring-gray-300 ${
              error?.field === "email" ? "border border-red-500 mb-2" : ""
            }`}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          {error?.field === "email" && (
            <p className="text-sm text-red-500">{error.message}</p>
          )}
        </div>

        <div className='w-full'>
          <Input
            type="password"
            placeholder="Password"
            className={`outline-none focus:ring-gray-300 ${
              error?.field === "password" ? "border border-red-500 mb-2" : ""
            }`}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error?.field === "password" && (
            <p className="text-sm text-red-500">{error.message}</p>
          )}
        </div>

        <div className='w-full'>
          <Input
            type="text"
            placeholder="Username"
            className={`outline-none focus:ring-gray-300 ${
              error?.field === "username" ? "border border-red-500 mb-2" : ""
            }`}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          {error?.field === "username" && (
            <p className="text-sm text-red-500">{error.message}</p>
          )}
        </div>

        <Button
          variant="default"
          className='w-full bg-blue-500 hover:bg-blue-600'
          size='lg'
          type='submit'
          disabled={loading}
        >
          Register
        </Button>

        <Separator className='w-full text-gray-400' />

        <div className='w-full flex justify-start items-start gap-x-4'>
          {buttons.map((btn, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button className='w-full flex items-center justify-center' variant='outline' disabled={loading} onClick={()=>router.push(btn.href)}>
                  <Image src={btn.src} alt={btn.alt} width={16} height={16} className='w-4 h-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-sm'>{btn.tooltipName}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </form>

      <div className='w-full'>
        <p className='text-sm '>
          Already Have An Account?{' '}
          <span
            className='text-blue-500 hover:text-blue-600 cursor-pointer'
            onClick={() => setState("Login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
