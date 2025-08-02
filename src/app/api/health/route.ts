import { NextResponse } from "next/server"
import connectDB from "@/lib/db"

export async function GET() {
  try {
    await connectDB()
    const mongoose = await connectDB()
    const state = mongoose.connection.readyState
    
    return NextResponse.json({ 
      status: "Connected to database",
      state: state === 1 ? "connected" : "disconnected" 
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      { status: "Database connection failed" }, 
      { status: 500 }
    )
  }
}