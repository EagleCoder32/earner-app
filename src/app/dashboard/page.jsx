// src/app/dashboard/page.jsx

import Head from 'next/head';                              // SEO: page title
import DashboardNavbar from '@/components/DashboardNavbar';
import EarningOptions from '@/components/EarningOptions';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();                        // Auth guard
  if (!userId) {
    return redirect('/');                                  // Redirect if not signed in
  }

  return (
    <>
      {/* SEO: Set page title */}
      <Head>
        <title>Dashboard – EagleEarner</title>
      </Head>

      {/* Main layout with dynamic padding based on navbar height */}
            {/* Main layout without extra padding */}
      <main className="relative flex flex-col min-h-screen bg-black">
        {/* Navbar */}
        <DashboardNavbar />

        {/* Dashboard content */}
                {/* Dashboard content starts directly under navbar */}
        <div className="flex-grow px-4 pt-32">  {/* space below navbar */}             {/* Ensure spacing below navbar */}
          <EarningOptions />                      
        </div>
      </main>
    </>
  );
}