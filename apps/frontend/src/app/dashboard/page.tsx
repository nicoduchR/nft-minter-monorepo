'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

type WalletInfo = {
  balance: number;
  address: string;
};

type NFT = {
  id: string;
  name: string;
  image: string;
  collection: string;
  platform: string;
  mintedAt: string;
};

type MintOpportunity = {
  id: string;
  name: string;
  image: string;
  collection: string;
  price: number;
  currency: string;
  platform: string;
  mintDate: string;
  countdown: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [recentNFTs, setRecentNFTs] = useState<NFT[]>([]);
  const [upcomingMints, setUpcomingMints] = useState<MintOpportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would be a real API call in a production environment
    const fetchDashboardData = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock wallet data
      setWalletInfo({
        balance: 1.75,
        address: '0xf3a4...e6c2',
      });

      // Mock recent NFTs
      setRecentNFTs([
        {
          id: '1',
          name: 'Bored Ape #7281',
          image: 'https://i.seadn.io/gae/hcN0obYvS8-xBatmK3WZoLWiUnzGkNJ7TPbYZ2JGmrG3ViCLAIrhG5NbRHCG2r-qHw8sh0oBmwfmJTnPHxje2xDr9RJJdOjMaLs?w=500&auto=format',
          collection: 'BAYC',
          platform: 'OpenSea',
          mintedAt: '2023-10-15',
        },
        {
          id: '2',
          name: 'Crypto Punk #3124',
          image: 'https://cryptopunks.app/cryptopunks/cryptopunk3100.png',
          collection: 'CryptoPunks',
          platform: 'Rarible',
          mintedAt: '2023-11-02',
        },
      ]);

      // Mock upcoming mints
      setUpcomingMints([
        {
          id: '1',
          name: 'Moonbirds',
          image: 'https://openseauserdata.com/files/038f517148b223aba7d5989e181d7f1a.png',
          collection: 'Moonbirds Collection',
          price: 2.5,
          currency: 'ETH',
          platform: 'OpenSea',
          mintDate: '2023-12-25',
          countdown: '5 days',
        },
        {
          id: '2',
          name: 'DeGods',
          image: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https%3A%2F%2Fcontent.solana-nft.com%2Fimages%2Fde_gods%2Fde_gods.png',
          collection: 'DeGods Genesis',
          price: 25,
          currency: 'SOL',
          platform: 'Magic Eden',
          mintDate: '2023-12-15',
          countdown: '2 days',
        },
        {
          id: '3',
          name: 'Azuki',
          image: 'https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/8875.png',
          collection: 'Azuki Origins',
          price: 1.5,
          currency: 'ETH',
          platform: 'OpenSea',
          mintDate: '2024-01-05',
          countdown: '15 days',
        },
      ]);

      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header with greeting and wallet info */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name || user?.email || 'User'}
        </h1>
        <p className="text-gray-600">Here{"'"}s what{"'"}s happening with your NFTs today.</p>
      </div>

      {/* Wallet Overview Card */}
      {walletInfo && (
        <div className="mb-8 bg-white rounded-lg border border-gray-200 shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Wallet Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-2xl font-bold text-gray-900">{walletInfo.balance} ETH</p>
              <Link 
                href="/wallet"
                className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Manage wallet
                <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </Link>
            </div>
            <div>
              <p className="text-sm text-gray-500">Wallet Address</p>
              <p className="text-md font-medium text-gray-900">{walletInfo.address}</p>
              <button 
                className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                onClick={() => navigator.clipboard.writeText('0xf3a456789abcdef1234567890abcdef123456e6c2')}
              >
                Copy full address
                <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent NFTs */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Your Recent NFTs</h2>
          <Link 
            href="/nfts"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
        
        {recentNFTs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow p-6 text-center">
            <p className="text-gray-500">You haven&apos;t minted any NFTs yet.</p>
            <Link 
              href="/upcoming"
              className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Browse upcoming drops
              <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
              </svg>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentNFTs.map((nft) => (
              <div key={nft.id} className="bg-white rounded-lg border border-gray-200 shadow overflow-hidden">
                <div className="h-48 w-full overflow-hidden">
                  <img 
                    src={nft.image} 
                    alt={nft.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900">{nft.name}</h3>
                  <p className="text-sm text-gray-500">{nft.collection}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Minted on {nft.mintedAt}</span>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{nft.platform}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Mint Opportunities */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Upcoming Mint Opportunities</h2>
          <Link 
            href="/upcoming"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingMints.map((mint) => (
            <div key={mint.id} className="bg-white rounded-lg border border-gray-200 shadow overflow-hidden">
              <div className="h-48 w-full overflow-hidden">
                <img 
                  src={mint.image} 
                  alt={mint.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{mint.name}</h3>
                    <p className="text-sm text-gray-500">{mint.collection}</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {mint.countdown}
                  </span>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{mint.price} {mint.currency}</p>
                    <p className="text-xs text-gray-500">{mint.platform}</p>
                  </div>
                  <Link
                    href={`/mint/${mint.id}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Mint
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 