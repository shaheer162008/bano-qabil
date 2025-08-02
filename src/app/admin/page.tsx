"use client"

import { useState, useEffect, useCallback } from "react"
import { Camera, CameraOff, Download, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { QRScanner } from "@/components/QRScanner"
import { DatePicker } from "@/components/DatePicker"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

interface Student {
  _id: string
  student_id: string
  name: string
  faculty: string
  section: string
  attendance?: {
    date: string
    status: "present" | "absent"
  }
}

interface Settings {
  type: "faculty" | "section"
  name: string
  active: boolean
}

export default function AdminPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [faculties, setFaculties] = useState<string[]>([])
  const [sections, setSections] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [selectedFaculty, setSelectedFaculty] = useState("_all")
  const [selectedSection, setSelectedSection] = useState("_all")
  const [search, setSearch] = useState("")
  const [scannerError, setScannerError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const today = format(new Date(), "yyyy-MM-dd")

  // Fetch settings (faculties and sections)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings')
        const data = await res.json()
        
        const activeFaculties = data.settings
          .filter((s: Settings) => s.type === "faculty" && s.active)
          .map((s: Settings) => s.name)
        
        const activeSections = data.settings
          .filter((s: Settings) => s.type === "section" && s.active)
          .map((s: Settings) => s.name)

        setFaculties(activeFaculties)
        setSections(activeSections)
      } catch (error) {
        toast.error("Failed to load settings")
      }
    }

    fetchSettings()
  }, [])

  const handleScan = useCallback(async (decodedText: string) => {
    try {
      setLoading(true)
      
      // Optimistically update UI
      const studentToUpdate = students.find(s => s.student_id === decodedText)
      if (studentToUpdate) {
        setStudents(prev => prev.map(s => 
          s.student_id === decodedText 
            ? { ...s, attendance: { date: today, status: "present" }} 
            : s
        ))
      }

      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: decodedText,
          date: today,
          status: "present",
          marked_by: "qr"
        })
      })

      const data = await res.json()
      
      if (!res.ok) {
        // Revert optimistic update
        await fetchStudents()
        throw new Error(data.message)
      }

      // Play success sound
      const audio = new Audio("/sounds/success.mp3")
      await audio.play()

      toast.success(`Marked ${data.student.name} as present`)
      
      // Keep scanner running for next student
      setScannerError(null)
    } catch (error) {
      toast.error("Failed to mark attendance")
      setScannerError(String(error))
    } finally {
      setLoading(false)
    }
  }, [students, today])

  const markAttendance = async (studentId: string, status: "present" | "absent") => {
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          date: format(selectedDate, "yyyy-MM-dd"),
          status,
          marked_by: "manual",
        }),
      })

      if (!res.ok) throw new Error("Failed to mark attendance")

      const updatedStudent = await res.json()

      // Update the table without refreshing
      setStudents((prev) =>
        prev.map((s) =>
          s.student_id === studentId
            ? { ...s, attendance: updatedStudent.attendance }
            : s
        )
      )
      toast.success(`Marked as ${status}`)
    } catch (error) {
      toast.error("Failed to mark attendance")
    }
  }

  // Add export handler
  const handleExport = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/attendance/export?date=${format(selectedDate, "yyyy-MM-dd")}`)
      const blob = await res.blob()

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `attendance-${format(selectedDate, "yyyy-MM-dd")}.xlsx`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success("Attendance exported successfully")
    } catch (error) {
      toast.error("Failed to export attendance")
    } finally {
      setLoading(false)
    }
  }

  // Update fetchStudents to use selectedDate
  const fetchStudents = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedFaculty !== "_all") params.set("faculty", selectedFaculty)
      if (selectedSection !== "_all") params.set("section", selectedSection)
      if (search) params.set("search", search)
      params.set("date", format(selectedDate, "yyyy-MM-dd"))

      const res = await fetch(`/api/admin/students?${params}`)
      if (!res.ok) throw new Error("Failed to fetch students")
      
      const data = await res.json()
      setStudents(data.students)
    } catch (error) {
      toast.error("Failed to load students")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [selectedFaculty, selectedSection, search, selectedDate])

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <div className="flex items-center space-x-4">
          <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
          <Button onClick={() => setShowScanner(!showScanner)}>
            {showScanner ? "Stop Scanner" : "Start Scanner"}
          </Button>
          <Button onClick={handleExport} disabled={loading}>
            Export
          </Button>
        </div>
      </div>

      {showScanner && (
        <Card>
          <CardHeader>
            <CardTitle>QR Scanner</CardTitle>
          </CardHeader>
          <CardContent>
            <QRScanner
              isScanning={showScanner}
              onScan={(result) => markAttendance(result, "present")}
              onError={(error) => toast.error(error)}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Students</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : (
            students.length > 0 ? (
              students.map((student) => (
                <div key={student.student_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">{student.name}</h3>
                    <div className="space-y-1 text-sm text-gray-500">
                      <p>ID: {student.student_id}</p>
                      <p>Faculty: {student.faculty}</p>
                      <p>Section: {student.section}</p>
                      <p>Status: {student.attendance?.status || "Not Marked"}</p>
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant={student.attendance?.status === "present" ? "default" : "outline"}
                      size="sm"
                      className={student.attendance?.status === "present" ? "bg-green-600 hover:bg-green-700" : ""}
                      onClick={() => markAttendance(student.student_id, "present")}
                    >
                      Mark Present
                    </Button>
                    <Button
                      variant={student.attendance?.status === "absent" ? "default" : "outline"}
                      size="sm"
                      className={student.attendance?.status === "absent" ? "bg-red-600 hover:bg-red-700" : ""}
                      onClick={() => markAttendance(student.student_id, "absent")}
                    >
                      Mark Absent
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No students found</p>
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}