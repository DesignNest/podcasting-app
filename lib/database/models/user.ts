import mongoose from "mongoose";


function generateRandomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
    required: false,
  },
  githubId: {
    type: String,
    required: false,
  },
  profilePhotoColor: {
    type: String,
    default: generateRandomHexColor,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  provider: {
    type: String,
    enum: ["credentials", "google", "github"],
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
