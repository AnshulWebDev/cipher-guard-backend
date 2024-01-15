const User = require("../../models/user.js");
const CryptoJS = require("crypto-js");
const Response = require("../../utils/Response.js");

exports.getNote = async (req, res) => {
  try {
    const vaultPin = req.vaultPin;
    const verifyToken = req.user;
    const id = req.params.id;
    const user = await User.findById(verifyToken.id).populate("secureNotes");
    const note = user.secureNotes.filter((value) => value._id == id);
    if (!note[0]) {
      Response(res, false, "Note not found", 404);
      return;
    } else if (!note[0].encrypt) {
      Response(res, true, null, 200, note[0].notes);
      return;
    }
    // console.log(note[0].notes);
    const decryptedNote = CryptoJS.AES.decrypt(
      note[0].notes,
      vaultPin
    ).toString(CryptoJS.enc.Utf8);
    Response(res, true, null, 200, decryptedNote);
    return;
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
