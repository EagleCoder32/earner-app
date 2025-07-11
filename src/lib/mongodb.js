// src/lib/mongodb.js
import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    // ✔️ Already connected—just return it
    return cached.conn;
  }

  if (!cached.promise) {
    let uri = process.env.MONGODB_URI?.trim();
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set.');
    }

    console.log('🔗 Connecting to MongoDB…');
    // Kick off the connection attempt once
    cached.promise = mongoose
      .connect(uri, {
        // Mongoose 6+ uses new URL parser and unified topology by default
        serverSelectionTimeoutMS: 5000,
        heartbeatFrequencyMS: 10000,
        writeConcern: { w: 'majority' },
      })
      .then((mongooseInstance) => {
        console.log('✅ MongoDB connected');
        return mongooseInstance;
      })
      .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        throw err;
      });
  }

  // Await the (possibly in‑flight) connection promise
  cached.conn = await cached.promise;
  return cached.conn;
}



// // src/lib/mongodb.js
// import mongoose from 'mongoose';

// let cached = global.mongoose;
// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// export async function connectToDatabase() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     let uri = process.env.MONGODB_URI || '';
//     uri = uri.replace(/['"]/g, '');
//     if (!uri) {
//       throw new Error('MONGODB_URI environment variable is not set.');
//     }
//     console.log('🔗 Connecting to MongoDB:', uri);

//     cached.promise = mongoose
//       .connect(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         serverSelectionTimeoutMS: 5000,
//         heartbeatFrequencyMS: 10000,
//         writeConcern: { w: 'majority' },
//       })
//       .then((m) => {
//         console.log('✅ MongoDB connected');
//         return m;
//       })
//       .catch((err) => {
//         console.error('❌ MongoDB connection error:', err);
//         throw err;
//       });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }