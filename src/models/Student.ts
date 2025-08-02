// \bano-qabil\src\models\Student.ts
import mongoose from "mongoose"

export interface Student {
  _id: string
  student_id: string
  name: string
  phone_number: string
  faculty: string
  section: string
  attendance?: {
    date: string
    status: "present" | "absent"
  }
}

const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  faculty: { type: String, required: true },
  section: { type: String, required: true }
}, { 
  timestamps: true,
  versionKey: false 
})

export default mongoose.models.Student || mongoose.model("Student", studentSchema)