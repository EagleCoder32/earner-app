// src/app/api/admin/withdrawals/route.js
import { NextResponse }      from 'next/server';
import { getAuth }           from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import WithdrawalRequest     from '@/models/WithdrawalRequest';

export async function GET(req) {
  try {
    // 1) Authenticate via Clerk
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // 2) Check admin privileges
    // Expect ADMIN_IDS in .env.local as "user_id1,user_id2"
    const adminList = (process.env.ADMIN_IDS || '').split(',');
    if (!adminList.includes(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3) Connect to MongoDB
    await connectToDatabase();

    // 4) Fetch all withdrawal requests, newest first
    const records = await WithdrawalRequest
      .find({})
      .sort({ createdAt: -1 })
      .lean();

    // 5) Return JSON
    return NextResponse.json({ records });
  } catch (err) {
    console.error('🔥 Error in GET /api/admin/withdrawals:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}