// src/app/api/read-earn/verify/route.js
import { NextResponse }      from 'next/server';
import { getAuth }           from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import User                  from '@/models/User';
import ArticleProgress       from '@/models/ArticleProgress';

export async function POST(req) {
  try {
    // 1) Authenticate with Clerk
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // 2) Parse & validate
    const { articleIdx, sessionId } = await req.json();
    if (typeof articleIdx !== 'number' || !sessionId) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 3) Connect to MongoDB
    await connectToDatabase();

    // 4) Prevent double‐claim today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const already = await ArticleProgress.findOne({
      clerkId:    userId,
      articleIdx,
      redeemedAt: { $gte: todayStart }
    });
    if (already) {
      return NextResponse.json({ error: 'Already claimed today' }, { status: 400 });
    }

    // 5) Award points & record
    const awardPoints = 20;
    await ArticleProgress.create({
      clerkId:   userId,
      articleIdx,
      sessionId,
      points:    awardPoints
    });

    let user = await User.findOne({ clerkId: userId });
    if (!user) user = await User.create({ clerkId: userId });
    user.points += awardPoints;
    await user.save();

    // 6) Return success
    return NextResponse.json({
      message:     '20 points awarded!',
      totalPoints: user.points
    });
  } catch (err) {
    console.error('🔥 Error in /api/read-earn/verify:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}