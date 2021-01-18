/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { MdDelete, MdAccountCircle } from 'react-icons/md';
import { IconContext } from 'react-icons';
import { useToasts } from 'react-toast-notifications';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import { getCollection, makeEntityDeleter } from '../services/API';
import './style/AdherentList.scss';

const Adherents = (props) => {
  const { addToast } = useToasts();

  const [adherentList, setAdherentList] = useState([]);
  const [gardenList, setGardenList] = useState([]);
  const [filterArray, setFilterArray] = useState([]);

  useEffect(() => {
    getCollection('users').then((data) => {
      setAdherentList(
        data.map((userData) => ({
          ...userData,
          gardenArray: userData.garden_id_concat
            .split(',')
            .map((gardenId) => +gardenId),
        }))
      );
    });
  }, []);

  useEffect(() => {
    getCollection('garden').then((data) => setGardenList(data));
  }, []);

  const handleGardenList = (target) => {
    if (filterArray.includes(+target.id)) {
      const newFilterArray = filterArray.filter((item) => item !== +target.id);
      setFilterArray(newFilterArray);
    } else {
      setFilterArray((prevState) => [...prevState, +target.id]);
    }
  };

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
    <div>
      <div className="button-user-container">
        <button type="button" className="button-user-list">
          <Link to="/adherents">Listes Adhérents</Link>
        </button>
        <button type="button" className="button-user">
          <Link to="/adherents/creation">Nouvel Adhérent</Link>
        </button>
      </div>
      <div className="filterContainer">
        {gardenList &&
          gardenList.map((garden) => {
            return (
              <div key={garden.id}>
                <button
                  type="button"
                  className="filterButton"
                  id={garden.id}
                  onClick={(e) => handleGardenList(e.target)}
                >
                  {garden.name}
                </button>
              </div>
            );
          })}
      </div>
      <div className="user-list-container">
        {adherentList
          .filter((user) => {
            if (filterArray.length > 0) {
              return user.gardenArray.some((gardenId) =>
                filterArray.includes(gardenId)
              );
            }
            return true;
          })
          .map((e) => {
            return (
              <div key={e.id} className="adherent-row">
                <div className="user-infos">
                  <p>
                    <span className="bold">
                      {e.firstname} {e.lastname.toUpperCase()}
                    </span>{' '}
                    <br /> {e.email}
                  </p>
                  <ul className="garden-list">
                    {gardenList.length > 0 &&
                      gardenList.map((garden) => {
                        if (
                          e.gardenArray &&
                          e.gardenArray.includes(garden.id)
                        ) {
                          return <li>{garden.name}</li>;
                        }
                        return null;
                      })}
                  </ul>
                </div>
                <div className="user-list-icons">
                  {/* IconContext provider pour personnaliser les props de react-icons */}
                  <IconContext.Provider value={{ className: 'react-icons' }}>
                    <FiMail size={25} />
                    <MdAccountCircle
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
