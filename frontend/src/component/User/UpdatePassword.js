import React, { Fragment, useEffect, useState } from "react";
import "./UpdatePassword.css";
import Spinner from "../layout/Loaders/Spinner";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layout/MetaData";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from "../../Constants/userConstants";
import { clearErrors, updatePassword } from "../../Actions/userActions";
import VpnKeyIcon from "@material-ui/icons/VpnKey"
import LockOpenIcon from "@material-ui/icons/LockOpen"
import LockIcon from "@material-ui/icons/Lock"
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updatePasswordSubmit = (e) => {
    const myForm = new FormData();
    e.preventDefault();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);
   
    dispatch(updatePassword(myForm));
  };


  useEffect(() => {
    if (error) {
      alert.error(error);
      console.log(error);
      dispatch(clearErrors());
    }
    
    if (isUpdated) {
      alert.success("Password Updated Succesfully");
      Navigate("/account");
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }
  }, [dispatch, error, alert, Navigate, isUpdated]);

  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <MetaData title="Update Profile" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2>Update Profile</h2>
              <form
                className="updatePasswordForm"
                encType="multipart/form-data"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <VpnKeyIcon />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="old Password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon/>
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="new Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="loginPassword">
                  <LockIcon />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <input
                  type="submit"
                  value="Change"
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

export default UpdatePassword;
