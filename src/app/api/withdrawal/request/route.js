export const runtime = 'edge';         // ← add this!

import { NextResponse }      from 'next/server';
import { getAuth }           from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import User                  from '@/models/User';
import WithdrawalRequest     from '@/models/WithdrawalRequest';
import { withdrawalTiers }   from '@/app/withdrawal/withdrawalTiers';

export async function POST(req) {
  try {
    // 1) Authenticate via Clerk
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // 2) Parse and validate body
    const { option, tierValue, tierLabel, country, recipient } = await req.json();
    if (!option || typeof tierValue !== 'number' || !tierLabel || !country ||
        !recipient?.name || !recipient?.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 3) Verify that the selected tier is valid for this option
    const tiers = withdrawalTiers[option] || [];
    const match = tiers.find(t => t.value === tierValue && t.label === tierLabel);
    if (!match) {
      return NextResponse.json({ error: 'Invalid tier selection' }, { status: 400 });
    }

    // 4) Connect to MongoDB & fetch user
    await connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 5) Check user has enough points
    if (user.points < match.points) {
      return NextResponse.json({ error: 'Insufficient points' }, { status: 400 });
    }

    // 6) Deduct points and save
    user.points -= match.points;
    await user.save();

    // 7) Create the withdrawal record
    await WithdrawalRequest.create({
      clerkId:       userId,
      option,
      tierValue,
      tierLabel,
      country,
      recipient,
      pointsDeducted: match.points
    });

    // 8) Return success and updated balance
    return NextResponse.json({
      message:     'Withdrawal request submitted.',
      totalPoints: user.points
    });
  } catch (err) {
    console.error('🔥 Error in /api/withdrawal/request:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}