'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SignIn = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/'); 
    }
  }, [status]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

        <button
          onClick={() => signIn('google')}
          className="w-full bg-red-500 text-white py-2 px-4 rounded-lg mb-4 hover:bg-red-600"
        >
          Sign in with Google
        </button>

        <button
          onClick={() => signIn('github')}
          className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900"
        >
          Sign in with GitHub
        </button>

        <div className="text-center mt-4">
          <p className="text-sm">
            Or{' '}
            <a
              href="#"
              onClick={() => signIn('email')}
              className="text-blue-500 hover:underline"
            >
              Sign in with Email
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
