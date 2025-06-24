// src/app/api/type-earn/verify/route.js
import { NextResponse }      from 'next/server';
import { getAuth }           from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import User                  from '@/models/User';
import TypeProgress          from '@/models/TypeProgress';

export async function POST(req) {
  try {
    // 1) Authenticate via Clerk — pass the Request directly!
    const { userId } = getAuth(req);
    if (!userId) {
      console.warn('🔒 Unauthenticated request to /api/type-earn/verify');
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // 2) Parse & validate body
    const { sessionId, setNumber } = await req.json();
    if (!sessionId || typeof setNumber !== 'number') {
      console.warn('⚠️ Invalid payload to /api/type-earn/verify:', {
        sessionId,
        setNumber,
      });
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 3) Connect to MongoDB
    await connectToDatabase();

    // 4) Prevent duplicate redemption for the same session+set
    const already = await TypeProgress.findOne({
      clerkId:   userId,
      sessionId,
      setNumber,
    });
    if (already) {
      console.info(
        `🚫 Duplicate claim attempt by ${userId} for session=${sessionId}, set=${setNumber}`
      );
      return NextResponse.json(
        { error: 'You’ve already claimed points for this typing set.' },
        { status: 400 }
      );
    }

    // 5) Record the completion
    const POINTS_PER_SET = 5;
    await TypeProgress.create({
      clerkId:   userId,
      sessionId,
      setNumber,
      points:    POINTS_PER_SET,
    });

    // 6) Award the user in their profile
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = await User.create({ clerkId: userId, points: 0 });
    }
    user.points += POINTS_PER_SET;
    await user.save();

    // 7) Return success
    return NextResponse.json({
      message:     `${POINTS_PER_SET} points awarded!`,
      totalPoints: user.points,
    });
  } catch (err) {
    // Log the full error and stack trace
    console.error('🔥 Error in /api/type-earn/verify:', err);
    console.error(err.stack);

    // Return a generic error to the client
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}