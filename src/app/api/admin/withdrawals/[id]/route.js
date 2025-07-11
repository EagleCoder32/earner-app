// src/app/api/admin/withdrawals/[id]/route.js
import { NextResponse }      from 'next/server';
import { getAuth }           from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import WithdrawalRequest     from '@/models/WithdrawalRequest';

export async function PATCH(req, { params }) {
  try {
    // 1) Authenticate
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });
    }

    // 2) Authorize admin
    const adminList = (process.env.ADMIN_IDS || '').split(',');
    if (!adminList.includes(userId)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 3) Read new status from body
    const { status } = await req.json();
    if (!['Pending','Completed','Rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // 4) Connect & update
    await connectToDatabase();
    const updated = await WithdrawalRequest.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    if (!updated) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    // 5) Return the updated record
    return NextResponse.json({ record: updated });
  } catch (err) {
    console.error('🔥 Error in PATCH /api/admin/withdrawals/[id]:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}