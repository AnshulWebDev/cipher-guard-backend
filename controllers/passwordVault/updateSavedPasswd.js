import { passwordvault } from "../../models/passwordVault.js";
import { nodeCache } from "../../server.js";
import Response from "../../utils/Response.js";

export const updateSavedPasswd = async (req, res) => {
  try {
    const vaultPin = req.vaultPin;
    const id = req.params.id;
    const { name, username, password, website } = req.body;
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
    const updatePassword = {
      Updated: currentDate,
    };
    if (name) {
      updatePassword.name = name;
    } else if (username) {
      updatePassword.username = username;
    } else if (password) {
      updatePassword.password = await CryptoJS.AES.encrypt(
        password,
        vaultPin
      ).toString();
      updatePassword.passwordUpdated = currentDate;
    } else if (website) {
      updatePassword.website = website;
    }
    try {
      const updatePassword = await passwordvault.findByIdAndUpdate(
        id,
        updatePassword,
        { new: true }
      );
      updatePassword.passwordHistory += 1;
      await updatePassword.save();
      nodeCache.del("getSavedPasswd");
      Response(res, true, "Password Updated", 200);
      return;
    } catch (error) {
      Response(res, true, "Unable to update password", 404);
      return;
    }
  } catch (error) {
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
