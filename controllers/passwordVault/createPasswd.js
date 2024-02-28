const User = require("../../models/user.js");
const passwordvault = require("../../models/passwordVault.js");
const CryptoJS = require("crypto-js");
const Response = require("../../utils/Response.js");
const nodeCache = require("../../utils/nodeCache.js");
const favicon = require("favicon-getter").default;
exports.createPasswd = async (req, res) => {
  try {
    const { name, username, password, website } = req.body;
    const vaultPin = req.vaultPin;
    const verifyToken = req.user;
    const userEmail = req.user.email;
    const user = await User.findById(verifyToken.id);
    if (!name || !username || !password || !website) {
      Response(res, false, "Enter all fields", 402);
      return;
    }
    const faviconFinder = async () => {
      try {
        const faviconUrl = await favicon(website);
        return faviconUrl;
      } catch (error) {
        return "https://raw.githubusercontent.com/anshuldevsec/cipher-guard/main/src/assets/defaultFavicon.png";
      }
    };
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
      websiteFavicon: await faviconFinder(),
      Created: currentDate,
      email: userEmail,
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
    console.log("here is the error", error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
