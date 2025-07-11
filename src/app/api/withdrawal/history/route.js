// src/app/api/withdrawal/history/route.js
import { NextResponse }      from 'next/server';
import { getAuth }           from '@clerk/nextjs/server';
import { connectToDatabase } from '@/lib/mongodb';
import { errorJSON }         from '@/lib/apiResponses';              // 1️⃣ Centralized errors
import WithdrawalRequest     from '@/models/WithdrawalRequest';       // 2️⃣ Memoized model

export async function GET(req) {
  try {
    // ——— 1) Authenticate —————————————
    const { userId } = getAuth(req);
    if (!userId) {
      return errorJSON('Unauthenticated', 401);
    }

    // ——— 2) Pagination parameters ——————
    // default to page=1, limit=20
    const url    = req.nextUrl;
    const page   = Math.max(1, parseInt(url.searchParams.get('page')  || '1',  10));
    const limit  = Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10));
    const skip   = (page - 1) * limit;

    // ——— 3) Connect to DB ——————————
    await connectToDatabase();

    // ——— 4) Count total records ——————
    const total = await WithdrawalRequest.countDocuments({ clerkId: userId });

    // ——— 5) Fetch paginated, projected records ————
    const records = await WithdrawalRequest
      .find({ clerkId: userId })
      .sort({ createdAt: -1 })                       // most recent first
      .skip(skip)                                     // pagination offset
      .limit(limit)                                   // page size
      .select('option tierLabel country status createdAt') // 3️⃣ Project only used fields
      .lean();

    // ——— 6) Return structured response ——————
    return NextResponse.json({
      total,                                          // total available records
      page,                                           // current page
      limit,                                          // items per page
      records,                                        // this page’s slice
    });
  } catch (err) {
    console.error('🔥 Error in /api/withdrawal/history:', err);
    return errorJSON('Internal server error', 500);
  }
}