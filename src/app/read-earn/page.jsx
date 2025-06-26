'use client';

import { useEffect, useState } from 'react';
import articleList from '../articleList';

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
  const [today, setToday]             = useState('');
  const [remaining, setRemaining]     = useState([]);  
  const [limitReached, setLimitReached] = useState(false);

  // On mount: reset for a new day, otherwise rehydrate
  useEffect(() => {
    const isoNow = new Date().toISOString().split('T')[0];
    setToday(isoNow);

    const storedDate = localStorage.getItem('lastReadDate');
    if (storedDate !== isoNow) {
      // New day → fresh shuffle
      localStorage.setItem('lastReadDate', isoNow);
      const fresh = shuffleArray(articleList);
      localStorage.setItem('remainingArticles', JSON.stringify(fresh));
      setRemaining(fresh);
    } else {
      // Same day → rehydrate what’s left
      const raw = localStorage.getItem('remainingArticles');
      let arr;
      try {
        arr = JSON.parse(raw);
      } catch {
        arr = null;
      }
      // If nothing stored at all, shuffle once; *but if stored [] (finished), keep it empty!*
      if (!Array.isArray(arr)) {
        arr = shuffleArray(articleList);
        localStorage.setItem('remainingArticles', JSON.stringify(arr));
      }
      setRemaining(arr);
    }
  }, []);

  // Persist & detect “done”
  useEffect(() => {
    localStorage.setItem('remainingArticles', JSON.stringify(remaining));
    setLimitReached(remaining.length === 0);
  }, [remaining]);

  function handleReadEarnClick() {
    if (limitReached) return;
    const [nextUrl, ...rest] = remaining;
    setRemaining(rest);
    window.location.href = nextUrl;
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Read &amp; Earn</h1>
        <p className="date">📅 {today}</p>

        {limitReached ? (
          <p className="limit">You’ve completed all articles today!</p>
        ) : (
          <>
            <div className="progress-bar">
              <div
                className="progress-filled"
                style={{
                  width: `${((articleList.length - remaining.length) / articleList.length) * 100}%`
                }}
              />
            </div>
            <p className="progress-text">
              {articleList.length - remaining.length} / {articleList.length} articles read
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
        h1 { margin: 0 0 .5rem; font-size: 2rem; }
        .date { margin-bottom: 1.5rem; font-size: .9rem; opacity: .8; }
        .limit { font-size: 1.1rem; color: #ffd700; }
        .progress-bar {
          height: 8px;
          background: rgba(255,255,255,.3);
          border-radius: 4px;
          margin: 1rem 0;
          overflow: hidden;
        }
        .progress-filled {
          height: 100%;
          background: #ff7df0;
          transition: width .3s ease;
        }
        .progress-text { margin-bottom: 1.5rem; font-size: 1rem; }
        .cta-button {
          background: linear-gradient(135deg, #ee1bd6 0%, #d900ff 100%);
          border: none;
          border-radius: 8px;
          padding: .75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
          box-shadow: 0 4px 16px rgba(0,0,0,.4);
        }
        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 24px rgba(0,0,0,.6);
        }
      `}</style>
    </div>
  );
}