// src/app/api/type-earn/verify/route.js
import { NextResponse } from 'next/server';
import { getAuth }     from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import User            from '@/models/User';
import TypeProgress    from '@/models/TypeProgress';

export async function GET() {
  // A simple health check
  return NextResponse.json({ status: 'OK', route: '/api/type-earn/verify' });
}

export async function POST(req) {
  console.log('🟢 [type-earn/verify] POST hit');
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      console.warn('🔒 Unauthenticated request');
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const { sessionId, setNumber } = await req.json();
    console.log('📥 Payload:', { sessionId, setNumber });

    if (!sessionId || typeof setNumber !== 'number') {
      console.warn('⚠️ Invalid payload');
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    await connectToDatabase();
    console.log('🗄️ Connected to DB');

    const already = await TypeProgress.findOne({ clerkId: userId, sessionId, setNumber });
    if (already) {
      console.info('🚫 Duplicate claim');
      return NextResponse.json(
        { error: 'Already claimed points for this set.' },
        { status: 400 }
      );
    }

    const POINTS_PER_SET = 5;
    await TypeProgress.create({ clerkId: userId, sessionId, setNumber, points: POINTS_PER_SET });
    console.log('✅ Recorded TypeProgress');

    let user = await User.findOne({ clerkId: userId });
    if (!user) user = await User.create({ clerkId: userId, points: 0 });
    user.points += POINTS_PER_SET;
    await user.save();
    console.log('💾 User points updated to', user.points);

    return NextResponse.json({
      message:     `${POINTS_PER_SET} points awarded!`,
      totalPoints: user.points
    });

  } catch (err) {
    console.error('🔥 Error in /api/type-earn/verify:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}