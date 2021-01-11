import React, { useEffect, useState } from 'react';

import { useHistory, Link } from 'react-router-dom';

import { Editor } from '@tinymce/tinymce-react';
import Select from 'react-select';
import dayjs from 'dayjs';
import {
  makeEntityAdder,
  getCollection,
  getEntity,
  makeEntityUpdater,
} from '../services/API';

import './style/ArticleCreation.scss';

const ArticleCreation = (props) => {
  const textEditorApi = process.env.REACT_APP_TEXT_EDITOR_API;
  const [articleContent, setArticleContent] = useState('');
  const [title, setTitle] = useState('');
  const [urlImage, setUrlImage] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [tagsArray, setTagsArray] = useState([]);
  const [gardenList, setGardenList] = useState([]);
  const [gardenArray, setGardenArray] = useState([]);
  const [update, setUpdate] = useState('');
  const history = useHistory();
  const {
    match: {
      params: { id },
    },
  } = props;
  useEffect(() => {
    if (id) {
      getEntity('articles', id).then((data) => {
        console.log(data);
        if (data.row) {
          setArticleContent(data.row.content);
          setUrlImage(data.row.url);
          setTitle(data.row.title);
        } else {
          setArticleContent(data.content);
          setUrlImage(data.url);
          setTitle(data.title);
        }
      });
      setUpdate(true);
    }
  }, [id]);

  useEffect(() => {
    getCollection('tags').then((data) => setAllTags(data));
  }, [id]);
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

  const handleCreate = async () => {
    const data = {
      content: articleContent,
      title,
      url: urlImage,
      tagsArray,
      gardenArray,
    };
    await makeEntityAdder('articles')(data);
    setArticleContent('');
    setTitle('');
    setUrlImage('');
    setGardenArray([]);
    history.push('/articles');
  };
  const handleUpdate = async () => {
    const data = {
      content: articleContent,
      title,
      url: urlImage,
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      tagsArray,
      gardenArray,
    };
    await makeEntityUpdater('articles')(id, data).then(() => {
      setArticleContent('');
      setTitle('');
      setUrlImage('');
      setGardenArray([]);
      setTagsArray([]);
      props.history.push('/articles');
    });
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
        <input
          className="Title"
          placeholder="Titre"
          defaultValue={title}
          onChange={handleTitle}
        />
        <input
          className="Image"
          placeholder="url de l'image"
          defaultValue={urlImage}
          onChange={handleImage}
        />
        <Editor
          apiKey={textEditorApi}
          value={`${articleContent}`}
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
        {update && (
          <button type="button" className="sendButton" onClick={handleUpdate}>
            Mettre à jour
          </button>
        )}
        {!update && (
          <button type="button" className="sendButton" onClick={handleCreate}>
            Créer
          </button>
        )}
      </div>
    </div>
  );
};

export default ArticleCreation;
