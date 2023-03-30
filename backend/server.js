const app = require('./app')

// import file of database in backend ==> config ==> database 
const connectDatabase =  require('./config/database')

const dotenv = require('dotenv')
const cloudinary = require('cloudinary')

//Handle Uncaught exceptions  'not defined'
// for example console.log(a);   <== error
process.on('uncaughtException',err => {
    console.log(`ERROR : ${err.stack}`); 
    //en mode development use  console.log(`ERROR : ${err.stack}`) 
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
})
//test Handle Uncaught exceptions
//console.log(a);



// Settings up config file
dotenv.config({path : 'backend/config/config.env'})



//connecting  to database
connectDatabase()

//Settings up cloudinary configuration
cloudinary.config({
    cloud_name :process.env.CLOUDINARY_CLOUD_NAME,
    api_key :process.env.CLOUDINARY_API_KEY,
    api_secret :process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT ,() => {
    console.log(`Server started on PORT : ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
})


//Handle Unhandled Promise rejections
//generate connect server error

process.on('unhandledRejection',err => {
    console.log(`ERROR : ${err.stack}`); //message or stack
    console.log('Shutting down the server due to Unhandled Promise Rejection');
    server.close(()=> {
        process.exit(1);
    })
})
