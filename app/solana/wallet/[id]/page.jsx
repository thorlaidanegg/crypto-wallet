'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Page = ({ params }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [accountInfo, setAccountInfo] = useState(null);
  const { id } = params;

  const getBalance = async (walletId) => {
    try {
      const res = await axios.post(
        `${process.env.SOL_URL}`,
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [walletId],
        }
      );
      const lamports = res.data.result.value;
      const solBalance = lamports / 10 ** 9; // Convert lamports to SOL
      setBalance(solBalance.toFixed(4)); // Format to 4 decimal places
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getAccountInfo = async (walletId) => {
    try {
      const res = await axios.post(
        'https://solana-mainnet.g.alchemy.com/v2/RXkKhOv8Dzuu2V8gdXF3VlpPl0T1wsVL',
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'getAccountInfo',
          params: [walletId],
        }
      );
      setAccountInfo(res.data.result.value);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBalance(id);
    getAccountInfo(id);
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white p-4">
      <div className="bg-neutral-800 p-8 rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Solana Wallet</h1>
        <p className="text-lg text-gray-400 mb-4">Wallet ID:</p>
        <p className="text-xl break-all bg-gray-500 p-4 rounded-lg mb-6">
          {id}
        </p>
        <p className="text-lg text-gray-400 mb-4">Account Balance:</p>
        {loading ? (
          <p className="text-2xl font-semibold text-center">Loading...</p>
        ) : (
          <p className="text-2xl font-semibold text-center">
            {balance} SOL
          </p>
        )}
        <div className="mt-8">
          <h2 className="text-lg text-gray-400 mb-4">Account Info:</h2>
          {accountInfo ? (
            <pre className="bg-gray-700 p-4 rounded-lg text-sm">
              {JSON.stringify(accountInfo, null, 2)}
            </pre>
          ) : (
            <p className="text-center text-gray-500">No account info available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
