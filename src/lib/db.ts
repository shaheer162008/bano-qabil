import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    console.log("Using cached connection")
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts)
    console.log("Creating new connection")
  }

  try {
    cached.conn = await cached.promise
    console.log("Connected to MongoDB")
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default connectDB