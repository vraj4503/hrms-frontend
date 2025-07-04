'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

interface TeamMemberData {
  UID: number;
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
  UpdatedBy?: number;
}

interface EditTeamMemberPageProps {
  params: { id: string };
}

export default function EditTeamMemberPage({ params }: EditTeamMemberPageProps) {
  const router = useRouter();
  const { id } = params;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<TeamMemberData>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (!accessToken) {
      router.push('/login');
      return;
    }

    const fetchTeamMember = async () => {
      try {
        const response = await fetch(`https://hrms-backend-production-3091.up.railway.app/user/${id}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data: TeamMemberData = await response.json();
          setFormData({
            Fname: data.Fname,
            Lname: data.Lname,
            Mname: data.Mname,
            DOB: data.DOB ? new Date(data.DOB).toISOString().split('T')[0] : '',
            StatusType: data.StatusType,
            DepartmentID: String(data.DepartmentID),
            UserType: data.UserType,
            Email: data.Email,
            Phone: data.Phone,
          });
        } else {
          // console.error('Failed to fetch team member');
          setError('Failed to load team member data.');
        }
      } catch (err) {
        // console.error('Error fetching team member:', err);
        setError('An error occurred while loading data.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTeamMember();
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const updatedBy = sessionStorage.getItem('uid');

      if (!accessToken) {
        router.push('/login');
        return;
      }

      const updatePayload = {
        ...formData,
        DepartmentID: Number(formData.DepartmentID), // Ensure number type for backend
        DOB: formData.DOB ? new Date(formData.DOB) : undefined,
        UpdatedBy: updatedBy ? Number(updatedBy) : undefined,
      };

      // Remove password if it's empty to avoid overwriting with an empty value
      if (updatePayload.Password === '') {
        delete updatePayload.Password;
      }

      const response = await fetch(`https://hrms-backend-production-3091.up.railway.app/user/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatePayload),
      });

      if (response.ok) {
        router.push('/team-members');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update team member.');
      }
    } catch (err) {
      // console.error('Error updating team member:', err);
      setError('An error occurred while updating team member.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center py-4">Loading team member data...</div>
      </main>
    );
  }

  if (error && !loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center py-4 text-red-500">{error}</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Team Member</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="Fname" className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" id="Fname" name="Fname" value={formData.Fname || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="Lname" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" id="Lname" name="Lname" value={formData.Lname || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="Mname" className="block text-sm font-medium text-gray-700">Middle Name</label>
                <input type="text" id="Mname" name="Mname" value={formData.Mname || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="DOB" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input type="date" id="DOB" name="DOB" value={formData.DOB || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="StatusType" className="block text-sm font-medium text-gray-700">Status Type</label>
                <select id="StatusType" name="StatusType" value={formData.StatusType || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label htmlFor="DepartmentID" className="block text-sm font-medium text-gray-700">Department ID</label>
                <input type="number" id="DepartmentID" name="DepartmentID" value={formData.DepartmentID || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="UserType" className="block text-sm font-medium text-gray-700">User Type</label>
                <select id="UserType" name="UserType" value={formData.UserType || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <option value="Admin">Admin</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div>
                <label htmlFor="Password" className="block text-sm font-medium text-gray-700">Password (leave blank to keep current)</label>
                <input type="password" id="Password" name="Password" value={formData.Password || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="Email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="Email" name="Email" value={formData.Email || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="Phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="tel" id="Phone" name="Phone" value={formData.Phone || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
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
                {loading ? 'Updating...' : 'Update Team Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 
