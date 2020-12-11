import React from "react";
import { Link } from "react-router-dom";
import TextEditor from "./TextEditor";
import "./style/TextEditor.scss";
// import "./style/Articles.scss";

const ArticleCreation = () => {
  return (
    <div>
      <div className="buttons">
        <button className="buttonList">
          <Link to="/articles">Listes</Link>
        </button>
        <button className="buttonArticle">
          <Link to="/articles/creation">Nouvel Article</Link>
        </button>
      </div>
      <div className="TextEditor">
        <div className="Editor">
          <TextEditor />
        </div>
      </div>
    </div>
  );
};

export default ArticleCreation;
