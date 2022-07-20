import React from "react";
import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import man from "../../Images/attire 2.webp";

const ProductCart = ({ product }) => {
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "red",
    size: window.innerWidth < 600 ? 20 : 18,
    value: product.ratings,
    isHalf: true,
  };
  return (
    <>
      <Link className="productCard" to={`/product/${product._id}`}>
        <img src={man} alt="product" />
        <p>{product.name}</p>
        <div>
          <ReactStars {...options} />{" "}
          <span>({product.numOfReviews} Reviews)</span>
        </div>
        <p>{`$${product.price}`}</p>
      </Link>
    </>
  );
};

export default ProductCart;
