import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}


const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const cached = (globalWithMongoose.mongooseCache ??= {
  conn: null,
  promise: null,
});

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
      })
      .then((m) => {
        console.log(" MongoDB Connected");
        return m;
      })
      .catch((error) => {
        cached.promise = null; 
        console.error(" MongoDB Connection Failed:", error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};