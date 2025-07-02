// src/app/read-earn/page.jsx
'use client';
import Head from 'next/head';                              // SEO: metadata
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import articleList from '../articleList';
import { shuffleArray } from '@/lib/utils';                 // Clean‑up: shuffle logic in utils

export default function ReadEarnPage() {
  const router = useRouter();
  const [today, setToday] = useState('');
  const [remaining, setRemaining] = useState([]);
  const [limitReached, setLimitReached] = useState(false);
  const sectionRef = useRef(null);

  // Load-or-init remaining list
  const loadRemaining = useCallback(() => {
    try {
      const raw = localStorage.getItem('remainingArticles');
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) throw new Error();
      return arr;
    } catch {
      const fresh = shuffleArray(articleList);
      localStorage.setItem('remainingArticles', JSON.stringify(fresh));
      return fresh;
    }
  }, []);

  // Batch updates to state + localStorage
  const updateRemaining = useCallback((newArr) => {
    requestAnimationFrame(() => {
      setRemaining(newArr);
      localStorage.setItem('remainingArticles', JSON.stringify(newArr));
    });
  }, []);

  // On mount: set today and init or rehydrate articles list
  useEffect(() => {
    const isoNow = new Date().toISOString().split('T')[0];
    setToday(isoNow);

    const storedDate = localStorage.getItem('lastReadDate');
    if (storedDate !== isoNow) {
      localStorage.setItem('lastReadDate', isoNow);
      const fresh = shuffleArray(articleList);
      updateRemaining(fresh);
    } else {
      setRemaining(loadRemaining());
    }
  }, [loadRemaining, updateRemaining]);

  // Detect completion
  useEffect(() => {
    setLimitReached(remaining.length === 0);
  }, [remaining]);

  // Handle Read Next & Earn
  const handleReadEarnClick = () => {
    if (limitReached) return;
    const [nextUrl, ...rest] = remaining;
    updateRemaining(rest);
    window.location.href = nextUrl;
  };

  // Progress calculation
  const total = articleList.length;
  const done = total - remaining.length;
  const percent = Math.round((done / total) * 100);

  return (
    <>
      {/* SEO metadata */}
      <Head>
        <title>Read & Earn – EagleEarner</title>
        <meta
          name="description"
          content="Read articles each day to earn points on EagleEarner. Fresh content daily!"
        />
      </Head>

      {/* Page container */}
      <div
        ref={sectionRef}
        aria-labelledby="read-earn-title"
        className="page flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-700 to-indigo-800 p-4"
      >
        {/* Header with Back button */}
        <header className="absolute top-4 left-4 flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard')}
            aria-label="Back to dashboard"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1 rounded focus:outline-none focus:ring"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </header>

        {/* Main article card */}
        <article
          id="read-earn-title"
          className="card bg-white/10 backdrop-blur-lg rounded-xl p-8 max-w-md w-full text-center text-white shadow-xl"
        >
          <h1 className="text-2xl font-bold mb-2">Read &amp; Earn</h1>
          <p className="date text-sm opacity-80 mb-6">📅 {today}</p>

          {limitReached ? (
            <p className="limit text-lg font-semibold text-yellow-300">
              You’ve completed all articles today!
            </p>
          ) : (
            <>
              {/* Progress section */}
              <section
                aria-labelledby="progress-title"
                className="mb-4"
              >
                <h2 id="progress-title" className="sr-only">
                  Reading progress
                </h2>
                <div className="progress-bar h-2 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={`progress-filled h-full bg-pink-400 transition-width duration-300 w-[${percent}%]`}
                  />
                </div>
                <p className="progress-text mt-2 text-sm">
                  {done} / {total} articles read
                </p>
              </section>
              {/* Call-to-action */}
              <button
                className="cta-button mt-4 bg-gradient-to-r from-pink-500 to-purple-600 py-2 px-6 rounded-md font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition focus:outline-none focus:ring"
                onClick={handleReadEarnClick}
              >
                Read Next &amp; Earn
              </button>
            </>
          )}
        </article>
      </div>
    </>
  );
}