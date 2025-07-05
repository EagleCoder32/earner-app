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

  // Loading state
  if (points === null) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-5xl animate-pulse">🪙</span>
        <div className="h-12 w-32 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  // Error state
  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  // Loaded state
  return (
    <div className="flex items-center space-x-3">
      <span className="text-5xl">🪙</span>
      <span className="text-5xl font-bold">{points.toLocaleString()}</span>
    </div>
  );
}