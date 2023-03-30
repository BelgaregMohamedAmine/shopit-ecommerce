// Create and Send token and save in the cookie

const sendToken =(user, statusCode, res) => {

        //Create Jwt token
        const token = user.getJwtToken();


        //Options for cookie
        const options = {
            expires:new Date(
                Date.now() + process.env.COOKIE_EXPIRES_TIME * 24/*24H*/ * 60 /*60M*/* 60 /*60SEC*/* 1000 /*1000 millisecond*/ 
                //Terminate the cookie after this time and convert it by the millisecond
                ),
                httpOnly : true // Disable access through javascript code
        }

        res.status(statusCode).cookie('token', token, options).json({
            success : true,
            token,
            user
        })

}


module.exports = sendToken;
//or use export default sendToken;