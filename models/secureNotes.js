import mongoose from "mongoose";

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
});
mongoose.models = {};
export const secureNotes = mongoose.model("securenotes", secureNotesSchema);
