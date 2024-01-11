import { passwordvault } from "../../models/passwordVault.js";
import { user as User } from "../../models/user.js";
import { nodeCache } from "../../server.js";
import Response from "../../utils/Response.js";

export const deleteSavedPasswd = async (req, res) => {
  try {
    const verifyToken = req.user;
    const id = req.params.id;
    try {
      await passwordvault.findByIdAndDelete(id);
      await User.findByIdAndUpdate(verifyToken.id, {
        $pull: { passwordVault: id },
      });
      nodeCache.del("getSavedPasswd")
      Response(res, true, "Password delete successfully", 200);
      return;
    } catch (error) {
      console.log(error.message);
      Response(res, false, "Unable to delete item", 404);
      return;
    }
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
