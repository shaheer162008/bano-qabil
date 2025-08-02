// filepath: d:\code\bano-qabil\src\app\api\students\verify\route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Student from "@/models/Student";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const phone = searchParams.get("phone");

    if (!id || !phone) {
      return NextResponse.json(
        { success: false, message: "Missing parameters" },
        { status: 400 }
      );
    }

    await connectDB();

    const student = await Student.findOne({
      student_id: id,
      phone_number: phone
    });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.student_id,
        fullName: student.name,
        phoneNumber: student.phone_number,
        faculty: student.faculty,
        section: student.section,
        enrollmentDate: student.createdAt
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}