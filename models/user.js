import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  isEmailVerify: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    trim: true,
    select: false,
  },
  profileImg: {
    type: String,
    trim: true,
  },
  token: {
    type: String,
  },
  wrongPasswdAttempt: {
    attempts: {
      type: Number,
      default: 0,
    },
    lastAttemptTime: {
      type: Date,
      default: Date.now(),
    },
  },
  accountLock: {
    type: Boolean,
    default: false,
  },
  vaultPin: {
    type: String,
  },
  vaultAuth: {
    type: String,
  },
  passwordVault: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "passwordVault",
    },
  ],
  secureNotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "securenotes",
    },
  ],
  role: {
    type: String,
    default: "user",
  },
});

// mongoose.models = {};
export const user = mongoose.model("user", userSchema);
