import React, { Fragment, useState, useEffect } from 'react'
//useEffect : It is a function that runs when the state of the data changes
import Pagination from 'react-js-pagination';
//pagination 

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css';//default params


import MetaData from './layout/MetaData'
import Product from './product/Product'
import Loader from './layout/Loader'

import { useDispatch, useSelector } from 'react-redux';
import { getProducts  } from '../actions/productActions';
import { useAlert } from 'react-alert'; 


//slider
const {createSliderWithTooltip} = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const Home = ({match}) => {
  //slider 
   const [price, setPrice]= useState([1,1000]);
  // current page 
  const [currentPage, setCurrentPage] = useState();
  //category selection
  const [category, setCategory]= useState('');
  //rating
  const [rating, setRating] = useState(0);

  //list of categories
  const categories = [
    'Electronics',
    'Cameras',
    'Laptops',
    "Accessories",
    "Headphones",
    'Food',
    'Books',
    'Clothes/Shoes',
    'Beauty/Health',
    'Sports',
    'Outdoor',
    'home'
  ];


    //get data of product id and  generate error message alert
    const alert = useAlert();
    const dispatch = useDispatch();
    const { loading, products, error, productsCount, resPerPage, filteredProductsCount } = useSelector(state => state.products) 
   
    //search product
    const keyword = match.params.keyword
  
    useEffect(()=>{

    //error alert
    if(error) {
        return  alert.error(error);
    }

    //send the request from the backend to get the products
      dispatch(getProducts(keyword, currentPage, price, category, rating));

    },[dispatch, alert, error, currentPage, keyword, price, category, rating]);
    
    



    //setCurrentPageNo
    function setCurrentPageNo(pageNumber){
      setCurrentPage(pageNumber)
    }

     //filteredProductsCount
      let count = productsCount;
      if (keyword) {
        count = filteredProductsCount
       }

    
  return (
    <Fragment>
    {/*<h2 data-text="loading..." className="loading">loading...</h2> */}
        {loading ? <Loader/> :(
         <Fragment>
            <MetaData title={'Buy Best Products Online'} />
                <h1 id="products_heading">Latest Products</h1>
                <section id="products" className="container mt-5">
                    <div className="row">
                        {keyword ? (
                            <Fragment>
                                <div className="col-6 col-md-3 mb-5">
                                     <div className="px-5">
                                        <Range
                                            marks = {{
                                              1:`1$`, 
                                              1000:`1000$`
                                            }}
                                            min = {1}
                                            max = {1000}
                                            defaultValue = {[1,1000]}
                                            tipFormatter={value => `$${value}`}
                                            tipProps={{
                                              placement:"top",
                                              visible: true,
                                            }}
                                            value={price}
                                            onChange={price => setPrice(price)}
                                        />
                                        <hr className="my-5"/>

                                        <div className="mt-5">
                                          <h4 className="mb-3">
                                           Categories
                                          </h4>
                                           <ul className="pl-0">
                                              {categories.map(category =>(
                                                <li style={{cursor:'pointer',
                                                            listStyleType:'none'
                                                          }}
                                                          key={category}
                                                          onClick={()=>setCategory(category)}
                                                          >
                                                          {category}
                                                </li>
                                              ))}
                                           </ul>
                                        </div>

                                        <hr className="my-5"/>

                                        <div className="mt-5">
                                          <h4 className="mb-3">
                                          Ratings
                                          </h4>
                                           <ul className="pl-0">
                                              {[1,2,3,4,5].map(star=>(
                                                <li style={{cursor:'pointer',
                                                            listStyleType:'none'
                                                          }}
                                                          key={star}
                                                          onClick={()=>setRating(star)}
                                                          >
                                                      <div className="rating-outer">
                                                         <div className="rating-inner"
                                                         style={{width:`${star * 20}%`,}}
                                                         >
                                                         
                                                         </div>
                                                      </div>
                                                </li>
                                              ))}
                                           </ul>
                                        </div>
                                     </div>
                                </div>

                                <div className="col-6 col-md-9">
                                   <div className="row">
                                        { 
                                           products && products.map(product =>(
                                           //get product component 
                                          <Product key={product._id} product={product}  col={4}/>
                                          
                                          ))
                                        }
                                    </div>
                                </div>
                            </Fragment>
                        ):(
                             products && products.map(product =>(
                                //get product component 
                                <Product key={product._id} product={product} col={3} />
                             ))
                        )}
                    
                   
                        
                    </div>
                </section>
                {/*affiche  current Page if  number of products[4] in page > number of products*/}
                {resPerPage < count && (
                  <div className="d-flex justify-content-center mt-5">
                      <Pagination
                          activePage={currentPage}
                          itemsCountPerPage={resPerPage}
                          totalItemsCount={productsCount}
                          onChange={setCurrentPageNo}
                          nextPageText={'Next'}
                          prevPageText={'Prev'}
                          firstPageText={'First'}
                          lastPageText={'Last'}
                          itemClass="page-item"
                          linkClass="page-link"
                      />
                  </div>
              )}
               
         </Fragment>)}
    </Fragment>
  )
}

export default Home
