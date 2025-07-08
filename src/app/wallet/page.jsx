// src/app/wallet/page.jsx
export const runtime = 'edge';         // ← add this!

import Head from 'next/head';



// 📌 SEO: Add Head for metadata
import { redirect } from 'next/navigation';
import { getAuth } from '@clerk/nextjs/server';
import { headers, cookies } from 'next/headers';
import Link from 'next/link';
import WalletClient from '@/components/WalletClient';    // 📌 Client‑side fetch

export default async function WalletPage() {
  // 1) Authenticate via Clerk on the server
  const { userId } = getAuth({ headers: headers(), cookies: cookies() });
  if (!userId) {
    return redirect('/');
  }

  // 2) Render the shell immediately; WalletClient will fetch points
  return (
    <>
      {/* 📌 SEO Metadata */}
      <Head>
        <title>Wallet – EagleEarner</title>
        <meta
          name="description"
          content="View your EagleEarner points balance and redeem your rewards."
        />
      </Head>

      {/* 📌 Main content */}
      <main className="relative flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        {/* Transaction History Link */}
        <div className="absolute top-4 right-4">
          <Link
            href="/withdrawal/history"
            aria-label="View transaction history"
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Transaction History
          </Link>
        </div>

        {/* Wallet Balance (client‑fetched) */}
        <WalletClient />

        {/* Redeem Button */}
        <Link href="/withdrawal">
          <button
            aria-label="Redeem your points"
            className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition focus:outline-none focus:ring"
          >
            <span className="text-xl">💼</span>
            <span className="font-medium">Redeem</span>
          </button>
        </Link>
      </main>
    </>
  );
}