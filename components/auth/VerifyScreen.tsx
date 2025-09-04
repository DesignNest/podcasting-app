"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";

interface ErrorProps {
  message: string;
  field: "otp" | "general";
}

const VerifyScreen = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [timer, setTimer] = useState<number>(300); // 5 minutes
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<ErrorProps | null>(null);
  const [loading,setLoading] = useState<boolean>(false)
  const router = useRouter();

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const resendCode = async () => {
    if (timer !== 0) return;

    try {
      const response = await axios.post("/api/auth/resend-otp", { email });
      setTimer(300);
      setCode("");
      setError(null);
    } catch (err) {
      setError({ message: "Failed to resend code. Try again later.", field: "general" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const response = await axios.post("/api/auth/verify-otp", { email, otp: code });
      const { success, message } = response.data;

      if (success) {
        router.push("/dashboard");
      } else {
        if (message.toLowerCase().includes("otp")) {
          setError({ message, field: "otp" });
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

  return (
    <div>
      <Card className="px-8 py-6 font-poppins flex items-center justify-start flex-col w-[28vw]">
        <CardHeader className="text-left w-full flex items-start justify-start">
          <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <div className="flex flex-col items-start justify-start gap-y-8">
            <p className="text-gray-500 text-sm font-poppins">
              A Code Was Sent To <span className="text-blue-500">{email}</span>
            </p>

            <form
              className="flex flex-col items-start justify-start w-full gap-y-4"
              onSubmit={handleSubmit}
            >
              {error?.field === "general" && (
                <p className="text-sm text-red-500">{error.message}</p>
              )}

              <div className="w-full">
                <label className="text-gray-500 text-sm font-poppins">Verification Code</label>
                <Input
                  type="text"
                  className={`outline-none focus:ring-gray-300 w-full ${
                    error?.field === "otp" ? "border border-red-500 mb-2" : ""
                  }`}
                  value={code}
                  disabled={loading}
                  onChange={(e) => setCode(e.target.value)}
                />
                {error?.field === "otp" && (
                  <p className="text-sm text-red-500">{error.message}</p>
                )}
              </div>

              <Button
                className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-poppins w-full"
                variant={"default"}
                size={"lg"}
                type="submit"
                disabled={loading}
              >
                Verify
              </Button>
            </form>

            <p className="text-xs text-gray-500 font-poppins">
              Didn't Receive Code?{" "}
              <span
                onClick={resendCode}
                className={`cursor-pointer ${
                  timer === 0 ? "text-blue-500" : "text-gray-800"
                }`}
              >
                Resend Code {timer !== 0 && "in"} {timer !== 0 && formatTime(timer)}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyScreen;
