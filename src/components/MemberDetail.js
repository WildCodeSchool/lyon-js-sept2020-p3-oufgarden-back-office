/* eslint-disable no-nested-ternary */
/* eslint-disable import/first */
/* eslint-disable import/order */

import React, { useEffect, useState } from 'react';
import { MdEdit, MdKeyboardBackspace } from 'react-icons/md';
import { IconContext } from 'react-icons';

import { getEntity, getCollection } from '../services/API';

import dayjs from 'dayjs';

import './style/MemberDetail.scss';

const today = dayjs();

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
    <>
      {userDetails && (
        <div className="member-detail-container">
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
          <h2 className="name">
            {`${
              userDetails.gender_marker === 'madame'
                ? 'Mme'
                : userDetails.gender_marker === 'monsieur'
                ? 'M.'
                : ''
            } ${userDetails.firstname}  ${userDetails.lastname}`}
          </h2>
          <div className="is-admin">
            {userDetails.is_admin === 1 ? 'Admin' : ''}
          </div>
          <div className="user-infos">
            <div className="contact">
              <h3>Informations de contact</h3>
              <p>{userDetails.email}</p>
              <p>{userDetails.phone}</p>
            </div>
            <div className="membership-infos">
              <h3>Adhésion</h3>
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
                <span className="emph">Profil d'utilisateur créé le : </span>
                {dayjs(userDetails.user_creation).format('DD/MM/YYYY')}
              </p>
            </div>
            <div className="garden-infos">
              <h3>Jardins associés</h3>
              {gardenList
                .filter((garden) => gardenArray.includes(garden.id))
                .map((garden) => (
                  <p key={garden.name}>{garden.name}</p>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default MemberDetail;
