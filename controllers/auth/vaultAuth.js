const User = require("../../models/user.js");
const bcrypt = require("bcrypt");
const Response = require("../../utils/Response.js");
const CryptoJS = require("crypto-js");
require("dotenv").config();
exports.vaultAuth = async (req, res) => {
  try {
    const { vaultPin } = req.body;
    const verifyUser = req.user;
    const user = await User.findById(verifyUser.id);
    if (!vaultPin || vaultPin.toString().length !== 6) {
      Response(res, false, "Enter 6-digit vault pin", 422);
      return;
    } else if (!user.vaultPin) {
      Response(res, false, "create 6-digit vault pin", 422);
      return;
    } else if (!(await bcrypt.compare(vaultPin, user.vaultPin))) {
      Response(res, false, "Vault pin is incorrect", 402);
      return;
    }
    const encrypt = await CryptoJS.AES.encrypt(
      vaultPin,
      process.env.SECUREPIN
    ).toString();

    Response(res, true, "vault unlock", 200, encrypt);
    return;
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
