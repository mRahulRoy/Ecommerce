import React, { Fragment, useEffect, useRef, useState } from "react";
import "./LoginSignup.css";
import Loader from "../layout/Loaders/Spinner";
import { Link, Navigate, useNavigate } from "react-router-dom";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import FaceIcon from "@material-ui/icons/Face";
import { useSelector, useDispatch } from "react-redux";
import profileImage from "../../Images/profile.jpg";
import { clearErrors, login, register } from "../../Actions/userActions";
import { useAlert } from "react-alert";


const LoginSignUp = () => {
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { error, loading, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const alert = useAlert();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [avatar, setAvatar] = useState("/profile");
  // here the slash / will automatically look for the image in the src's public folder
  const [avatarPreview, setAvatarPreview] = useState("/defaultProfile.png");

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = user;
  const loginTab = useRef(null);
  const registerTab = useRef(null);
  const switcherTab = useRef(null);

  const loginSubmit = (e) => {
    e.preventDefault();
    dispatch(login(loginEmail, loginPassword));
  };

  const registerSubmit = (e) => {

    const myForm = new FormData();
    e.preventDefault();
    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("password", password);
    myForm.set("avatar", avatar);
    dispatch(register(myForm));
  };

  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
          setAvatarPreview(reader.result);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      //This is just setting the values , if name is email then email value will be store like this email : value and goes same for other values
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };
 

  useEffect(() => {
    if (error) {
      alert.error(error);
      console.log(error);
      dispatch(clearErrors());
    }
    if(isAuthenticated){
      Navigate("/account")
    }
    
  }, [dispatch, error, alert, Navigate,isAuthenticated]);

  const switchTabs = (e, tab) => {
    if (tab === "Login") {
      switcherTab.current.classList.add("shiftToNeutral");
      switcherTab.current.classList.remove("shiftToRight");

      registerTab.current.classList.remove("shiftToNeutralForm");
      loginTab.current.classList.remove("shiftToLeft");
    }
    if (tab === "Register") {
      switcherTab.current.classList.add("shiftToRight");
      switcherTab.current.classList.remove("shiftToNeutral");

      registerTab.current.classList.add("shiftToNeutralForm");
      loginTab.current.classList.add("shiftToLeft");
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <div className="loginSignUpContainer">
            <div className="login-signup-box">
              <div>
                <div className="login-signup-toggle">
                  <p onClick={(e) => switchTabs(e, "Login")}>Login</p>
                  <p onClick={(e) => switchTabs(e, "Register")}>Register</p>
                </div>
                <button ref={switcherTab}></button>
              </div>


              <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                <div className="loginEmail">
                  <MailOutlineIcon />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    placeholder="Enter Email"
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <Link to="/password/forgot">Forgot Password ?</Link>
                <input type="submit" value="Login" className="loginBtn" />
              </form>

              <form
                className="signupForm"
                ref={registerTab}
                encType="multipart/form-data"
                onSubmit={registerSubmit}
              >
                <div className="signupName">
                  <FaceIcon />
                  <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signupEmail">
                  <MailOutlineIcon />
                  <input
                    type="emaill"
                    placeholder="Email"
                    name="email"
                    onChange={registerDataChange}
                  />
                </div>
                <div className="signupPassword">
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="password"
                    name="password"
                    onChange={registerDataChange}
                  />
                </div>

                <div id="registerImage">
                  <img src={avatarPreview} alt="profile" />
                  <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={registerDataChange}
                  />
                </div>
                <input
                  type="submit"
                  value="Register"
                  className="signupBtn"
                  //   disabled={loading ? true : false}
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default LoginSignUp;
