'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface TeamMemberFormData {
  Fname: string;
  Lname: string;
  Mname: string;
  DOB: string;
  StatusType: string;
  DepartmentID: string;
  UserType: string;
  Password?: string;
  Email: string;
  Phone: string;
  CID?: number;
  CreatedBy?: number;
}

export default function AddTeamMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TeamMemberFormData>({
    Fname: '',
    Lname: '',
    Mname: '',
    DOB: '',
    StatusType: 'Active',
    DepartmentID: '',
    UserType: 'Employee',
    Password: '',
    Email: '',
    Phone: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cid = sessionStorage.getItem('cid');
    const uid = sessionStorage.getItem('uid');
    if (cid) {
      setFormData((prev) => ({ ...prev, CID: Number(cid) }));
    }
    if (uid) {
      setFormData((prev) => ({ ...prev, CreatedBy: Number(uid) }));
    }

    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
      return;
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/login');
        return;
      }

      
      const formattedDOB = formData.DOB ? new Date(formData.DOB).toISOString() : null;
      
      const statusType = formData.StatusType === 'Active' ? 'A' : 'I';
      
      const departmentID = formData.DepartmentID ? Number(formData.DepartmentID) : null;

      const payload = {
        Fname: formData.Fname,
        Lname: formData.Lname,
        Mname: formData.Mname ? formData.Mname : null,
        DOB: formattedDOB,
        StatusType: statusType,
        DepartmentID: departmentID,
        UserType: formData.UserType,
        Password: formData.Password,
        Email: formData.Email,
        Phone: formData.Phone,
        CID: formData.CID,
        CreatedBy: formData.CreatedBy,
      };

      console.log('Payload:', payload);

      const response = await fetch("https://hrms-backend-production-3091.up.railway.app/user/team-member", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push('/team-members');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add team member.');
      }
    } catch (err) {
      console.error('Error adding team member:', err);
      setError('An error occurred while adding team member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Team Member</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="Fname" className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" id="Fname" name="Fname" value={formData.Fname} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="Lname" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" id="Lname" name="Lname" value={formData.Lname} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="Mname" className="block text-sm font-medium text-gray-700">Middle Name</label>
                <input type="text" id="Mname" name="Mname" value={formData.Mname} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="DOB" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" id="DOB" name="DOB" value={formData.DOB} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              
              <div>
                <label htmlFor="DepartmentID" className="block text-sm font-medium text-gray-700">Department ID</label>
                <input type="number" id="DepartmentID" name="DepartmentID" value={formData.DepartmentID} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="Password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="Password" name="Password" value={formData.Password} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="Email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="Email" name="Email" value={formData.Email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="Phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" id="Phone" name="Phone" value={formData.Phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Team Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 
