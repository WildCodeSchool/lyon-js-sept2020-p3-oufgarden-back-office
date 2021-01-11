import React, { useState, useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { IconContext } from 'react-icons';
import { MdDelete } from 'react-icons/md';
import {
  getCollection,
  makeEntityAdder,
  makeEntityDeleter,
} from '../services/API';
import './style/TagsPage.scss';

const TagsPage = () => {
  const [tagList, setTagList] = useState([]);
  const [newTag, setNewTag] = useState('');
  const { addToast } = useToasts();

  useEffect(() => {
    getCollection('tags')
      .then((data) => {
        return data.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });
      })
      .then((sortedData) => {
        setTagList(sortedData);
      });
  }, []);

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirmez la suppression',
      message: 'Etes vous sûr de vouloir supprimer cet utilisateur ?',
      buttons: [
        {
          label: 'Confirmer',
          onClick: async () => {
            try {
              await makeEntityDeleter('tags')(id);
              const updatedList = await getCollection('tags');
              const sortedUpdatedList = updatedList.sort((a, b) => {
                addToast('Catégorie supprimée avec succès', {
                  appearance: 'success',
                  autoDismiss: true,
                });
                return a.name.localeCompare(b.name);
              });
              setTagList(sortedUpdatedList);
              setNewTag(() => '');
            } catch (err) {
              addToast(
                'problème serveur lors de la suppression de la catégorie',
                {
                  appearance: 'error',
                  autoDismiss: true,
                }
              );
            }
          },
        },
        {
          label: 'Annuler',
          onClick: () => null,
        },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { name: newTag.toLowerCase() };
    try {
      await makeEntityAdder('tags')(data);
      const updatedList = await getCollection('tags');
      const sortedUpdatedList = updatedList.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      setTagList(sortedUpdatedList);
      setNewTag(() => '');
    } catch (err) {
      if (err.response.data.errorMessage) {
        if (err.response.data.errorMessage === 'tag_already_exists') {
          addToast('impossible de créer 2 fois la même catégorie', {
            appearance: 'error',
            autoDismiss: true,
          });
          setNewTag(() => '');
        }
      }
    }
  };

  return (
    <div className="tag-list-container">
      <div className="tag-creation-container">
        <form className="tag-form" onSubmit={(e) => handleSubmit(e)}>
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
          <input
            className="button-tag"
            type="submit"
            value="Créer la catégorie"
          />
        </form>
      </div>
      {tagList.map((tag) => {
        return (
          <div className="tag-row" key={tag.id}>
            <p>{tag.name}</p>
            <div className="user-list-icons">
              {/* IconContext provider pour personnaliser les props de react-icons */}
              <IconContext.Provider value={{ className: 'react-icons' }}>
                <MdDelete size={25} onClick={() => handleDelete(tag.id)} />
              </IconContext.Provider>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TagsPage;
