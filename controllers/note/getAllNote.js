import { user as User } from "../../models/user.js";
import Response from "../../utils/Response.js";

export const getAllNote = async (req, res) => {
  try {
    const verifyToken = req.user;
    const user = await User.findById(verifyToken.id).populate("secureNotes");
    Response(res, true, null, 200, user.secureNotes);
    return;
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
