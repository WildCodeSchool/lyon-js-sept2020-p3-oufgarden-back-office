import React, { useState, useEffect } from 'react';
import { getCollection, makeEntityAdder } from '../services/API';
import './style/TagsPage.scss';

const TagsPage = () => {
  const [tagList, setTagList] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    getCollection('tags')
      .then((data) => {
        console.log(data);
        return data.sort();
      })
      .then((sortedData) => {
        setTagList(sortedData);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name: newTag.toLowerCase() };
    try {
      await makeEntityAdder('tags')(data);
      const updatedList = await getCollection('tags');
      const sortedUpdatedList = updatedList.sort();
      setTagList(sortedUpdatedList);
      setNewTag(() => '');
    } catch (err) {
      console.error(`Erreur: ${err}`);
      if (err.errorMessage) {
        if (err.errorMessage === 'tag_already_exists') {
          console.log('pouet');
        }
      }
    }
  };

  return (
    <div className="tag-list-container">
      <div className="tag-creation-container">
        <form onSubmit={(e) => handleSubmit(e)}>
          <label htmlFor="newTag">
            {' '}
            Nom de la nouvelle catégorie
            <input
              id="newTag"
              name="newTag"
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
          </label>
          <input type="submit" value="Créer la catégorie" />
        </form>
      </div>
      {tagList.map((tag) => {
        return (
          <div className="tag-row" key={tag.id}>
            <p>{tag.name}</p>
          </div>
        );
      })}
    </div>
  );
};

export default TagsPage;
