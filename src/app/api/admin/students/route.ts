import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Student from "@/models/Student"
import Attendance from "@/models/Attendance"

export async function GET(request: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const faculty = searchParams.get('faculty')
    const section = searchParams.get('section')
    const search = searchParams.get('search')

    // Build query
    const query: any = {}
    if (faculty && faculty !== '_all') query.faculty = faculty
    if (section && section !== '_all') query.section = section
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { student_id: { $regex: search, $options: 'i' } }
      ]
    }

    // Get all students matching query
    const students = await Student.find(query).lean()

    // If date is provided, get attendance for that date
    if (date) {
      const attendance = await Attendance.find({ 
        date,
        student_id: { 
          $in: students.map(s => s.student_id) 
        }
      }).lean()

      // Merge attendance with students
      return NextResponse.json({
        success: true,
        students: students.map(student => ({
          ...student,
          attendance: attendance.find(a => 
            a.student_id === student.student_id
          ) || null
        }))
      })
    }

    return NextResponse.json({ success: true, students })
  } catch (error: any) {
    console.error("Fetch students error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch students" },
      { status: 500 }
    )
  }
}