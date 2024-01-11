import { secureNotes } from "../../models/secureNotes.js";
import Response from "../../utils/Response.js";
import { nodeCache } from "./../../server.js";
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
      Response(res, true, "Note updated successfully", 200);
      nodeCache.del("getAllNote");
      nodeCache.del("favoriteNotes");
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
