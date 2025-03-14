'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [upcomingDropsCount] = useState(24);
  const [mintedNFTsCount, setMintedNFTsCount] = useState(1523);
  const [usersCount, setUsersCount] = useState(487);

  useEffect(() => {
    // This would be a real API call in production
    // Here we just simulate incrementing counts for visual effect
    const interval = setInterval(() => {
      setMintedNFTsCount(prev => prev + Math.floor(Math.random() * 3));
      setUsersCount(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-16 md:py-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900">
            <span className="block">Automate Your NFT</span>
            <span className="block text-blue-600">Minting Experience</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
            Never miss a drop again. Our platform automates minting from popular NFT marketplaces with no MetaMask required.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="py-3 px-6 rounded-md shadow-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="py-3 px-6 rounded-md shadow-md font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="py-3 px-6 rounded-md shadow font-medium text-blue-600 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-4xl font-bold text-blue-600">{upcomingDropsCount}+</p>
            <p className="mt-2 text-gray-600">Upcoming NFT Drops</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-4xl font-bold text-blue-600">{mintedNFTsCount.toLocaleString()}+</p>
            <p className="mt-2 text-gray-600">NFTs Minted</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-4xl font-bold text-blue-600">{usersCount}+</p>
            <p className="mt-2 text-gray-600">Happy Users</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Our platform makes NFT minting simple, secure, and automated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center">Discover Drops</h3>
            <p className="mt-2 text-gray-600 text-center">
              Browse upcoming NFT drops from OpenSea, Magic Eden, and Rarible all in one place.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center">Set Auto-Mint</h3>
            <p className="mt-2 text-gray-600 text-center">
              Configure automatic minting for drops you&apos;re interested in. No need to stay glued to your screen.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center">Collect & Profit</h3>
            <p className="mt-2 text-gray-600 text-center">
              We handle the minting process automatically. You just collect your NFTs and decide when to sell.
            </p>
          </div>
        </div>
      </div>

      {/* Platforms Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">Supported Platforms</h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            We integrate with the most popular NFT marketplaces.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
          <div className="text-center">
            <img src="https://opensea.io/static/images/logos/opensea.svg" alt="OpenSea" className="h-12 mx-auto" />
            <p className="mt-2 text-gray-600">OpenSea</p>
          </div>
          <div className="text-center">
            <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_claimpage_ME%20full%20logo%20sliced.png" alt="Magic Eden" className="h-12 mx-auto" />
            <p className="mt-2 text-gray-600">Magic Eden</p>
          </div>
          <div className="text-center">
            <img src="https://rarible.com/static/logo-light.svg" alt="Rarible" className="h-12 mx-auto" />
            <p className="mt-2 text-gray-600">Rarible</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-blue-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 md:py-16 md:px-12 text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Ready to start minting NFTs automatically?
            </h2>
            <p className="mt-4 max-w-lg mx-auto text-xl text-blue-100">
              Join thousands of users who are already using our platform to mint NFTs automatically.
            </p>
            <div className="mt-8">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="inline-block py-3 px-6 rounded-md shadow-md font-medium text-blue-600 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="inline-block py-3 px-6 rounded-md shadow-md font-medium text-blue-600 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
                >
                  Get Started Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-900">NFT Minter</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              The easiest way to mint NFTs automatically.
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Contact Us</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} NFT Minter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}