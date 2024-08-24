'use client';

import React, { useEffect, useState } from 'react';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';  // Import the bs58 library for Base58 encoding
import { IoIosArrowDown, IoIosArrowUp, IoIosEye, IoIosEyeOff } from "react-icons/io";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { MdDelete } from "react-icons/md";
import { useRouter } from 'next/navigation'; // Correct import for useRouter

const SolanaWallet = () => {
  const [words, setWords] = useState([]);
  const [seed, setSeed] = useState('');
  const [walletNo, setWalletNo] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState([]);

  const router = useRouter(); // Initialize router

  const generateWordsAndSeed = () => {
    const mnemonic = generateMnemonic();
    setWords(mnemonic.split(' '));
    const seed = mnemonicToSeedSync(mnemonic);
    setSeed(seed.toString('hex'));
  };

  const generateKeysFromSeed = () => {
    const path = `m/44'/501'/${walletNo}'/0'`;
    const derivedSeed = derivePath(path, Buffer.from(seed, 'hex')).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    setWalletNo(walletNo + 1);
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    
    // Convert private key to Base58 format
    const privateKeyBase58 = bs58.encode(secret);
    
    setPublicKeys((prevPublicKeys) => [...prevPublicKeys, publicKey]);
    setPrivateKeys((prevPrivateKeys) => [...prevPrivateKeys, privateKeyBase58]);
    setVisiblePrivateKeys((prevVisible) => [...prevVisible, false]);
  };

  const togglePrivateKeyVisibility = (index) => {
    setVisiblePrivateKeys((prevVisible) =>
      prevVisible.map((isVisible, i) => (i === index ? !isVisible : isVisible))
    );
  };

  const deleteWallet = (index) => {
    setPublicKeys((prevPublicKeys) => prevPublicKeys.filter((_, i) => i !== index));
    setPrivateKeys((prevPrivateKeys) => prevPrivateKeys.filter((_, i) => i !== index));
    setVisiblePrivateKeys((prevVisible) => prevVisible.filter((_, i) => i !== index));
  };

  useEffect(() => {
    generateWordsAndSeed();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center mt-10 space-y-10">
      <div className="w-[90%] md:w-[80%] rounded-xl">
        <div 
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="flex justify-between text-2xl md:text-5xl py-6 cursor-pointer text-white"
        >
          View Mnemonics
          {isDrawerOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
        {isDrawerOpen && (
          <div className="max-w-full md:max-w-5xl mx-auto px-8 pb-8">
            <HoverEffect items={words} />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-2xl md:text-4xl font-bold w-[90%] md:w-[80%]">
        <div className="text-white">Solana Wallet</div>
        <button onClick={generateKeysFromSeed} className="bg-blue-700 px-4 py-2 text-base md:text-xl rounded-lg hover:bg-blue-400">
          Create Wallet
        </button>
      </div>

      <div className="flex flex-col gap-8 items-center w-[90%] md:w-[80%]">
        {publicKeys.map((publicKey, index) => (
          <div key={index} className="p-4 md:p-8 w-full bg-neutral-800 rounded-xl">
            <div className="flex justify-between items-center">
              <p className="font-bold text-xl md:text-2xl text-white">Wallet {index + 1}</p>
              <MdDelete
                className="text-red-500 cursor-pointer"
                size={24}
                onClick={() => deleteWallet(index)}
              />
            </div>
            <p className="font-normal text-sm md:text-base text-neutral-200 mt-4">
              <strong>Public Key:</strong> {publicKey}
            </p>
            <div className="flex justify-between items-center">
              <div className="mt-4 flex items-center">
                <p className="font-normal text-sm md:text-base text-neutral-200">
                  <strong>Private Key:</strong>{' '}
                  {visiblePrivateKeys[index] ? privateKeys[index] : '●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●'}
                </p>
                <button
                  onClick={() => togglePrivateKeyVisibility(index)}
                  className="ml-4 text-neutral-400 hover:text-white"
                >
                  {visiblePrivateKeys[index] ? <IoIosEyeOff size={20} /> : <IoIosEye size={20} />}
                </button>
              </div>
              <div className="cursor-pointer bg-blue-700 px-6 py-2 font-bold rounded-xl" onClick={() => { router.push(`/solana/wallet/${publicKey}`); }}>
                Open
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SolanaWallet;
