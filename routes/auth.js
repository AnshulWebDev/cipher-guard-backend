import express from "express";
import { sendOtp } from "./../controllers/auth/register/sendOtp.js";
import { verifyOtp } from "./../controllers/auth/register/verifyOtp.js";
import { resendOtp } from "./../controllers/auth/register/resendOtp.js";
const router = express.Router();

router.post("/register/sendOtp", sendOtp);
router.post("/register/verifyOtp", verifyOtp);
router.post("/register/resendOtp", resendOtp);

export default router;
