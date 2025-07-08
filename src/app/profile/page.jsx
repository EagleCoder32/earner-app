// src/app/profile/page.jsx
'use client';

import Link from 'next/link';
import { useUser, SignOutButton } from '@clerk/nextjs';   // ← 1️⃣ import SignOutButton

export default function ProfilePage() {
  const { isLoaded, user, isSignedIn } = useUser();



  if (!isLoaded) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <p className="text-gray-500">Loading profile…</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <p className="text-gray-500">You must be signed in to view your profile.</p>
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 font-sans space-y-6">
      {/* Back to Dashboard */}
      <div>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold">Your Profile</h1>

        <div className="space-y-2">
          <div>
            <span className="font-medium">Name:&nbsp;</span>
            <span>{user.fullName || user.firstName}</span>
          </div>
          <div>
            <span className="font-medium">Email:&nbsp;</span>
            <span>{user.primaryEmailAddress?.emailAddress}</span>
          </div>
          <div>
            <span className="font-medium">Member Since:&nbsp;</span>
            <span>
              {new Date(user.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>


        </div>

        {/* 📌 2️⃣ Support & Logout buttons */}
        <div className="flex justify-between mt-6">
          {/* Support Link */}
          <Link href="/support">
            <button
              aria-label="Contact support"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              Support
            </button>
          </Link>

          {/* Logout Button via Clerk */}
          <SignOutButton>
            <button
              aria-label="Log out"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}