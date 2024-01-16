const mongoose = require("mongoose");

const secureNotesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
  encrypt: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String,
    select: false,
  },
});
module.exports = mongoose.model("securenotes", secureNotesSchema);
