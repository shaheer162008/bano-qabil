import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/dbOperations"

export async function POST() {
  try {
    const result = await seedDatabase()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: "Seed failed" },
      { status: 500 }
    )
  }
}