import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { getProduct, clearErrors } from "../../Actions/productAction";
import Spinner from "../layout/Loaders/Spinner";
import ProductCard from "../Home/ProductCart";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination"
const Products = () => {
  const dispatch = useDispatch();
  const params = useParams();
    const [currentPage,setCurrentPage] = useState(1);
    console.log(currentPage);
  const { products, loading, error, productsCount,resultPerPage } = useSelector(
    (state) => state.products
  );
    console.log(resultPerPage);
    console.log(productsCount);
    const setCurrentPageNo = (e)=>{
        console.log(e);
        setCurrentPage(e);
    }


  useEffect(() => {
    dispatch(getProduct(params.keyword,currentPage));
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
