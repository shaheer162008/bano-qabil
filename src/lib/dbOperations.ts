import connectDB from "./db"
import Student from "@/models/Student"
import Settings from "@/models/Settings"
import Attendance from "@/models/Attendance"

export async function seedDatabase() {
  try {
    await connectDB()
    console.log("Connected to database, starting seed...")

    // Clear existing data
    await Promise.all([
      Student.deleteMany({}),
      Settings.deleteMany({}),
      Attendance.deleteMany({}),
    ])
    console.log("Cleared existing data.")

    // Seed faculties and sections
    const faculties = ["Computer Science", "Software Engineering", "Electrical Engineering"]
    const sections = ["A", "B", "C"]

    await Promise.all([
      ...faculties.map(name =>
        Settings.create({
          type: "faculty",
          name,
          active: true,
        })
      ),
      ...sections.map(name =>
        Settings.create({
          type: "section",
          name,
          active: true,
        })
      ),
    ])
    console.log("Seeded faculties and sections.")

    // Seed students
    const students = [
      {
        name: "Ahmad Khan",
        student_id: "CS001",
        phone_number: "0300-1234567",
        faculty: "Computer Science",
        section: "A",
      },
      {
        name: "Sara Ali",
        student_id: "CS002",
        phone_number: "0300-2345678",
        faculty: "Computer Science",
        section: "A",
      },
      {
        name: "Muhammad Usman",
        student_id: "SE001",
        phone_number: "0300-3456789",
        faculty: "Software Engineering",
        section: "B",
      },
      {
        name: "Fatima Ahmed",
        student_id: "SE002",
        phone_number: "0300-4567890",
        faculty: "Software Engineering",
        section: "B",
      },
      {
        name: "Ali Hassan",
        student_id: "EE001",
        phone_number: "0300-5678901",
        faculty: "Electrical Engineering",
        section: "C",
      },
      {
        name: "Zainab Malik",
        student_id: "EE002",
        phone_number: "0300-6789012",
        faculty: "Electrical Engineering",
        section: "C",
      },
      {
        name: "Omar Farooq",
        student_id: "CS003",
        phone_number: "0300-7890123",
        faculty: "Computer Science",
        section: "A",
      },
      {
        name: "Ayesha Khan",
        student_id: "SE003",
        phone_number: "0300-8901234",
        faculty: "Software Engineering",
        section: "B",
      },
      {
        name: "Bilal Ahmad",
        student_id: "EE003",
        phone_number: "0300-9012345",
        faculty: "Electrical Engineering",
        section: "C",
      },
      {
        name: "Mehwish Ali",
        student_id: "CS004",
        phone_number: "0300-0123456",
        faculty: "Computer Science",
        section: "A",
      },
    ]

    await Student.insertMany(students)
    console.log("Seeded students.")

    console.log("Database seed complete.")
    return { success: true, message: "Database seed successful" }
  } catch (error) {
    console.error("Seed failed:", error)
    throw new Error("Database seed failed")
  }
}

export async function resetDatabase() {
  try {
    await connectDB()
    console.log("Connected to database, starting reset...")

    // Clear all collections
    await Promise.all([
      Student.deleteMany({}),
      Settings.deleteMany({}),
      Attendance.deleteMany({}),
    ])

    console.log("Database reset complete.")
    return { success: true, message: "Database reset successful" }
  } catch (error) {
    console.error("Reset failed:", error)
    throw new Error("Database reset failed")
  }
}