const mongoose = require("mongoose");

const uniquepasswdSchema = new mongoose.Schema({
  passwd: {
    type: String,
    unique: true,
  },
});
module.exports = mongoose.model("uniquepasswd", uniquepasswdSchema);
