import { user as User } from "../../models/user.js";
import { nodeCache } from "../../server.js";
import Response from "../../utils/Response.js";

export const getAllNote = async (req, res) => {
  try {
    const verifyToken = req.user;
    let allNote;
    if (nodeCache.has("getAllNote")) {
      allNote = JSON.parse(nodeCache.get("getAllNote"));
      Response(res, true, null, 200, allNote);
      return;
    } else {
      const user = await User.findById(verifyToken.id).populate("secureNotes");
      allNote = user.secureNotes;
      nodeCache.set("getAllNote", JSON.stringify(allNote), 300);
      Response(res, true, null, 200, allNote);
      return;
    }
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
