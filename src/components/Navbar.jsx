// src/components/Navbar.jsx
'use client';

import { SignInButton, SignUpButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav
      role="navigation"                                      // 📌 CHANGES START: semantic navigation role
      aria-label="Main site navigation"                     // 📌 CHANGES START: descriptive label for assistive tech
      className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 z-50"
    >
      {/* Logo linking to home */}
      <Link href="/" aria-label="Go to home page" className="-ml-4 -mt-6 focus:outline-none focus:ring">
        <Image
          src="/earner-eagle.webp"
          alt="Earner Eagle"                               // 📌 CHANGES: improved alt text
          height={35}
          width={35}
          priority={true}                                       // 📌 CHANGES: prioritize logo loading for LCP
        />
      </Link>  


      {/* Authentication buttons */}
      <div className="flex items-center space-x-3">
        <SignInButton mode="modal">
          <button
            className="py-2.5 px-5 text-sm font-medium text-white bg-black rounded-full hover:opacity-90 transition focus:outline-none focus:ring"
            aria-label="Log in to your account"                // 📌 CHANGES: aria-label for clarity
          >
            Log in
          </button>
        </SignInButton>

        <SignUpButton mode="modal">
          <button
            className="py-2.5 px-5 text-sm font-medium text-black bg-yellow-400 rounded-full hover:bg-yellow-500 transition focus:outline-none focus:ring"
            aria-label="Sign up for a new account"            // 📌 CHANGES: aria-label for clarity
          >
            Sign up
          </button>
        </SignUpButton>
      </div>
    </nav>
  );
}