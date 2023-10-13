const express = require("express");

const {adminuserregister,adminuserlogin,adminUserDetails,}= require("../controller/adminController");
const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", adminuserregister);
router.post("/login", adminuserlogin);
router.get("/current", validateToken, adminUserDetails);


module.exports=router;