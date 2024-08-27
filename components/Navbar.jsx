'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for Next.js 14 App Router
import { IconMenu2, IconX } from "@tabler/icons-react"; // Import icons for mobile menu
import Image from 'next/image';
import { useSession, signOut, signIn } from "next-auth/react";

const Navbar = () => {
  const router = useRouter();
  const [selected, setSelected] = useState('/');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu toggle
  const { data: session, status } = useSession(); // Get session and status

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Solana', path: '/solana/wallet' },
    { name: 'Ethereum', path: '/etherium/wallet' },
    { name: 'Profile', path: '/profile' },
  ];

  const handleNavigation = (path) => {
    setSelected(path);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
    router.push(path);
  };

  return (
    <div className="text-white">
      <div className="flex justify-between items-center py-5 px-10">
        <div className="flex gap-2">
          <div className="text-xl font-semibold py-3">
            Soleth
          </div>
          <Image
            src={'/logo.png'}
            width={50}
            height={50}
            alt='logo'
          />
        </div>
        <div className="md:hidden">
          {/* Mobile menu toggle button */}
          {isMobileMenuOpen ? (
            <IconX onClick={() => setIsMobileMenuOpen(false)} className="cursor-pointer" />
          ) : (
            <IconMenu2 onClick={() => setIsMobileMenuOpen(true)} className="cursor-pointer" />
          )}
        </div>
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <div
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`cursor-pointer px-4 py-2 rounded-lg ${
                selected === item.path ? 'bg-gray-700' : ''
              }`}
            >
              {item.name}
            </div>
          ))}
        </div>
        {status === "unauthenticated" ? (
          <div
            className="hidden md:flex cursor-pointer px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
            onClick={() =>
              signIn('google', { callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}` }) // Customize redirect URL after sign-in
            }
          >
            Sign in/up
          </div>
        ) : (
          <div
            className="hidden md:flex cursor-pointer px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
            onClick={() =>
              signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}` }) // Customize redirect URL after sign-out
            }
          >
            Sign out
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden flex flex-col space-y-2 px-4 py-2">
          {navItems.map((item) => (
            <div
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`cursor-pointer px-4 py-2 rounded-lg ${
                selected === item.path ? 'bg-gray-700' : ''
              }`}
            >
              {item.name}
            </div>
          ))}
          {status === "unauthenticated" ? (
            <div
              className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
              onClick={() =>
                signIn('google', { callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}` }) // Customize redirect URL after sign-in
              }
            >
              Sign in/up
            </div>
          ) : (
            <div
              className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500"
              onClick={() =>
                signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL}` }) // Customize redirect URL after sign-out
              }
            >
              Sign out
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
