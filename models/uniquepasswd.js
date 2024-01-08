const mongoose = require("mongoose");

const uniquepasswdSchema = new mongoose.Schema({
  passwd: {
    type: String,
    unique: true,
  },
});
mongoose.models = {};
export const uniquepasswd = mongoose.model("uniquepasswd", uniquepasswdSchema);
