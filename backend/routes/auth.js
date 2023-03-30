const express = require('express');

const router = express.Router();

const { registerUser,
     loginUser,
     forgotPassword,
     resetPassword,
     getUserProfile,
     UpdatePassword,
     updateProfile,
     logout,
     getAllUsers, //admin 
     getUserDetails ,//admin
     updateUser, //admin
     deleteUser//admin
     } = require('../controllers/authController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

//You must be logged in to access this page of Profile 'isAuthenticatedUser' ==>getUserProfile
router.route('/me').get(isAuthenticatedUser, getUserProfile);

//change password 
router.route('/password/update').put(isAuthenticatedUser, UpdatePassword);

//update profile
router.route('/me/update').put(isAuthenticatedUser, updateProfile);

//get all user admin routes
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),getAllUsers);

//get user details
router.route('/admin/user/:id')
              // get user details
             .get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetails)
             //update user 
             .put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)
             //delete user 
             .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser);


module.exports = router;