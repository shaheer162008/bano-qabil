import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Settings from "@/models/Settings"

export async function GET() {
  try {
    await connectDB()
    const settings = await Settings.find({ active: true }).lean()
    
    return NextResponse.json({ 
      success: true, 
      settings 
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json(
      { message: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, name } = body

    await connectDB()

    const setting = await Settings.create({
      type,
      name: type === 'section' ? name.toUpperCase() : name
    })

    return NextResponse.json({ success: true, setting })
  } catch (error) {
    console.error("Error adding setting:", error)
    return NextResponse.json(
      { message: "Error adding setting" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const name = searchParams.get("name")

    if (!type || !name) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 400 }
      )
    }

    await connectDB()

    await Settings.updateOne(
      { type, name },
      { active: false }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting setting:", error)
    return NextResponse.json(
      { message: "Error deleting setting" },
      { status: 500 }
    )
  }
}