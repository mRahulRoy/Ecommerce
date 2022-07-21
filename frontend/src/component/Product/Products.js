//Mine UnderStanding is clear for this file
import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, clearErrors } from "../../Actions/productAction";
import Spinner from "../layout/Loaders/Spinner";
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination"

const Products = () => {

  const dispatch = useDispatch();
  const params = useParams();
  const [currentPage,setCurrentPage] = useState(1);
    
  const { products, loading, error, productsCount,resultPerPage } = useSelector(
    (state) => state.products
  );


    const setCurrentPageNo = (e)=>{
        setCurrentPage(e);
    }


  useEffect(() => {
    // getting the product according to the search thats why passing the keyword and page
    dispatch(getProducts(params.keyword,currentPage));
  }, [dispatch, params.keyword,currentPage]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {
                products && products.map((product) => (
                <ProductCard key={product._id} product={product} />
                ))
            }
          </div>
          <div className="paginationBox">
           {
            resultPerPage < productsCount ? (
              <Pagination 
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="First"
                lastPageText="Last"
                itemClass="page-Item"
                linkClass="page-Link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
            />
            ) : ("")
           }
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
