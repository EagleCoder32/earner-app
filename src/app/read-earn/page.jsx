// src/app/read-earn/page.jsx
'use client';

import { useEffect, useState } from 'react';
import articleList from '../articleList';

export default function ReadEarnPage() {
  const [today, setToday] = useState('');
  const [currentIndex, setCurrentIndex] = useState(null);
  const [limitReached, setLimitReached] = useState(false);

  // Initialize date and index
  useEffect(() => {
    const isoNow = new Date().toISOString().split('T')[0];
    setToday(isoNow);

    const storedDate = localStorage.getItem('lastReadDate');
    if (storedDate !== isoNow) {
      localStorage.setItem('lastReadDate', isoNow);
      localStorage.setItem('nextArticleIndex', '0');
      setCurrentIndex(0);
    } else {
      const saved = parseInt(localStorage.getItem('nextArticleIndex') || '0', 10);
      setCurrentIndex(saved);
    }
  }, []);

  // Check if we've read all articles
  useEffect(() => {
    if (currentIndex === null) return;
    setLimitReached(currentIndex >= articleList.length);
  }, [currentIndex]);

  // Handle click
  function handleReadEarnClick() {
    if (limitReached || currentIndex === null) return;

    const next = currentIndex + 1;
    localStorage.setItem('nextArticleIndex', String(next));
    setCurrentIndex(next);

    window.location.href = articleList[currentIndex];
  }

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
                style={{ width: `${(currentIndex / articleList.length) * 100}%` }}
              />
            </div>
            <p className="progress-text">
              {currentIndex} / {articleList.length} articles read
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