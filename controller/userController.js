const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const user = require("../model/userModel");
const { Op } = require("sequelize");
const jwt=require("jsonwebtoken");

// const User = require("../models/userModel");

//@desc Register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone ,password} = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const userAvailable = await user.findOne({
    where: {
      user_email: {
        [Op.eq]: email,
      },
    },
  });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered!");
  }

  //Hash password
   const hashedPassword = await bcrypt.hash(password, 10);
  // console.log("Hashed Password: ", hashedPassword);
  
  const uniqueRandomID = uuid.v4();

  const k = await user.create({
    user_id: uniqueRandomID,
    user_name: req.body.name,
    user_phone: req.body.phone,
    user_email: req.body.email,
    user_password :hashedPassword,
  });

  if (k) {
    res.status(201).json({ id: k.user_id, email: k.user_email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
 
});

//@desc Login user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
 
  if (!email || !password) {
    res.status(400);
    
    throw new Error("All fields are mandatory!");
  }
  
  const existingUser = await user.findOne({  where: {
    user_email: {
      [Op.eq]: email,
    },
  }, });
  
  //compare password with hashedpassword
  //&& (await bcrypt.compare(password, existingUser.user_password)
  if (existingUser && (await bcrypt.compare(password, existingUser.user_password))) {
   
    const accessToken = jwt.sign(
      {
        userData: {
          username: existingUser.user_name,
          email: existingUser.user_email,
          id: existingUser.user_id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );
   
    res.status(200).json( accessToken);
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }

  
});

//@desc Current user info
//@route POST /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
