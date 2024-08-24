'use client';

import React, { useEffect, useState } from 'react';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';

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
    setSeed(seed.toString('hex'));
  };

  const generateKeysFromSeed = () => {
    const path = `m/44'/501'/${walletNo}'/0'`; // This is the derivation path
    const derivedSeed = derivePath(path, Buffer.from(seed, 'hex')).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    setWalletNo(walletNo + 1);
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    const privateKey = Keypair.fromSecretKey(secret).secretKey.toString('hex');
    setPublicKeys((prevPublicKeys) => [...prevPublicKeys, publicKey]);
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
