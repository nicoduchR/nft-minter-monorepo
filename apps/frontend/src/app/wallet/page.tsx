'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  address?: string;
  txHash?: string;
};

export default function WalletPage() {
  const { } = useAuth();
  const [walletBalance, setWalletBalance] = useState(1.75);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'deposit',
      amount: 1.0,
      currency: 'ETH',
      status: 'completed',
      timestamp: '2023-12-05T12:30:45Z',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      txHash: '0x8a528f32a4d3e30b5a4cc2e81b95cdc216a4ce8fc544184be078321dd2f2a29d',
    },
    {
      id: '2',
      type: 'deposit',
      amount: 0.75,
      currency: 'ETH',
      status: 'completed',
      timestamp: '2023-12-01T09:15:30Z',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      txHash: '0x9b7bb827782298a59d5a53783c5a9ebe81729ec0f7b2c563659a98895dafb32a',
    },
  ]);

  // For the deposit form
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositForm, setShowDepositForm] = useState(false);
  
  // For the withdraw form
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);

  // Handle deposit submission
  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would initiate a blockchain transaction
    const amount = parseFloat(depositAmount);
    
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    // Simulate deposit transaction
    const newTransaction: Transaction = {
      id: String(Date.now()),
      type: 'deposit',
      amount,
      currency: 'ETH',
      status: 'pending',
      timestamp: new Date().toISOString(),
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Simulate transaction completion after delay
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? {...tx, status: 'completed', txHash: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)} 
            : tx
        )
      );
      setWalletBalance(prev => prev + amount);
      setShowDepositForm(false);
      setDepositAmount('');
    }, 2000);
  };

  // Handle withdrawal submission
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(withdrawAmount);
    
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (amount > walletBalance) {
      alert('Insufficient funds');
      return;
    }
    
    if (!withdrawAddress || !/^0x[a-fA-F0-9]{40}$/.test(withdrawAddress)) {
      alert('Please enter a valid Ethereum address');
      return;
    }
    
    // Simulate withdrawal transaction
    const newTransaction: Transaction = {
      id: String(Date.now()),
      type: 'withdrawal',
      amount,
      currency: 'ETH',
      status: 'pending',
      timestamp: new Date().toISOString(),
      address: withdrawAddress,
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Simulate transaction completion after delay
    setTimeout(() => {
      setTransactions(prev => 
        prev.map(tx => 
          tx.id === newTransaction.id 
            ? {...tx, status: 'completed', txHash: '0x' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)} 
            : tx
        )
      );
      setWalletBalance(prev => prev - amount);
      setShowWithdrawForm(false);
      setWithdrawAmount('');
      setWithdrawAddress('');
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Wallet Management</h1>
        <p className="text-gray-600">Manage your funds and track your transactions.</p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Current Balance</h2>
          <div className="text-3xl font-bold text-gray-900">{walletBalance.toFixed(4)} ETH</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setShowDepositForm(true);
              setShowWithdrawForm(false);
            }}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Deposit Funds
          </button>
          <button
            onClick={() => {
              setShowWithdrawForm(true);
              setShowDepositForm(false);
            }}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Withdraw Funds
          </button>
        </div>
      </div>

      {/* Deposit Form */}
      {showDepositForm && (
        <div className="bg-white rounded-lg border border-gray-200 shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Deposit Ethereum</h2>
          <form onSubmit={handleDeposit}>
            <div className="mb-4">
              <label htmlFor="depositAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (ETH)
              </label>
              <input
                type="number"
                id="depositAmount"
                step="0.001"
                min="0.001"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                required
              />
            </div>
            <div className="bg-gray-50 border border-gray-300 rounded-md p-4 mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Deposit Address</h3>
              <div className="flex items-center">
                <code className="text-xs sm:text-sm bg-gray-100 p-2 rounded flex-grow overflow-auto">
                  0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                </code>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText('0x71C7656EC7ab88b098defB751B7401B5f6d8976F')}
                  className="ml-2 p-2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Send ETH to this address from your external wallet. Once confirmed on the blockchain, your balance will be updated.
              </p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowDepositForm(false)}
                className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Simulate Deposit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Withdraw Form */}
      {showWithdrawForm && (
        <div className="bg-white rounded-lg border border-gray-200 shadow p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Withdraw Ethereum</h2>
          <form onSubmit={handleWithdraw}>
            <div className="mb-4">
              <label htmlFor="withdrawAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (ETH)
              </label>
              <input
                type="number"
                id="withdrawAmount"
                step="0.001"
                min="0.001"
                max={walletBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Available: {walletBalance.toFixed(4)} ETH</p>
            </div>
            <div className="mb-4">
              <label htmlFor="withdrawAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Destination Address
              </label>
              <input
                type="text"
                id="withdrawAddress"
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="0x..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">Enter the Ethereum address where you want to receive the funds.</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowWithdrawForm(false)}
                className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Withdraw
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-lg border border-gray-200 shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'deposit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.amount} {transaction.currency}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.txHash ? (
                        <a 
                          href={`https://etherscan.io/tx/${transaction.txHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500"
                        >
                          View on Etherscan
                        </a>
                      ) : (
                        'Processing...'
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
} 