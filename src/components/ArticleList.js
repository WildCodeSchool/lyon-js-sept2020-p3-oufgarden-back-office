/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';

import { MdDelete, MdEdit } from 'react-icons/md';
import { IconContext } from 'react-icons';
import { useToasts } from 'react-toast-notifications';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ButtonListCreation from './ButtonListCreation';

import { getCollection, makeEntityDeleter } from '../services/API';
import './style/ListArticles.scss';

const ArticleList = (props) => {
  const [articles, setArticles] = useState([]);
  const [articlesFiltered, setArticlesFiltered] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const { addToast } = useToasts();

  useEffect(() => {
    getCollection('articles').then((elem) => {
      setArticles(elem);
    });
  }, []);

  useEffect(() => {
    getCollection('tags').then((data) => setAllTags(data));
  }, []);

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirmez la suppression',
      message: 'Etes vous sûr de vouloir supprimer cet article ?',
      buttons: [
        {
          label: 'Confirmer',
          onClick: async () => {
            try {
              await makeEntityDeleter('articles')(id);
              getCollection('articles').then((elem) => {
                setArticles(elem);
                addToast('Article supprimé avec succès', {
                  appearance: 'success',
                  autoDismiss: true,
                });
              });
            } catch (err) {
              addToast(
                "Un problème est survenu lors de la suppression de l'article",
                {
                  appearance: 'error',
                  autoDismiss: true,
                }
              );
            }
          },
        },
        {
          label: 'Annuler',
          onClick: () => null,
        },
      ],
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
    <div className="articleListContainer">
      <ButtonListCreation
        attributes={{
          list: '/articles',
          creation: '/articles/creation',
          name: 'Article',
          names: 'Articles',
        }}
      />

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
      <div className="container-to-color-rows-articles">
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
