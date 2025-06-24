// src/app/api/type-earn/verify/route.js
import { NextResponse }                  from 'next/server';
import { getAuth }                       from '@clerk/nextjs/server';
import { connectToDatabase }             from '@/lib/mongodb';
import User                              from '@/models/User';
import TypeProgress                      from '@/models/TypeProgress';

export async function POST(req) {
  try {
    // 1) Authenticate
    const { userId } = getAuth({ req });          // <-- pass { req } here
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // 2) Validate payload
    const { sessionId, setNumber } = await req.json();
    if (!sessionId || typeof setNumber !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 3) Connect to DB
    await connectToDatabase();

    // 4) Prevent duplicate for same session & set
    const already = await TypeProgress.findOne({
      clerkId:  userId,
      sessionId,
      setNumber
    });
    if (already) {
      return NextResponse.json(
        { error: 'You’ve already claimed points for this typing set.' },
        { status: 400 }
      );
    }

    // 5) Record completion & award
    const awardPoints = 5;
    await TypeProgress.create({
      clerkId:   userId,
      sessionId,
      setNumber,
      points:    awardPoints
    });

    // 6) Increment user’s total points
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = await User.create({ clerkId: userId, points: 0 });
    }
    user.points += awardPoints;
    await user.save();

    // 7) Return new total
    return NextResponse.json({
      message:     `${awardPoints} points awarded!`,
      totalPoints: user.points
    });

  } catch (err) {
    console.error('🔥 Error in /api/type-earn/verify:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}