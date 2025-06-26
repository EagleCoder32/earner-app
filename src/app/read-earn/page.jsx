'use client';

import { useEffect, useState } from 'react';
import articleList from '../articleList';

// ── Helpers ──────────────────────────────────────────────────────────
// Fisher–Yates shuffle
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function ReadEarnPage() {
  const [today, setToday]         = useState('');      // inferred string
  const [currentIndex, setCurrentIndex] = useState(null); // inferred null | number
  const [limitReached, setLimitReached] = useState(false);
  const [shuffled, setShuffled]   = useState([]); 

  // ── 1) On mount: compute “today” and reset if needed ───────────────
  useEffect(() => {
    const isoNow = new Date().toISOString().split('T')[0];
    setToday(isoNow);

    const storedDate = localStorage.getItem('lastReadDate');
    if (storedDate !== isoNow) {
      // New day: reset index & shuffle
      localStorage.setItem('lastReadDate', isoNow);
      localStorage.setItem('nextArticleIndex', '0');

      const newShuffle = shuffleArray(articleList);
      localStorage.setItem('shuffledArticles', JSON.stringify(newShuffle));
      setShuffled(newShuffle);

      setCurrentIndex(0);
    } else {
      // Same day: rehydrate shuffle or regenerate if missing
      const saved = JSON.parse(localStorage.getItem('shuffledArticles') || 'null');
      const arr = Array.isArray(saved) ? saved : shuffleArray(articleList);
      localStorage.setItem('shuffledArticles', JSON.stringify(arr));
      setShuffled(arr);

      const idx = parseInt(localStorage.getItem('nextArticleIndex') || '0', 10);
      setCurrentIndex(idx);
    }
  }, []);

  // ── 2) Once we have an index & shuffle, check if we're done ─────────
  useEffect(() => {
    if (currentIndex === null) return;
    setLimitReached(currentIndex >= shuffled.length);
  }, [currentIndex, shuffled]);

  // ── 3) Button handler ─────────────────────────────────────────────
  function handleReadEarnClick() {
    if (limitReached || currentIndex === null) return;

    // Grab the URL at our shuffled index
    const url = shuffled[currentIndex];

    // Bump for next time
    const next = currentIndex + 1;
    localStorage.setItem('nextArticleIndex', String(next));
    setCurrentIndex(next);

    // Finally redirect
    window.location.href = url;
  }

  // ── 4) Render ─────────────────────────────────────────────────────
  return (
    <div className="page">
      <div className="card">
        <h1>Read &amp; Earn</h1>
        <p className="date">📅 {today}</p>

        {limitReached ? (
          <p className="limit">You’ve completed all articles today!</p>
        ) : currentIndex === null ? (
          <p>Loading…</p>
        ) : (
          <>
            <div className="progress-bar">
              <div
                className="progress-filled"
                style={{ width: `${(currentIndex / shuffled.length) * 100}%` }}
              />
            </div>
            <p className="progress-text">
              {currentIndex} / {shuffled.length} articles read
            </p>
            <button className="cta-button" onClick={handleReadEarnClick}>
              Read Next &amp; Earn
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #3c1053 0%, #6e1b80 100%);
          padding: 1rem;
        }
        .card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 2rem;
          max-width: 400px;
          width: 100%;
          text-align: center;
          color: #fff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        }
        h1 {
          margin: 0 0 0.5rem;
          font-size: 2rem;
        }
        .date {
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
          opacity: 0.8;
        }
        .limit {
          font-size: 1.1rem;
          color: #ffd700;
        }
        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          margin: 1rem 0;
          overflow: hidden;
        }
        .progress-filled {
          height: 100%;
          background: #ff7df0;
          transition: width 0.3s ease;
        }
        .progress-text {
          margin-bottom: 1.5rem;
          font-size: 1rem;
        }
        .cta-button {
          background: linear-gradient(135deg, #ee1bd6 0%, #d900ff 100%);
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  );
}