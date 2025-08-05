import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema({
  student_id: {
    type: String,
    ref: "Student",
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["present", "absent"],
    required: true,
  },
  marked_by: {
    type: String,
    enum: ["manual", "qr"],
    required: true,
  },
  marked_at: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

// Ensure unique attendance per student per day
attendanceSchema.index({ student_id: 1, date: 1 }, { unique: true })

export default mongoose.models.Attendance || mongoose.model("Attendance", attendanceSchema)