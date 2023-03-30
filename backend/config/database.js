const mongoose = require('mongoose');




const connectDatabase = () => {
  mongoose.connect(process.env.DB_LOCAL_URI,{
  // mongoose.connect(process.env.DB_ LOCAL_URI ,{
   useNewUrlParser : true,
   useUnifiedTopology : true,
  
  }).then(con => {
      console.log(`MongoDB Database connect with host: ${con.connection.host}`)
  })//.catch((err) => console.log('error mongoose'))
}


module.exports = connectDatabase