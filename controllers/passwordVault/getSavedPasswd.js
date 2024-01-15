const User = require("../../models/user.js");
const Response = require("../../utils/Response.js");
const { nodeCache } = require("../../server.js");

exports.getSavedPasswd = async (req, res) => {
  try {
    const verifyToken = req.user;
    let getAllSavedPasswd;
    if (nodeCache.has("getSavedPasswd")) {
      getAllSavedPasswd = JSON.parse(nodeCache.get("getSavedPasswd"));
      Response(res, true, null, 200, getAllSavedPasswd);
      return;
    } else {
      const user = await User.findById(verifyToken.id).populate(
        "passwordVault"
      );
      getAllSavedPasswd = user.passwordVault;
      nodeCache.set("getSavedPasswd", JSON.stringify(getAllSavedPasswd), 300);
      Response(res, true, null, 200, getAllSavedPasswd);
      return;
    }
  } catch (error) {
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
