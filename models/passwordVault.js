import mongoose from "mongoose";

const passwordVault = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
    select: false,
  },
  website: {
    type: String,
    trim: true,
  },
  Updated: {
    type: String,
    trim: true,
  },
  Created: {
    type: String,
    trim: true,
  },
  passwordUpdated: {
    type: String,
    trim: true,
  },
  passwordHistory: {
    type: Number,
    trim: true,
  },
});
export const passwordvault = mongoose.model("passwordVault", passwordVault);
