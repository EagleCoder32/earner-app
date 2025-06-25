// src/lib/mongodb.js
import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // 1) Grab your raw ENV var
    let uri = process.env.MONGODB_URI || '';

    // 2) Remove any stray quotes anywhere in the string
    uri = uri.replace(/['"]/g, '');

    // 3) (Optional) log it once to verify
    console.log('🔗 connecting to MongoDB with URI:', uri);

    // 4) Connect, forcing a proper writeConcern
    cached.promise = mongoose
      .connect(uri, {
        // ensure a valid writeConcern
        writeConcern: { w: 'majority' },
        // other options you may have...
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}