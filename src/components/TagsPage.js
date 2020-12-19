import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { IconContext } from 'react-icons';
import { MdDelete, MdEdit } from 'react-icons/md';
import { getCollection, makeEntityAdder } from '../services/API';
import './style/TagsPage.scss';

const TagsPage = () => {
  const [tagList, setTagList] = useState([]);
  const [newTag, setNewTag] = useState('');
  const { addToast } = useToasts();

  useEffect(() => {
    getCollection('tags')
      .then((data) => {
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
      if (err.response.data.errorMessage) {
        if (err.response.data.errorMessage === 'tag_already_exists') {
          addToast('impossible de créer 2 fois la même catégorie', {
            appearance: 'error',
            autoDismiss: true,
          });
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
            <div className="user-list-icons">
              {/* IconContext provider pour personnaliser les props de react-icons */}
              <IconContext.Provider value={{ className: 'react-icons' }}>
                <MdEdit size={25} />
                <MdDelete size={25} />
              </IconContext.Provider>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TagsPage;
