import React from "react";
import { Link } from "react-router-dom";
import "./style/Navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo"></div>
      <ul>
        <li>
          <Link to="/adherents">Adhérents</Link>
        </li>
        <li>
          <Link to="/garden">Jardins</Link>
        </li>
        <li>
          <Link to="/articles">Articles</Link>
        </li>
        <li>
          <Link to="/category">Catégories</Link>
        </li>
        <li>
          <Link to="/calendar">Agenda</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
