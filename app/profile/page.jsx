'use client'
import { useAppContext } from '@/context/index';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

const Page = () => {
    const { isLoggedIn, email } = useAppContext(); 
    const [userInfo, setUserInfo] = useState(null);

    const getUserInfo = async () => {
        try {
            const res = await axios.get(`${process.env.SITE_URL}/api/users/${email}`); // Replace with your API endpoint
            setUserInfo(res.data);
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            getUserInfo();
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
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
        <div className="min-h-screen bg-black text-white flex flex-col items-center p-10 w-[80%] mx-auto mt-10">
            <div className="flex justify-between items-center w-full mb-28">
                <div className='text-6xl font-semibold'>
                    Your Wallets:
                </div>
                <div className='flex gap-10'>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-2xl font-semibold">Solana Wallets</h2>
                        <p className="text-4xl mt-4">{userInfo?.solanaWallets || 0}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
                        <h2 className="text-2xl font-semibold">Ethereum Wallets</h2>
                        <p className="text-4xl mt-4">{userInfo?.ethWallets || 0}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-lg shadow-lg w-full ">
                <div className='text-6xl font-semibold mb-10'>
                    Personal Details:
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <p className="text-lg"><strong>Username:</strong> {userInfo?.username}</p>
                    <p className="text-lg"><strong>Email:</strong> {userInfo?.email}</p>
                    <p className="text-lg"><strong>Phone:</strong> {userInfo?.phone}</p>
                    <p className="text-lg"><strong>Total Wallets:</strong> {userInfo?.wallets}</p>
                </div>
            </div>
        </div>
    );
};

export default Page;
