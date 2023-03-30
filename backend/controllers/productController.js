const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary')


//create new product =>  /api/v1/admin/product/new

exports.newProduct = catchAsyncErrors (async (req, res, next) => {

    let images = [];
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    
    req.body.images = imagesLinks

    //Register the ID of the person who added the product
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
   
    res.status(201).json({
        success: true,
        product
    });
});

//Get all products => /api/v1/products?Keyword=nameProduct
exports.getProducts = catchAsyncErrors (async (req, res, next) => {
   
    //Number of products in page
    const resPerPage =4;

    //number of products
    const productsCount = await Product.countDocuments();
   
    const apiFeatures = new APIFeatures(Product.find(), req.query)
        .search()
        .filter()
     
   
    //pagination filter by category 
    let products = await apiFeatures.query;
    //number of products in category 
    let filteredProductsCount = products.length

    apiFeatures.pagination(resPerPage)
    products = await apiFeatures.query.clone();

  
    res.status(200).json({
        success: true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products
    })
   
});


//Get all products  admin dashboard=> /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })

})


//get single product details   => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors (async (req, res, next) => {

     const product = await Product.findById(req.params.id);
    if(!product) {
        
       /*return res.status(404).json({
            success: false,
            message: 'Product not found.'});*/

     return next(new ErrorHandler('Product not found.',404)) 
    }

    res.status(200).json({
        success: true,
        product
    });
});

//Update Product  => /api/v1/admin/product/:id
exports.UpdateProduct = catchAsyncErrors ( async  (req, res) => {

    let product = await Product.findById(req.params.id);

    if(!product) {
      return next(new ErrorHandler('Product not found.',404)) 
    }

    let images = [];
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if(images !== undefined){
         //deleting images associated with the product 
        for(let i=0; i < product.images.length; i++){
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        
        }

        
        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }
        
        req.body.images = imagesLinks
    }


    product = await Product.findByIdAndUpdate(req.params.id,req.body,{
         new : true,
         runValidators:true,
         useFindAndModify:false
    });

    res.status(200).json({
        success : true,
        product
    });
});

// Delete product ==>  /api/v1/admin/product/:id
exports.DeleteProduct = catchAsyncErrors (async (req, res ,next) => {
    
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found.',404)) 
    }

    //deleting images associated with the product 
    for(let i=0; i < product.images.length; i++){
         const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
         
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted successfully.'
    });
});

// Create a new  review  =>  / api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review ={
        user : req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment

    }

    const product = await Product.findById(productId);

    //console.log(product.reviews);

    const isReviewed =  product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )
    

    //update review is received
    if(isReviewed) {
      product.reviews.forEach(review => {
          if(review.user.toString() === req.user._id.toString()){
              review.comment = comment;
              review.rating = rating;
          }
      })
    }

    // add new review is not reviewed
    else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
     

    // update ratings  (sum of rating[] / Number of reviews)
    product.ratings = product.reviews.reduce((acc , item) => item.rating + acc , 0) / product.reviews.length;
    
   // save the ratings

   await product.save({ validateBeforeSave : false});

   res.status(200).json({
       success: true,
   })


})

// get product reviews  => / api/v1/reviews
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews 
    })
})

// Delete product review  => / api/v1/reviews
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());
     
    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc , item) => item.rating + acc , 0) / reviews.length;

    //update 
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
       },
       {
        new : true,
        runValidators : true,
        useFindAndModify : false
       }
    )


    res.status(200).json({
        success: true
    })
})
 
 
