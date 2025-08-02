import { NextResponse } from "next/server"

const students = [
  {
    id: "S001",
    fullName: "Ali Khan",
    phoneNumber: "123-456-7890",
    faculty: "Engineering",
  },
  {
    id: "S002",
    fullName: "Sara Ahmed",
    phoneNumber: "234-567-8901",
    faculty: "Business",
  },
  {
    id: "S003",
    fullName: "Omar Farooq",
    phoneNumber: "345-678-9012",
    faculty: "Science",
  },
  {
    id: "S004",
    fullName: "Fatima Noor",
    phoneNumber: "456-789-0123",
    faculty: "Arts",
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""

  if (!query) {
    return NextResponse.json([])
  }

  const filtered = students.filter(
    (student) =>
      student.fullName.toLowerCase().includes(query) ||
      student.id.toLowerCase().includes(query)
  )

  return NextResponse.json(filtered)
}
