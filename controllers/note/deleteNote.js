import { user as User } from "../../models/user.js";
import { secureNotes } from "../../models/secureNotes.js";
import Response from "../../utils/Response.js";
export const deleteNote = async (req, res) => {
  try {
    const verifyUser = req.user;
    const notesId = req.params.id;
    const user = await User.findById(verifyUser.id).populate("secureNotes");

    try {
      await secureNotes.findByIdAndDelete(notesId);
      await User.updateOne(
        { _id: verifyUser.id },
        {
          $pull: { secureNotes: notesId },
        },
        { new: true }
      );
      Response(res, true, "note delete successfully", 200);
      return;
    } catch (error) {
      console.log(error.message);
      Response(res, false, "Unable to delete item", 200);
      return;
    }
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
