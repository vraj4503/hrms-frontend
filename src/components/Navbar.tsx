'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    
    sessionStorage.clear();
    
    router.push('/login');
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <nav className="bg-[#7861ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Image
                src="/logo.svg"
                alt="HRMS Logo"
                width={40}
                height={40}
                className="h-8 w-auto"
              />
              <span className="ml-2 text-xl font-semibold text-white">
                HRMS
              </span>
            </div>
          </div>

          
          <div className="flex items-center">
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-white hover:text-gray-900 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">VP</span>
                </div>
                <span className="text-sm font-medium">Profile</span>
                <svg
                  className={`h-5 w-5 transition-transform ${
                    isProfileOpen ? 'rotate-180' : ''
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={handleProfileClick}
                    >
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
