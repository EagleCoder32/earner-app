// src/components/WalletClient.jsx
'use client';

import { useEffect, useState } from 'react';

export default function WalletClient() {
  const [points, setPoints] = useState(null);    // null = loading
  const [error, setError]   = useState(null);

  useEffect(() => {
    async function fetchPoints() {
      try {
        const res = await fetch('/api/wallet/points', { credentials: 'same-origin' });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load points');
        setPoints(data.points);
      } catch (err) {
        console.error('Error fetching points:', err);
        setError('Unable to load balance');
        setPoints(0);
      }
    }
    fetchPoints();
  }, []);

  // 📌 LOADING STATE: show a message instead of a gray block
  if (points === null) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <span className="text-xl italic text-gray-600">Loading your balance...</span>
      </div>
    );
  }

  // 📌 ERROR STATE
  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  // 📌 LOADED STATE
  return (
    <div className="flex items-center space-x-3">
      <span className="text-5xl">🪙</span>
      <span className="text-5xl font-bold">{points.toLocaleString()}</span>
    </div>
  );
}