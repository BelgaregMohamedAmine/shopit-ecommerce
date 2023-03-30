const express = require('express');
const router = express.Router();


const {getProducts, 
      getAdminProducts,
       newProduct, 
       getSingleProduct,
       UpdateProduct, 
       DeleteProduct,
       createProductReview,
       getProductReviews,
       deleteReview
    } = require('../controllers/productController');


const { isAuthenticatedUser , authorizeRoles } = require('../middlewares/auth');

// get All Products
router.route('/products').get(getProducts);

// get All Products (admin dashboard)
router.route('/admin/products').get(getAdminProducts);

//get Single Product 
router.route('/product/:id').get(getSingleProduct);

//create new Product
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct);

//update Product
router.route('/admin/product/:id').put(isAuthenticatedUser,authorizeRoles('admin'),UpdateProduct);

//delete Product
router.route('/admin/product/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),DeleteProduct);


// ou use delete Product or update product
// router.route('/admin/product/:id')
//             .put(UpdateProduct)
//             .delete(DeleteProduct);


router.route('/review').put(isAuthenticatedUser, createProductReview)
router.route('/reviews').get(isAuthenticatedUser, getProductReviews)
router.route('/reviews').delete(isAuthenticatedUser, deleteReview)


module.exports = router; 