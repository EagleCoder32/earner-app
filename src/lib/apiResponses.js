// src/lib/apiResponses.js
import { NextResponse } from 'next/server';

export function errorJSON(msg, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}