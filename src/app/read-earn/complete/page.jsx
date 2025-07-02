// src/app/read-earn/complete/page.jsx

'use client';

import Head from 'next/head';
import { useEffect, useState } from 'react';

const ERROR_MESSAGES = {
  INVALID: '❌ Invalid session or article. No points were awarded.',
  JSON_ERROR: '❌ An unknown error occurred.',
  TEXT_ERROR: (text) => `❌ Unexpected response: ${text.slice(0, 100)}`,
  NETWORK: '❌ A network error occurred. Please try again.',
};

function CompleteContent() {
  const [message, setMessage] = useState('Checking your session…');
  const [today, setToday] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idx = parseInt(params.get('articleIndex') || '-1', 10);
    const sessionId = params.get('sessionId') || '';

    setToday(new Date().toISOString().split('T')[0]);

    if (isNaN(idx) || idx < 0 || !sessionId) {
      setMessage(ERROR_MESSAGES.INVALID);
      return;
    }

    fetch('/api/read-earn/verify', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleIdx: idx, sessionId }),
    })
      .then(async (res) => {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const data = await res.json();
          setMessage(
            res.ok
              ? `🎉 You earned 20 points! Your total is now ${data.totalPoints} points.`
              : `❌ ${data.error || ERROR_MESSAGES.JSON_ERROR}`
          );
        } else {
          const text = await res.text();
          setMessage(ERROR_MESSAGES.TEXT_ERROR(text));
        }
      })
      .catch(() => {
        setMessage(ERROR_MESSAGES.NETWORK);
      });
  }, []);

  return (
    <>
      <p>Today’s date: <strong>{today}</strong></p>

      {/* 📌 CHANGES START: show skeleton while checking */}
      {message === 'Checking your session…' ? (
        <div className="mt-4 h-6 bg-gray-200 rounded w-3/4 mx-auto animate-pulse" />
      ) : (
        <p className="mt-4 text-lg">{message}</p>
      )}
      {/* 📌 CHANGES END: loading skeleton */}

      <button
        onClick={() => window.location.replace('/read-earn')}
        aria-label="Back to Read & Earn"
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring"
      >
        Back to Read &amp; Earn
      </button>
    </>
  );
}

export default function CompletePage() {
  return (
    <>
      <Head>
        <title>Read & Earn Complete – EagleEarner</title>
        <meta
          name="description"
          content="Verify your points after reading an article on EagleEarner."
        />
      </Head>

      <main className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-6">Read &amp; Earn Complete</h1>
          <CompleteContent />
        </div>
      </main>
    </>
  );
}