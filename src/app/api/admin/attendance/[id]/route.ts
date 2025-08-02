import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Student from "@/models/Student"
import Attendance from "@/models/Attendance"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const student = await Student.findOne({ student_id: params.id })
    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      )
    }

    const attendance = await Attendance.find({ student_id: params.id })
      .sort({ date: -1 })
      .lean()

    return NextResponse.json({ 
      student,
      attendance 
    })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return NextResponse.json(
      { message: "Failed to fetch attendance" },
      { status: 500 }
    )
  }
}