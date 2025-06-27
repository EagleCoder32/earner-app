"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from 'next/image';


export default function TypeAndEarnPage() {

  // 0) On fresh load, if we're *not* coming back from a completed claim,
//    clear any old sessionId so we get a brand-new chain when they click Start.
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (!params.get("earned")) {
    localStorage.removeItem("typeEarnSession");
  }
}, []);




  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const earned = params.get("earned");
    if (earned) {
      // 1) Show a popup
      alert(`🎉 You got ${earned} points!`);

      // 2) Log to console
      console.log(`User earned ${earned} points`);

      // 3) Optionally store locally
      const prev = parseInt(localStorage.getItem("typeEarnPoints") || "0", 10);
      localStorage.setItem("typeEarnPoints", prev + Number(earned));

      // 4) Clean the URL after 3s so you can re‑earn later
      setTimeout(() => {
        router.replace("/type-and-earn", { scroll: false });
      }, 3000);
    }
  }, [params, router]);

  const handleStart = () => {
 // 1) Create a fresh sessionId for this typing chain
const sessionId = crypto.randomUUID();
localStorage.setItem('typeEarnSession', sessionId);

  // 2) Navigate in the same tab instead
  window.location.href = 
   `https://eagleearner.com/type-and-earn/?sessionId=${sessionId}`;
    "noopener,noreferrer"
  }

  return (
    <div className="page-container">

      {/* ◀︎ Back button */}
      <button
        className="back-button"
        onClick={() => router.push('/dashboard')}
        aria-label="Back to dashboard"
      >
        ← Back
      </button>

      <div className="content-wrapper">
        <Image src="/typing.svg" alt="Typing Icon" className="icon-svg" width={70} height={70} />
        <button className="start-button mt-8" onClick={handleStart}>
          Start Type and Earn
        </button>
      </div>

      <style jsx>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          min-height: 100vh;
          background: linear-gradient(
            135deg,
            #1b0432 0%,
            #3c1053 40%,
            #6e1b80 75%,
            #2a0a4f 100%
          );
        }
        .content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          padding: 2.5rem 2rem;
          border-radius: 1.5rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          max-width: 350px;
          width: 90%;
        }
        .icon-svg {
          width: 4.5rem;
          height: 4.5rem;
          margin-bottom: 1.5rem;
        }
        .start-button {
          width: 100%;
          background: linear-gradient(135deg, #1eec06f2 0%, #1eec06f2 100%);
          color: #000000f2;  
          font-size: 1.25rem;
          font-weight: 600;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 1rem;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }
        .start-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.6);
        }

       .back-button {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: transparent;
          border: none;
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          font-weight: 700;
        }

      `}</style>
    </div>
  );
}