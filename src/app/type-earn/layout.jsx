'use client'

import { Suspense } from 'react'

// This layout wraps everything under /type-earn in a Suspense boundary
export default function TypeEarnLayout({ children }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading…</div>}>
      {children}
    </Suspense>
  )
}