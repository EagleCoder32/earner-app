// src/app/withdrawal/history/page.jsx

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function CompletePage() {
  const [message, setMessage] = useState('Checking…')
  const [loading, setLoading] = useState(true)
  const sp     = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // 1) Grab sessionId (URL wins, then fallback to localStorage)
    const sidFromUrl = sp.get('sessionId')
    const sessionId  = sidFromUrl || localStorage.getItem('typeEarnSession')
    // 2) Grab the set number
    const setNum     = parseInt(sp.get('set') || '', 10)

    if (!sessionId || isNaN(setNum)) {
      // redirect them back to start if something is off
      router.replace('/type-earn')
      return
    }

    // 3) Call our backend to award points
    fetch('/api/type-earn/verify', {
      method:      'POST',
      credentials: 'include',              // ensure cookies are sent
      headers:     { 'Content-Type': 'application/json' },
      body:        JSON.stringify({ sessionId, setNumber: setNum })
    })
    .then(async res => {
      const data = await res.json()
      if (res.ok) {
        localStorage.removeItem('typeEarnSession')
        setMessage(`🎉 You got 5 points! Total: ${data.totalPoints}.`)
      } else {
        setMessage(`❌ ${data.error}`)
      }
    })
    .catch(() => {
      setMessage('❌ Network error.')
    })
    .finally(() => {
      setLoading(false)
    })
  }, [sp, router])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#1b0432] text-white text-center p-8">
      <h1 className="text-2xl font-semibold">
        {loading ? 'Processing…' : message}
      </h1>
      {!loading && (
        <button
          onClick={() => router.replace('/type-earn')}
          className="mt-8 py-4 px-8 text-lg rounded-lg bg-pink-400 text-black font-medium hover:bg-pink-500 transition focus:outline-none focus:ring"
        >
          Type Again
        </button>
      )}
    </div>
  )
}