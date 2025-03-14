'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

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
  status: 'upcoming' | 'live' | 'ended';
};

type GasPriceInfo = {
  price: string;
  time: string;
  recommended: boolean;
};

export default function MintPage() {
  const { id } = useParams();
  const { } = useAuth();
  const [drop, setDrop] = useState<NFTDrop | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [gasOption, setGasOption] = useState('medium');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mintStatus, setMintStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);

  useEffect(() => {
    const fetchNFTDrop = async () => {
      setLoading(true);
      
      // In a real app, this would be an API call
      // For this PoC, we'll simulate data loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock NFT drop data for this specific ID
      const mockDrop: NFTDrop = {
        id: id as string,
        name: 'Cyber Nomads',
        image: 'https://ipfs.io/ipfs/QmUWVRuyFuVfo45estsJt2VaQUSEc4uwcBDW7JUhQnQmMZ/1234.png',
        collection: 'Cyber Nomads Society',
        platform: 'Rarible',
        blockchain: 'Ethereum',
        price: 0.08,
        currency: 'ETH',
        mintDate: '2023-12-15T18:00:00Z',
        supply: 8888,
        remaining: 2156,
        description: 'Cyber Nomads Society is a collection of digital wanderers roaming the metaverse. Join the society and gain access to exclusive virtual events and digital merchandise.',
        status: 'live',
      };
      
      setDrop(mockDrop);
      setLoading(false);
    };
    
    fetchNFTDrop();
  }, [id]);

  const getGasPriceInfo = (): GasPriceInfo => {
    const gasPrices: Record<string, GasPriceInfo> = {
      low: { price: '15', time: '~5 mins', recommended: false },
      medium: { price: '25', time: '~1 min', recommended: true },
      high: { price: '35', time: '<30 secs', recommended: false },
      urgent: { price: '50', time: 'Immediate', recommended: false },
    };
    
    return gasPrices[gasOption] || gasPrices.medium;
  };

  const calculateTotalCost = () => {
    if (!drop) return { nftCost: 0, gasCost: 0, total: 0 };
    
    const nftCost = drop.price * quantity;
    const gasPriceParsed = parseFloat(getGasPriceInfo().price);
    const gasEstimate = (gasPriceParsed * 0.000001) * (drop.blockchain === 'Ethereum' ? 1 : 0.01);
    
    return {
      nftCost,
      gasCost: gasEstimate,
      total: nftCost + gasEstimate
    };
  };

  const handleMint = async () => {
    if (!drop) return;
    
    setMintStatus('processing');
    setIsProcessing(true);
    
    try {
      // In a real app, this would be a real blockchain transaction
      // For this PoC, we'll simulate the process
      
      // Simulate transaction submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful transaction
      const fakeTxHash = '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      setTxHash(fakeTxHash);
      setMintStatus('success');
    } catch (error) {
      console.error('Mint error:', error);
      setErrorMessage('Transaction failed. Please try again.');
      setMintStatus('error');
    } finally {
      setIsProcessing(false);
    }
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

  if (!drop) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900">NFT Drop Not Found</h1>
          <p className="mt-2 text-gray-600">The NFT drop you&apos;re looking for does not exist or has been removed.</p>
          <Link 
            href="/upcoming" 
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Upcoming Drops
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mint {drop.name}</h1>
          <p className="text-gray-600">Complete your transaction to mint this NFT</p>
        </div>
        <Link 
          href="/upcoming" 
          className="mt-2 md:mt-0 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
        >
          ← Back to Upcoming Drops
        </Link>
      </div>

      {mintStatus === 'success' ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow p-6 mb-8">
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">NFT Minted Successfully!</h2>
            <p className="text-gray-600 mb-6">Your transaction has been processed and the NFT is now in your wallet.</p>
            
            {txHash && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Transaction Hash:</p>
                <a 
                  href={`https://etherscan.io/tx/${txHash}`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {txHash}
                </a>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/nfts" 
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Your NFTs
              </Link>
              <Link 
                href="/upcoming" 
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse More Drops
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* NFT information */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 shadow overflow-hidden">
              <div className="md:flex">
                <div className="md:flex-shrink-0 md:w-1/3">
                  <img 
                    src={drop.image} 
                    alt={drop.name} 
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{drop.name}</h2>
                      <p className="text-sm text-gray-600">{drop.collection}</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {drop.platform}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-700">{drop.description}</p>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <span className="block text-xs text-gray-500">Price</span>
                      <span className="block text-lg font-medium text-gray-900">{drop.price} {drop.currency}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Blockchain</span>
                      <span className="block text-lg font-medium text-gray-900">{drop.blockchain}</span>
                    </div>
                  </div>
                  
                  {drop.supply && (
                    <div className="mt-6">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">Minted</span>
                        <span className="text-xs text-gray-500">
                          {drop.supply - (drop.remaining || 0)} / {drop.supply}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${((drop.supply - (drop.remaining || 0)) / drop.supply) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Minting options */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Minting Options</h2>
              
              {mintStatus === 'error' && (
                <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                  <p className="text-sm">{errorMessage}</p>
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  disabled={isProcessing}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {[1, 2, 3, 5, 10].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label htmlFor="gas-priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Gas Priority
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['low', 'medium', 'high', 'urgent'].map((option) => {
                    const gasInfo = getGasPriceInfo();
                    
                    return (
                      <div 
                        key={option}
                        onClick={() => !isProcessing && setGasOption(option)}
                        className={`p-3 border rounded-md cursor-pointer ${
                          gasOption === option 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium capitalize">{option}</span>
                          {option === 'medium' && (
                            <span className="px-1.5 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                              Recommended
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 flex justify-between">
                          <span>{gasInfo.price} GWEI</span>
                          <span>{gasInfo.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Price ({quantity} NFTs)</span>
                  <span className="text-sm text-gray-900">{(drop.price * quantity).toFixed(4)} {drop.currency}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Gas fee (estimated)</span>
                  <span className="text-sm text-gray-900">{calculateTotalCost().gasCost.toFixed(4)} {drop.currency}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm font-medium text-gray-700">Total</span>
                  <span className="text-sm font-medium text-gray-900">{calculateTotalCost().total.toFixed(4)} {drop.currency}</span>
                </div>
                <div className="text-xs text-gray-500 text-right mt-1">
                  ≈ ${(calculateTotalCost().total * (drop.currency === 'ETH' ? 2000 : 100)).toFixed(2)} USD
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleMint}
                  disabled={isProcessing || drop.status !== 'live'}
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${isProcessing 
                      ? 'bg-blue-400 cursor-wait' 
                      : drop.status !== 'live'
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </div>
                  ) : drop.status !== 'live' ? (
                    drop.status === 'upcoming' ? 'Minting Not Yet Available' : 'Minting Ended'
                  ) : (
                    'Mint Now'
                  )}
                </button>
                
                <div className="text-xs text-center text-gray-500">
                  By minting, you agree to our Terms of Service and confirm you have sufficient funds in your wallet.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 