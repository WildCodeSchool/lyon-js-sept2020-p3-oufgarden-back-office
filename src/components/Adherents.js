/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { MdDelete, MdEdit } from 'react-icons/md';
import { IconContext } from 'react-icons';
import { useToasts } from 'react-toast-notifications';

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
      addToast('Un problème est survenu lors de la suppression du membre', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };
  const handleEdit = (id) => {
    props.history.push(`/adherents/${id}`);
  };

  return (
    <div className="user-list-container">
      <div className="button-user-container">
        <button type="button" className="button-user-list">
          <Link to="/adherents">Listes Adhérents</Link>
        </button>
        <button type="button" className="button-user">
          <Link to="/adherents/creation">Nouvel Adhérent</Link>
        </button>
      </div>
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
  );
};

export default Adherents;
