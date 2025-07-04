'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    
    Email: '',
    Password: '',
    Fname: '',
    Lname: '',
    Mname: '',
    DOB: '',
    DepartmentID: 1,
    UserType: 'Admin',
    Phone: '',
    
    
    companyName: '',
    location: '',
    strength: '',
  });

  const [invalidFields, setInvalidFields] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(formData.Phone)) {
    alert('Phone number must be exactly 10 digits.');
    return;
  }

  const requiredFields = [
    'Email', 'Password', 'Fname', 'Lname', 'Mname', 'DOB', 'DepartmentID', 'UserType', 'Phone', 'companyName', 'location', 'strength'
  ];
  const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
  setInvalidFields(emptyFields);

  if (emptyFields.length > 0) {
    return; // Stop submission if any field is empty
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
 
  const password = formData.Password;
  const passwordRegex = /^(?=.*[0-9])(?=.*[\W_]).{6,24}$/;
  if (!passwordRegex.test(password)) {
    alert('Password must be 6-24 characters and include with atleast one symbol and one number.');
    return;
  }
    
    try {
      const companyResponse = await fetch('https://hrms-backend-production-3091.up.railway.app/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          location: formData.location,
          strength: formData.strength,
          
        }),
      });

      if (!companyResponse.ok) {
        throw new Error('Failed to create company');
      }

      const companyData = await companyResponse.json();
      
      const formattedDate = formData.DOB ? formData.DOB : null; 
      
      const userResponse = await fetch('https://hrms-backend-production-3091.up.railway.app/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: formData.Email,
          Password: formData.Password, 
          Fname: formData.Fname,
          Lname: formData.Lname,
          Mname: formData.Mname || null,
          DOB: formattedDate,
          StatusType:'A',
          DepartmentID: Number(formData.DepartmentID),
          UserType: formData.UserType,
          Phone: formData.Phone,
          CID: companyData.CID, 
        }),
      });

      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      router.push('/login');
    } catch (error) {
      // console.error('Error during signup:', error);
      alert('Failed to create account. Please try again.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Create Your Account</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input 
                  type="text" 
                  name="Fname" 
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${invalidFields.includes('Fname') ? 'border-red-500' : ''}`}
                  placeholder="Enter your first name"
                  value={formData.Fname}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                <input 
                  type="text" 
                  name="Mname" 
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${invalidFields.includes('Fname') ? 'border-red-500' : ''}`}
                  placeholder="Enter your middle name (optional)"
                  value={formData.Mname}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input 
                  type="text" 
                  name="Lname" 
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${invalidFields.includes('Fname') ? 'border-red-500' : ''}`}
                  placeholder="Enter your last name"
                  value={formData.Lname}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input 
                  type="date" 
                  name="DOB" 
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${invalidFields.includes('Fname') ? 'border-red-500' : ''}`}
                  value={formData.DOB}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  name="Email" 
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${invalidFields.includes('Fname') ? 'border-red-500' : ''}`}
                  placeholder="Enter your email address"
                  value={formData.Email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  name="Phone" 
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${invalidFields.includes('Fname') ? 'border-red-500' : ''}`}
                  placeholder="Enter your phone number"
                  value={formData.Phone}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                  type="password" 
                  name="Password" 
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${invalidFields.includes('Fname') ? 'border-red-500' : ''}`}
                  placeholder="Create a strong password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input 
                  type="text" 
                  name="companyName" 
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${invalidFields.includes('Fname') ? 'border-red-500' : ''}`}
                  placeholder="Enter company name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input 
                  type="text" 
                  name="location" 
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${invalidFields.includes('Fname') ? 'border-red-500' : ''}`}
                  placeholder="Enter company location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company Size</label>
                <select
                  name="strength"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${invalidFields.includes('strength') ? 'border-red-500' : ''}`}
                  value={formData.strength}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select company size</option>
                  <option value="0-8">0-8</option>
                  <option value="9-12">9-12</option>
                  <option value="13-20">13-20</option>
                  <option value="21-50">21-50</option>
                  <option value="51-100">51-100</option>
                  <option value="100+">100+</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <button 
              type="submit" 
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Account
            </button>
            <div className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Login here
              </a>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignupPage; 
