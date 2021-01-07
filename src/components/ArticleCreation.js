import React, { useEffect, useState } from 'react';

import { useHistory, Link } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import Select from 'react-select';

import { makeEntityAdder, getCollection } from '../services/API';

import './style/ArticleCreation.scss';

const ArticleCreation = () => {
  const textEditorApi = process.env.REACT_APP_TEXT_EDITOR_API;
  const [articleContent, setArticleContent] = useState('');
  const [title, setTitle] = useState('');
  const [urlImage, setUrlImage] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [tagsArray, setTagsArray] = useState([]);
  const [gardenList, setGardenList] = useState([]);
  const [gardenArray, setGardenArray] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getCollection('tags').then((data) => setAllTags(data));
  }, []);
  useEffect(() => {
    getCollection('garden').then((data) => setGardenList(data));
  }, []);

  const handleEditorChange = (content) => {
    setArticleContent(content);
  };
  const tagOptions = allTags.map((elem) => {
    return {
      value: elem.id,
      label: `${elem.name}`,
    };
  });
  const gardenOptions = gardenList.map((elem) => {
    return {
      value: elem.id,
      label: `${elem.name}`,
    };
  });

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleImage = (e) => {
    setUrlImage(e.target.value);
  };

  const handleClick = async () => {
    const data = {
      content: articleContent,
      title,
      url: urlImage,
      tagsArray,
      gardenArray,
    };
    console.log(data);
    await makeEntityAdder('articles')(data);
    setArticleContent('');
    setTitle('');
    setUrlImage('');
    setGardenArray([]);
    history.push('/articles');
  };

  const handleSelectTagChange = (elem) => {
    if (!elem) {
      setTagsArray([]);
    } else {
      setTagsArray(elem.map((e) => e.value));
    }
  };
  const handleSelectGardenChange = (elem) => {
    if (!elem) {
      setGardenArray([]);
    } else {
      setGardenArray(elem.map((e) => e.value));
    }
  };

  return (
    <div className="ArticleCreationContainer">
      <div className="buttonNav">
        <button type="button" className="buttonList">
          <Link to="/articles">Liste Articles</Link>
        </button>
        <button type="button" className="buttonArticle">
          <Link to="/articles/creation">Nouvel Article</Link>
        </button>
      </div>
      <div className="EditorContainer">
        <input className="Title" placeholder="Titre" onChange={handleTitle} />
        <input
          className="Image"
          placeholder="url de l'image"
          onChange={handleImage}
        />
        <Editor
          apiKey={textEditorApi}
          initialValue=""
          init={{
            height: 500,
            menubar: false,
            plugins: [
              'advlist autolink lists link image charmap print preview anchor',
              'searchreplace visualblocks code fullscreen',
              'insertdatetime media table paste code help wordcount',
            ],
            toolbar:
              // eslint-disable-next-line no-multi-str
              'undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help',
          }}
          onEditorChange={handleEditorChange}
        />
        <Select
          isMulti
          name="garden"
          placeholder="Choisissez votre jardin"
          options={gardenOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(e) => {
            handleSelectGardenChange(e);
          }}
        />
        <Select
          isMulti
          name="tags"
          placeholder="Votre tag ici"
          options={tagOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={(e) => {
            handleSelectTagChange(e);
          }}
        />

        <button type="button" className="sendButton" onClick={handleClick}>
          Créer
        </button>
      </div>
    </div>
  );
};

export default ArticleCreation;
