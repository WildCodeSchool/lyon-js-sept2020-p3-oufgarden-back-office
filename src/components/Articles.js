import React from 'react';
import ListArticles from './ListArticles';
import './style/Articles.scss';

require('dotenv').config();

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
