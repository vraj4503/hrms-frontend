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

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
        <div className="space-y-2">
          <div><strong>First Name:</strong> {user.Fname}</div>
          <div><strong>Last Name:</strong> {user.Lname}</div>
          <div><strong>Middle Name:</strong> {user.Mname}</div>
          <div><strong>Phone:</strong> {user.Phone}</div>
          <div><strong>Email:</strong> {user.Email}</div>
          <div><strong>Date of Birth:</strong> {user.DOB}</div>
          <div><strong>User Type:</strong> {user.UserType}</div>
        </div>
      </div>
    </main>
  );
}