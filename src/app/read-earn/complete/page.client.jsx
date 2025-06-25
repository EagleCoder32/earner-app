'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useSearchParams }     from 'next/navigation';

export default function CompletePage() {
  const [message, setMessage] = useState('Checking…');
  const [today, setToday]     = useState('');
  const sp = useSearchParams();

  useEffect(() => {
    // A) Today’s date
    const isoNow = new Date().toISOString().split('T')[0];
    setToday(isoNow);

    // B) Get params
    const idx       = parseInt(sp.get('articleIndex')  || '-1', 10);
    const sessionId = sp.get('sessionId') || '';

    // Validate
    if (isNaN(idx) || idx < 0 || !sessionId) {
      setMessage('❌ Invalid session or article. No points awarded.');
      return;
    }

    // C) POST to your verify endpoint
    fetch('/api/read-earn/verify', {
      method:  'POST',
      credentials: 'include',     
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ articleIdx: idx, sessionId })
    })
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) {
        setMessage(`🎉 You earned 20 points! Your total is now ${data.totalPoints} points.`);
      } else {
        setMessage(`❌ ${data.error}`);
      }
    })
    .catch(() => {
      setMessage('❌ Network error. Please try again.');
    });
  }, [sp]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Read &amp; Earn Complete</h1>
      <p>Today’s date: <strong>{today}</strong></p>
      <p>{message}</p>
      <button
        style={{
          marginTop:   '1rem',
          padding:     '0.5rem 1rem',
          fontSize:    '1rem',
          borderRadius:'0.5rem',
          cursor:      'pointer'
        }}
        onClick={() => window.location.href = '/read-earn'}
      >
        Back to Read &amp; Earn
      </button>
    </div>
  );
}