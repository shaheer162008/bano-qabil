import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Student from "@/models/Student"

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    await connectDB()

    const student = await Student.findOneAndUpdate(
      { student_id: params.id },
      { $set: body },
      { new: true }
    )

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, student })
  } catch (error) {
    console.error("Error updating student:", error)
    return NextResponse.json(
      { message: "Error updating student" },
      { status: 500 }
    )
  }
}