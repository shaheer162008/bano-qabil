"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Edit2, Download, Search, Loader2, Trash2, Plus } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { toast } from "sonner"
import DropdownCombo from "@/components/DropdownCombo"

interface Student {
  _id: string
  student_id: string
  name: string
  phone_number: string
  faculty: string
  section: string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(false)
  // const [search, setSearch] = useState("")
  // const [selectedFaculty, setSelectedFaculty] = useState("_all")
  // const [selectedSection, setSelectedSection] = useState("_all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: "",
    student_id: "",
    phone_number: "",
    faculty: "",
    section: ""
  })

  const handleEditStudent = async () => {
    if (!editingStudent) return

    try {
      setLoading(true)
      const res = await fetch(`/api/admin/students/${editingStudent.student_id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingStudent.name,
          phone_number: editingStudent.phone_number,
          faculty: editingStudent.faculty,
          section: editingStudent.section
        })
      })

      if (!res.ok) throw new Error('Failed to update')
      
      const data = await res.json()
      setStudents(students.map(s => 
        s.student_id === editingStudent.student_id ? data.student : s
      ))
      setEditingStudent(null)
      toast.success('Student updated successfully')
    } catch (error) {
      toast.error('Failed to update student')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async () => {
    try {
      const res = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent)
      })

      if (!res.ok) throw new Error("Failed to add student")

      toast.success("Student added successfully")
      setShowAddDialog(false)
    } catch (error) {
      toast.error("Failed to add student")
    }
  }
  
  const handleDataFromChild = (data: Student[]) => {
    // Handle data from child component if needed
    setStudents(data)
  }
  

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="space-x-2">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              const csvContent = [
                ["ID", "Name", "Phone", "Faculty", "Section"],
                ...students.map(s => [
                  s.student_id,
                  s.name,
                  s.phone_number,
                  s.faculty,
                  s.section
                ])
              ].map(row => row.join(",")).join("\n")

              const blob = new Blob([csvContent], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `students-${new Date().toISOString().split('T')[0]}.csv`
              a.click()
            }}
          >
            <Download className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          <DropdownCombo sendData={handleDataFromChild} setLoading={setLoading}/>
          <div className="mt-6 space-y-4">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            )}
            
            {!loading && students.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No students found
              </div>
            )}
            
            {!loading && students.length > 0 && (
              <div className="space-y-4">
                {students.map((student) => (
                  <div 
                    key={student.student_id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <div className="space-y-1 text-sm text-gray-500">
                        <p>ID: {student.student_id}</p>
                        <p>Phone: {student.phone_number}</p>
                        <p>Faculty: {student.faculty}</p>
                        <p>Section: {student.section}</p>
                      </div>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingStudent(student)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          // Add delete functionality
                          if (confirm('Are you sure you want to delete this student?')) {
                            // Handle delete
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          {editingStudent && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({
                    ...editingStudent,
                    name: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone Number</label>
                <Input
                  value={editingStudent.phone_number}
                  onChange={(e) => setEditingStudent({
                    ...editingStudent,
                    phone_number: e.target.value
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Faculty</label>
                <Select
                  value={editingStudent.faculty}
                  onValueChange={(value) => setEditingStudent({
                    ...editingStudent,
                    faculty: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                    <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                    <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Section</label>
                <Select
                  value={editingStudent.section}
                  onValueChange={(value) => setEditingStudent({
                    ...editingStudent,
                    section: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Section A</SelectItem>
                    <SelectItem value="B">Section B</SelectItem>
                    <SelectItem value="C">Section C</SelectItem>
                    <SelectItem value="D">Section D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setEditingStudent(null)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleEditStudent}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                value={newStudent.name}
                onChange={(e) => setNewStudent({
                  ...newStudent,
                  name: e.target.value
                })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Student ID</label>
              <Input
                value={newStudent.student_id}
                onChange={(e) => setNewStudent({
                  ...newStudent,
                  student_id: e.target.value
                })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={newStudent.phone_number}
                onChange={(e) => setNewStudent({
                  ...newStudent,
                  phone_number: e.target.value
                })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Faculty</label>
              <Select
                value={newStudent.faculty}
                onValueChange={(value) => setNewStudent({
                  ...newStudent,
                  faculty: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Faculty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                  <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Section</label>
              <Select
                value={newStudent.section}
                onValueChange={(value) => setNewStudent({
                  ...newStudent,
                  section: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Section A</SelectItem>
                  <SelectItem value="B">Section B</SelectItem>
                  <SelectItem value="C">Section C</SelectItem>
                  <SelectItem value="D">Section D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddStudent}>
              Add Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}