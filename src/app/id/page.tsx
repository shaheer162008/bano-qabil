"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { QRCodeCanvas } from "qrcode.react"
import { toPng } from "html-to-image"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Download, Camera, Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

interface Student {
  id: string
  fullName: string
  phoneNumber: string
  faculty: string
  section: string
  enrollmentDate: string
}

export default function IdPage() {
  const [studentId, setStudentId] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [student, setStudent] = useState<Student | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  async function handleFindStudent(e: React.FormEvent) {
    e.preventDefault()
    if (!studentId || !phoneNumber) {
      toast.error("Please enter both Student ID and Phone Number")
      return
    }

    setLoading(true)
    try {
      // Replace with actual API call
      const res = await fetch(`/api/students/verify?id=${studentId}&phone=${phoneNumber}`)
      const data = await res.json()
      
      if (!data.success) {
        toast.error("Student not found")
        return
      }
      
      setStudent(data.student)
      toast.success("Student found! Please upload your photo")
    } catch (error) {
      toast.error("Failed to find student")
    } finally {
      setLoading(false)
    }
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Photo size should be less than 5MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhoto(reader.result as string)
        toast.success("Photo uploaded successfully")
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleDownload() {
    if (!cardRef.current || !student) return
    
    // Temporarily hide download button
    const downloadBtn = cardRef.current.querySelector('#downloadBtn')
    if (downloadBtn) {
      downloadBtn.classList.add('hidden')
    }
    
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true })
      const link = document.createElement("a")
      link.download = `${student.id}-id-card.png`
      link.href = dataUrl
      link.click()
      toast.success("ID Card downloaded successfully")
    } catch (error) {
      toast.error("Failed to download ID card")
    } finally {
      // Show download button again
      if (downloadBtn) {
        downloadBtn.classList.remove('hidden')
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gray-50 px-4 py-8 md:py-12"
      >
        <div className="max-w-lg mx-auto">
          {!showPreview ? (
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Find Your ID Card</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFindStudent} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Student ID</label>
                      <Input
                        type="text"
                        value={studentId}
                        onChange={e => setStudentId(e.target.value)}
                        placeholder="Enter your student ID"
                        className="h-12"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input
                        type="tel"
                        value={phoneNumber}
                        onChange={e => setPhoneNumber(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="h-12"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Finding...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Find ID Card
                      </>
                    )}
                  </Button>
                </form>

                {student && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 space-y-6"
                  >
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <p className="text-green-800">
                        Student found! Please upload your photo to continue.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <label className="block">
                        <span className="text-sm font-medium">Upload Photo</span>
                        <div className="mt-1">
                          <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors">
                            {photo ? (
                              <div className="w-32 h-32 rounded-full overflow-hidden">
                                <img 
                                  src={photo} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <>
                                <Camera className="w-8 h-8 text-gray-400" />
                                <span className="mt-2 text-sm text-gray-500">
                                  Click to upload photo
                                </span>
                              </>
                            )}
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handlePhotoChange}
                            />
                          </label>
                        </div>
                      </label>

                      {photo && (
                        <Button
                          onClick={() => setShowPreview(true)}
                          className="w-full h-12"
                        >
                          Preview ID Card
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Card ref={cardRef} className="border-2 overflow-hidden">
                <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-1/2 -translate-y-1/2" />
                  
                  <div className="relative flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">Bano Qabil</h3>
                      <p className="text-blue-100">Student ID Card</p>
                    </div>
                    <div className="w-24">
                      {/* Add logo here */}
                    </div>
                  </div>

                  <div className="mt-6 flex gap-6">
                    <div className="w-32 h-32 rounded-full bg-white p-2">
                      <img 
                        src={photo!} 
                        alt={student?.fullName} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <h2 className="text-2xl font-bold">{student?.fullName}</h2>
                      <div className="space-y-1 text-blue-100">
                        <p>ID: {student?.id}</p>
                        <p>Faculty: {student?.faculty}</p>
                        <p>Section: {student?.section}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex justify-between items-center bg-gray-50">
                  <QRCodeCanvas
                    value={JSON.stringify({
                      id: student?.id,
                      name: student?.fullName,
                      faculty: student?.faculty
                    })}
                    size={80}
                    level="H"
                  />
                  <div className="text-sm text-gray-500">
                    <p>Enrollment Date</p>
                    <p className="font-medium">{student?.enrollmentDate}</p>
                  </div>
                </div>
              </Card>

              <Button
                id="downloadBtn"
                onClick={handleDownload}
                className="w-full h-12 text-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Download ID Card
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
