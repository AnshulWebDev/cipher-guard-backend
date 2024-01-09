import { secureNotes } from "../../models/secureNotes.js";
import Response from "../../utils/Response.js";
export const favoriteNote = async (req, res) => {
  try {
    const { favorite } = req.body;
    const id = req.params.id;
    const updateNotes = {};
    if (favorite === true || favorite === false) {
      updateNotes.favorite = favorite;
    }
    try {
      await secureNotes.findByIdAndUpdate(id, updateNotes, {
        new: true,
      });
      Response(res, false, "Note updated successfully", 404);
      return;
    } catch (error) {
      Response(res, false, "Note not found", 404);
      return;
    }
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
