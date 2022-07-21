//Mine UnderStanding is clear for this file
import React, { Fragment, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import "./productDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, getProductDetails } from "../../Actions/productAction";
import { useParams } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import man from "../../Images/attire 2.webp";
import ReviewCard from "./ReviewCard.js";
import Spinner from "../layout/Loaders/Spinner";
import { useAlert } from "react-alert";

const ProductDetails = ({ match }) => {
  const alert = useAlert();
  //in backend we have req.params.id but in frontend we have match.params.id so to access the route parameters we are using useParams Hook.
  const { id } = useParams();

  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  console.log(product);
  
  // console.log(products);
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(id)); 
  }, [dispatch, id, error, alert]);

  // options for react stars or just a CSS for Stars
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "red",
    size: window.innerWidth < 600 ? 20 : 18,
    value: product.ratings,
    isHalf: true,
  };

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className="ProductDetails">

            {/* Carousel Image container */}
            <div className="box1">
              <Carousel className="caro" animation="slide" duration={800}>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

          {/* Product Information container */}
            <div className="box2">
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span className="detailsBlock-2-span">
                  {" "}
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button>-</button>
                    <input type="number" />
                    <button>+</button>
                  </div>
                  <button disabled={product.Stock < 1 ? true : false}>
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button className="submitReview">Submit Review</button>
            </div>
          </div>
          
          {/*Reviews Rendering for the particular Product */}
          
            
          
          <h3 className="reviewHeading">Reviews</h3>
          {product.reviews  ? ( 
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => <ReviewCard review={review} />)}
            </div>
          ) : (
            <p className="noReview">No Reviews</p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
