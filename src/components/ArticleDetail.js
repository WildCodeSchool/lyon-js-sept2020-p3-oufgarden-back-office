import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import {
  getEntity,
  getCollection /* , makeEntityDeleter  */,
} from '../services/API';
import './style/ArticleDetail.scss';

import CommentList from './CommentList';

const URL = process.env.REACT_APP_API_BASE_URL;

const ArticleDetail = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const { id } = props.match.params;
  const [articlesDetails, setArticlesDetails] = useState(undefined);

  const [comments, setComments] = useState([]);

  useEffect(() => {
    getEntity('articles', id).then((elem) => {
      setArticlesDetails(elem);
    });
  }, []);

  useEffect(() => {
    getCollection('comments', { article_id: id }).then((elem) => {
      setComments(elem);
    });
  }, []);

  const refresh = () => {
    getCollection('comments', { article_id: id }).then((elem) => {
      setComments(elem);
    });
  };

  return (
    <div className="articleDetailsPage">
      {articlesDetails && (
        <div className="articlesDetails">
          <img
            className="imgArticleDetails"
            src={`${URL}/${articlesDetails.row.url}`}
            alt="jardin"
          />
          <div className="whitebar">
            <div className="back-home">
              <Link className="link-back-feed" to="/articles">
                <div className="back-arrow" />
                <div className="retour">Retour</div>
              </Link>
            </div>
          </div>
          <div className="article-tags">
            {articlesDetails.tag &&
              articlesDetails.tag.map((t) => {
                return (
                  <div key={t.id}>
                    <div className="tag-of-article">{t.name}</div>
                  </div>
                );
              })}
          </div>
          <div className="fullText">
            <div className="title">{articlesDetails.row.title}</div>
            <div className="content">
              {ReactHtmlParser(articlesDetails.row.content)}
            </div>
          </div>
          <div className="article-garden">
            <div className="garden-image" />
            {articlesDetails.garden &&
              articlesDetails.garden.map((t) => {
                return (
                  <div key={t.id}>
                    <div className="garden-of-article">{t.name}</div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="comments">
        <div className="comments-title">
          <div className="speech-bubble" />
          <h4>Commentaires</h4>
        </div>
        <CommentList
          comments={comments}
          setComments={setComments}
          refresh={refresh}
        />
      </div>
    </div>
  );
};

export default ArticleDetail;
