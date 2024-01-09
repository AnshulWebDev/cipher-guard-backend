import { user as User } from "../../models/user.js";
import { secureNotes } from "../../models/secureNotes.js";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
import Response from "../../utils/Response.js";
export const createNote = async (req, res) => {
  try {
    const { name, note, favorite, vaultPin, lockNote } = req.body;
    if (!name) {
      Response(res, false, "enter note name", 422);
      return;
    } else if (!note) {
      Response(res, false, "note will not be empty", 422);
      return;
    }
    const verifyUser = req.user;
    const user = await User.findById(verifyUser.id);
    const createNote = async (name, note, encrypt) => {
      const newNote = await secureNotes.create({
        name: name,
        notes: note,
        favorite: favorite ? true : false,
        encrypt: encrypt,
      });
      await User.findByIdAndUpdate(
        user._id,
        {
          $push: { secureNotes: newNote._id },
        },
        { new: true }
      );
    };
    if (lockNote === true) {
      if (!vaultPin || vaultPin.toString().length !== 6) {
        Response(res, false, "Enter a 6-digit number vault pin", 422);
        return;
      } else if (!user.vaultPin) {
        Response(res, false, "create 6 digit vault pin", 422);
        return;
      } else if (!(await bcrypt.compare(vaultPin, user.vaultPin))) {
        Response(res, false, "Vault pin is incorrect", 401);
        return;
      }
      const encryptNote = await CryptoJS.AES.encrypt(note, vaultPin).toString();
      await createNote(name, encryptNote, true);
      Response(res, true, "Note added successfully", 200);
      return;
    } else {
      await createNote(name, note, false);
      Response(res, true, "Note added successfully", 200);
      return;
    }
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
