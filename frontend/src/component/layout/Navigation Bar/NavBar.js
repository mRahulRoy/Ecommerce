import React, { Fragment, useState } from "react";
import { Link, NavLink ,useParams,useNavigate} from "react-router-dom";

import "./navbar.css";
import adwaitLogo from "../../../Images/logo.png";
import { BsCart3 } from "react-icons/bs";


import {
  AiFillInstagram,
  AiOutlineTwitter,
  AiFillFacebook,
} from "react-icons/ai";


const NavBar = () => {
  
  const [keyword,setKeyword] = useState("");
  const navigate = useNavigate()

  const searchSubmitHandler = (e)=>{
    
    e.preventDefault();
    if(keyword.trim()){
      navigate(`/products/${keyword}`)
    }else{
      navigate(`/products`)

    }
  }
  const loggedStatus = "Sign in";
  return (
    <Fragment>
      <div className="preNav">
        <div className="socials">
          <a href="#">
           
            <AiFillInstagram className="social-icon" />
          </a>
          <a href="#">
           
            <AiOutlineTwitter className="social-icon" />
          </a>
          <a href="#">
           
            <AiFillFacebook className="social-icon" />
          </a>
        </div>
        <div className="navsupport">
          <span>Delivery</span>
          <span>Help</span>
          <span>Language</span>
        </div>
      </div>
      <div className="navContainer">
        <div className="left">
          <img src={adwaitLogo} alt="" />
        </div>

        <div className="center">
          <form className="searchBox"  onSubmit={searchSubmitHandler}>
            <input
              type="text"
              placeholder="Enter Search"
             
              onChange={(e)=> setKeyword(e.target.value)}
            />
          <input type="submit" value="Search"/>
          </form>
        </div>

        <div className="right">
          <div className="login">
            <span>Hello,{loggedStatus}</span>
          </div>

          <div className="navCartIcon">
            <BsCart3 className="cartIcon" />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default NavBar;
