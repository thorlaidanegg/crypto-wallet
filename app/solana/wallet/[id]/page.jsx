'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Page = ({params}) => {
  const [balance, setBalance] = useState(0);
  const { id } = params;

  const getBalance = async (walletId) => {
    try {
      const res = await axios.post(
        'https://solana-mainnet.g.alchemy.com/v2/RXkKhOv8Dzuu2V8gdXF3VlpPl0T1wsVL',
        {
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [walletId],
        }
      );

      console.log(res.data.result.value);
      setBalance(res.data.result.value);
    } catch (err) {
      console.log(err);
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
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
      getBalance(id);
  }, [id]);

  return (
    <div>
      <p>Wallet ID: {id}</p>
      <p>Account Balance: {balance}</p>
    </div>
  );
};

export default Page;
