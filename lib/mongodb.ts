import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string; // Fix 1: Cast as string

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI in environment variables");
}

// Fix 2: Refined Global Interface
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // Use var for global augmentation
  var mongoose: MongooseCache | undefined;
}

// Use a fallback to prevent "undefined" issues
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    // mongoose.connect returns a promise of the mongoose instance
    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}