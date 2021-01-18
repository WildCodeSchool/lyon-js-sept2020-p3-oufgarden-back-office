import React, { useEffect, useState } from 'react';

import { MdDelete, MdEdit } from 'react-icons/md';
import { IconContext } from 'react-icons';

import { useToasts } from 'react-toast-notifications';
import { confirmAlert } from 'react-confirm-alert';
import ButtonListCreation from './ButtonListCreation';

import 'react-confirm-alert/src/react-confirm-alert.css';
import { getCollection, makeEntityDeleter } from '../services/API';
import './style/Garden.scss';

const Garden = (props) => {
  const { addToast } = useToasts();
  const [gardenList, setGardenList] = useState([]);

  useEffect(() => {
    getCollection('garden').then((elem) => {
      setGardenList(elem);
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
              await makeEntityDeleter('garden')(id);
              getCollection('garden').then((elem) => {
                setGardenList(elem);
                addToast('Jardin supprimé avec succès', {
                  appearance: 'success',
                  autoDismiss: true,
                });
              });
            } catch (err) {
              addToast(
                'Un problème est survenu lors de la suppression du jardin',
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
  const handleEdit = (id) => {
    props.history.push(`/garden/${id}`);
  };
  return (
    <div className="garden-list-container">
      <ButtonListCreation
        attributes={{
          list: '/garden',
          creation: '/garden/creation',
          name: 'Jardin',
          names: 'Jardins',
        }}
      />

      {gardenList.map((e) => {
        return (
          <div key={e.id} className="garden-row">
            <div className="garden-infos">
              <p>{e.name}</p>
            </div>
            <div className="garden-list-icons">
              {/* IconContext provider pour personnaliser les props de react-icons */}
              <IconContext.Provider value={{ className: 'react-icons' }}>
                <MdEdit
                  size={25}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleEdit(e.id);
                  }}
                />
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
