import React, { Fragment } from "react";
import { CgMouse } from "react-icons/cg";
import "./HomeStyle.css";
import Product from "./ProductCart.js";
import man from "../../Images/attire 2.webp";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../Actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import Spinner from "../layout/Loaders/Spinner";
import { useAlert } from "react-alert";

const product = {
  name: "laptop",
  image: [{ url: man }],
  price: "$1000",
  _id: "rahul12122",
};
const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );
  console.log()
  useEffect(() => {
    if (error) {
       alert.error(error);
      dispatch(clearErrors);

    }
    dispatch(getProduct());
  }, [dispatch, error,alert]);

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

            <h2 className="homeHeading">Featured Product</h2>

            <div className="container" id="container">
              {products &&
                products.map((product) => <Product key={product._id}  product={product} />)}
            </div>
          </Fragment>
        )}
      </Fragment>
    </>
  );
};

export default Home;
