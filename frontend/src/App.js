import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./component/Home/Home";
import Header from "./component/layout/Header/Header.js";
import Footer from "./component/layout/footer/Footer.js";
import webFont from "webfontloader";
import Products from "./component/Product/Products.js";
import ProductDetails from "./component/Product/ProductDetails.js"
import Spinner from "./component/layout/Loaders/Spinner.js";
import NavBar from "./component/layout/Navigation Bar/NavBar";
import { useEffect } from "react";
import "./App.css"






function App() {
  useEffect(() => {
    webFont.load({
      google: {
        families: ["Roboto", "Droid sans", "Chilanka"],
      },
    });
  }, []);

  return (
    <Router>
      <NavBar/>
      <Header />

      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/Home" element={<Home/>} />
        <Route exact path="/product/:id" element={<ProductDetails/>} />
        <Route exact path="/products" element={<Products/>} />
        <Route exact path="/products/:keyword" element={<Products/>} />
       
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
