import React from "react";
import "../footer/footerstyle.css";
const Footer = () => {
  return (
    <div className="footerContainer">
      <div className="left">
        <h3>DOWNLOAD OUR APP</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut provident
          vero est commodi soluta eveniet!
        </p>
      </div>
      <div className="middle">
        <h3>ECOMMEREC</h3>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ut provident
          vero est commodi soluta eveniet!
        </p>
      </div>
      <div className="right">
        <h3>DOWNLOAD OUR APP</h3>
        <div className="links">
          <a href="#ddd">Insta </a>
          <a href="#ddd">facebook </a>
          <a href="#ddd">Twitter </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
