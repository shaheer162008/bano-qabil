import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Attendance from "@/models/Attendance"
import Student from "@/models/Student"

export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    const { student_id, date, status, marked_by } = body

    // Validate student exists
    const student = await Student.findOne({ student_id })
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Update or create attendance
    const attendance = await Attendance.findOneAndUpdate(
      { student_id: student._id, date },
      { status, marked_by, marked_at: new Date() },
      { upsert: true, new: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      attendance,
      student: {
        name: student.name,
        student_id: student.student_id,
        faculty: student.faculty,
        section: student.section,
      },
    })
  } catch (error:any) {
    console.error("Error marking attendance:", error)
    return NextResponse.json(
      { error: error.message || "Failed to mark attendance" },
      { status: 500 }
    )
  }
}