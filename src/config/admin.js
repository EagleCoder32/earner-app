// src/config/admin.js

// Read the comma-separated admin IDs from your NEXT_PUBLIC_ADMIN_IDS env var
const raw = process.env.NEXT_PUBLIC_ADMIN_IDS || '';
export const ADMIN_IDS = raw.split(',').map(id => id.trim()).filter(Boolean);