import React from "react";
import ReactStars from "react-rating-stars-component";
import man from "../../Images/attire 2.webp";

const ReviewCard = ({ review }) => {
  const options = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "red",
    size: window.innerWidth < 600 ? 20 : 18,
    value: review.rating,
    isHalf: true,
  };
  console.log(review)
  return (
    <div className="reviewCard">
      <img src={man} alt="user" />
      <p className="review">{review.name}</p>
      <ReactStars {...options} />
      <span>{review.comment}</span>
    </div>
  );
};

export default ReviewCard;
