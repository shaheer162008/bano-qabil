import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Attendance from "@/models/Attendance"
import Student from "@/models/Student"
import * as XLSX from "xlsx"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    await connectDB()

    // Get attendance for the date
    const attendance = await Attendance.find({ date })
      .populate("student_id", "name student_id faculty section")
      .lean()

    // Create worksheet data
    const wsData = attendance.map((record) => ({
      Name: record.student_id.name,
      "Phone Number": record.student_id.phone_number,
      "Student ID": record.student_id.student_id,
      Date: record.date,
      Status: record.status,
      "Marked By": record.marked_by,
      "Marked At": new Date(record.marked_at).toLocaleString(),
    }))

    // Create workbook
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, "Attendance")

    // Generate buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

    return new NextResponse(buf, {
      headers: {
        "Content-Disposition": `attachment; filename=attendance-${date}.xlsx`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { message: "Failed to export attendance" },
      { status: 500 }
    )
  }
}