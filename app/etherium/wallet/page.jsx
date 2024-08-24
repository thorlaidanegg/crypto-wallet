'use client';

import React, { useEffect, useState } from 'react';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { Wallet, HDNodeWallet } from "ethers";

const Page = () => {
  const [words, setWords] = useState([]);
  const [seed, setSeed] = useState('');
  const [walletNo, setWalletNo] = useState(0);
  const [publicKeys, setPublicKeys] = useState([]);
  const [privateKeys, setPrivateKeys] = useState([]);

  const generateWordsAndSeed = () => {
    const mnemonic = generateMnemonic();
    console.log(mnemonic.split(' '));
    setWords(mnemonic.split(' '));
    const seed = mnemonicToSeedSync(mnemonic);
    setSeed(seed);
  };

  const generateKeysFromSeed = () => {
    const path = `m/44'/60'/${walletNo}'/0'`; // This is the derivation path
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(path);
    const privateKey = child.privateKey;
    setWalletNo(walletNo + 1);
    const wallet = new Wallet(privateKey);
    const publicKey = wallet.address;
    setPublicKeys((prevPublicKeys) => [...prevPublicKeys, publicKey]);
    console.log("fojsd",wallet)
    setPrivateKeys((prevPrivateKeys) => [...prevPrivateKeys, privateKey]);
  };

  useEffect(() => {
    generateWordsAndSeed();
  }, []);

  return (
    <div>
      <div>
        <p>Mnemonic Words: {words.join(' ')}</p>
        <p>Seed: {seed}</p>
        <p>Public Keys: {publicKeys.join(', ')}</p>
        <p>Private Keys: {privateKeys.join(', ')}</p>
      </div>

      <div>
        <button onClick={generateKeysFromSeed}>create wallet</button>
      </div>
    </div>
  );
};

export default Page;
