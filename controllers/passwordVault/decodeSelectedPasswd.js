const Response = require("../../utils/Response.js");
const CryptoJS = require("crypto-js");

exports.decodePasswd = async (req, res) => {
  try {
    const { encodePasswd } = req.body;
    const vaultPin = req.vaultPin;
    if (!encodePasswd) {
      Response(res, false, "Enter encoded password", 406);
      return;
    }
    const decode = CryptoJS.AES.decrypt(encodePasswd, vaultPin).toString(
      CryptoJS.enc.Utf8
    );
    Response(res, true, null, 200, decode);
    return;
  } catch (error) {
    console.error(error);
    Response(res, false, "Internal server error. Try again.", 500);
    return;
  }
};
