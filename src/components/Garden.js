import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { MdDelete, MdEdit } from 'react-icons/md';
import { IconContext } from 'react-icons';

import { useToasts } from 'react-toast-notifications';
import { getCollection, makeEntityDeleter } from '../services/API';
import './style/Garden.scss';

const Garden = () => {
  const { addToast } = useToasts();
  const [gardenList, setGardenList] = useState([]);

  useEffect(() => {
    getCollection('garden').then((elem) => {
      setGardenList(elem);
    });
  }, []);

  const handleDelete = async (id) => {
    try {
      await makeEntityDeleter('garden')(id);
      getCollection('garden').then((elem) => {
        setGardenList(elem);
        addToast('Jardin supprimé avec succès', {
          appearance: 'success',
          autoDismiss: true,
        });
      });
    } catch (err) {
      addToast('Un problème est survenu lors de la suppression du jardin', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };
  return (
    <div className="garden-list-container">
      <div className="button-garden-container">
        <button type="button" className="button-garden-list">
          <Link to="/garden">Liste Jardins</Link>
        </button>
        <button type="button" className="button-garden">
          <Link to="/garden/creation">Nouveau Jardin</Link>
        </button>
      </div>
      {gardenList.map((e) => {
        return (
          <div key={e.id} className="garden-row">
            <div className="garden-infos">
              <p>{e.name}</p>
            </div>
            <div className="garden-list-icons">
              {/* IconContext provider pour personnaliser les props de react-icons */}
              <IconContext.Provider value={{ className: 'react-icons' }}>
                <MdEdit size={25} />
                <MdDelete
                  style={{ cursor: 'pointer' }}
                  size={25}
                  onClick={() => {
                    handleDelete(e.id);
                  }}
                />
              </IconContext.Provider>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Garden;
