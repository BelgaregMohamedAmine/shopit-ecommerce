const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

  //use for Lots of details [development mode] 
   if(process.env.NODE_ENV === 'DEVELOPMENT'){
       res.status(err.statusCode).json({
           success: false,
           error: err,
           errMessage:err.message,
           stack: err.stack //details
       });
   }


 // use err for error messages personalize [simple user]
   if(process.env.NODE_ENV === "PRODUCTION"){
    let error = {...err}

    error.message = err.message;

    //wrong Mongoose Object ID Error  (use in get/update product )
    //return Resource not found. Invalid: _id" 
    if(err.name === 'CastError'){
      const message = `Resource not found. Invalid: ${err.path}`
      error = new ErrorHandler (message, 400);
    }


    //handling  Mongoose  Validation Error

    if(err.name === 'ValidationError'){
       const message = Object.values(err.errors).map(value => value.message);
       error = new ErrorHandler (message, 400);
    }

    //Handling Mongoose duplicate ket errors (E11000 duplicate key error collection)
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new ErrorHandler (message, 400);
    }


    //Handling wrong JWT error
     if(err.name === 'JsonWebTokenError'){
      const message = `Json Web Token is invalid. Try Again !!!`;
      error = new ErrorHandler (message, 400);
    }

    //Handling Expired JWT error
    if(err.name === 'TokenExpiredError'){
     const message = `Json Web Token is Expired. Try Again !!!`;
     error = new ErrorHandler (message, 400);
    }


    res.status(error.statusCode).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });

  }

   
}
