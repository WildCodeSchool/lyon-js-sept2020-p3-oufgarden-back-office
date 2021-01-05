import React from 'react';
import { Link } from 'react-router-dom';
import TextEditor from './TextEditor';

import './style/ArticleCreation.scss';

const ArticleCreation = () => {
  return (
    <div className="CreationArticle">
      <div className="buttonNav">
        <button type="button" className="buttonList">
          <Link to="/articles">Listes</Link>
        </button>
        <button type="button" className="buttonArticle">
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
