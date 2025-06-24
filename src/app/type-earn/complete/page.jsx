'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function CompletePage() {
  const [message, setMessage] = useState('Checking…');
  const sp     = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // 1) First, grab sessionId from the URL if present, else from localStorage:
    const sidFromUrl = sp.get('sessionId');
    const sessionId  = sidFromUrl || localStorage.getItem('typeEarnSession') || '';
    // 2) Grab the set number:
    const setNum     = parseInt(sp.get('set') || '', 10);

    if (!sessionId || isNaN(setNum)) {
      setMessage('❌ Invalid session or set.');
      return;
    }

    // 3) Call our backend to award points
    fetch('/api/type-earn/verify', {
      method:      'POST',
      credentials: 'same-origin',
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ sessionId, setNumber: setNum })
    })
    .then(async res => {
      const data = await res.json();
      if (res.ok) {
        // Award successful → clear stored ID so they can start fresh next time
        localStorage.removeItem('typeEarnSession');
        setMessage(`🎉 You got 5 points! Total: ${data.totalPoints}.`);
      } else {
        setMessage(`❌ ${data.error}`);
      }
      // After 3s, send them back to the start
      setTimeout(() => {
        router.replace('/type-earn', { scroll: false });
      }, 3000);
    })
    .catch(() => {
      setMessage('❌ Network error.');
      // still clean up after a moment
      setTimeout(() => {
        router.replace('/type-earn', { scroll: false });
      }, 3000);
    });
  }, [sp, router]);

  return (
    <div className="container">
      <h1>{message}</h1>
      <button onClick={() => router.replace('/type-earn')}>
        Type Again
      </button>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #1b0432;
          color: #fff;
          text-align: center;
          padding: 2rem;
        }
        button {
          margin-top: 2rem;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          border: none;
          border-radius: 8px;
          background: #ff7df0;
          color: #000;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}