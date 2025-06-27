"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';



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


      {/* Back button */}
      <button
        onClick={() => router.push('/dashboard')}
        aria-label="Back to dashboard"
        className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-base font-semibold px-3 py-1 rounded pr-5"
      >
        <ArrowLeft size={20} />
        Back
      </button>


      <div className="content-wrapper justify-center">
        <Image src="/typing.svg" alt="Typing Icon" width={75} height={75} />
        <button className="start-button mt-7" onClick={handleStart}>
          Type and Earn
        </button>
      </div>

      <style jsx>{`
        .page-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          min-height: 100vh;
         background: linear-gradient(135deg, #3c1053 0%, #6e1b80 100%);
         padding-bottom: 150px;


          );
        }
        .content-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          background:rgb(0 0 0 / 44%);
          backdrop-filter: blur(8px);
          padding: 2.5rem 2rem;
          border-radius: 1.5rem;
          
            max-width: 430px;
          width: 100%;        
              height: 290px;
          width: 85%;
        }
        
        .start-button {
          width: 80%;
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
     

      `}</style>
    </div>
  );
}