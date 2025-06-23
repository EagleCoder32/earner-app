// src/app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { connectToDatabase } from '../../../lib/mongodb';
import User               from '../../../models/User';
export async function GET(req) {
  // 1) Ensure the user is authenticated
const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
  }

  // 2) Connect to MongoDB
  await connectToDatabase();

  // 3) Load (or create) the User document
  let user = await User.findOne({ clerkId: userId });
  if (!user) {
    user = await User.create({ clerkId: userId });
  }

  // 4) Check if 24h have passed since lastReset
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  if (Date.now() - user.lastReset.getTime() > ONE_DAY_MS) {
    // a) Delete all VideoProgress entries for this user
    await VideoProgress.deleteMany({ clerkId: userId });

    // b) Update lastReset so we don’t reset again immediately
    user.lastReset = new Date();
    await user.save();
  }

  // 5) Return the user’s current points (and you could also
  //    return how many videos they’ve done today by counting VideoProgress)
  return NextResponse.json({
    points: user.points,
    videosRedeemedToday: await VideoProgress.countDocuments({ clerkId: userId })
  });
}