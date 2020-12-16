import React from "react";
import { Link } from "react-router-dom";
import ListArticles from "./ListArticles";
import "./style/Articles.scss";
require("dotenv").config();

function Articles() {
  return (
    <div className="Article">
      <div className="List">
        <ListArticles />
      </div>
    </div>
  );
}

export default Articles;
