import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Response from "../utils/Response";
dotenv.config();
//auth
export const auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies.token || req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      Response(res, false, "Token Is missing", 401);
    }

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      Response(res, false, "Token Is Invalid", 404);
    }
    next();
  } catch (error) {
    Response(
      res,
      false,
      "Something went wrong while validating the token",
      401
    );
  }
};
