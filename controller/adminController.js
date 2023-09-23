const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const errorCustom = require("../utils/asyncErrorHandler");
const CustomError = require("../utils/customError");
const adminUser =require("../model/adminModel");


const adminusermiddleware= errorCustom(
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
            const err = new CustomError("User already registered!", 400);
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
            const err = new CustomError("User data is not valid", 400);
            next(err);
            
          }
        }
}
);


module.exports=adminusermiddleware;