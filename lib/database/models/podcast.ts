import mongoose from "mongoose"
import { v4 as uuidv4 } from "uuid"

const podcastSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    default: () => `user-${uuidv4()}`
  },
  password: {
    type: String,
    required: true,
    unique: true,
    default: () => `pass-${uuidv4()}`
  },
  invitationLink: {
    type: String,
    required: true,
    unique: true,
    default: () => `${uuidv4()}`
  }
})

export default mongoose.models.Podcast || mongoose.model("Podcast", podcastSchema)