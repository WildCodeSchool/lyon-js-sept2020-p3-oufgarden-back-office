import React from 'react';
import { Link } from 'react-router-dom';
import './style/Articles.scss';

require('dotenv').config();

function Articles() {
  return (
    <div className="Article">
      <div className="buttonArticle">
        <button type="button" className="buttonList">
          <Link to="/articles">Listes</Link>
        </button>
        <button type="button" className="buttonArticle">
          <Link to="/articles/creation">Nouvel Article</Link>
        </button>
      </div>
      {/* <div className="List"><ListArticles /></div> */}
    </div>
  );
}

export default Articles;
