import React, { Fragment, useEffect, useState } from "react";
import "./ForgotPassword.css";
import Spinner from "../layout/Loaders/Spinner";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

import { useAlert } from "react-alert";
import { clearErrors, forgotPassword } from "../../Actions/userActions";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import LockIcon from "@material-ui/icons/Lock";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { error, message, loading } = useSelector(
    (state) => state.forgotPassword
  );

  const [email, setEmail] = useState("");

  const forgotPasswordSubmit = (e) => {
    const myForm = new FormData();
    e.preventDefault();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      console.log(error);
      dispatch(clearErrors());
    }
   
    if (message) {
      alert.success(message);
    }
  }, [dispatch, error, alert, message] );
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <MetaData title="Forgot Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2>Forgot Password</h2>
              <form
                className="updatePasswordForm"
                onSubmit={forgotPasswordSubmit}
              >
                <div className="updatePasswordEmail">
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

                <input
                  type="submit"
                  value="updatePassword"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ForgotPassword;
