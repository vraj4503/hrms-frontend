'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';
import Image from 'next/image';
import Link from 'next/link';

const SECRET_KEY = 'Vraj123';

const createEncryptedToken = (token: string) => {
  const timestamp = Date.now();
  const combinedString = `${token}_${timestamp}`;
  // console.log('Frontend Encrypt: Combined string (JWT_timestamp):', combinedString);
  const encrypted = CryptoJS.AES.encrypt(combinedString, SECRET_KEY);
  const encryptedString = encrypted.toString();
  // console.log('Frontend Encrypt: CryptoJS encrypted output:', encryptedString);
  return encryptedString;
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      const encryptedToken = sessionStorage.getItem('encryptedToken');
      if (encryptedToken) {
        headers['Authorization'] = `Bearer ${encryptedToken}`;
      }
  
      const loginResponse = await fetch('https://hrms-backend-production-3091.up.railway.app/auth/login', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        const encryptedToken = createEncryptedToken(loginData.access_token);
        
        // Store tokens
        sessionStorage.setItem('accessToken', loginData.access_token);
        sessionStorage.setItem('encryptedToken', encryptedToken);
        
        // Store user details
        if (loginData.user) {
          sessionStorage.setItem('uid', loginData.user.uid);
          sessionStorage.setItem('cid', loginData.user.cid);
          sessionStorage.setItem('firstName', loginData.user.firstName);
          sessionStorage.setItem('lastName', loginData.user.lastName);
          sessionStorage.setItem('email', loginData.user.email);
        }
        
        router.push('/dashboard');
      } else {
        setError('Invalid Credentials');
      }
    } catch (err) {
      setError('An error occurred while logging in');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e7eafe]">
      <div className="bg-white rounded-2xl shadow-lg flex w-full max-w-4xl overflow-hidden">
        {/* Left: Login Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <div className="mb-8 flex items-center space-x-2">
{/*             <Image src="/anantam-logo.png" alt="Anantam Logo" width={32} height={32} /> */}
            <span className="text-2xl font-bold text-[#7b61ff]">Anantam</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Welcome </h2>
          <p className="mb-6 text-gray-500">Login to your account</p>
         
          <div className="flex items-center mb-4">
            
          </div>
          <form onSubmit={e => { e.preventDefault(); handleLogin(); }}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full mb-3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7b61ff]"
            />
            <div className="flex justify-between items-center mb-4">
             
              <Link href="/reset-password" className="text-[#7b61ff] text-sm hover:underline">
                Forgot your password?
              </Link>
            </div>
            {error && (
              <div className="mb-3 text-red-600 font-semibold text-center animate-pulse">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-[#7b61ff] text-white py-2 rounded-md font-semibold hover:bg-[#6a4ee6] transition"
            >
              Log in
            </button>
          </form>
          <p className="mt-6 text-center text-gray-500 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#7b61ff] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        {/* Right: Illustration */}
        <div className="hidden md:flex w-1/2 bg-white items-center justify-center">
          <Image
            src="/login-illustration.png"
            alt="Login Illustration"
            width={350}
            height={350}
            className="object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
} 
