const express =require("express") ;
const { getLockUser } =require("../controllers/admin/getLockUser.js") ;
const { unBlockUser } =require("../controllers/admin/unBlockUser.js") ;
const { statistics } =require("../controllers/admin/statistics.js") ;
const { adminLogin } =require("../controllers/admin/adminLogin.js") ;
const { auth, isAuthAdmin } =require("../middleware/auth.js") ;
const { adminProfile } =require( "./../controllers/admin/adminProfile.js");
const router = express.Router();

router.post("/getLockUser", auth, isAuthAdmin, getLockUser);
router.put("/unBlockUser", auth, isAuthAdmin, unBlockUser);
router.post("/statistics", auth, isAuthAdmin, statistics);
router.post("/adminLogin", adminLogin);
router.post("/adminProfile", auth, isAuthAdmin, adminProfile);

module.exports = router;
