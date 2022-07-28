import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
} from "react-router-dom";
import Profile from "../User/Profile";

const loggedStatus = JSON.parse(window.localStorage.getItem("loggedStatus"));
export const ProtectedRoute = ( {isAuthenticated} ) => {

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Profile />;
};

// export const UpdateProfileProtectedRoute = ({isAuthenticated}) => {
//  if(!isAuthenticated){
//     return <Navigate to={"/login"}/>
//  }
//    return <UpdateProfile/>

// }
