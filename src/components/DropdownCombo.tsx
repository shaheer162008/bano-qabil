'use client'
import { Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { format } from "date-fns"
import { toast } from 'sonner'

interface Student {
  _id: string
  student_id: string
  name: string
  phone_number: string
  faculty: string
  section: string
}


const DropdownCombo = ({ sendData , date ,setLoading}: { sendData: (data: Student[]) => void , date?:Date|undefined ,setLoading:(loading:boolean)=>void}) => {

      const [search, setSearch] = useState("")
      const [selectedFaculty, setSelectedFaculty] = useState("_all")
      const [selectedSection, setSelectedSection] = useState("_all")

      useEffect(() => {
          const fetchStudents = async () => {
            try {
              setLoading(true)
              const params = new URLSearchParams()
              if (selectedFaculty !== "_all") params.set("faculty", selectedFaculty)
              if (selectedSection !== "_all") params.set("section", selectedSection)
              if (search) params.set("search", search)
              if(date!=undefined) params.set("date", format(date, "yyyy-MM-dd"))
      
              const res = await fetch(`/api/admin/students?${params}`)
              if (!res.ok) throw new Error("Failed to fetch")
              const data = await res.json()
              sendData(data.students)
            } catch (error) {
              toast.error("Failed to load students")
            } finally {
              setLoading(false)
            }
          }
      
          fetchStudents()
        }, [search, selectedFaculty, selectedSection])

  return (
    <div className="grid gap-4 md:grid-cols-3">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                          <Input
                            placeholder="Search students..."
                            className="pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
            
                        <Select
                          value={selectedFaculty}
                          onValueChange={setSelectedFaculty}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Faculty" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_all">All Faculties</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                            <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                            <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                            <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                          </SelectContent>
                        </Select>
            
                        <Select
                          value={selectedSection}
                          onValueChange={setSelectedSection}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Section" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="_all">All Sections</SelectItem>
                            <SelectItem value="A">Section A</SelectItem>
                            <SelectItem value="B">Section B</SelectItem>
                            <SelectItem value="C">Section C</SelectItem>
                            <SelectItem value="D">Section D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
  )
}

export default DropdownCombo