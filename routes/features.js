const express = require("express");
const {
  addEmergencyAccess,
  emergencyLogin,
} = require("../controllers/features/emergencyAccess.js");
const { auth, isAuthUser } = require("./../middleware/auth.js");
const router = express.Router();

router.post("/emergencyAccess", auth, isAuthUser, addEmergencyAccess);
router.post("/emergencyLogin", emergencyLogin);
module.exports = router;
