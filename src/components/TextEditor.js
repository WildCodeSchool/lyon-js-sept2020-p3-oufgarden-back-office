import React, { useState } from "react";
import { useMutation } from "react-query";
import { Editor } from "@tinymce/tinymce-react";
import { makeEntityAdder } from "../services/API";

const TextEditor = () => {
  const [articleContent, setArticleContent] = useState("");
  const [title, setTitle] = useState("");
  const [urlImage, setUrlImage] = useState("");

  const handleEditorChange = (content, editor) => {
    setArticleContent(content);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleImage = (e) => {
    setUrlImage(e.target.value);
  };

  const { data: articleContent, title, urlImage } = useQuery(
    "article",
    makeEntityAdder
  );

  const handleClick = () => {
    const data = { articleContent, title, urlImage };
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
