'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Page = ({ params }) => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const { id } = params;

  const getBalance = async (walletId) => {
    try {
      const res = await axios.post(
        'https://eth-mainnet.g.alchemy.com/v2/RXkKhOv8Dzuu2V8gdXF3VlpPl0T1wsVL',
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBalance',
          params: [walletId, 'latest'],
        }
      );

      const weiBalance = res.data.result;
      const etherBalance = parseFloat(weiBalance) / 10 ** 18; // Convert from Wei to Ether
      setBalance(etherBalance.toFixed(4)); // Format to 4 decimal places
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBalance(id);
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="bg-neutral-800 p-8 rounded-xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Ethereum Wallet</h1>
        <p className="text-lg text-gray-400 mb-4">Wallet ID:</p>
        <p className="text-xl break-all bg-gray-500 p-4 rounded-lg mb-6">
          {id}
        </p>
        <p className="text-lg text-gray-400 mb-4">Account Balance:</p>
        {loading ? (
          <p className="text-2xl font-semibold text-center">Loading...</p>
        ) : (
          <p className="text-2xl font-semibold text-center">
            {balance} ETH
          </p>
        )}
      </div>
    </div>
  );
};

export default Page;
