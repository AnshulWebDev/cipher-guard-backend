import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Response from "../utils/Response.js";
dotenv.config();
//auth
export const auth = async (req, res, next) => {
  try {
    //extract token
    const token0 =
      req.cookies.token || req.header("Authorization").replace("Bearer ", "");
    if (!token0) {
      Response(res, false, "Token Is missing", 401);
      return;
    }

    //verify the token
    try {
      const decode = jwt.verify(token0, process.env.JWT_SECRET);
      req.user = decode;
    } catch (error) {
      Response(res, false, "Token Is Invalid", 404);
      return;
    }
    next();
  } catch (error) {
    console.log(error.message);
    Response(
      res,
      false,
      "Something went wrong while validating the token",
      401
    );
    return;
  }
};
//auth
export const isAuthUser = async (req, res, next) => {
  try {
    //extract token
    const user = req.user;
    if (user.role !== "user") {
      Response(res, false, "only user access this route", 401);
      return;
    }

    next();
  } catch (error) {
    console.log(error.message);
    Response(
      res,
      false,
      "Something went wrong while validating the token",
      401
    );
    return;
  }
};
