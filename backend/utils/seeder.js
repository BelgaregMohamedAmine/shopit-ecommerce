const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/products');

//settings dotenv file
dotenv.config({path : 'backend/config/config.env'})

//import functions connected to database
connectDatabase();


const seedProduct = async () => {
    try {

        await Product.deleteMany();
        console.log('Products are deleted successfully');

        await Product.insertMany(products);
        console.log('Products are inserted successfully');

        process.exit();
  

    }
    
    catch(error) {
        console.log(error.message);
        process.exit();
    }
}

seedProduct();