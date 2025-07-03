// src/app/wallet/page.jsx

import Head from 'next/head';                           // 📌 SEO: Add Head for metadata
import { redirect } from 'next/navigation';
import { getAuth } from '@clerk/nextjs/server';
import { headers, cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Link from 'next/link';

export default async function WalletPage() {
  // 1) Read headers & cookies for server‑side auth
  const reqHeaders = headers();
  const reqCookies = cookies();

  // 2) Authenticate via Clerk
  const { userId } = getAuth({ headers: reqHeaders, cookies: reqCookies });
  if (!userId) {
    return redirect('/sign-in');
  }

  // 3) Connect to DB (uses cached connection under the hood)
  await connectToDatabase();

  // 4) Lean, projected query for performance: only fetch 'points'
  const userDoc = await User.findOne({ clerkId: userId })
    .select('points')
    .lean();
  const points = userDoc?.points ?? 0;

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

      {/* 📌 Semantic main landmark & hidden heading for accessibility */}
      <main role="main" className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="sr-only">Your Wallet</h1>

        {/* 📌 Transaction History link with ARIA */}
        <div className="absolute top-4 right-4">
          <Link
            href="/withdrawal/history"
            aria-label="View transaction history"
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Transaction History
          </Link>
        </div>

        {/* 📌 Balance Display */}
        <div className="flex items-center space-x-3">
          <span className="text-5xl">🪙</span>
          <span className="text-5xl font-bold">{points.toLocaleString()}</span>
        </div>
        <p className="mt-2 text-gray-600">Available Balance</p>

        {/* 📌 Redeem Button with ARIA */}
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