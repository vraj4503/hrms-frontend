'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { userApi, User } from '@/app/services/api';

export default function TeamMembersPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
      return;
    }

    const fetchTeamMembers = async () => {
      try {
        const cid = sessionStorage.getItem('cid');
        if (!cid) return;
        const response = await userApi.getByCompany(Number(cid));
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Team Members</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/team-members/add')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow"
            >
              Add Team Member
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold shadow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Back to Dashboard
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading team members...</div>
        ) : (
          <div className="overflow-x-auto rounded-xl shadow">
            <table className="min-w-full divide-y divide-gray-200 bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-xl">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">First Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Last Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Middle Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-indigo-700 uppercase tracking-wider">User Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-100">
                {teamMembers.map((member) => (
                  <tr key={member.UID} className="hover:bg-indigo-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{member.UID}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.Fname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.Lname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.Mname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.Email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{member.UserType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
} 
