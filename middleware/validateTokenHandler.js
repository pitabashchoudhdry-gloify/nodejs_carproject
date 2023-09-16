const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(
  async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if(authHeader==undefined || authHeader=="")
  {
    // res.status(401);
    // throw new Error("User is not authorized or token is missing");
    const customError = new Error('User is not authorized or token is missing');
    customError.statusCode = 401; // Set the desired status code
    throw customError;
    
  }
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
   
   

    if (!token || token=="") {
      // res.status(401);
      // throw new Error("User is not authorized or token is missing");
      const customError = new Error('User is not authorized or token is missing');
      console.log(customError.statusCode);
          customError.statusCode = 401; // Set the desired status code
          throw customError;
    }
    else{
      jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
        if (err) {
         
        // res.status(401);
         // throw new Error("User is not authorized");
          const customError = new Error('User is not authorized');
          console.log(customError.statusCode);
          customError.statusCode = 401; // Set the desired status code
          throw customError;
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