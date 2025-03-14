'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

type NFTDrop = {
  id: string;
  name: string;
  image: string;
  collection: string;
  platform: string;
  blockchain: string;
  price: number;
  currency: string;
  mintDate: string;
  supply: number | null;
  remaining: number | null;
  description: string;
  website: string;
  discord: string | null;
  twitter: string | null;
  countdown: string;
  status: 'upcoming' | 'live' | 'ended';
};

export default function UpcomingPage() {
  const { } = useAuth();
  const [drops, setDrops] = useState<NFTDrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [blockchain, setBlockchain] = useState('all');
  const [sort, setSort] = useState('date');
  const [selectedDrop, setSelectedDrop] = useState<NFTDrop | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    // This would be a real API call to the scraper service in a production environment
    const fetchUpcomingDrops = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock drop data
      const mockDrops: NFTDrop[] = [
        {
          id: '1',
          name: 'Alpha Prestige',
          image: 'https://openseauserdata.com/files/438ef058270c809a242ff24c6ab1996b.png',
          collection: 'Alpha Prestige Collection',
          platform: 'OpenSea',
          blockchain: 'Ethereum',
          price: 0.15,
          currency: 'ETH',
          mintDate: '2023-12-20T16:00:00Z',
          supply: 10000,
          remaining: 8542,
          description: 'Alpha Prestige is a limited collection of 10,000 unique digital collectibles that provide exclusive benefits and rewards to holders.',
          website: 'https://alphaprestige.io',
          discord: 'https://discord.gg/alphaprestige',
          twitter: 'https://twitter.com/AlphaPrestige',
          countdown: '2 days',
          status: 'upcoming',
        },
        {
          id: '2',
          name: 'Mystic Explorers',
          image: 'https://img-cdn.magiceden.dev/rs:fill:400:400:0:0/plain/https://creator-hub-prod.s3.us-east-2.amazonaws.com/mystic_explorers_pfp.png',
          collection: 'Mystic Explorers',
          platform: 'Magic Eden',
          blockchain: 'Solana',
          price: 2.5,
          currency: 'SOL',
          mintDate: '2023-12-18T10:00:00Z',
          supply: 5000,
          remaining: 5000,
          description: 'Mystic Explorers is a collection of 5,000 explorers journeying through a mystical universe, with each explorer granting access to exclusive virtual expeditions.',
          website: 'https://mysticexplorers.xyz',
          discord: 'https://discord.gg/mysticexplorers',
          twitter: 'https://twitter.com/MysticExplorers',
          countdown: '12 hours',
          status: 'upcoming',
        },
        {
          id: '3',
          name: 'Cyber Nomads',
          image: 'https://ipfs.io/ipfs/QmUWVRuyFuVfo45estsJt2VaQUSEc4uwcBDW7JUhQnQmMZ/1234.png',
          collection: 'Cyber Nomads Society',
          platform: 'Rarible',
          blockchain: 'Ethereum',
          price: 0.08,
          currency: 'ETH',
          mintDate: '2023-12-15T18:00:00Z',
          supply: 8888,
          remaining: 0,
          description: 'Cyber Nomads Society is a collection of digital wanderers roaming the metaverse. Join the society and gain access to exclusive virtual events and digital merchandise.',
          website: 'https://cybernomads.io',
          discord: 'https://discord.gg/cybernomads',
          twitter: 'https://twitter.com/CyberNomads',
          countdown: 'Live now',
          status: 'live',
        },
        {
          id: '4',
          name: 'Quantum Beings',
          image: 'https://lh3.googleusercontent.com/y7Wsz2qySru9dEl0LEzMzTUEj0aBU9Q8BX-qz9iqzQxS-NlVPBv1_pJZ1PS1PET013xQcZ_JcgRVc3Y6HpkO5_s1WnW13cw5MtxdZA',
          collection: 'Quantum Beings Universe',
          platform: 'OpenSea',
          blockchain: 'Polygon',
          price: 100,
          currency: 'MATIC',
          mintDate: '2023-12-25T00:00:00Z',
          supply: 4444,
          remaining: 4444,
          description: 'Quantum Beings exist in a parallel dimension, offering a glimpse into a universe governed by quantum physics. Each Being comes with unique traits and abilities.',
          website: 'https://quantumbeings.io',
          discord: 'https://discord.gg/quantumbeings',
          twitter: 'https://twitter.com/QuantumBeingsNFT',
          countdown: '1 week',
          status: 'upcoming',
        },
        {
          id: '5',
          name: 'Metaverse Moguls',
          image: 'https://i.imgur.com/3mZnWbr.png',
          collection: 'Metaverse Moguls Club',
          platform: 'Magic Eden',
          blockchain: 'Solana',
          price: 5,
          currency: 'SOL',
          mintDate: '2023-12-10T14:00:00Z',
          supply: 3333,
          remaining: 0,
          description: 'The Metaverse Moguls Club is an exclusive collection of virtual real estate tycoons. Members gain access to virtual land drops, investment opportunities, and networking events.',
          website: 'https://metaversemoguls.club',
          discord: null,
          twitter: 'https://twitter.com/MetaverseMoguls',
          countdown: 'Ended',
          status: 'ended',
        },
      ];
      
      setDrops(mockDrops);
      setLoading(false);
    };
    
    fetchUpcomingDrops();

    // Load favorites from localStorage if available
    const savedFavorites = localStorage.getItem('nft_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem('nft_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (dropId: string, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent opening the modal when clicking the favorite button
    }
    
    if (favorites.includes(dropId)) {
      setFavorites(favorites.filter(id => id !== dropId));
    } else {
      setFavorites([...favorites, dropId]);
    }
  };

  // Filter drops based on platform, blockchain, and favorites filter
  const filteredDrops = drops.filter((drop) => {
    const matchesPlatform = filter === 'all' || drop.platform.toLowerCase() === filter.toLowerCase();
    const matchesBlockchain = blockchain === 'all' || drop.blockchain.toLowerCase() === blockchain.toLowerCase();
    const matchesFavorites = !showFavoritesOnly || favorites.includes(drop.id);
    
    return matchesPlatform && matchesBlockchain && matchesFavorites;
  });

  // Sort drops
  const sortedDrops = [...filteredDrops].sort((a, b) => {
    switch (sort) {
      case 'date':
        return new Date(a.mintDate).getTime() - new Date(b.mintDate).getTime();
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  const handleDropSelect = (drop: NFTDrop) => {
    setSelectedDrop(drop);
  };

  const closeModal = () => {
    setSelectedDrop(null);
  };

  // Function to handle mint now button
  const handleMintNow = (dropId: string) => {
    // In a real app, this would navigate to a minting page or process
    alert(`Redirecting to minting page for ${dropId}`);
  };

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upcoming NFT Drops</h1>
        <p className="text-gray-600">Discover and mint the latest NFT collections from popular marketplaces.</p>
      </div>

      {/* Filters and Controls */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="platform-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Platform
            </label>
            <select
              id="platform-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Platforms</option>
              <option value="OpenSea">OpenSea</option>
              <option value="Magic Eden">Magic Eden</option>
              <option value="Rarible">Rarible</option>
            </select>
          </div>
          <div>
            <label htmlFor="blockchain-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Blockchain
            </label>
            <select
              id="blockchain-filter"
              value={blockchain}
              onChange={(e) => setBlockchain(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Blockchains</option>
              <option value="Ethereum">Ethereum</option>
              <option value="Solana">Solana</option>
              <option value="Polygon">Polygon</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort-by"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="date">Mint Date (Soonest First)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center">
          <label htmlFor="favorites-only" className="flex items-center text-sm font-medium text-gray-700">
            <input
              id="favorites-only"
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2">Show favorites only</span>
          </label>
          <span className="ml-2 text-xs text-gray-500">({favorites.length} favorites)</span>
        </div>
      </div>

      {/* NFT Drops Grid */}
      {sortedDrops.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No NFT drops found matching your filters.</p>
          <button
            onClick={() => {
              setFilter('all');
              setBlockchain('all');
              setShowFavoritesOnly(false);
            }}
            className="text-blue-600 hover:text-blue-500"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedDrops.map((drop) => (
            <div
              key={drop.id}
              className="bg-white rounded-lg border border-gray-200 shadow overflow-hidden cursor-pointer transform transition duration-200 hover:scale-[1.02] hover:shadow-lg"
              onClick={() => handleDropSelect(drop)}
            >
              {/* Status badge */}
              <div className="relative">
                <div className={`absolute top-2 left-2 z-10 px-2 py-1 rounded-full text-xs font-medium ${
                  drop.status === 'live' ? 'bg-green-100 text-green-800' : 
                  drop.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {drop.status === 'live' ? 'Live Now' : 
                   drop.status === 'upcoming' ? `Starts in ${drop.countdown}` : 
                   'Ended'}
                </div>
                
                {/* Favorite button */}
                <button
                  onClick={(e) => toggleFavorite(drop.id, e)}
                  className="absolute top-2 right-2 z-10 p-1 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100"
                >
                  <svg 
                    className={`h-5 w-5 ${favorites.includes(drop.id) ? 'text-yellow-500' : 'text-gray-400'}`} 
                    fill={favorites.includes(drop.id) ? 'currentColor' : 'none'} 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </button>
              </div>
              
              {/* NFT Image */}
              <div className="w-full h-60 overflow-hidden">
                <img
                  src={drop.image}
                  alt={drop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* NFT Details */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 truncate">{drop.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{drop.collection}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-gray-900">
                      {drop.price} {drop.currency}
                    </span>
                    <span className="text-xs text-gray-500">
                      {drop.blockchain}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center">
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      {drop.platform}
                    </span>
                    {drop.supply && (
                      <span className="ml-2 text-xs text-gray-500">
                        {drop.remaining !== null
                          ? `${drop.remaining} / ${drop.supply}`
                          : `${drop.supply} items`}
                      </span>
                    )}
                  </div>
                  
                  {drop.status === 'live' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMintNow(drop.id);
                      }}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Mint Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NFT Drop Detail Modal */}
      {selectedDrop && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900">{selectedDrop.name}</h3>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                  selectedDrop.status === 'live' ? 'bg-green-100 text-green-800' : 
                  selectedDrop.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedDrop.status === 'live' ? 'Live Now' : 
                   selectedDrop.status === 'upcoming' ? `Starts in ${selectedDrop.countdown}` : 
                   'Ended'}
                </span>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg">
                  <img
                    src={selectedDrop.image}
                    alt={selectedDrop.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleFavorite(selectedDrop.id)}
                      className="flex items-center text-sm font-medium focus:outline-none"
                    >
                      <svg 
                        className={`h-5 w-5 mr-1 ${favorites.includes(selectedDrop.id) ? 'text-yellow-500' : 'text-gray-400'}`} 
                        fill={favorites.includes(selectedDrop.id) ? 'currentColor' : 'none'} 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {favorites.includes(selectedDrop.id) ? 'Favorited' : 'Add to Favorites'}
                    </button>
                  </div>
                  
                  <div className="flex space-x-2">
                    {selectedDrop.twitter && (
                      <a 
                        href={selectedDrop.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                        </svg>
                      </a>
                    )}
                    {selectedDrop.discord && (
                      <a 
                        href={selectedDrop.discord} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-gray-500 hover:text-indigo-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                        </svg>
                      </a>
                    )}
                    <a 
                      href={selectedDrop.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-gray-900"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </a>
                  </div>
                </div>
                
                {selectedDrop.description && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                    <p className="text-gray-900 text-sm">{selectedDrop.description}</p>
                  </div>
                )}
              </div>
              
              <div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="block text-xs text-gray-500">Price</span>
                    <span className="block text-lg font-medium text-gray-900">{selectedDrop.price} {selectedDrop.currency}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="block text-xs text-gray-500">Blockchain</span>
                    <span className="block text-lg font-medium text-gray-900">{selectedDrop.blockchain}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="block text-xs text-gray-500">Platform</span>
                    <span className="block text-lg font-medium text-gray-900">{selectedDrop.platform}</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="block text-xs text-gray-500">Mint Date</span>
                    <span className="block text-lg font-medium text-gray-900">
                      {new Date(selectedDrop.mintDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
                
                {selectedDrop.supply && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Supply</h4>
                    <div className="bg-gray-100 h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full rounded-full"
                        style={{ 
                          width: selectedDrop.remaining !== null 
                            ? `${((selectedDrop.supply - selectedDrop.remaining) / selectedDrop.supply) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-gray-500">
                      <span>
                        {selectedDrop.remaining !== null 
                          ? `${selectedDrop.supply - selectedDrop.remaining} minted` 
                          : '0 minted'}
                      </span>
                      <span>Total: {selectedDrop.supply}</span>
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Auto-Mint Settings</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                      <input
                        id="enable-auto-mint"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="enable-auto-mint" className="ml-2 block text-sm font-medium text-gray-700">
                        Enable auto-mint when live
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="mint-quantity" className="block text-xs font-medium text-gray-500 mb-1">
                          Quantity
                        </label>
                        <select
                          id="mint-quantity"
                          className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                          defaultValue="1"
                        >
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="5">5</option>
                          <option value="10">10</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="gas-price" className="block text-xs font-medium text-gray-500 mb-1">
                          Gas Priority
                        </label>
                        <select
                          id="gas-price"
                          className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                          defaultValue="medium"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  {selectedDrop.status === 'live' ? (
                    <Link
                      href={`/mint/${selectedDrop.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Mint Now
                    </Link>
                  ) : selectedDrop.status === 'upcoming' ? (
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() => {
                        closeModal();
                        alert('You will receive a notification when this drop goes live.');
                      }}
                    >
                      Get Notified
                    </button>
                  ) : (
                    <span className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white">
                      Mint Ended
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 