/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { useEffect, useState } from 'react';
import { MdKeyboardBackspace, MdEmail, MdAccountCircle } from 'react-icons/md';
import {
  FaBirthdayCake,
  FaPhone,
  FaRegCalendarAlt,
  FaLeaf,
} from 'react-icons/fa';
import { IconContext } from 'react-icons';
import dayjs from 'dayjs';
import { getEntity, getCollection } from '../services/API';

import './style/MemberDetail.scss';

const today = dayjs();
const URL = process.env.REACT_APP_API_BASE_URL;

const MemberDetail = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [userDetails, setUserDetails] = useState();
  const [gardenList, setGardenList] = useState([]);
  const [gardenArray, setGardenArray] = useState([]);

  // MemberEdition was merged with MemberCreation | if there is an id in the props, then it's for edition
  useEffect(() => {
    getEntity('users', id).then((data) => {
      setUserDetails(() => ({
        ...data,
        birthdate: dayjs(data.birthdate).format('YYYY-MM-DD'),
        membership_start: dayjs(data.membership_start).format('YYYY-MM-DD'),
        user_creation: dayjs(data.user_creation).format('YYYY-MM-DD'),
      }));
      setGardenArray(() =>
        data.garden_id_concat
          ? data.garden_id_concat.split(',').map((gardenId) => +gardenId)
          : []
      );
    });
  }, []);

  useEffect(() => {
    getCollection('garden').then((data) => setGardenList(data));
  }, []);

  const handleEdit = (userId) => {
    props.history.push(`/adherents/edit/${userId}`);
  };
  const handleBack = () => {
    props.history.push(`/adherents`);
  };

  return (
    <div className="box-container-user">
      <div className="centering-box">
        {userDetails && (
          <div className="member-detail-container">
            <IconContext.Provider value={{ className: 'react-icons' }}>
              <div className="icons">
                <MdKeyboardBackspace
                  size={25}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    handleBack();
                  }}
                />
              </div>
              <div className="top-section">
                <div className="user-avatar-container">
                  <img
                    className="user-avatar"
                    alt="utilisateur"
                    src={`${URL}/${userDetails.picture_url}`}
                  />
                </div>
                <h2 className="name">
                  {userDetails.firstname} {userDetails.lastname}
                </h2>
                <div className="is-admin">
                  {userDetails.is_admin === 1 ? 'Admin' : ''}
                </div>
                <div className="edit-button" onClick={() => handleEdit(id)}>
                  Mettre à jour
                </div>
              </div>
              <div className="user-infos">
                <div className="contact">
                  <h3>
                    <MdAccountCircle size={25} style={{ marginRight: '5px' }} />
                    Informations personnelles
                  </h3>
                  <p className="vertical-align">
                    <MdEmail size={18} style={{ marginRight: '5px' }} />
                    {userDetails.email}
                  </p>
                  <p className="vertical-align">
                    <FaPhone size={18} style={{ marginRight: '5px' }} />
                    {userDetails.phone}
                  </p>
                  <p className="vertical-align">
                    <FaBirthdayCake size={18} style={{ marginRight: '5px' }} />
                    {dayjs(userDetails.birthdate).format('DD/MM/YYYY')}
                  </p>
                </div>
                <div className="membership-infos">
                  <h3>
                    <FaRegCalendarAlt
                      size={25}
                      style={{ marginRight: '5px' }}
                    />
                    Adhésion
                  </h3>
                  <p>
                    <span className="emph">Date d'adhésion : </span>
                    {dayjs(userDetails.membership_start).format('DD/MM/YYYY')}
                  </p>
                  <p>
                    <span className="emph">
                      Temps restant avant le renouvellement d'adhésion :{' '}
                    </span>
                    <span
                      className={
                        dayjs(userDetails.membership_start)
                          .add(1, 'year')
                          .diff(today, 'days') < 30
                          ? 'alert'
                          : 'ok'
                      }
                    >
                      {dayjs(userDetails.membership_start)
                        .add(1, 'year')
                        .diff(today, 'days')}{' '}
                      jours
                    </span>
                  </p>
                  <p>
                    <span className="emph">
                      Profil d'utilisateur créé le :{' '}
                    </span>
                    {dayjs(userDetails.user_creation).format('DD/MM/YYYY')}
                  </p>
                </div>
                <div className="garden-infos">
                  <h3>
                    <FaLeaf size={25} style={{ marginRight: '5px' }} />
                    Jardins associés
                  </h3>
                  {gardenList
                    .filter((garden) => gardenArray.includes(garden.id))
                    .map((garden) => (
                      <p key={garden.name}>{garden.name}</p>
                    ))}
                </div>
              </div>
            </IconContext.Provider>
          </div>
        )}
      </div>
    </div>
  );
};
export default MemberDetail;
