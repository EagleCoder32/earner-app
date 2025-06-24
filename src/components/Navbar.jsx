'use client';

import {SignInButton,SignUpButton} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';


export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 z-50">
      <Link href="/">
        <Image src="/eagle earner.png" alt="EagleEarner Logo" height={10} width={10} />
      </Link>

      <div className="flex items-center space-x-3">
          <SignInButton mode="modal">
            <button className="py-2.5 px-5 text-sm font-medium text-white bg-black rounded-full">
              Log-in
            </button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="py-2.5 px-5 text-sm font-medium text-black bg-yellow-400 rounded-full hover:bg-yellow-500">
              Sign Up
            </button>
          </SignUpButton>
             
      </div>
    </nav>
  );
}