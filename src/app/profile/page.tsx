'use client';

import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = sessionStorage.getItem('uid');
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        const res = await fetch(
          `https://hrms-backend-production-3091.up.railway.app/user/${userId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8">User not found.</div>;

  // Helper to get initials
  const getInitials = (first: string, last: string) => {
    return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg">
          {getInitials(user.Fname, user.Lname)}
        </div>
        {/* Name */}
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">{user.Fname} {user.Lname}</h1>
        <p className="text-gray-500 mb-6">{user.Email}</p>
        {/* Info */}
        <div className="w-full space-y-3">
          <div className="flex justify-between text-gray-700"><span className="font-semibold">First Name:</span> <span>{user.Fname}</span></div>
          <div className="flex justify-between text-gray-700"><span className="font-semibold">Last Name:</span> <span>{user.Lname}</span></div>
          <div className="flex justify-between text-gray-700"><span className="font-semibold">Middle Name:</span> <span>{user.Mname}</span></div>
          <div className="flex justify-between text-gray-700"><span className="font-semibold">Phone:</span> <span>{user.Phone}</span></div>
          <div className="flex justify-between text-gray-700"><span className="font-semibold">Date of Birth:</span> <span>{user.DOB}</span></div>
          <div className="flex justify-between text-gray-700"><span className="font-semibold">User Type:</span> <span>{user.UserType}</span></div>
        </div>
      </div>
    </main>
  );
}