const express = require('express');
const route = express.Route;

const { newOrder,
      getSingleOrder ,
      myOrders,
      allOrders, //admin
      UpdateOrder ,//admin
      deleteOrder
      } = require ('../controllers/orderController');


const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth');
const router = require('./auth');

// create new Order
router.route('/order/new').post(isAuthenticatedUser,newOrder);

//get single order
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);

//Get logged in user Orders
router.route('/orders/me').get(isAuthenticatedUser,myOrders);

// Get all Orders   => /api/v1/admin/orders/
router.route('/admin/orders/').get(isAuthenticatedUser ,authorizeRoles('admin'), allOrders);

router.route('/admin/order/:id')
      .put(isAuthenticatedUser ,authorizeRoles('admin'),UpdateOrder)
      .delete(isAuthenticatedUser ,authorizeRoles('admin'),deleteOrder);

module.exports = router;