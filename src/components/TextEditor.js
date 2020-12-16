import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import { useMutation } from "react-query";
import { Editor } from '@tinymce/tinymce-react';
import { makeEntityAdder, getCollection } from '../services/API';

const TextEditor = () => {
  const [articleContent, setArticleContent] = useState('');
  const [title, setTitle] = useState('');
  const [urlImage, setUrlImage] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [tagsArray, setTagsArray] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const tags = getCollection('tags');
    setAllTags(tags);
  }, []);

  const handleEditorChange = (content) => {
    setArticleContent(content);
  };

  const currentDate = new Date()
    .toISOString()
    .replace('T', ' ')
    .replace('Z', '');

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleImage = (e) => {
    setUrlImage(e.target.value);
  };

  const handleClick = () => {
    const data = {
      content: articleContent,
      title,
      url: urlImage,
      created_at: currentDate,
      tagsArray,
    };
    makeEntityAdder('articles')(data);
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
        apiKey="c2pe0rrg2r5r6yu3c3gcxe5qr192kgoghmxbjnaj4fk1yv9d"
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

export default TextEditor;
