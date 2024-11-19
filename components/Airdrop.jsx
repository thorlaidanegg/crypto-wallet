'use client';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import React, { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import toast, { Toaster } from 'react-hot-toast';
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight'; // Import the HeroHighlight component
import { Input } from "@/components/ui/input"


const Airdrop = () => {
  const [publicKey, setPublicKey] = useState("");
  const [amount, setAmount] = useState(0.25); // Default amount is 0.25 SOL
  const [drawerOpen, setDrawerOpen] = useState(false); // State to manage the drawer

  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (wallet.publicKey) {
      setPublicKey(wallet.publicKey.toBase58());
      toast.success("Wallet connected");
    }
  }, [wallet.publicKey]);

  const sendAirdrop = async () => {
    if (!publicKey || !connection) {
      console.error("Public key is not provided or connection is unavailable.");
      toast.error("Public key is not provided or connection is unavailable.");
      return;
    }

    try {
      const lamports = amount * 1000000000; // Convert amount to lamports
      
      const pubKeyObj = new PublicKey(publicKey);
      
      const airdropSignature = await connection.requestAirdrop(
        pubKeyObj,
        lamports
      );
      console.log("Airdrop successful, transaction signature:", airdropSignature);
      toast.success("Airdrop successful");
    } catch (error) {
      console.error("Airdrop failed:", error);
      toast.error("Airdrop failed");
    }
  };

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  const handleAmountSelect = (selectedAmount) => {
    setAmount(selectedAmount);
    setDrawerOpen(false); // Close the drawer after selecting an amount
  };

  return (
    <div containerClassName="min-h-screen flex flex-col justify-start">
      <div className="w-full space-y-6  mt-[20vh] px-20">
        <h1 className="text-6xl font-bold text-center mb-16">Airdrop Yourself SOL</h1>

        {/* Public Key Input Field */}
        <div className="flex gap-9">
            <div className="mb-4">
          <Input
            type="text"
            placeholder="Enter Public Key"
            className="border rounded w-[100vh] py-3 px-4 text-gray-700 text-xl leading-tight focus:outline-none focus:shadow-outline"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
          />
        </div>

        {/* Amount Selection Button */}
        <button
          onClick={toggleDrawer}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold  px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4 text-xl"
        >
          Select Amount: {amount} SOL
        </button>
        </div>
    
        <div className="text-center">------------   OR   ------------</div>

        {/* Drawer for Amount Selection */}
        {drawerOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="absolute bottom-0 left-0 right-0 bg-white shadow-lg p-4 rounded-t-lg z-50"
          >
            <h3 className="text-lg font-bold mb-4">Select Airdrop Amount</h3>
            <div className="grid grid-cols-2 gap-4">
              {[0.25, 0.5, 1, 2].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleAmountSelect(amt)}
                  className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded text-xl"
                >
                  {amt} SOL
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Wallet Controls */}
        <div className="mt-6 flex justify-center space-x-4">
          <WalletModalProvider>
            <WalletMultiButton className="w-full" />
          </WalletModalProvider>
        </div>

        {/* Airdrop Button */}
        <button
          onClick={sendAirdrop}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline w-full text-xl"
        >
          Send Airdrop
        </button>

        {/* Toaster for Notifications */}
        <Toaster />
      </div>
    </div>
  );
};

export default Airdrop;
