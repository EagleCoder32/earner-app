// src/app/dashboard/page.jsx

import Head from 'next/head';                              // SEO: page title
import DashboardNavbar from '@/components/DashboardNavbar';
import EarningOptions from '@/components/EarningOptions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();                        // Auth guard
  if (!userId) {
    return redirect('/');                       
  }

  return (
    <>
      {/* SEO: Set page title */}
      <Head>
        <title>Dashboard – EagleEarner</title>
      </Head>

      {/* Main layout with dynamic padding based on navbar height */}
      <main
        className="flex flex-col min-h-screen bg-black"
        style={{ paddingTop: 'var(--navbar-h, 4rem)' }}      // Dynamic padding under navbar
      >
        {/* Navbar */}
        <DashboardNavbar />

        {/* Dashboard content */}
        <div className="flex-grow px-4 pt-32">             {/* Ensure spacing below navbar */}
          <EarningOptions />
        </div>
      </main>
    </>
  );
}