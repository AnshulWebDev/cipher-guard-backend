import { user as User } from "../../models/user.js";
import bcrypt from "bcrypt";
import Response from "../../utils/Response.js";
export const createVaultPin = async (req, res) => {
  try {
    const { vaultPin } = req.body;
    const verifyUser = req.user;
    if (vaultPin.toString().length !== 6) {
      Response(res, false, "Enter a 6-digit number", 422);
      return;
    }
    const user = await User.findById(verifyUser.id);
    if (user.vaultPin) {
      Response(res, false, "vault pin already created", 422);
      return;
    }
    const hashVaultPin = await bcrypt.hash(vaultPin, 12);
    user.vaultPin = hashVaultPin;
    await user.save();
    Response(res, true, "pin created successfully", 200);
    return;
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
