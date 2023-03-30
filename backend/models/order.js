const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    shippingInfo: {
        
        //The place where the order arrives
        address: {
             type: String,
             required: true
        },

        //The place where the order arrives
        city: {
            type: String,
            required: true,
        },
        
        //phone number for user
        phoneNo: {
            type: String,
            required: true
        },

        //postal code  for user
        postalCode: {
           type: String,
           required: true,
        },
        
        // It has not been used at the moment
        country: {
           type: String,
           required: true
        }
    },

    //user info
    user : {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref : 'User'
    },
    
    // product selected
    orderItems : [
        {
            name : {
                 type : String,
                 required: true
            },

            quantity : {
                type : Number,
                required: true
            },

            image : {
                type : String,
                required: true
            },

            price : {
                type : Number,
                required: true
            },

            product : {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref : 'Product'
            }
        }   
    ],

    //payment method
    paymentInfo: {
        id : {
         type : String  
        },
        status: {
            type: String
        }
    },

     //Payment Date
    paidAt : {
        type: Date,
    },

    //price hors tax
    itemsPrice: {
        type: Number,
        required : true,
        default: 0.0
    },

    //tax 
    taxPrice: {
        type: Number,
        required : true,
        default: 0.0
    },

    //Delivery price (Prix ​​de livraison)
    shippingPrice: {
        type: Number,
        required : true,
        default: 0.0
    },

    // itemPrice + tax + Delivery price
    totalPrice: {
        type: Number,
        required : true,
        default: 0.0
    },

    // The condition of the product is in the delivery stage (L'état du produit est en cours de livraison/delevery )
    orderStatus : {
        type: String,
        required : true,
        default: 'Processing'
    },
    

    //La date de réception
    deliveredAt : {
        type: Date
    },

    //The date of application (date de la demande)
    createdAt : {
        type: Date,
        default: Date.now
    }


})


module.exports = mongoose.model('Order', orderSchema);