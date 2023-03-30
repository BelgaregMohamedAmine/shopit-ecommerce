const Order = require('../models/order');
const Product = require('../models/product');


const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// create new Order  ==> /api/v1/order/new
exports.newOrder = catchAsyncErrors (async (req, res, next) => {

    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;

    const order = await  Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user : req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
})

// Get single Order   => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  
    const order = await Order.findById(req.params.id).populate("user","name email");
    // populate  == Fill in the boxes automatically

    if(!order){
         return next(new ErrorHandler(`No Order found with this ID` ,404))
    }

    res.status(200).json({
        success: true,
        order
    })

})

// Get logged in user Orders   => /api/v1/orders/me
exports.myOrders= catchAsyncErrors(async (req, res, next) => {
  
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders
    })

})


// Get all Orders    => /api/v1/admin/orders/
exports.allOrders= catchAsyncErrors(async (req, res, next) => {
  
    const orders = await Order.find();

     // total price of orders
    let totalAmount =0;
    
    
    //loop price Orders for users
    orders.forEach(order => {

        totalAmount += order.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })

})


////////////////////////////////////////////////////////////////
// Update / Process order -Admin => /api/v1/admin/order/:id
exports.UpdateOrder= catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

   if(order.status === 'Delivered') {
       return next(new ErrorHandler ('You have already delivered this order',400));
   }
    //update  stock (apple function updateStock(id, quantity))
   order.orderItems.forEach(async item => {
        await  updateStock(item.product, item.quantity)
    })
    
    //update status et date 
    order.orderStatus = req.body.status,
    order.deliveredAt =  Date.now()

    await order.save()

    res.status(200).json({
        success: true,
       
    })

})


//update  stock function 
async function updateStock(id, quantity){
     const product = await Product.findById(id);

    product.stock = product.stock  - quantity;

    await product.save({ validateBeforeSave : false});
}


// delete  Order   => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  
    const order = await Order.findById(req.params.id);
    // populate  == Fill in the boxes automatically

    if(!order){
         return next(new ErrorHandler(`No Order found with this ID` ,404))
    }
    
    await order.remove();
    res.status(200).json({
        success: true
    })

})