// src/app/read-earn/complete/page.jsx
'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';

function CompleteContent() {
  const [message, setMessage] = useState('Checking your session…');
  const [today,   setToday]   = useState('');

  useEffect(() => {
    const params    = new URLSearchParams(window.location.search);
    const idx       = parseInt(params.get('articleIndex') || '-1', 10);
    const sessionId = params.get('sessionId') || '';

    setToday(new Date().toISOString().split('T')[0]);

    if (isNaN(idx) || idx < 0 || !sessionId) {
      setMessage('❌ Invalid session or article. No points were awarded.');
      return;
    }

    fetch('/api/read-earn/verify', {
      method:      'POST',
      credentials: 'include',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ articleIdx: idx, sessionId })
    })
    .then(async (res) => {
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const data = await res.json();
        setMessage(res.ok
          ? `🎉 You earned 20 points! Your total is now ${data.totalPoints} points.`
          : `❌ ${data.error || 'An unknown error occurred.'}`
        );
      } else {
        const text = await res.text();
        setMessage(`❌ Unexpected response: ${text.slice(0,100)}`);
      }
    })
    .catch((err) => {
      console.error('Fetch error:', err);
      setMessage('❌ A network error occurred. Please try again.');
    });
  }, []);

  return (
    <>
      <p>Today’s date: <strong>{today}</strong></p>
      <p className="mt-4 text-lg">{message}</p>
      <button
        onClick={() => window.location.replace('/read-earn')}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Back to Read &amp; Earn
      </button>
    </>
  );
}

export default function CompletePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-6">Read &amp; Earn Complete</h1>
        <CompleteContent />
      </div>
    </div>
  );
}