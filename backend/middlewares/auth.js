const  User = require('../models/user')

const jwt = require('jsonwebtoken'); // default  
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('./catchAsyncErrors');


//checks if user is authenticated or not  (in backend)
exports.isAuthenticatedUser = catchAsyncErrors (async (req, res, next) => {

     const { token } = req.cookies
 
    if(!token) {
        return next(new ErrorHandler('Login first to access this resources',401))
    }
     //JsonWebTokenError == jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);
    next()

})


// Handling users roles (authorizeRoles)
exports.authorizeRoles = (...roles) => {

    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(
              new ErrorHandler(`Role (${(req.user.role).toUpperCase()}) is not allowed to access this resources `, 403)
            )
        }
        next()
    }
}
