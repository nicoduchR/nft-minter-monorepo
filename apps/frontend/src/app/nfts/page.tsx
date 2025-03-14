'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

type NFT = {
  id: string;
  name: string;
  image: string;
  collection: string;
  platform: string;
  mintedAt: string;
  description?: string;
  traits?: {
    trait_type: string;
    value: string;
  }[];
  floorPrice?: number;
  currency?: string;
};

export default function NFTsPage() {
  const { } = useAuth();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // This would be a real API call in a production environment
    const fetchNFTs = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Mock NFT data
      const mockNFTs: NFT[] = [
        {
          id: '1',
          name: 'Bored Ape #7281',
          image: 'https://i.seadn.io/gae/hcN0obYvS8-xBatmK3WZoLWiUnzGkNJ7TPbYZ2JGmrG3ViCLAIrhG5NbRHCG2r-qHw8sh0oBmwfmJTnPHxje2xDr9RJJdOjMaLs?w=500&auto=format',
          collection: 'Bored Ape Yacht Club',
          platform: 'OpenSea',
          mintedAt: '2023-10-15',
          description: 'The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain.',
          traits: [
            { trait_type: 'Background', value: 'Orange' },
            { trait_type: 'Fur', value: 'Brown' },
            { trait_type: 'Eyes', value: 'Hypnotized' },
            { trait_type: 'Mouth', value: 'Bored' },
          ],
          floorPrice: 68.5,
          currency: 'ETH',
        },
        {
          id: '2',
          name: 'Crypto Punk #3124',
          image: 'https://cryptopunks.app/cryptopunks/cryptopunk3100.png',
          collection: 'CryptoPunks',
          platform: 'Rarible',
          mintedAt: '2023-11-02',
          description: 'CryptoPunks launched as a fixed set of 10,000 items in mid-2017 and became one of the inspirations for the ERC-721 standard.',
          traits: [
            { trait_type: 'Type', value: 'Male' },
            { trait_type: 'Attribute', value: 'Mohawk' },
            { trait_type: 'Attribute', value: 'Earring' },
          ],
          floorPrice: 50.2,
          currency: 'ETH',
        },
        {
          id: '3',
          name: 'Azuki #5629',
          image: 'https://ipfs.io/ipfs/QmYDvPAXtiJg7s8JdRBSLWdgSphQdac8j1YuQNNxcGE1hg/8875.png',
          collection: 'Azuki',
          platform: 'OpenSea',
          mintedAt: '2023-09-20',
          description: 'Azuki starts with a collection of 10,000 avatars that give you membership access to The Garden: a corner of the internet where artists, builders, and web3 enthusiasts meet to create a decentralized future.',
          traits: [
            { trait_type: 'Type', value: 'Human' },
            { trait_type: 'Hair', value: 'Blue' },
            { trait_type: 'Clothing', value: 'Hoodie' },
          ],
          floorPrice: 12.8,
          currency: 'ETH',
        },
        {
          id: '4',
          name: 'Doodle #8795',
          image: 'https://doodles.app/images/doodle/6.png',
          collection: 'Doodles',
          platform: 'OpenSea',
          mintedAt: '2023-11-15',
          description: 'A community-driven collectible NFT project featuring art by Burnt Toast.',
          traits: [
            { trait_type: 'Background', value: 'Yellow' },
            { trait_type: 'Face', value: 'Happy' },
            { trait_type: 'Head', value: 'Blonde' },
          ],
          floorPrice: 3.2,
          currency: 'ETH',
        },
        {
          id: '5',
          name: 'Moonbird #4512',
          image: 'https://openseauserdata.com/files/038f517148b223aba7d5989e181d7f1a.png',
          collection: 'Moonbirds',
          platform: 'Magic Eden',
          mintedAt: '2023-10-01',
          description: 'A collection of 10,000 utility-enabled PFPs that feature a richly diverse and unique pool of rarity-powered traits.',
          traits: [
            { trait_type: 'Feathers', value: 'Red' },
            { trait_type: 'Eyes', value: 'Blue' },
            { trait_type: 'Beak', value: 'Short' },
          ],
          floorPrice: 7.5,
          currency: 'ETH',
        },
      ];
      
      setNfts(mockNFTs);
      setLoading(false);
    };
    
    fetchNFTs();
  }, []);

  // Filter NFTs based on platform and search query
  const filteredNFTs = nfts.filter((nft) => {
    const matchesFilter = filter === 'all' || nft.platform.toLowerCase() === filter.toLowerCase();
    const matchesSearch = 
      searchQuery === '' || 
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      nft.collection.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Sort NFTs
  const sortedNFTs = [...filteredNFTs].sort((a, b) => {
    switch (sort) {
      case 'newest':
        return new Date(b.mintedAt).getTime() - new Date(a.mintedAt).getTime();
      case 'oldest':
        return new Date(a.mintedAt).getTime() - new Date(b.mintedAt).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleNFTSelect = (nft: NFT) => {
    setSelectedNFT(nft);
  };

  const closeModal = () => {
    setSelectedNFT(null);
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
        <h1 className="text-2xl font-bold text-gray-900">Your NFT Collection</h1>
        <p className="text-gray-600">Manage and view all your NFTs.</p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 bg-white rounded-lg border border-gray-200 shadow p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-64">
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
                <option value="Rarible">Rarible</option>
                <option value="Magic Eden">Magic Eden</option>
              </select>
            </div>
            <div className="w-full sm:w-64">
              <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                id="sort-by"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
          </div>
          <div className="w-full md:w-64">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search NFTs..."
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      {sortedNFTs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No NFTs found matching your filters.</p>
          <button
            onClick={() => {
              setFilter('all');
              setSearchQuery('');
            }}
            className="text-blue-600 hover:text-blue-500"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedNFTs.map((nft) => (
            <div
              key={nft.id}
              className="bg-white rounded-lg border border-gray-200 shadow overflow-hidden cursor-pointer transform transition duration-200 hover:scale-[1.02] hover:shadow-lg"
              onClick={() => handleNFTSelect(nft)}
            >
              <div className="w-full h-64 overflow-hidden relative">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {nft.platform}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">{nft.name}</h3>
                <p className="text-sm text-gray-500 truncate">{nft.collection}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Minted on {new Date(nft.mintedAt).toLocaleDateString()}</span>
                  {nft.floorPrice && (
                    <span className="text-xs font-medium text-gray-900">
                      Floor: {nft.floorPrice} {nft.currency}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NFT Detail Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">{selectedNFT.name}</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4">
              <div className="w-full h-80 mb-4 overflow-hidden rounded-lg">
                <img
                  src={selectedNFT.image}
                  alt={selectedNFT.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Collection</h4>
                <p className="text-gray-900">{selectedNFT.collection}</p>
              </div>
              {selectedNFT.description && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
                  <p className="text-gray-900">{selectedNFT.description}</p>
                </div>
              )}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Platform</h4>
                <p className="text-gray-900">{selectedNFT.platform}</p>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Minted Date</h4>
                <p className="text-gray-900">{new Date(selectedNFT.mintedAt).toLocaleDateString()}</p>
              </div>
              {selectedNFT.traits && selectedNFT.traits.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Traits</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedNFT.traits.map((trait, index) => (
                      <div key={index} className="bg-gray-100 rounded-md p-2">
                        <span className="text-xs text-gray-500 block">{trait.trait_type}</span>
                        <span className="text-sm font-medium text-gray-900">{trait.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-6 flex justify-end">
                <a
                  href={`https://opensea.io/assets/${selectedNFT.id}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View on {selectedNFT.platform}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 