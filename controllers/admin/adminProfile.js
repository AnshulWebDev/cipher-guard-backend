import { user as User } from "../../models/user.js";
import Response from "../../utils/Response.js";

export const adminProfile = async (req, res) => {
  try {
    const verifyToken = req.user;
    const userDetails = await User.findById(verifyToken.id);
    Response(res, true, null, 200, userDetails);
    return;
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
