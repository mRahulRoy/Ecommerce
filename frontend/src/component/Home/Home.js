//Mine UnderStanding is clear for this file
import React, { Fragment } from "react";
import { CgMouse } from "react-icons/cg";
import "./HomeStyle.css";
import Product from "./ProductCard.js";
import man from "../../Images/attire 1.webp";
import MetaData from "../layout/MetaData";
import { clearErrors, getProducts } from "../../Actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Spinner from "../layout/Loaders/Spinner";
import { useAlert } from "react-alert";
import Carousel from "react-material-ui-carousel";



const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );

   
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    dispatch(getProducts());

  }, [dispatch, error, alert]);

  return (
    <>
      <Fragment>
        {loading ? (
          <Spinner />
        ) : (
          <Fragment>
            <MetaData title={"Ecommerce"} />
            <div className="banner">
              <p>Welcome to Ecommerce</p>
              <h1>Find Amazing Products Below</h1>
              <a href="#container">
                <button>
                  Scroll <CgMouse />
                </button>
              </a>
            </div>

            {/* Rendering Products-HomePage */}

            <h2 className="homeHeading">Featured Product</h2>

            <div className="container" id="container">
              {products &&
                products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
            </div>
          </Fragment>
        )}
      </Fragment>
    </>
  );
};

export default Home;
