import { user as User } from "../../models/user.js";
import Response from "../../utils/Response.js";

export const getSavedPasswd = async (req, res) => {
  try {
    const verifyToken = req.user;
    const user = await User.findById(verifyToken.id).populate("passwordVault");
    Response(res, true, null, 200, user.passwordVault);
    return;
  } catch (error) {
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
