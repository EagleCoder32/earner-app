import { NextResponse }      from 'next/server';
import { getAuth }           from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import WithdrawalRequest     from '@/models/WithdrawalRequest';

export async function GET(req) {
  try {
    // 1) Authenticate the user
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // 2) Connect to MongoDB
    await connectToDatabase();

    // 3) Fetch this user’s withdrawal requests, most recent first
    const records = await WithdrawalRequest
      .find({ clerkId: userId })
      .sort({ createdAt: -1 })
      .lean();

    // 4) Return the array of records
    return NextResponse.json({ records });
  } catch (err) {
    console.error('🔥 Error in /api/withdrawal/history:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}