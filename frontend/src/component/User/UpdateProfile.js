import React, { Fragment, useRef, useEffect, useState } from "react";
import "./UpdateProfile.css";
import Loader from "../layout/Loaders/Spinner";
import { Link, Navigate, useNavigate } from "react-router-dom";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import { useSelector, useDispatch } from "react-redux";
import profileImage from "../../Images/profile.jpg";
import MetaData from "../layout/MetaData";
import {
  clearErrors,
  loadUser,
  updateProfile,
} from "../../Actions/userActions";

import { useAlert } from "react-alert";
import { UPDATE_PROFILE_RESET } from "../../Constants/userConstants";
import Spinner from "../layout/Loaders/Spinner";

const UpdateProfile = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("/profile");
  const [avatarPreview, setAvatarPreview] = useState("/defaultProfile.png");

  const updateProfileSubmit = (e) => {
  
    const myForm = new FormData();
    e.preventDefault();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("avatar", avatar);
    dispatch(updateProfile(myForm));
    
  };

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      console.log(error);
      dispatch(clearErrors());
    }
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
    }
    if (isUpdated) {
      alert.success("User Updated Succesfully");
      dispatch(loadUser());
      Navigate("/account");
      dispatch({ type: UPDATE_PROFILE_RESET });
    }
  }, [dispatch, error, alert, Navigate, user, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <MetaData title="Update Profile" />
          <div className="updateProfileContainer">
            <div className="updateProfileBox">
              <h2>Update Password</h2>
              <form
                className="updateProfileForm"
                encType="multipart/form-data"
                onSubmit={updateProfileSubmit}
              >
                <div className="updateProfileName">
                  <FaceIcon />
                  <input
                    type="text"
                    required
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="updateProfileEmail">
                  <MailOutlineIcon />
                  <input
                    type="emaill"
                    required
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>

                <div id="updateProfileImage">
                  <img src={avatarPreview} alt="profile" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={updateProfileDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="updateProfile"
                  className="updateProfileBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdateProfile;
