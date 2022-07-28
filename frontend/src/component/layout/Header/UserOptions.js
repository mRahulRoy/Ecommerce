import React, { Fragment, useState } from "react";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { logout } from "../../../Actions/userActions";
import Backdrop from "@material-ui/core/Backdrop";
import "./userOptions.css";

const UserOptions = ({ user }) => {

  const Navigate = useNavigate();

 console.log("Fandu")
  const alert = useAlert();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  //Getting the logged in user's Data
  const loggedUser = JSON.parse(window.localStorage.getItem("loggedUserDetails"));
  console.log(loggedUser)

  function dashboard() {
    Navigate("/dashboard");
  }
  function orders() {
    Navigate("/orders");
  }
  function account() {
    Navigate("/account");
  }
  function logoutUser() {
    dispatch(logout());
    alert.success("Logout Succesful");
    Navigate("/");
  }

  const options = [
    { icon: <ListAltIcon />, name: "Orders", func: orders },
    { icon: <PersonIcon />, name: "Profile", func: account },
    { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser },
  ];

  if (loggedUser.user.role === "admin") {
    options.unshift({
      icon: <DashboardIcon />,
      name: "Dashoard",
      func: dashboard,
    });
  }

  return (
    <Fragment>
      <Backdrop open={open} style={{ zIndex: "10" }} />
      <SpeedDial
        className="speedDial"
        ariaLabel='="speedDial tooltip example'
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        direction="down"
        open={open}
        icon={<img className="speedDialIcon" src={user.avatar.url} alt="Profile" />}
      >
        {options.map((item, index) => (
          <SpeedDialAction
            key={index}
            icon={item.icon}
            tooltipTitle={item.name}
            onClick={item.func}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
};

export default UserOptions;
