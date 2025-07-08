// src/app/type-earn/page.jsx


'use client';
export const runtime = 'edge'; 


import Head from 'next/head';
import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

/**
 * 🪄 Hook: Clears old session on mount if not returning from an earn flow
 */
function useTypeEarnSession() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get('earned')) {
      localStorage.removeItem('typeEarnSession');
    }
  }, []);
}

/**
 * 🔔 Hook: Shows a celebratory alert when 'earned' param appears, then cleans URL
 */
function useEarnedAlert() {
  const params = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    let timeout;
    const earned = params.get('earned');
    if (earned) {
      alert(`🎉 You got ${earned} points!`);
      console.log(`User earned ${earned} points`);
      const prev = parseInt(localStorage.getItem('typeEarnPoints') || '0', 10);
      localStorage.setItem('typeEarnPoints', prev + Number(earned));
      timeout = setTimeout(() => {
        router.replace('/type-and-earn', { scroll: false });
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [params, router]);
}

export default function TypeAndEarnPage() {
  const router = useRouter();
  useTypeEarnSession();
  useEarnedAlert();

  /**
   * 🏁 Starts a new typing session by generating a UUID and navigating
   */
  const handleStart = () => {
    // only runs in browser
    const sessionId = crypto.randomUUID();
    localStorage.setItem('typeEarnSession', sessionId);
    window.location.href =
      `https://eagleearner.com/type-and-earn/?sessionId=${sessionId}`;
  };

  return (
    <>
      <Head>
        <title>Type &amp; Earn – EagleEarner</title>
        <meta
          name="description"
          content="Practice typing to earn points on EagleEarner—fast, fun challenges every day!"
        />
      </Head>

      <nav aria-label="Breadcrumb" className="absolute top-4 left-4">
        <button
          onClick={() => router.push('/dashboard')}
          aria-label="Back to Dashboard"
          className="flex items-center gap-2 bg-gray-800 hover:bg-white/30 text-white font-semibold px-3 py-1 rounded focus:outline-none focus:ring"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </nav>

      <main
        role="main"
        className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4"
      >
        <div className="flex flex-col items-center bg-black/50 backdrop-blur-lg p-10 rounded-2xl max-w-xs w-11/12 h-[290px]">
          <Image
            src="/typing.svg"
            alt="Typing Icon"
            width={95}
            height={95}
            loading="lazy"
          />
          <button
            onClick={handleStart}
            aria-label="Start typing challenge"
            className="mt-12 w-4/5 bg-green-400 text-black text-xl font-semibold py-3 rounded-lg transform transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring"
          >
            Type and Earn
          </button>
        </div>
      </main>
    </>
  );
}