/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
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
    <div>
      {adherentList.map((e) => {
        return (
          <div key={e.id} className="adherent-row">
            <p>
              {e.firstname} {e.lastname} {e.email}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Adherents;
