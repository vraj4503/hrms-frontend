'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'Vraj123';

const createEncryptedToken = (token: string) => {
  const timestamp = Date.now();
  const combinedString = `${token}_${timestamp}`;
  console.log('Frontend Encrypt: Combined string (JWT_timestamp):', combinedString);
  const encrypted = CryptoJS.AES.encrypt(combinedString, SECRET_KEY);
  const encryptedString = encrypted.toString();
  console.log('Frontend Encrypt: CryptoJS encrypted output:', encryptedString);
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
  
      const loginResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
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
        
        
        sessionStorage.setItem('accessToken', loginData.access_token);
        sessionStorage.setItem('encryptedToken', encryptedToken);
        
        
        if (loginData.user) {
          sessionStorage.setItem('uid', loginData.user.uid);
          sessionStorage.setItem('cid', loginData.user.cid);
          sessionStorage.setItem('firstName', loginData.user.firstName);
          sessionStorage.setItem('lastName', loginData.user.lastName);
          sessionStorage.setItem('email', loginData.user.email);
        }
        
        router.push('/dashboard');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred while logging in');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>

          {error && (
            <div className="text-red-500 text-center text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 