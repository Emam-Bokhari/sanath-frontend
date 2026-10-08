"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { myFetch } from "@/helpers/myFetch";
import { apiFetch } from "@/lib/api-fech";

interface OtpCountdownProps {
  email: string | null;
  onExpire?: () => void;
  onResendSuccess?: () => void;
}

function getOtpExpiryFromCookie(): number | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("otpExpiry="));
  if (!match) return null;
  const value = match.split("=")[1];
  const expiry = parseInt(value, 10);
  return isNaN(expiry) ? null : expiry;
}

function getRemainingSeconds(): number {
  const expiry = getOtpExpiryFromCookie();
  if (!expiry) return 0;
  const nowMs = Date.now();
  const expiryMs = expiry > 1e12 ? expiry : expiry * 1000;
  const diff = Math.floor((expiryMs - nowMs) / 1000);
  return diff > 0 ? diff : 0;
}

export default function OtpCountdown({ email, onExpire, onResendSuccess }: OtpCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(() => getRemainingSeconds() || 180);
  const [isResending, setIsResending] = useState(false);
  const router = useRouter();

  const isExpired = timeLeft <= 0;

  useEffect(() => {
    const initial = getRemainingSeconds();
    if (initial > 0) setTimeLeft(initial);
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire?.();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onExpire]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResend = async (payload: { email: string }) => {
    if (!email) return;
    setIsResending(true);

    try {
      const response = await apiFetch<any>("/auth/resend-otp", {
        method: "POST",
        body: JSON.stringify({ email: payload.email }),
      }, "client");

      if (response) {
        toast.success(response?.message || "OTP resent successfully", { id: "otp-resend" });
        setTimeLeft(180);
        setTimeout(() => {
          const newTime = getRemainingSeconds();
          setTimeLeft(newTime > 0 ? newTime : 180);
        }, 300);
        onResendSuccess?.();
        router.refresh();
      } else {
        if (response?.error && Array.isArray(response.error)) {
          response.error.forEach((err: { message: string }) =>
            toast.error(err.message, { id: "otp-resend" })
          );
        } else {
          toast.error(response?.message || "Failed to resend OTP", { id: "otp-resend" });
        }
      }
    } catch (err) {
      console.error("OtpCountdown resend error:", err);
      toast.error("Something went wrong while resending OTP", { id: "otp-resend" });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex items-center justify-between text-xs md:text-sm mt-1">
      {/* Timer */}
      {isExpired ? (
        <span className="text-red-400 font-semibold animate-pulse text-xs">
          Code expired
        </span>
      ) : (
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <span>Expires in:</span>
          <span
            className={`font-mono font-bold ${timeLeft < 30 ? "text-red-400 animate-pulse" : "text-[#1a3c6e]"
              }`}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      )}

      {/* Resend button */}
      <button
        type="button"
        onClick={() => handleResend({ email: email ?? "" })}
        disabled={isResending || (!isExpired && timeLeft > 120)}
        className="inline-flex items-center gap-1.5 text-xs text-[#1a3c6e] hover:text-blue-800 font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <RefreshCcw className={`w-3 h-3 ${isResending ? "animate-spin" : ""}`} />
        {isResending ? "Sending..." : "Resend OTP"}
      </button>
    </div>
  );
}