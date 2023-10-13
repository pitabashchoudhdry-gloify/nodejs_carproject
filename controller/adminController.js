const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const errorCustom = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const adminUser =require("../model/adminModel");


const adminuserregister= errorCustom(
    async (req, res, next)=>{

        const {name,email,phone,password}=req.body;
        if (!name || !email || !phone || !password) {
            const customError = new CustomError("All fields are mandatory!", 400);
        
            next(customError);
          }


          const userAvailable = await adminUser.findOne({
            where: {
              email: {
                [Op.eq]: email,
              },
            },
          });
          if (userAvailable) {
            const err = new CustomError("Admin already registered!", 400);
            next(err);
          }else{

          const hashedPassword = await bcrypt.hash(password, 10);

          const uniqueRandomID = uuid.v4();
          const k = await adminUser.create({
            id: uniqueRandomID,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: hashedPassword,
            image:"",
            active:1
          });
        
          if (k) {
             res.status(201).json({ id: k.id, email: k.email });
          } else {
            const err = new CustomError("Admin data is not valid", 400);
            next(err);
            
          }
        }
}
);

const adminuserlogin=errorCustom(
  async (req, res, next)=>{
    const {email,password}=req.body;
    if ( !email || !password) {
        const customError = new CustomError("All fields are mandatory!", 400);
    
        next(customError);
      }
      const userAvailable = await adminUser.findOne({
        where: {
          email: {
            [Op.eq]: email,
          },
        },
      });
        //compare password with hashedpassword
  //&& (await bcrypt.compare(password, existingUser.user_password)
  if (
    userAvailable &&
    (await bcrypt.compare(password, userAvailable.password))
  ) {
    const accessToken = jwt.sign(
      {
        userData: {
          username: userAvailable.name,
          email: userAvailable.email,
          id: userAvailable.id,
        },
      },
      process.env.ACCESS_TOKEN_SECERT,
      { expiresIn: "15m" }
    );

    res.status(200).json(accessToken);
  } else {
    const customError = new CustomError("email or password is not valid", 401);

    next(customError);
  }
     
  }
);

const adminUserDetails = errorCustom(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports={adminuserregister,adminuserlogin, adminUserDetails};