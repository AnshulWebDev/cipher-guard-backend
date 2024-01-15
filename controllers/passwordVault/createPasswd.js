const User = require("../../models/user.js");
const passwordvault = require("../../models/passwordVault.js");
const CryptoJS = require("crypto-js");
const Response = require("../../utils/Response.js");
const { nodeCache } = require("../../server.js");
exports.createPasswd = async (req, res) => {
  try {
    const { name, username, password, website } = req.body;
    const vaultPin = req.vaultPin;
    const verifyToken = req.user;
    const user = await User.findById(verifyToken.id);
    if (!name || !username || !password || !website) {
      Response(res, false, "Enter all fields", 402);
      return;
    }
    const currentDate = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    const encryptPasswd = await CryptoJS.AES.encrypt(
      password,
      vaultPin
    ).toString();
    const newPassword = await passwordvault.create({
      name,
      username,
      password: encryptPasswd,
      website,
      Created: currentDate,
    });
    await User.findByIdAndUpdate(
      user._id,
      {
        $push: { passwordVault: newPassword._id },
      },
      { new: true }
    );
    nodeCache.del("getSavedPasswd");
    Response(res, false, "credential saved", 200);
    return;
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
