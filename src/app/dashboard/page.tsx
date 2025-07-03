'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('duplicateToken');
    sessionStorage.clear();
    router.push('/login');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center">
        {/* Welcome Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-5xl mb-4 shadow-lg">
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-12 h-12'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z' />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Welcome to Your Dashboard</h1>
          <p className="text-gray-500 text-center">Quickly access your tasks, buckets, team, and more.</p>
        </div>
        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mb-8">
          <button
            onClick={() => router.push('/tasks/add')}
            className="flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 transition rounded-xl p-6 shadow group"
          >
            <svg className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            <span className="font-semibold text-blue-700">Add Task</span>
          </button>
          <button
            onClick={() => router.push('/tasks')}
            className="flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 transition rounded-xl p-6 shadow group"
          >
            <svg className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6" /></svg>
            <span className="font-semibold text-green-700">Tasks</span>
          </button>
          <button
            onClick={() => router.push('/buckets')}
            className="flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 transition rounded-xl p-6 shadow group"
          >
            <svg className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" /></svg>
            <span className="font-semibold text-purple-700">Buckets</span>
          </button>
          <button
            onClick={() => router.push('/team-members')}
            className="flex flex-col items-center justify-center bg-indigo-100 hover:bg-indigo-200 transition rounded-xl p-6 shadow group"
          >
            <svg className="w-8 h-8 text-indigo-600 mb-2 group-hover:scale-110 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            <span className="font-semibold text-indigo-700">Team Members</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center justify-center bg-red-100 hover:bg-red-200 transition rounded-xl p-6 shadow group"
          >
            <svg className="w-8 h-8 text-red-600 mb-2 group-hover:scale-110 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
            <span className="font-semibold text-red-700">Logout</span>
          </button>
        </div>
      </div>
    </main>
  );
} 