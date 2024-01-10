import { user as User } from "../../models/user.js";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
import Response from "../../utils/Response.js";
export const getNote = async (req, res) => {
  try {
    const vaultPin = req.vaultPin;
    const verifyToken = req.user;
    const id = req.params.id;
    const user = await User.findById(verifyToken.id).populate("secureNotes");

    if (!vaultPin || vaultPin.toString().length !== 6) {
      Response(res, false, "Enter a 6-digit number vault pin", 422);
      return;
    }
    const note = user.secureNotes.filter((value) => value._id == id);
    if (!note[0]) {
      Response(res, false, "Note not found", 404);
      return;
    } else if (!note[0].encrypt) {
      Response(res, true, null, 200, note[0].notes);
      return;
    } else if (!(await bcrypt.compare(vaultPin, user.vaultPin))) {
      Response(res, false, "Vault pin is incorrect", 402);
      return;
    }
    console.log(note[0].notes);
    const decryptedNote = CryptoJS.AES.decrypt(
      note[0].notes,
      vaultPin
    ).toString(CryptoJS.enc.Utf8);
    const fullNote={
      
    }
    Response(res, true, null, 200, decryptedNote);
    return;
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
