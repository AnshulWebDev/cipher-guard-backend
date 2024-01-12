import express from "express";
import { getLockUser } from "../controllers/admin/getLockUser.js";
import { unBlockUser } from "../controllers/admin/unBlockUser.js";
import { statistics } from "../controllers/admin/statistics.js";
import { adminLogin } from "../controllers/admin/adminLogin.js";
import { auth as Auth, isAuthAdmin } from "../middleware/auth.js";
const router = express.Router();

router.post("/getLockUser", Auth, isAuthAdmin, getLockUser);
router.put("/unBlockUser", Auth, isAuthAdmin, unBlockUser);
router.post("/statistics", Auth, isAuthAdmin, statistics);
router.post("/adminLogin", adminLogin);

export default router;
