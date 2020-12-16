/* eslint-disable */
/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

require('dotenv').config();

const ListArticles = () => {
  const [articles, setArticles] = useState([]);
  const url = process.env.REACT_APP_API_BASE_URL;

  // useEffect(() => {
  //   axios.get(`${url}/articles`).then((res) => {
  //     setArticles(res.data.result);
  //   });
  // }, [articles]);

  // const handleEdit = (id) => {
  //   axios.update(`${url}/articles/:${id}`).then;
  // };

  // const handleDelete = (id) => {
  //   axios.delete(`${url}/articles/:${id}`).then((res) => {});
  // };

  return (
    <div>
      {/* <ul>
        <li>
          {articles.map((e) => {
            <div key={e.id} className="listArticles">
              {e.title}, {e.text}
              <button
                onClick={() => {
                  handleEdit(e.id);
                }}
              >
                Edit
              </button>
              <button
                onClick={() => {
                  handleDelete(e.id);
                }}
              >
                Delete
              </button>
            </div>;
          })}
        </li>
      </ul> */}
    </div>
  );
};
export default ListArticles;
