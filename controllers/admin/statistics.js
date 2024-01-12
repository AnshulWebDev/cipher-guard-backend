import { user as User } from "../../models/user.js";
import { nodeCache } from "../../server.js";
import Response from "../../utils/Response.js";

export const statistics = async (req, res) => {
  try {
    const getAllRegisterUser = await User.find();
    let allRegisterUser;
    if (nodeCache.has("allRegisterUser")) {
      allRegisterUser = nodeCache.get(JSON.parse("allRegisterUser"));
      Response(res, true, null, 200, allRegisterUser);
      return;
    } else {
      allRegisterUser = getAllRegisterUser;
      nodeCache.set("allRegisterUser", JSON.stringify(allRegisterUser));
      Response(res, true, null, 200, allRegisterUser);
      return;
    }
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
