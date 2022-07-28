import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./component/Home/Home";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/footer/Footer.js";
import webFont from "webfontloader";
import Products from "./component/Product/Products.js";
import ProductDetails from "./component/Product/ProductDetails.js";
import Spinner from "./component/layout/Loaders/Spinner.js";
import NavBar from "./component/layout/Navigation Bar/NavBar";
import { useEffect } from "react";
import "./App.css";
import LoginSignUp from "./component/User/LoginSignUp";
import store from "./store";
import { loadUser } from "./Actions/userActions";
import UserOptions from "./component/layout/Header/UserOptions.js";
import Profile from "./component/User/Profile.js";
import UpdateProfile from "./component/User/UpdateProfile.js";
import UpdatePassword from "./component/User/UpdatePassword.js";
import ForgotPassword from "./component/User/ForgotPassword.js";
import { useDispatch, useSelector } from "react-redux";
import { ProtectedRoute } from "./component/Routes/ProtectedRoute.js";

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid sans", "Chilanka"],
      },
    });
    if (isAuthenticated) {
      dispatch(loadUser());
    }
  }, []);

  return (
    <Router>
      <Header />
      <NavBar />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<LoginSignUp />} />

        <Route exact path="/product/:id" element={<ProductDetails />} />

        <Route exact path="/products" element={<Products />} />
        <Route exact path="/products/:keyword" element={<Products />} />

        <Route
          exact
          path="/account"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route exact path="/password/update" element={<UpdatePassword />} />
        <Route exact path="/password/forgot" element={<ForgotPassword />} />

        <Route exact path="/me/update" element={<UpdateProfile />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
