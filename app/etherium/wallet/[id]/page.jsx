'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Page = ({params}) => {
  const [balance, setBalance] = useState(0);
  const { id } = params;

  const getBalance = async (walletId) => {
    try {
      const res = await axios.post(
        'https://eth-mainnet.g.alchemy.com/v2/RXkKhOv8Dzuu2V8gdXF3VlpPl0T1wsVL',
        {
            jsonrpc: "2.0",
            id: 1,
            method: "eth_getBalance",
            params: [walletId, "latest"]
        }
      );

      console.log(res.data);
      setBalance(res.data.result);
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
