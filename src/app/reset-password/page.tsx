"use client";
import { useState, useEffect } from "react";



function RequestOtpForm({ onNext }: { onNext: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    const checkRes = await fetch("https://hrms-backend-production-3091.up.railway.app/user/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const checkData = await checkRes.json();
    if (!checkData.exists) {
      setMsg(checkData.message || "Email ID not found");
      return;
    }
   
    const res = await fetch("https://hrms-backend-production-3091.up.railway.app/user/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMsg(data.message || "Check your email for OTP.");
    if (res.ok) onNext(email);
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">Request OTP</h2>
      <input type="email" placeholder="Enter your email" value={email} required onChange={e => setEmail(e.target.value)}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition">Send OTP</button>
      <div className="text-sm text-gray-600 min-h-[1.5em]">{msg}</div>
    </form>
  );
}

function VerifyOtpForm({ email, onNext }: { email: string, onNext: (otp: string) => void }) {
  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(180); 
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (timeLeft <= 0) return;
    const res = await fetch("https://hrms-backend-production-3091.up.railway.app/user/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (data.valid) {
      setMsg("OTP verified! You can now reset your password.");
      onNext(otp);
    } else {
      setMsg("Invalid OTP.");
    }
  };
  const handleResend = async () => {
    const res = await fetch("https://hrms-backend-production-3091.up.railway.app/user/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setMsg(data.message || "OTP resent. Check your email.");
    setTimeLeft(180);
  };
  const min = Math.floor(timeLeft / 60);
  const sec = timeLeft % 60;
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">Verify OTP</h2>
      <input type="text" placeholder="Enter OTP" value={otp} required onChange={e => setOtp(e.target.value)} disabled={timeLeft <= 0}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100" />
      <div className="flex gap-2">
        <button type="submit" disabled={timeLeft <= 0} className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition disabled:bg-gray-300">Verify OTP</button>
        <button type="button" onClick={handleResend} disabled={timeLeft > 0} className="bg-gray-200 text-gray-700 rounded px-4 py-2 hover:bg-gray-300 transition disabled:bg-gray-100">Resend OTP</button>
      </div>
      <div className="text-sm text-gray-600 min-h-[1.5em]">{msg}</div>
      <div className="text-xs text-gray-400">{timeLeft > 0 ? `Time left: ${min}:${sec.toString().padStart(2, '0')}` : 'OTP expired'}</div>
    </form>
  );
}

function ResetPasswordForm({ email, otp }: { email: string, otp: string }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("https://hrms-backend-production-3091.up.railway.app/user/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
    });
    const data = await res.json();
    if (data.success) {
      setMsg("Password reset successful! You can now log in.");
      setSuccess(true);
    } else {
      setMsg(data.message || "Failed to reset password.");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
      <input type="password" placeholder="New Password" value={newPassword} required onChange={e => setNewPassword(e.target.value)}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <input type="password" placeholder="Confirm Password" value={confirmPassword} required onChange={e => setConfirmPassword(e.target.value)}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 transition">Reset Password</button>
      <div className="text-sm text-gray-600 min-h-[1.5em]">{msg}</div>
      {success && (
        <button type="button" onClick={() => window.location.href = '/login'} className="bg-green-500 text-white rounded px-4 py-2 mt-2 hover:bg-green-600 transition">
          Login
        </button>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        {step === 1 && <RequestOtpForm onNext={e => { setEmail(e); setStep(2); }} />}
        {step === 2 && <VerifyOtpForm email={email} onNext={o => { setOtp(o); setStep(3); }} />}
        {step === 3 && <ResetPasswordForm email={email} otp={otp} />}
        <p className="mt-6 text-center text-gray-500 text-sm">
          Remembered your password?{' '}
          <a href="/login" className="text-indigo-600 hover:underline font-semibold">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
} 
