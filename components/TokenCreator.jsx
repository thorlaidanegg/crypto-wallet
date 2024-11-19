import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import toast, { Toaster } from 'react-hot-toast';
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMint2Instruction, createMint, getMinimumBalanceForRentExemptMint } from "@solana/spl-token"
import {
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

const TokenCreator = () => {
  
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [image, setImage] = useState("");
  const [initialSupply, setInitialSupply] = useState("");

  const { connection } = useConnection();
  const wallet = useWallet();

  const createToken = async () => {

        const mintKeypair = Keypair.generate();
        const lamports = await getMinimumBalanceForRentExemptMint(connection);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: MINT_SIZE,
                lamports,
                programId: TOKEN_PROGRAM_ID,
            }),
            createInitializeMint2Instruction(mintKeypair.publicKey, 6, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID)
        );
            
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mintKeypair);

        await wallet.sendTransaction(transaction, connection);
        console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
        toast.success(`Token mint created at ${mintKeypair.publicKey.toBase58()}`)

    }


  return(
  <div>
    TokenCreator

    <div>
        <WalletMultiButton/>
        <Input placeholder='Name' onChange={(e) => setName(e.target.value)} type="text"/>
        <Input placeholder='Symbol' onChange={(e) => setSymbol(e.target.value)} type="text"/>
        <Input placeholder='Image url' onChange={(e) => setImage(e.target.value)} type="text"/>
        <Input placeholder='initial supply' onChange={(e) => setInitialSupply(e.target.value)} type="text"/>
    </div>

    <button onClick={createToken}>Create Token</button>

     <Toaster />
  </div>
)}

export default TokenCreator