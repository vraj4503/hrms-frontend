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
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const errorMsg = params.get('error');
      if (errorMsg) {
        setError(errorMsg);
        
        const url = new URL(window.location.href);
        url.searchParams.delete('error');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }, []);

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

    // Validate required fields
    if (!formData.Fname || !formData.Lname || !formData.DOB || !formData.DepartmentID || !formData.Email || !formData.Phone) {
      alert('Please fill in all required fields.'); 
      setLoading(false);
      return;
    }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.Email)) {
      alert('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    // Validate date of birth and age
    if (!formData.DOB) {
      alert('Please enter your date of birth.');
      setLoading(false);
      return;
    }
    if (new Date(formData.DOB) > new Date()) {
      alert('Date of birth cannot be in the future.');
      setLoading(false);
      return;
    }
    // Calculate age and validate
    if (!formData.DOB) {
      alert('Please enter your date of birth.');
      return;
    }
  if (formData.DOB.length < 10) {
      alert('Date of birth must be at least 10 characters long.');
      return;
    }


    const dob = new Date(formData.DOB);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  const isBirthdayPassed = m > 0 || (m === 0 && today.getDate() >= dob.getDate());
  const actualAge = isBirthdayPassed ? age : age - 1;
  if (isNaN(dob.getTime()) || actualAge < 18) {
    alert('You must be at least 18 years old to sign up.');
    return;
  }
    
   const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(formData.Phone)) {
    alert('Phone number must be exactly 10 digits.');
    return;
  }

 
  const password = formData.Password ?? '';
  const passwordRegex = /^(?=.*[0-9])(?=.*[\W_]).{6,24}$/;
  if (!passwordRegex.test(password)) {
    alert('Password must be 6-24 characters and include with atleast one symbol and one number.');
    return;
  }
    
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        router.push('/login');
        return;
      }

      
      const formattedDOB = formData.DOB ? formData.DOB : null; 
      
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

      // console.log('Payload:', payload);

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
      // console.error('Error adding team member:', err);
      router.replace(`/team-members/add?error=${encodeURIComponent('An error occurred while adding team member.')}`);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">Add New Team Member</h1>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="Fname" className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" id="Fname" name="Fname" value={formData.Fname} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="Lname" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" id="Lname" name="Lname" value={formData.Lname} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="Mname" className="block text-sm font-medium text-gray-700">Middle Name</label>
              <input type="text" id="Mname" name="Mname" value={formData.Mname} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="DOB" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" id="DOB" name="DOB" value={formData.DOB} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="DepartmentID" className="block text-sm font-medium text-gray-700">Department ID</label>
              <input type="number" id="DepartmentID" name="DepartmentID" value={formData.DepartmentID} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="Password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="Password" name="Password" value={formData.Password} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="Email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="Email" name="Email" value={formData.Email} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="Phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="tel" id="Phone" name="Phone" value={formData.Phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition shadow disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Team Member'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
} 
