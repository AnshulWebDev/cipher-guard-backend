import Response from "../../utils/Response.js";
export const logout = async (req, res) => {
  try {
    return res.clearCookie("token");
  } catch (error) {
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
