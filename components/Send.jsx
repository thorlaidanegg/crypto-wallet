import React,{useState} from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL ,PublicKey,SystemProgram,Transaction } from '@solana/web3.js';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Input } from "@/components/ui/input"
import toast, { Toaster } from 'react-hot-toast';

const Send = () => {

    const wallet = useWallet()
    const { connection } = useConnection()
    const [receiver , setReceiver] = useState();
    const [amount , setAmount] = useState();

    const sendToken = async () => {

      try{
        const transaction = new Transaction();
        transaction.add(SystemProgram.transfer({
          fromPubkey:wallet.publicKey,
          toPubkey: new PublicKey(receiver),
          lamports: amount * LAMPORTS_PER_SOL,
        }))

        await wallet.sendTransaction(transaction,connection);
        toast.success("Transaction successful");
      }catch(error){
        console.error("Transaction failed:", error);
        toast.error("Transaction failed");
      }

    }

  return (
    <div>
      <WalletModalProvider>
            <WalletMultiButton className="w-full" />
          </WalletModalProvider>
        <Input
            type="to"
            placeholder="Enter Receiver Public Key"
            className="border rounded w-[100vh] py-3 px-4 text-gray-700 text-xl leading-tight focus:outline-none focus:shadow-outline"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <Input
            type="amount"
            placeholder="Enter SOL Amount"
            className="border rounded w-[100vh] py-3 px-4 text-gray-700 text-xl leading-tight focus:outline-none focus:shadow-outline"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={()=>sendToken()}>send</button>
          <Toaster />
    </div>
  )
}

export default Send