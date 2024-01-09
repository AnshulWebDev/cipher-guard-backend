import { user as User } from "../../models/user.js";
import bcrypt from "bcrypt";
import { secureNotes } from "../../models/secureNotes.js";
import CryptoJS from "crypto-js";
import Response from "../../utils/Response.js";
export const updateNote = async (req, res) => {
  try {
    const { name, note, favorite, vaultPin } = req.body;
    const verifyToken = req.user;
    const id = req.params.id;
    const user = await User.findById(verifyToken.is);
    if (!vaultPin || vaultPin.toString().length !== 6) {
      Response(res, false, "Enter a 6-digit number vault pin", 422);
      return;
    } else if (!(await bcrypt.compare(vaultPin, user.vaultPin))) {
      Response(res, false, "Vault pin is incorrect", 402);
      return;
    }
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
