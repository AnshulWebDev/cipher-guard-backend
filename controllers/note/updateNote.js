import { secureNotes } from "../../models/secureNotes.js";
import CryptoJS from "crypto-js";
import Response from "../../utils/Response.js";
export const updateNote = async (req, res) => {
  try {
    const { name, note, favorite } = req.body;
    const vaultPin = req.vaultPin;
    const id = req.params.id;
    const updateNotes = {};
    if (name) {
      updateNotes.name = name;
    }
    if (note) {
      updateNotes.notes = await CryptoJS.AES.encrypt(note, vaultPin).toString();
    }
    try {
      await secureNotes.findByIdAndUpdate(id, updateNotes, {
        new: true,
      });
      Response(res, true, "Note updated successfully", 200);
      return;
    } catch (error) {
      Response(res, false, "Note not found", 404);
      return;
    }
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
