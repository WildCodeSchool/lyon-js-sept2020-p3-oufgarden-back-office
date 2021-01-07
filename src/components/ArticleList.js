/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { IconContext } from 'react-icons';

import { getCollection, makeEntityDeleter } from '../services/API';
import './style/ListArticles.scss';

const ArticleList = (props) => {
  const [articles, setArticles] = useState([]);
  const [articlesFiltered, setArticlesFiltered] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    getCollection('articles').then((elem) => {
      console.log(elem);
      setArticles(elem);
    });
  }, []);
  useEffect(() => {
    getCollection('tags').then((data) => setAllTags(data));
  }, []);

  const handleDelete = async (id) => {
    await makeEntityDeleter('articles')(id);
    getCollection('articles').then((elem) => {
      setArticles(elem);
    });
  };

  useEffect(() => {
    getCollection('tagToArticle').then((result) => {
      const articleToFilter = result
        .filter((article) => {
          if (tagList.includes(article.tag_id)) {
            return true;
          }
          return false;
        })
        .map((article) => {
          return article.article_id;
        });
      setArticlesFiltered(articleToFilter);
    });
  }, [tagList]);

  const handleTagList = (target) => {
    if (tagList.includes(+target.id)) {
      const newTagList = tagList.filter((item) => item !== +target.id);
      setTagList(newTagList);
    } else {
      setTagList((prevState) => [...prevState, +target.id]);
    }
  };
  const handleEdit = (id) => {
    props.history.push(`/articles/${id}`);
  };
  return (
    <div>
      <div className="articleListContainer">
        <div className="buttons">
          <button type="button" className="buttonList">
            <Link to="/articles">Liste Articles</Link>
          </button>
          <button type="button" className="buttonArticle">
            <Link to="/articles/creation">Nouvel Article</Link>
          </button>
        </div>
        <div className="filterContainer">
          {allTags &&
            allTags.map((tag) => {
              return (
                <div key={tag.id}>
                  <button
                    type="button"
                    className="filterButton"
                    id={tag.id}
                    onClick={(e) => handleTagList(e.target)}
                  >
                    {tag.name}
                  </button>
                </div>
              );
            })}
        </div>
        {articlesFiltered.length > 0
          ? articles
              .filter((article) => {
                if (articlesFiltered.includes(article.id)) {
                  return true;
                }
                return false;
              })
              .map((e) => {
                return (
                  <div key={e.id} className="ArticlesRow">
                    <div className="articlesInfos">
                      <p>
                        {e.title} {e.text}
                      </p>
                    </div>
                    <div className="articleListIcons">
                      <IconContext.Provider
                        value={{ className: 'react-icons' }}
                      >
                        <MdEdit
                          size={25}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            handleEdit(e.id);
                          }}
                        />
                        <MdDelete
                          size={25}
                          onClick={() => {
                            handleDelete(e.id);
                          }}
                        />
                      </IconContext.Provider>
                    </div>
                  </div>
                );
              })
          : articles.map((e) => {
              return (
                <div key={e.id} className="ArticlesRow">
                  <div className="articlesInfos">
                    <p>
                      {e.title} {e.text}
                    </p>
                  </div>
                  <div className="articleListIcons">
                    <IconContext.Provider value={{ className: 'react-icons' }}>
                      <MdEdit
                        size={25}
                        onClick={() => {
                          handleEdit(e.id);
                        }}
                      />
                      <MdDelete
                        size={25}
                        onClick={() => {
                          handleDelete(e.id);
                        }}
                      />
                    </IconContext.Provider>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};
export default ArticleList;
