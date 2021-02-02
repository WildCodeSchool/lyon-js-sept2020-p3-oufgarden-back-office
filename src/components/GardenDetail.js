/* eslint-disable no-nested-ternary */
/* eslint-disable import/first */
/* eslint-disable import/order */

import React, { useEffect, useState } from 'react';
import { MdEdit, MdKeyboardBackspace } from 'react-icons/md';
import { FaSun } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import { getEntity, getCollection } from '../services/API';

import './style/GardenDetail.scss';

const URL = process.env.REACT_APP_API_BASE_URL;

// const today = dayjs();

const GardenDetail = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [gardenDetails, setGardenDetails] = useState();
  const [allPlantFamilies, setAllPlantFamilies] = useState([]);
  const [zones, setZones] = useState();

  useEffect(() => {
    getEntity('garden', id).then((data) => {
      setGardenDetails(() => ({
        ...data,
      }));
    });
  }, []);

  useEffect(() => {
    getCollection('plantFamily').then((data) => setAllPlantFamilies(data));
  }, []);

  useEffect(() => {
    getCollection(`garden/${+id}/zones`).then((data) => {
      setZones(
        data.map((zoneInfo) => {
          return {
            ...zoneInfo,
            zone_name: zoneInfo.name,
            plantFamilyArray: zoneInfo.plantFamily_concat_string
              ? zoneInfo.plantFamily_concat_string
                  .split(',')
                  .map((number) => +number)
              : [],
          };
        })
      );
    });
  }, []);

  const handleEdit = (userId) => {
    props.history.push(`/garden/${userId}/edition`);
  };
  const handleBack = () => {
    props.history.push(`/garden`);
  };

  return (
    <>
      {gardenDetails && (
        <div className="garden-detail-container">
          <div className="icons">
            <IconContext.Provider value={{ className: 'react-icons' }}>
              <MdKeyboardBackspace
                size={25}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleBack();
                }}
              />
              <MdEdit
                size={25}
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleEdit(id);
                }}
              />
            </IconContext.Provider>
          </div>
          <div className="name-section">
            <img
              className="img-garden-details"
              src={`${URL}/${gardenDetails.picture}`}
              alt="[jardin]"
            />
            <h2 className="name">{gardenDetails.name}</h2>
          </div>

          <div className="garden-infos">
            <div className="address">
              <h3>Adresse</h3>
              <p>{gardenDetails.address.street}</p>
              <p>
                {gardenDetails.address.zip_code} {gardenDetails.address.city}
              </p>
            </div>
            <div className="details">
              <h3>Détails</h3>
              <p>
                <span className="emph">
                  Nombre max d'adhérents sur place :{' '}
                </span>
                {gardenDetails.max_users}
              </p>
            </div>
            <div className="zones-infos">
              <h3>Zones</h3>
              <img
                className="img-map"
                src={`${URL}/${gardenDetails.map}`}
                alt="[map]"
              />

              <p>
                <span className="emph">Nombre de zones renseigné : </span>
                {gardenDetails.zone_quantity}
              </p>
              <div className="zone-list">
                {zones &&
                  zones.length > 0 &&
                  zones.map((zone) => {
                    return (
                      <div className="zone-details">
                        <p className="zone-name">{zone.name}</p>
                        <p className="zone-type">{zone.type}</p>
                        <p className="zone-description">{zone.description}</p>
                        {zone.exposition && (
                          <p className="exposition">
                            <IconContext.Provider
                              value={{ className: 'react-icons' }}
                            >
                              <FaSun size={20} />
                            </IconContext.Provider>
                            <span>{zone.exposition}</span>
                          </p>
                        )}
                        <div className="plant-families">
                          {allPlantFamilies.length > 0 &&
                            allPlantFamilies.map((plantFamily) => {
                              if (
                                zone.plantFamilyArray.includes(plantFamily.id)
                              ) {
                                return (
                                  <div className="plant-family">
                                    {plantFamily.main_category} -{' '}
                                    {plantFamily.sub_category}
                                  </div>
                                );
                              }
                              return <></>;
                            })}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default GardenDetail;
