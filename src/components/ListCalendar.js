import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { MdEdit } from 'react-icons/md';
import { IconContext } from 'react-icons';

import { getCollection } from '../services/API';
import './style/ListCalendar.scss';

const ListCalendar = () => {
  const [gardenList, setGardenList] = useState([]);

  useEffect(() => {
    getCollection('garden').then((elem) => {
      setGardenList(elem);
    });
  }, []);

  return (
    <div className="calendar-list-container">
      <div className="button-calendar-container">
        <button type="button" className="button-calendar-list">
          <Link to="/calendar/google">Agenda des évenements</Link>
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
              </IconContext.Provider>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ListCalendar;
