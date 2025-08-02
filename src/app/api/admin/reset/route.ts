import { NextResponse } from "next/server"
import { resetDatabase } from "@/lib/dbOperations"

export async function POST() {
  try {
    const result = await resetDatabase()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: "Reset failed" },
      { status: 500 }
    )
  }
}