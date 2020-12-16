import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { MdDelete, MdEdit } from 'react-icons/md';
import { IconContext } from 'react-icons';
// import axios from "axios";
// require("dotenv").config();

import { getCollection, makeEntityDeleter } from '../services/API';
import './style/ListArticles.scss';

const ListArticles = (props) => {
  const [articles, setArticles] = useState([]);
  const [articlesFilterd, setArticlesFilterd] = useState([]);
  const [tagList, setTagList] = useState([]);

  useEffect(() => {
    const request = getCollection('articles').then((elem) => {
      console.log(elem);
      setArticles(elem);
    });
  }, []);

  const handleDelete = async (id) => { 
    await makeEntityDeleter('articles')(id);
    getCollection('articles').then((elem) => {
      console.log(elem);
      setArticles(elem);
    });
  };

  const handleTagFilter = () => {
    const request = getCollection('tagToArticle')
    .then((result) => {
      const articleToFilter = result.filter(article => { 
        if (tagList.includes(article.tag_id)) {
          return true
        } else { return false }
      }).map(article => { 
          return article.article_id
        });
        setArticlesFilterd(result);
    });
  };



  const handleTagList = (target) => {
    if (tagList.includes(+target.id)) {
      let newTagList = tagList.filter((item) => item !== +target.id);
      setTagList(newTagList);
    } else {
      setTagList((prevState) => [...prevState, +target.id]);
    }
    if (target.className !== 'filterBtn-on') {
      target.className = 'filterBtn-on';
    } else {
      target.className = 'filterBtn-off';
    }
  };

  const handleEdit = (id) => { 
    props.history.push(`/articles/creation/${id}`);
  };



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
      <div className='filterContainer'>
        {/* <p>Filter on : </p> */}
        <button
          id='1'
          className='filterBtn-on'
          onClick={(e) => handleTagList(e.target)}
        >Biodiversité
        </button>
      </div>
      <div className="articleListContainer">
        {articlesFilterd.length > 0 ? (
          articles.filter((article) => {
            if (articlesFilterd.includes(article.id)) {
              return true
            } else {
              return false
            }
            }).map((e) => {
              return (
                <div key={e.id} className="ArticlesRow">
                  <div className="articlesInfos">
                    <p>
                      {e.title} {e.text}
                    </p>
                  </div>
                  <div className="articleListIcons">
                    <IconContext.Provider value={{ className: 'react-icons' }}>
                      <MdEdit size={25} onClick={() => {
                        handleEdit(e.id);
                      }}/>
                      <MdDelete size={25} onClick={() => {
                        handleDelete(e.id);
                      }}/>
                    </IconContext.Provider>
                  </div>
                </div>
          )})
          ) : ( {articles.map((e) => {
            return (
              <div key={e.id} className="ArticlesRow">
                <div className="articlesInfos">
                  <p>
                    {e.title} {e.text}
                  </p>
                </div>
                <div className="articleListIcons">
                  <IconContext.Provider value={{ className: 'react-icons' }}>
                    <MdEdit size={25} onClick={() => {
                      handleEdit(e.id);
                    }}/>
                    <MdDelete size={25} onClick={() => {
                      handleDelete(e.id);
                    }}/>
                  </IconContext.Provider>
                </div> 
              </div> )
            })
        }
      </div>
    </div>
  );
};
export default ListArticles;
