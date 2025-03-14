'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full top-0 left-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap">
              NFT Minter
            </span>
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex md:items-center md:w-auto">
          <ul className="flex flex-col md:flex-row md:space-x-8 mt-4 md:mt-0 md:text-sm md:font-medium">
            <li>
              <Link href="/" className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 md:p-0">
                Home
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    href="/dashboard" 
                    className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 md:p-0"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/wallet" 
                    className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 md:p-0"
                  >
                    Wallet
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/nfts" 
                    className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 md:p-0"
                  >
                    My NFTs
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/upcoming" 
                    className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 md:p-0"
                  >
                    Upcoming Drops
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={logout}
                    className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 md:p-0"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    href="/login" 
                    className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 md:p-0"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/register" 
                    className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 md:p-0"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg 
              className="w-6 h-6" 
              fill="currentColor" 
              viewBox="0 0 20 20" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                fillRule="evenodd" 
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" 
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden w-full ${isMenuOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
          <li>
            <Link href="/" className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 border-b border-gray-100 md:border-0 md:p-0">
              Home
            </Link>
          </li>
          
          {isAuthenticated ? (
            <>
              <li>
                <Link 
                  href="/dashboard" 
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 border-b border-gray-100 md:border-0 md:p-0"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  href="/wallet" 
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 border-b border-gray-100 md:border-0 md:p-0"
                >
                  Wallet
                </Link>
              </li>
              <li>
                <Link 
                  href="/nfts" 
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 border-b border-gray-100 md:border-0 md:p-0"
                >
                  My NFTs
                </Link>
              </li>
              <li>
                <Link 
                  href="/upcoming" 
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 border-b border-gray-100 md:border-0 md:p-0"
                >
                  Upcoming Drops
                </Link>
              </li>
              <li>
                <button 
                  onClick={logout}
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 border-b border-gray-100 md:border-0 md:p-0"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  href="/login" 
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 border-b border-gray-100 md:border-0 md:p-0"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  href="/register" 
                  className="block py-2 pr-4 pl-3 text-gray-700 hover:text-blue-700 border-b border-gray-100 md:border-0 md:p-0"
                >
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
} 