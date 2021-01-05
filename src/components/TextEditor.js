import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { makeEntityAdder, getCollection } from '../services/API';
import './style/TextEditor.scss';

const ArticleCreationForm = () => {
  const [articleContent, setArticleContent] = useState('');
  const [title, setTitle] = useState('');
  const [urlImage, setUrlImage] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [tagsArray, setTagsArray] = useState([]);
  const history = useHistory();

  useEffect(() => {
    getCollection('tags').then((data) => setAllTags(data));
  }, []);

  const handleEditorChange = (content) => {
    setArticleContent(content);
  };

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
    };
    await makeEntityAdder('articles')(data);
    setArticleContent('');
    setTitle('');
    setUrlImage('');
    history.push('/articles');
  };

  const handleCheckboxChange = (target) => {
    if (target.checked) {
      setTagsArray((prevState) => [...prevState, +target.id]);
    } else if (!target.checked) {
      setTagsArray((prevState) =>
        prevState.filter((tagId) => tagId !== +target.id)
      );
    }
    console.log(tagsArray);
  };
  const textEditorApi = process.env.REACT_APP_TEXT_EDITOR_API;
  return (
    <div>
      <input className="Title" placeholder="Titre" onChange={handleTitle} />
      <input
        className="Image"
        placeholder="url de l'image"
        onChange={handleImage}
      />
      <div className="checkboxes">
        {allTags &&
          allTags.map((tag) => {
            return (
              <div key={tag.id}>
                <label htmlFor="{tag.name}">
                  <input
                    type="checkbox"
                    id={tag.id}
                    name={tag.name}
                    onChange={(e) => handleCheckboxChange(e.target)}
                  />
                  {tag.name}
                </label>
              </div>
            );
          })}
      </div>
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
      <button type="button" className="sendButton" onClick={handleClick}>
        Créer
      </button>
    </div>
  );
};

export default ArticleCreationForm;
