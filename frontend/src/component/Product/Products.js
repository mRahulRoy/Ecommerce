//Mine UnderStanding is clear for this file
import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { getProducts, clearErrors } from "../../Actions/productAction";
import Spinner from "../layout/Loaders/Spinner";
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Slider from "@material-ui/core/slider";
import Typography from "@material-ui/core/Typography";
import { useAlert } from "react-alert";
import MetaData from "../layout/MetaData";

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "Smart Phones",
];

const Products = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const params = useParams();//This helps in getting request query/parameter from the url
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 25000]);
  const [category, setCategory] = useState("");
  const [ratings, setRatings] = useState(0);

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };

  useEffect(() => {
    if(error){
      alert.error(error);
      dispatch(clearErrors());
    }
    // getting the product according to the search thats why passing the keyword and page
    dispatch(getProducts(params.keyword, currentPage, price, category,ratings));
  }, [dispatch, params.keyword, currentPage, price, category,ratings,error,alert]);

  let count = filteredProductsCount;
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
        <MetaData title="Products.."/>
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterbox">
         
            <Typography>Price</Typography> {/* Acts as a paragraph */}
            <Slider
              value={price}
              // This onchange automatically passes two arguments to the function priceHandler one is the event itself and the second one is array of size two having starting range and ending range just like this [0,25000]
              onChange={priceHandler}
              valueLabelDisplay="auto"
              areaLabelledBy="range-slider"
              min={0}
              max={25000}
            />
            <Typography>Category</Typography>
            <ul className="categorybox">
              {categories.map((category) => (
                <li
                  className="categoryLink"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

           
              <Typography component="legend">Ratings above</Typography>
              <Slider
              className="ratingabove"
                value={ratings}
                onChange={(e, newRating) => {
                  setRatings(newRating);
                }}
                areaLabelledBy="continous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            
          </div>

          {resultPerPage < count && (
            <div className="paginationBox">
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
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
