import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loadUser } from "../../Actions/userActions";
import { userReducer } from "../../Reducers/userReducer";
import MetaData from "../layout/MetaData";
import Spinner from "../layout/Loaders/Spinner";
import "./Profile.css";

const Profile = () => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  // console.log(user.createdAt);
  console.log(user);

  useEffect(() => {
    if (isAuthenticated === false) {
      Navigate("/login");
    }
   
  }, [Navigate, isAuthenticated]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <MetaData title={`${user.name} profile`} />
          <div className="profileContainer">
            <div>
              <h1>My Profile</h1>
              <img src={user.avatar.url} alt={userReducer.name} />
              <Link to="/me/update">Edit Profile</Link>
            </div>
            <div>
              <div>
                <h4>Full Name</h4>
                <p>{`${user.name}`}</p>
              </div>
              <div>
                <h4>Email</h4>
                <p>{`${user.email}`}</p>
              </div>
              <div>
                <h4>Joined on</h4>
                <p>{String(user.createdAt).substr(0, 10)}</p>
              </div>

              <div>
                <Link to="/orders">My Orders</Link>
                <Link to="/password/update">Change Password</Link>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Profile;
