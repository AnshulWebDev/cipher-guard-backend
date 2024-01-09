import { user as User } from "../../models/user.js";
import Response from "../../utils/Response.js";

export const getFavoriteNote = async (req, res) => {
  try {
    const verifyToken = req.user;
    const user = await User.findById(verifyToken.id).populate("secureNotes");
    const favoriteNotes = user.secureNotes.filter((note) => note.favorite);
    Response(res, true, null, 200, favoriteNotes);
    return;
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
