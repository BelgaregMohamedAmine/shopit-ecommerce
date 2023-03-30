//user model

const mongoose = require('mongoose');

//email verification
const validator = require('validator');

//Password encryption
const bcrypt = require('bcryptjs');

//Password crypto
const crypto = require('crypto');

const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
        name:{
        type: String,
        required: [true, 'Please  enter your name.'],
        maxLength:[30,'Your name cannot exceed 30 characters.']
        },

        email: {
            type: String,
            required: [true, 'Please enter your email address'],
            unique: true,
            validate:[validator.isEmail, 'Please enter a valid email address']
        },

        password: {
            type: String,
            required: [true, 'Please enter your password'],
            minLength:[8,'Your password must be at least 8 characters'],
            select : false //hide password(masquer le mot de passe)
        },

        avatar: {
            public_id:{
                type: String,
                required:true
            },
            url: {
                type: String,
                required :true
            }
        },

        role: {
            type: String,
            default: 'user'
        },

        createdAt: {
            type: Date,
            default:Date.now
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date  //date of validation token for reset password

})


//Encrypting password before saving user
userSchema.pre('save', async function(next) {

    // if password password default  not change  ==>  the password not crypt
    if(!this.isModified('password')) {
       next();
    }
     //else return new password
    this.password = await bcrypt.hash(this.password, 10)
})


//compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}



//Return JWT token
userSchema.methods.getJwtToken = function (){
    return jwt.sign({id : this._id}, process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_TIME
    });
} 



//Generate password rest token

userSchema.methods.getRestPasswordToken = function(){

    //Generate token(password)
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Has and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    
    // Set token expire Time  [30 MINUTES]
    this.resetPasswordExpire = Date.now() + 30 /*30min*/* 60 /*60sec*/ *1000 /*1000Ms*/

    return resetToken


}


module.exports = mongoose.model('User', userSchema);