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
    // 1) Grab the raw URI
    let uri = process.env.MONGODB_URI || '';

    // 2) Remove any leading/trailing single or double quotes
    uri = uri.replace(/^['"]|['"]$/g, '');

    // 3) Kick off the connection
    cached.promise = mongoose
      .connect(uri, {
        // you can add mongoose options here if needed
      })
      .then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}