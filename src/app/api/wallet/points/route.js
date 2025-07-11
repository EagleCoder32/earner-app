// src/app/api/wallet/points/route.js

import { NextResponse } from 'next/server';
import { getAuth }      from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import User             from '@/models/User';

export async function GET(req) {
  // 1) Authenticate via Clerk
  const { userId } = getAuth({ headers: req.headers, cookies: req.cookies });
  if (!userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  // 2) Ensure database connection
  await connectToDatabase();

  // 3) Lookup only the points field
  const user = await User.findOne({ clerkId: userId })
    .select('points')
    .lean();
  const points = user?.points ?? 0;

  // 4) Return JSON with Cache‑Control headers for edge caching
  return NextResponse.json(
    { points },
    {
      status: 200,
      headers: {
        // Keep this response cached at the edge for 10 seconds,
        // and allow serving stale while revalidating for up to 59 seconds
        'Cache-Control': 's-maxage=10, stale-while-revalidate=59'
      }
    }
  );
}