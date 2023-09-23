const express = require("express");

const adminUserRegister= require("../controller/adminController");
 
const router = express.Router();

router.post("/register", adminUserRegister);




module.exports=router;