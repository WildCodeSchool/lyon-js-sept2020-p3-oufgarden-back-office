import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { makeEntityAdder } from "../services/API";

const TextEditor = () => {
  const [articleContent, setArticleContent] = useState("");
  const [title, setTitle] = useState("");
  const [urlImage, setUrlImage] = useState("");
  let history = useHistory();

  // useEffect(() => {
  //   const request = getEntity(`articles/${id}`).then((elem) => {
  //     console.log(elem);
  //     setArticleContent(elem);
  //     setTitle(elem);
  //     setUrlImage(elem);
  //   });
  // }, []);

  const handleEditorChange = (content, editor) => {
    setArticleContent(content);
  };

  const currentDate = new Date()
    .toISOString()
    .replace("T", " ")
    .replace("Z", "");

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
    };
    makeEntityAdder("articles")(data);
    setArticleContent("");
    setTitle("");
    setUrlImage("");
    history.push("/articles");
  };

  return (
    <div>
      <input className="Title" placeholder="Titre" onChange={handleTitle} />
      <input
        className="Image"
        placeholder="url de l'image"
        onChange={handleImage}
      />
      <Editor
        apiKey="c2pe0rrg2r5r6yu3c3gcxe5qr192kgoghmxbjnaj4fk1yv9d"
        initialValue=""
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          // eslint-disable-next-line
          toolbar:
            "undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help",
        }}
        onEditorChange={handleEditorChange}
      />
      <button className="sendButton" onClick={handleClick}>
        Créer
      </button>
    </div>
  );
};

export default TextEditor;
