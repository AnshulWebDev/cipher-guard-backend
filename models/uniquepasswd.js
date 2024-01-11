import mongoose from "mongoose";

const uniquepasswdSchema = new mongoose.Schema({
  passwd: {
    type: String,
    unique: true,
  },
});
export const uniquepasswd = mongoose.model("uniquepasswd", uniquepasswdSchema);
