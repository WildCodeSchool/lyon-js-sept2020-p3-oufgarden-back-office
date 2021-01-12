/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from 'react';
import { FiMail } from 'react-icons/fi';
import { MdDelete, MdEdit } from 'react-icons/md';
import { IconContext } from 'react-icons';
import { useToasts } from 'react-toast-notifications';
import { confirmAlert } from 'react-confirm-alert';
import ButtonListCreation from './ButtonListCreation';

import 'react-confirm-alert/src/react-confirm-alert.css';

import { getCollection, makeEntityDeleter } from '../services/API';
import './style/AdherentList.scss';

const Adherents = (props) => {
  const { addToast } = useToasts();

  const [adherentList, setAdherentList] = useState([]);

  useEffect(() => {
    getCollection('users').then((elem) => {
      setAdherentList(elem);
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
              await makeEntityDeleter('users')(id);
              getCollection('users').then((elem) => {
                setAdherentList(elem);
                addToast('Membre supprimé avec succès', {
                  appearance: 'success',
                  autoDismiss: true,
                });
              });
            } catch (err) {
              addToast(
                'Un problème est survenu lors de la suppression du membre',
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
    props.history.push(`/adherents/${id}`);
  };

  return (
    <div className="user-list-container">
      <div className="button-user-container">
        <ButtonListCreation
          attributes={{
            list: '/adherents',
            creation: '/adherents/creation',
            name: 'Adhérent',
            names: 'Adhérents',
          }}
        />
      </div>
      <div className="container-to-color-rows">
        {adherentList.map((e) => {
          return (
            <div key={e.id} className="adherent-row">
              <div className="user-infos">
                <p>
                  {e.firstname} {e.lastname} {e.email}
                </p>
              </div>
              <div className="user-list-icons">
                {/* IconContext provider pour personnaliser les props de react-icons */}
                <IconContext.Provider value={{ className: 'react-icons' }}>
                  <FiMail size={25} />
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
    </div>
  );
};

export default Adherents;
