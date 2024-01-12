import express from "express";
import { createPasswd } from "../controllers/passwordVault/createPasswd.js";
import { generatePasswd } from "../controllers/passwordVault/generatePasswd.js";
import { auth as Auth, isAuthUser, verifyAuthPin } from "../middleware/auth.js";
import { generateUsername } from "../controllers/passwordVault/generateUsername.js";
import { deleteSavedPasswd } from "../controllers/passwordVault/deleteSavedPasswd.js";
import { getSavedPasswd } from "../controllers/passwordVault/getSavedPasswd.js";
import { updateSavedPasswd } from "../controllers/passwordVault/updateSavedPasswd.js";
const router = express.Router();

router.post("/createPasswd", Auth, isAuthUser, verifyAuthPin, createPasswd);
router.post("/generatePasswd", Auth, isAuthUser, generatePasswd);
router.get("/generateUsername", Auth, isAuthUser, generateUsername);
router.delete(
  "/deletePasswd/:id",
  Auth,
  isAuthUser,
  verifyAuthPin,
  deleteSavedPasswd
);
router.put(
  "/updateSavedPasswd/:id",
  Auth,
  isAuthUser,
  verifyAuthPin,
  updateSavedPasswd
);

router.post("/getAllPasswd", Auth, isAuthUser, verifyAuthPin, getSavedPasswd);
export default router;
