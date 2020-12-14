/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail } from 'react-icons/fi';
import { MdDelete, MdEdit } from 'react-icons/md';
import { IconContext } from 'react-icons';

import { getCollection } from '../services/API';
import './style/AdherentList.scss';

const Adherents = () => {
  const [adherentList, setAdherentList] = useState([]);
  useEffect(() => {
    const request = getCollection('users').then((elem) => {
      console.log(elem);
      setAdherentList(elem);
    });
  }, []);

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
                <FiMail size={25} style={{}} />
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

export default Adherents;
