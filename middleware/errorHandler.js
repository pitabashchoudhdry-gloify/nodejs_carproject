// const { constants } = require("../constants");

// const errorHandler = (err, req, res, next) => {
//   const statusCode = res.statusCode ? res.statusCode : 500;
  
//   switch (statusCode) {
//     case constants.VALIDATION_ERROR:
//       res.status(constants.VALIDATION_ERROR).json({
//         title: "Validation Failed",
//         message: err.message,
//         stackTrace: err.stack,
//       });
//       break;
//     case constants.NOT_FOUND:
//       res.status(constants.NOT_FOUND).json({
//         title: "Not Found",
//         message: err.message,
//         stackTrace: err.stack,
//       });
//     case constants.UNAUTHORIZED:
//       res.status(constants.UNAUTHORIZED).json({
//         title: "Unauthorized",
//         message: err.message,
//         stackTrace: err.stack,
//       });
//     case constants.FORBIDDEN:
//       res.status(constants.FORBIDDEN).json({
//         title: "Forbidden",
//         message: err.message,
//         stackTrace: err.stack,
//       });
//     case constants.SERVER_ERROR:
//       res.status(constants.SERVER_ERROR).json({
//         title: "Server Error",
//         message: err.message,
//         stackTrace: err.stack,
//       });
//     default:
//       res.status(err.statusCode).json({
//         title: "Unauthorized user",
//         message: err.message,
//         stackTrace: err.stack,
//       });
     
//       break;
//   }
// };

// module.exports = errorHandler;

const CustomError = require('../utils/customError');

const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value}!`
    return new CustomError(msg, 400);
}

const duplicateKeyErrorHandler = (err) => {
 const name = err.keyValue.name;
 const msg = `There is already a movie with name ${name}. Please use another name!`;
 
 return new CustomError(msg, 400);
}

const validationErrorHandler = (err) => {
    const errors = Object.values(err.errors).map(val => val.message);
    const errorMessages = errors.join('. ');
    const msg = `Invalid input data: ${errorMessages}`;

    return new CustomError(msg, 400);
}

const prodErrors = (res, error) => {
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message,
            stackTrace: error.stack,
        });
    }else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.',
            
        })
    }
}

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        devErrors(res, error);
    } else {
        if(error.name === 'CastError') error = castErrorHandler(error);
        if(error.code === 11000) error = duplicateKeyErrorHandler(error);
        if(error.name === 'ValidationError') error = validationErrorHandler(error);

        prodErrors(res, error);
    }
    
}