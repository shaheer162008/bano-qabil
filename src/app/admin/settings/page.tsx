"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [newFaculty, setNewFaculty] = useState("")
  const [newSection, setNewSection] = useState("")
  const [faculties, setFaculties] = useState([
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering"
  ])
  const [sections, setSections] = useState(["A", "B", "C"])

  const handleAddFaculty = () => {
    if (!newFaculty.trim()) {
      toast.error("Please enter faculty name")
      return
    }
    setFaculties([...faculties, newFaculty.trim()])
    setNewFaculty("")
    toast.success("Faculty added successfully")
  }

  const handleAddSection = () => {
    if (!newSection.trim()) {
      toast.error("Please enter section name")
      return
    }
    setSections([...sections, newSection.trim().toUpperCase()])
    setNewSection("")
    toast.success("Section added successfully")
  }

  const handleRemoveFaculty = (faculty: string) => {
    setFaculties(faculties.filter(f => f !== faculty))
    toast.success("Faculty removed successfully")
  }

  const handleRemoveSection = (section: string) => {
    setSections(sections.filter(s => s !== section))
    toast.success("Section removed successfully")
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Faculties */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Faculties</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newFaculty}
                onChange={(e) => setNewFaculty(e.target.value)}
                placeholder="Add new faculty..."
              />
              <Button onClick={handleAddFaculty}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {faculties.map((faculty) => (
                <div
                  key={faculty}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <span>{faculty}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFaculty(faculty)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newSection}
                onChange={(e) => setNewSection(e.target.value)}
                placeholder="Add new section..."
                maxLength={1}
              />
              <Button onClick={handleAddSection}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {sections.map((section) => (
                <div
                  key={section}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                >
                  <span>Section {section}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSection(section)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}