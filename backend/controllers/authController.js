const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

//import method of code secrets  in http
const sendToken = require('../utils/jwtToken');

//sen email in utils /sendEmail
const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');

const cloudinary = require('cloudinary')


//Register a user  => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
   
    const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder :'avatar',
        width :150,
        crop :"scale",
    })

    const {name, email, password} = req.body;

    const user = await User.create({
        name,
        email,
         password,
          avatar : {
              public_id :result.public_id,
              url:result.secure_url
        }
    })

//import method of code secrets  in http
 sendToken(user,200,res)
     
})



//Login user  ==> /a[i/v1/login]
exports.loginUser = catchAsyncErrors( async (req, res, next) => {
    const {email, password} = req.body;


    //checks if email and password entered  by user
    if(!email || !password){
        return next(new ErrorHandler('Please enter email and password', 400));

    }

    //Finding user in database
    const user =  await User.findOne({ email }).select('+password')

   if(!user) {
       return next(new ErrorHandler('Invalid Email or Password', 401));
   }


   //checks is password is correct or not 
   const isPasswordMatched = await user.comparePassword(password);

   if(!isPasswordMatched) {
       return next(new ErrorHandler('Invalid Email or Password',401));
   }


 //import method of code secrets  in http
 sendToken(user,200,res)

})



// Forget Password (demander and mail)=>  /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors( async (req, res, next) => {

      const user = await User.findOne({ email : req.body.email });

      if(!user){ 
        return next(new ErrorHandler('User not found with this email',404));
      }

      //get rest token
      const resetToken = user.getRestPasswordToken();

      //Verify the email is valid before saving it ... (getRestPasswordToken models/user)
       await user.save({ validateBeforeSave : false });
       
      //create reset password url
      //const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
      const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
      //request message  send
      const message = `Your password reset token is as follow : \n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.` ;

      try{
            await sendEmail({
                email : user.email,
                subject : 'ShopIT Password Recovery',
                message
            })

            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} `
            })

      }catch(error){

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave : false});

        return next(new ErrorHandler(error.message, 500))
      }


})


// Reset Password =>  /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors( async (req, res, next) => {


    //Hash URL token (Split the link and compare the secret code in the database)
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {
          //gt = date expire greater than to Date  now
           $gt : Date.now() 
        }
    })

    // verification  user  is Existing 
    //if user is not Existing
    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired', 400))
    }

    //if user is  Existing (password and confirm password pour validation the reset password)
    // if password not equal confirm Password  ==> return error message
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password does not match',401))

    }

    //Setup new password 
    user.password = req.body.password;

    //return default params 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // send the new password token
    sendToken(user, 200, res)


})


// GET Currently logged in user  details => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {

     const user = await User.findById(req.user.id);
     
     res.status(200).json({
          success: true,
          user 
     })
     
    
})

//Update / change password    ==>/api/v1/password/update
exports.UpdatePassword = catchAsyncErrors(async (req, res, next) => {
   
    const user = await User.findById(req.user.id).select('+password');
    
    //check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    
    if(!isMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));
    }

    user.password = req.body.newPassword;
    //save user 
    await user.save();
    sendToken(user, 200, res)

})

//Update user  profile   ==>/api/v1/me/update
exports.updateProfile = catchAsyncErrors (async (req, res, next) => {
  const newUserData = {
      name: req.body.name,
      email: req.body.email
  }

  //update avatar in user profile
  if(req.body.avatar !==''){
      const user = await User.findById(req.user.id); 

      const image_id = user.avatar.public_id;
      const res = await cloudinary.v2.uploader.destroy(image_id);

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder :'avatar',
        width :150,
        crop :"scale",
      })

      newUserData.avatar={
          public_id:result.public_id,
          url : result.secure_url,
      }
   }
  const user = await User.findByIdAndUpdate(req.user.id,newUserData , {
      new : true,
      runValidators : true,
      useFindAndModify : false
  })

  res.status(200).json({
      success : true
   })


})



//logout user  =>  /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, { 
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    })

})




// Admin routes 


// get all users  => /api/v1/admin/users

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })

})


// get user details  /api/v1/admin/user/:id
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {

    //get user 
    const user = await User.findById(req.params.id);


    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}` ))
    }

    res.status(200).json({
        success: true,
        user
    })

})


//Update user  profile  admin role   ==>/api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors (async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
  
   
    const user = await User.findByIdAndUpdate(req.params.id, newUserData , {
        new : true,
        runValidators : true,
        useFindAndModify : false
    })
  
    res.status(200).json({
        success : true
     })
  
  
  })


  // delete user  =>  /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {

    //get user 
    const user = await User.findById(req.params.id);
    const message = ` ${user.name} (ROLE : ${user.role}) is deleted successfully`;
 
    if(!user){
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}` ))
    }

    //Remove avatar from cloudinary 
    const image_id = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(image_id);

    // remove user
    await user.remove();

    res.status(200).json({
        success: true,
        message
    })

})


  
