import express from "express";
import { sendOtp } from "./../controllers/auth/register/sendOtp.js";
import { verifyOtp } from "./../controllers/auth/register/verifyOtp.js";
import { resendOtp } from "./../controllers/auth/register/resendOtp.js";
import { login } from "../controllers/auth/login.js";
import { logout } from "../controllers/auth/logout.js";
import { createVaultPin } from "../controllers/auth/createVaultPin.js";
import { vaultAuth } from "../controllers/auth/vaultAuth.js";
import {
  auth as Auth,
  isAuthUser,
  verifyAuthPin,
} from "./../middleware/auth.js";
const router = express.Router();

router.post("/register/sendOtp", sendOtp);
router.post("/register/verifyOtp", verifyOtp);
router.post("/register/resendOtp", resendOtp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/createVaultPin", Auth, createVaultPin);
router.post("/vaultAuth", Auth, isAuthUser, vaultAuth);
export default router;
