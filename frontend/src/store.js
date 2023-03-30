import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

//productsReducer
import { productsReducer,productDetailsReducer, newReviewReducer, newProductReducer, productReducer, productReviewsReducer, reviewReducer} from './reducers/productsReducer'
//usersReducer
import {authReducer, userReducer, allUsersReducer, forgotPasswordReducer, userDetailsReducer} from './reducers/userReducer'
// cart reducers
import { cartReducer } from './reducers/cartReducers'
//order 
import { newOrderReducer, allOrdersReducer, myOrdersReducer, OrderDetailsReducer, orderReducer }from './reducers/orderReducers'



const reducer = combineReducers({
  products: productsReducer,
  productDetails: productDetailsReducer,
  newProduct:newProductReducer,
  auth:authReducer,
  user :userReducer,
  allUsers:allUsersReducer,
  userDetails:userDetailsReducer,
  forgotPassword:forgotPasswordReducer,
  cart: cartReducer,
  newOrder:newOrderReducer,
  myOrders:myOrdersReducer,
  orderDetails:OrderDetailsReducer,
  allOrders:allOrdersReducer,
  order:orderReducer,
  newReview:newReviewReducer,
  productReviews:productReviewsReducer,
  review:reviewReducer,
  product:productReducer  //delete product or update
})


let  initialState = {
  cart: {
    cartItems: localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [],
    shippingInfo: localStorage.getItem('shippingInfo')
        ? JSON.parse(localStorage.getItem('shippingInfo'))
        : {}
}
}

const middlware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middlware)))

export default store;