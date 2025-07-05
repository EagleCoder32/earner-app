'use client';

import dynamic from 'next/dynamic';
import Head from 'next/head';

const DashboardNavbar = dynamic(
  () => import('@/components/DashboardNavbar'),
  { ssr: false }
);
const EarningOptions = dynamic(
  () => import('@/components/EarningOptions'),
  {
    ssr: false,
    loading: () => <p className="text-center text-white mt-8">Loading...</p>
  }
);

export default function DashboardClient() {
  return (
    <>
      <Head>
        <title>Dashboard – EagleEarner</title>
        <meta name="description" content="Your earnings dashboard on EagleEarner" />
      </Head>
      <main className="relative flex flex-col min-h-screen bg-black text-white">
        <DashboardNavbar />
        <section className="flex-grow px-4 pt-32">
          <EarningOptions />
        </section>
      </main>
    </>
  );
}