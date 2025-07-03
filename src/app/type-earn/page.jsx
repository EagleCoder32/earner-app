// src/app/type-earn/page.jsx
'use client';

import Head from 'next/head';                            // SEO: page metadata
import React, { useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

/**
 * 🪄 Hook: Clears old session on mount if not returning from an earn flow
 */
function useTypeEarnSession() {
  const params = useRef(new URLSearchParams(window.location.search));
  useEffect(() => {
    if (!params.current.get('earned')) {
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
      alert(`🎉 You got ${earned} points!`);                    // Popup celebration
      console.log(`User earned ${earned} points`);            // Log to console
      const prev = parseInt(localStorage.getItem('typeEarnPoints') || '0', 10);
      localStorage.setItem('typeEarnPoints', prev + Number(earned)); // Store total
      // Clean URL after 3s (throttled)
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
    const sessionId = crypto.randomUUID();                    // Unique session token
    localStorage.setItem('typeEarnSession', sessionId);       // Save for resume
    window.location.href =
      `https://eagleearner.com/type-and-earn/?sessionId=${sessionId}`; // Navigate
  };

  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>Type &amp; Earn – EagleEarner</title>
        <meta
          name="description"
          content="Practice typing to earn points on EagleEarner—fast, fun challenges every day!"
        />
      </Head>

      {/* Breadcrumb Navigation Landmark */}
      <nav aria-label="Breadcrumb" className="absolute top-4 left-4">
        <button
          onClick={() => router.push('/dashboard')}
          aria-label="Back to Dashboard"
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1 rounded focus:outline-none focus:ring"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
      </nav>

      {/* Main Content Landmark */}
      <main role="main" className="flex items-center justify-center w-screen min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-4">
        <div className="flex flex-col items-center bg-black/50 backdrop-blur-lg p-10 rounded-2xl max-w-xs w-11/12 h-[290px]">
          {/* Typing Icon */}
          <Image
            src="/typing.svg"
            alt="Typing Icon"
            width={75}
            height={75}
            loading="lazy"                                 // Performance: defer load
          />
          {/* Start Button */}
          <button
            onClick={handleStart}
            aria-label="Start typing challenge"
            className="mt-7 w-4/5 bg-green-400 text-black text-xl font-semibold py-3 rounded-lg transform transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring"
          >
            Type and Earn
          </button>
        </div>
      </main>
    </>
  );
}