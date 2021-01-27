/* eslint-disable no-unused-vars */

import React, { useEffect, useState, useContext } from 'react';
import { FiMail } from 'react-icons/fi';
import { MdDelete, MdAccountCircle } from 'react-icons/md';
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
  const [gardenList, setGardenList] = useState([]);
  const [filterArray, setFilterArray] = useState([]);

  useEffect(() => {
    getCollection('users').then((data) => {
      setAdherentList(
        data
          .map((userData) => ({
            ...userData,
            gardenArray: userData.garden_id_concat
              ? userData.garden_id_concat
                  .split(',')
                  .map((gardenId) => +gardenId)
              : [],
          }))
          .sort(function (a, b) {
            if (a.lastname < b.lastname) {
              return -1;
            }
            if (a.lastname > b.lastname) {
              return 1;
            }
            return 0;
          })
      );
    });
  }, []);

  useEffect(() => {
    getCollection('garden').then((data) => setGardenList(data));
  }, []);

  const handleGardenList = (target) => {
    if (filterArray.includes(+target.id)) {
      const newFilterArray = filterArray.filter((item) => item !== +target.id);
      target.classList.toggle('selected');
      setFilterArray(newFilterArray);
    } else {
      setFilterArray((prevState) => [...prevState, +target.id]);
      target.classList.toggle('selected');
    }
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirmez la suppression',
      message: 'Etes vous sûr.e de vouloir supprimer cet utilisateur ?',
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
      <div className="user-list">
        <div className="container-to-color-rows">
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
                            return <li key={garden.name}>{garden.name}</li>;
                          }
                          return null;
                        })}
                    </ul>
                  </div>
                  <div className="user-list-icons">
                    {/* IconContext provider pour personnaliser les props de react-icons */}
                    <IconContext.Provider value={{ className: 'react-icons' }}>
                      <a className="email-user" href={`mailto:${e.email}`}>
                        <FiMail size={25} />
                      </a>
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
    </div>
  );
};

export default Adherents;
