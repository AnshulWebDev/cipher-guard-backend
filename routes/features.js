import express from "express";
import {
  addEmergencyAccess,
  emergencyLogin,
} from "../controllers/features/emergencyAccess.js";
import { auth as Auth, isAuthUser } from "./../middleware/auth.js";
const router = express.Router();

router.post("/emergencyAccess", Auth, isAuthUser, addEmergencyAccess);
router.post("/emergencyLogin", Auth, isAuthUser, emergencyLogin);
export default router;
