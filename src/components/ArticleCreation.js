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
  const [articleImage, setArticleImage] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [tagsArray, setTagsArray] = useState([]);
  const [loadedTags, setLoadedTags] = useState([]);
  const [initialTagsValue, setInitialTagsValue] = useState([]);
  const [gardenList, setGardenList] = useState([]);
  const [gardenArray, setGardenArray] = useState([]);
  const [loadedGarden, setLoadedGarden] = useState([]);
  const [initialGardenValue, setInitialGardenValue] = useState([]);
  const [update, setUpdate] = useState('');
  const [disabledArticle, setDisabledArticle] = useState(false);
  const history = useHistory();
  const {
    match: {
      params: { id },
    },
  } = props;
  useEffect(() => {
    if (id) {
      getEntity('articles', id).then((data) => {
        if (data.row) {
          setArticleContent(data.row.content);
          setArticleImage(data.row.url);
          setTitle(data.row.title);
        } else {
          setArticleContent(data.content);
          setArticleImage(data.url);
          setTitle(data.title);
        }
        if (data.garden) {
          setLoadedGarden(data.garden);
        }
        if (data.tag) {
          setLoadedTags(data.tag);
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
  useEffect(() => {
    if (loadedTags) {
      // eslint-disable-next-line array-callback-return
      loadedTags.forEach((elem) => {
        setInitialTagsValue((prevState) => [
          ...prevState,
          { value: elem.tag_id, label: elem.name },
        ]);
        setTagsArray((prevState) => [...prevState, elem.tag_id]);
      });
    }
  }, [loadedTags]);
  useEffect(() => {
    if (loadedGarden) {
      // eslint-disable-next-line array-callback-return
      loadedGarden.forEach((elem) => {
        setInitialGardenValue((prevState) => [
          ...prevState,
          { value: elem.garden_id, label: elem.name },
        ]);
        setGardenArray((prevState) => [...prevState, elem.garden_id]);
      });
    }
  }, [loadedGarden]);
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

  const handleCreate = async () => {
    const data = {
      content: articleContent,
      title,
      tagsArray,
      gardenArray,
    };
    const formData = new FormData();
    formData.append('picture', articleImage);
    formData.append('data', JSON.stringify(data));
    console.log(articleImage);
    await makeEntityAdder('articles')(formData);
    setArticleContent('');
    setTitle('');
    setArticleImage('');
    setGardenArray([]);
    history.push('/articles');
  };
  const handleUpdate = async () => {
    const data = {
      content: articleContent,
      title,
      updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      tagsArray,
      gardenArray,
      disabledArticle,
    };
    const formData = new FormData();
    formData.append('picture', articleImage);
    formData.append('data', JSON.stringify(data));
    await makeEntityUpdater('articles')(id, formData).then(() => {
      setArticleContent('');
      setTitle('');
      setArticleImage('');
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
        <form>
          <input
            type="file"
            className="picture"
            placeholder="url de l'image"
            defaultValue={articleImage}
            onChange={(e) => setArticleImage(e.target.files[0])}
          />
        </form>

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
        {initialGardenValue.length > 0 && update && (
          <Select
            isMulti
            name="garden"
            defaultValue={initialGardenValue}
            placeholder="Choisissez votre jardin"
            options={gardenOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(e) => {
              handleSelectGardenChange(e);
            }}
          />
        )}
        {!update ||
          (update && initialGardenValue.length < 1 && (
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
          ))}
        {initialTagsValue.length > 0 && update && (
          <Select
            isMulti
            defaultValue={initialTagsValue}
            name="tags"
            placeholder="Votre tag ici"
            options={tagOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(e) => {
              handleSelectTagChange(e);
            }}
          />
        )}
        {!update ||
          (update && initialTagsValue.length < 1 && (
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
          ))}

        {update && (
          <div className="buttonArticlePublishDisable">
            <button type="button" className="sendButton" onClick={handleUpdate}>
              Mettre à jour
            </button>
            <button
              type="button"
              className="sendButton"
              onClick={() => setDisabledArticle(true)}
            >
              Désactiver
            </button>
          </div>
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
