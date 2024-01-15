const Response = require("../../utils/Response.js");
exports.logout = async (req, res) => {
  try {
    return res.clearCookie("token");
  } catch (error) {
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
