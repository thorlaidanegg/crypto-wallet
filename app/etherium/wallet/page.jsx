'use client';

import React, { useEffect, useState } from 'react';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { Wallet, HDNodeWallet } from "ethers";
import bs58 from 'bs58'; // Import Base58 encoding library
import { IoIosArrowDown, IoIosArrowUp, IoIosEye, IoIosEyeOff } from "react-icons/io";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { MdDelete } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/index';
import Image from 'next/image';
import { useSession } from "next-auth/react";
import axios from 'axios';

const EthereumWallet = () => {
  const [words, setWords] = useState([]);
  const [seed, setSeed] = useState('');
  const [walletNo, setWalletNo] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState([]);
  const { data: session, status } = useSession(); // Get session and status

  const { mnemonics, setMnemonics, setIsLoggedIn } = useAppContext();

  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoggedIn(true);
      checkOrCreateMnemonic();
    }
  }, [status]);

  useEffect(() => {
    if (seed && walletNo > 0) {
      generateWallets(walletNo); // Pass walletNo as an argument
    }
  }, [seed]);

  const checkOrCreateMnemonic = async () => {
    try {
      // Fetch user data
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });

      const userData = res.data;
      setWalletNo(userData.ethWallets || 0);

      if (!userData.mnemonic) {
        // If no mnemonic exists, generate and save it
        const newMnemonic = generateMnemonic();
        setWords(newMnemonic.split(' '));
        const seed = mnemonicToSeedSync(newMnemonic);
        setSeed(seed);

        // Save the mnemonic to the database
        await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saveMnemonic`, {
          mnemonic: newMnemonic,
        }, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
      } else {
        // If mnemonic exists, set it and generate wallets
        const fetchedMnemonic = userData.mnemonic;
        const fetchedSeed = mnemonicToSeedSync(fetchedMnemonic);
        setWords(fetchedMnemonic.split(' '));
        setSeed(fetchedSeed);
      }
    } catch (error) {
      console.error("Error checking or creating mnemonic:", error);
    }
  };

  const generateWallets = async (totalWallets) => {
    const newPublicKeys = [];
    const newPrivateKeys = [];
    const newVisiblePrivateKeys = [];

    for (let i = 0; i < totalWallets; i++) {
      const path = `m/44'/60'/${i}'/0/0`; // Correct derivation path for Ethereum
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(path);
      const privateKeyHex = child.privateKey;
      const privateKeyBase58 = bs58.encode(Buffer.from(privateKeyHex.slice(2), 'hex')); // Convert private key to Base58

      const wallet = new Wallet(privateKeyHex);
      const publicKey = wallet.address;

      newPublicKeys.push(publicKey);
      newPrivateKeys.push(privateKeyBase58);
      newVisiblePrivateKeys.push(false);
    }

    setPublicKeys(newPublicKeys);
    setPrivateKeys(newPrivateKeys);
    setVisiblePrivateKeys(newVisiblePrivateKeys);

    console.log('Public Keys:', newPublicKeys);
    console.log('Private Keys:', newPrivateKeys);
  };

  const addWallet = async () => {
    try {
      const newWalletNo = walletNo + 1;
      setWalletNo(newWalletNo);

      await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/addEthWallet`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });


      const path = `m/44'/60'/${newWalletNo - 1}'/0/0`; // Correct derivation path for Ethereum
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(path);
      const privateKeyHex = child.privateKey;
      const privateKeyBase58 = bs58.encode(Buffer.from(privateKeyHex.slice(2), 'hex')); // Convert private key to Base58

      const wallet = new Wallet(privateKeyHex);
      const publicKey = wallet.address;

      console.log('Adding Wallet:', { publicKey, privateKeyBase58 });

      setPublicKeys((prevPublicKeys) => [...prevPublicKeys, publicKey]);
      setPrivateKeys((prevPrivateKeys) => [...prevPrivateKeys, privateKeyBase58]);
      setVisiblePrivateKeys((prevVisible) => [...prevVisible, false]);
    } catch (e) {
      console.log(e);
    }
  }

  const togglePrivateKeyVisibility = (index) => {
    setVisiblePrivateKeys((prevVisible) =>
      prevVisible.map((isVisible, i) => (i === index ? !isVisible : isVisible))
    );
  };

  const deleteWallet = async (index) => {
    const publicKey = publicKeys[index];
    setPublicKeys((prevPublicKeys) => prevPublicKeys.filter((_, i) => i !== index));
    setPrivateKeys((prevPrivateKeys) => prevPrivateKeys.filter((_, i) => i !== index));
    setVisiblePrivateKeys((prevVisible) => prevVisible.filter((_, i) => i !== index));
    setWalletNo(walletNo - 1);

    try {
      await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/delEthWallet`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
    } catch (e) {
      console.log(e);
    }
  };

  if (status === "loading") {
    return <p>Loading...</p>; // Optional: Add a loading state while checking authentication status
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex top-1/3 left-1/4  gap-10 text-6xl absolute">
        Login to access the page 
        <Image
          src={'/logo.png'}
          width={100}
          height={100}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center mt-10 space-y-10">
      <div className="w-[90%] md:w-[80%] rounded-xl border-[0.5px] border-gray-700 px-10">
        <div
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="flex justify-between text-2xl md:text-3xl py-6 cursor-pointer text-white"
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

      <div className="flex justify-between items-center text-2xl md:text-5xl font-bold w-[90%] md:w-[80%]">
        <div className="text-white">Ethereum Wallet</div>
        <button onClick={addWallet} className="bg-blue-700 px-4 py-2 text-base md:text-xl rounded-lg hover:bg-blue-400">
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
            <div className="flex justify-between">
              <p className="font-normal text-sm md:text-base text-neutral-200 mt-4">
                <strong>Private Key:</strong>{" "}
                {visiblePrivateKeys[index] ? privateKeys[index] : "•".repeat(privateKeys[index].length)}
                {visiblePrivateKeys[index] ? (
                  <IoIosEyeOff
                    className="ml-2 text-white cursor-pointer inline"
                    onClick={() => togglePrivateKeyVisibility(index)}
                  />
                ) : (
                  <IoIosEye
                    className="ml-2 text-white cursor-pointer inline"
                    onClick={() => togglePrivateKeyVisibility(index)}
                  />
                )}
              </p>
              <div className="cursor-pointer bg-blue-700 px-6 py-2 font-bold rounded-xl" onClick={() => { router.push(`/etherium/wallet/${publicKey}`); }}>
                  Open
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EthereumWallet;
