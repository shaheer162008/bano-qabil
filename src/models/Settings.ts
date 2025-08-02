import mongoose from "mongoose"

const settingsSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["faculty", "section"],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Compound index to prevent duplicates
settingsSchema.index({ type: 1, name: 1 }, { unique: true })

export default mongoose.models.Settings || mongoose.model("Settings", settingsSchema)