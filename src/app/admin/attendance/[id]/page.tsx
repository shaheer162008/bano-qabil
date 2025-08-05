"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { toast } from "sonner"
import { format } from "date-fns"
interface AttendanceRecord {
  date: string
  status: "present" | "absent"
  marked_by: "qr" | "manual"
  marked_at: string
}

export default function StudentAttendance() {
  const params = useParams()
  const [student, setStudent] = useState<any>(null)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStudentAttendance = async () => {
      try {
        const res = await fetch(`/api/admin/attendance/${params.id}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        setStudent(data.student)
        setAttendance(data.attendance)
      } catch (error) {
        toast.error("Failed to load attendance")
      } finally {
        setLoading(false)
      }
    }

    fetchStudentAttendance()
  }, [params.id])

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            Attendance History - {student?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="space-y-4">
              {attendance.map((record) => (
                <div 
                  key={record.date}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {format(new Date(record.date), "PPP")}
                    </p>
                    <p className={`text-sm ${
                      record.status === "present" ? "text-green-600" : "text-red-600"
                    }`}>
                      {record.status.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Marked by: {record.marked_by}</p>
                    <p>Time: {format(new Date(record.marked_at), "pp")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}