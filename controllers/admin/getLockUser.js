import { user as User } from "../../models/user.js";
import Response from "../../utils/Response.js";
import { nodeCache } from "./../../server.js";

export const getLockUser = async (req, res) => {
  try {
    let lockUser;
    if (nodeCache.has("getLockUser")) {
      lockUser = JSON.parse(nodeCache.get("getLockUser"));
      Response(res, true, null, 200, lockUser);
      return;
    } else {
      const filterLockUser = await User.find({ accountLock: true });
      lockUser = nodeCache.set(
        "getLockUser",
        JSON.stringify(filterLockUser),
        200
      );
      Response(res, true, null, 200, lockUser);
      return;
    }
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
