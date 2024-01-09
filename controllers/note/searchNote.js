import { user as User } from "../../models/user.js";
import Response from "../../utils/Response.js";

export const searchNote = async (req, res) => {
  try {
    const verifyToken = req.user;
    const name = req.query.name;
    const user = await User.findById(verifyToken.id).populate("secureNotes");
    const searchResult = user.secureNotes.filter((note) =>
      new RegExp(name, "i").test(note.name)
    );
    user.secureNotes;
    Response(
      res,
      true,
      null,
      200,
      searchResult.length > 0 ? searchResult : "No result found"
    );
    return;
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
