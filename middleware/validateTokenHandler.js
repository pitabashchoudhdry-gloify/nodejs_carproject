//const asyncHandler = require("express-async-handler");
//const asyncHandler =require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");
const errorCustom = require("../utils/asyncErrorHandler");

const validateToken = errorCustom(
  async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if(authHeader==undefined || authHeader=="")
  {
    
    const customError = new CustomError('User is not authorized or token is missing',401);
   
   next(customError);
    
  }
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
   
   

    if (!token || token=="") {
      

      const customError = new CustomError('User is not authorized or token is missing',401);
      
      next(customError);
    }
    else{
       jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
        if (err) {
         
       
          const customError = new CustomError('User is not authorized or token is missing',401);
          
          next(customError);
        }
        else{
        req.user = decoded.userData;
      
        next();
        }
      });
    }
  }
}

);

module.exports = validateToken;