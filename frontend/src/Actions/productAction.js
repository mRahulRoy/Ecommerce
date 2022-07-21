import {
  ALL_PRODUCT_FAIL,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_REQUEST,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_REQUEST,
  CLEAR_ERRORS,
} from "../Constants/productConstants";

import axios from "axios";

export const getProducts = (keyword="",currentPage=1) => async (dispatch,getState) => {

  try {

    dispatch({
      type: ALL_PRODUCT_REQUEST,
    });
    let link = `/api/v1/products/?keyword=${keyword}&page=${currentPage}`;
    console.log(link)
    const { data } = await axios.get(link);
    
    dispatch({
      type: ALL_PRODUCT_SUCCESS,
      payload: data,
    });
    console.log(data)
    console.log(getState())
  } catch (error) {

    dispatch({
      type: ALL_PRODUCT_FAIL,
      payload: error.message,
    });
  }
};



export const getProductDetails = (id) => async (dispatch) => {
 
  try {
    dispatch({
      type: PRODUCT_DETAILS_REQUEST,
    });
    // getting a particular product data from the database based on the product id.
    const { data } = await axios.get(`/api/v1/product/${id}`);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data.product,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.message,
    });
  }
};

//Clearing errors
export const clearErrors = () => async (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
