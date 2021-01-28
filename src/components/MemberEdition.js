/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { MdKeyboardBackspace } from 'react-icons/md';
import { IconContext } from 'react-icons';
import Select from 'react-select';
import dayjs from 'dayjs';

import { getEntity, getCollection, makeEntityUpdater } from '../services/API';
import './style/MemberCreation.scss';
import AvatarEdition from './AvatarEdition';

const URL = process.env.REACT_APP_API_BASE_URL;
const passwordRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);

const MemberEdition = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [userToEdit, setUserToEdit] = useState(undefined);
  const [gardenList, setGardenList] = useState([]);
  const [gardenArray, setGardenArray] = useState([]); // array of the garden of the initial user
  const [gardenInitialOptions, setGardenInitialOptions] = useState([]);
  //  const [picture, setPicture] = useState(undefined);
  const [data, setData] = useState({
    gender_marker: undefined,
    lastname: undefined,
    firstname: undefined,
    birthdate: undefined,
    membership_start: undefined,
    email: undefined,
    emailConfirmation: undefined,
    phone: undefined,
    password: undefined, // not using the crypted password, but can send a new one
    passwordConfirmation: undefined,
    is_admin: undefined,
    garden: undefined,
  });

  const { addToast } = useToasts();

  // getting all the possible garden values
  useEffect(() => {
    getCollection('garden').then((gardenData) => setGardenList(gardenData));
  }, []);

  // getting the initial values for a user
  useEffect(() => {
    getEntity('users', id).then((userData) => {
      setUserToEdit(() => ({
        ...userData,
        birthdate: dayjs(userData.birthdate).format('YYYY-MM-DD'),
        membership_start: dayjs(userData.membership_start).format('YYYY-MM-DD'),
        user_creation: dayjs(userData.user_creation).format('YYYY-MM-DD'),
      }));
      setGardenArray(() =>
        userData.garden_id_concat
          ? userData.garden_id_concat.split(',').map((gardenId) => +gardenId)
          : []
      );
    });
  }, []);

  useEffect(() => {
    if (userToEdit) {
      setData((prevState) => ({
        ...prevState,
        gender_marker: userToEdit.gender_marker,
        lastname: userToEdit.lastname,
        firstname: userToEdit.firstname,
        birthdate: dayjs(userToEdit.birthdate).format('YYYY-MM-DD'),
        membership_start: dayjs(userToEdit.membership_start).format(
          'YYYY-MM-DD'
        ),
        email: userToEdit.email,
        emailConfirmation: userToEdit.emailConfirmation,
        phone: userToEdit.phone,
        // password: data.password,
        is_admin: userToEdit.is_admin,
      }));
    }
  }, [userToEdit]);

  useEffect(() => {
    if (gardenArray.length > 0) {
      setGardenInitialOptions(() =>
        gardenList
          .filter((garden) => gardenArray.includes(garden.id))
          .map((garden) => {
            return {
              value: garden.id,
              label: `${garden.name}`,
            };
          })
      );
      // in the initial data, we set the garden key to its initial value
      setData((prevState) => ({
        ...prevState,
        garden: gardenList
          .filter((garden) => gardenArray.includes(garden.id))
          .map((garden) => {
            return {
              value: garden.id,
              label: `${garden.name}`,
            };
          }),
      }));
    }
  }, [gardenArray]);

  const handleSelectGardenChange = (elem) => {
    if (!elem) {
      setGardenArray([]);
      setData((prevState) => ({ ...prevState, garden: [] }));
    } else {
      setGardenArray(elem.map((e) => e.value));
      setData((prevState) => ({ ...prevState, garden: [...elem] }));
    }
  };

  // formatting the options for react-select
  const gardenOptions = gardenList.map((elem) => {
    return {
      value: elem.id,
      label: `${elem.name}`,
    };
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    // data is updated to add the array with garden ids, before submit

    // here add data validation
    let newData = {};
    if (!data.garden) {
      newData = { ...data };
      setGardenArray([]);
    } else if (data.garden.length === 0) {
      newData = { ...data, gardenArray: [] };
      setGardenArray([]);
    } else {
      newData = {
        ...data,
        gardenArray, // adding garden array, in the state
      };
    }
    if (newData.password === '') {
      delete newData.password;
      delete newData.passwordConfirmation;
    }

    if (newData.password !== newData.passwordConfirmation) {
      addToast('Le mot de passe doit être identique à la confirmation', {
        appearance: 'error',
        autoDismiss: true,
      });
      return;
    }

    console.log(newData);

    const formData = new FormData();
    formData.append('data', JSON.stringify(newData));

    try {
      await makeEntityUpdater('users')(id, formData)
        .then(() => {
          setGardenArray([]);
          setGardenList([]);
          setUserToEdit([]);
          setGardenInitialOptions([]);
        })
        .then(() => {
          props.history.push('/adherents');
        });
      addToast('Membre mis à jour avec succès', {
        appearance: 'success',
        autoDismiss: true,
      });
    } catch (err) {
      addToast('Erreur lors de la mise à jour', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
  };

  const handleBack = () => {
    props.history.push(`/adherents/${id}`);
  };

  useEffect(() => {
    if (id) {
      getEntity('users', id).then((elem) => {
        setUserToEdit(elem);
      });
    }
  }, [id]);

  return (
    <div>
      <div className="container">
        <div className="title">
          <IconContext.Provider value={{ className: 'react-icons' }}>
            <MdKeyboardBackspace
              size={35}
              stroke="#57ac5a"
              fill="#57ac5a"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleBack();
              }}
            />
          </IconContext.Provider>
          <h3>Edition d'un membre</h3>
        </div>

        <AvatarEdition id={id} />

        {userToEdit && data && (
          <form onSubmit={onSubmit}>
            <p>
              Attention, à l'exception du mot de passe, l'envoi d'un champ vide
              efface les données existantes dans la base de données
            </p>

            <div>
              <label htmlFor="gender_marker">
                Civilité :{' '}
                <select
                  required
                  name="gender_marker"
                  value={data.gender_marker}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      gender_marker: e.target.value,
                    }))
                  }
                >
                  <option value="madame">Mme</option>
                  <option value="monsieur">M.</option>
                  <option value="inconnu">Non précisé</option>
                </select>
              </label>
            </div>

            <div>
              <label htmlFor="lastname">
                Nom :{' '}
                <input
                  required
                  type="text"
                  name="lastname"
                  value={data.lastname}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      lastname: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div>
              <label htmlFor="firstname">
                Prénom:{' '}
                <input
                  required
                  type="text"
                  name="firstname"
                  value={data.firstname}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      firstname: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div>
              <label htmlFor="birthdate">
                Date de naissance :{' '}
                <input
                  type="date"
                  name="birthdate"
                  value={data.birthdate}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      birthdate: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div>
              <label htmlFor="membership_start">
                Date de début d'adhésion :{' '}
                <input
                  type="date"
                  name="membership_start"
                  value={data.membership_start}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      membership_start: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div>
              <label htmlFor="email">
                E-mail :{' '}
                <input
                  required
                  id="email"
                  name="email"
                  type="email"
                  placeholder="example@mail.com"
                  value={data.email}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      email: e.target.value,
                    }))
                  }
                />
              </label>
            </div>
            <div>
              <label htmlFor="phone">
                Téléphone :{' '}
                <input
                  type="text"
                  name="phone"
                  value={data.phone}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      phone: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div>
              <label htmlFor="password">
                Nouveau mot de passe :
                <input
                  type="password"
                  name="password"
                  placeholder="******"
                  value={data.password}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      password: e.target.value,
                    }))
                  }
                />
              </label>
              {data.password && !passwordRegex.test(data.password) && (
                <p>
                  Le mot de passe doit faire au moins 8 caractères et contenir
                  au moins une lettre et un chiffre
                </p>
              )}
            </div>
            <div>
              <label htmlFor="passwordConfirmation">
                Confirmation du nouveau mot de passe :{' '}
                <input
                  style={{
                    boxShadow:
                      data.password !== data.passwordConfirmation
                        ? '2px 2px 2px red'
                        : '',
                  }}
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  placeholder="******"
                  value={data.passwordConfirmation}
                  onChange={(e) =>
                    setData((prevState) => ({
                      ...prevState,
                      passwordConfirmation: e.target.value,
                    }))
                  }
                />
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="label">Membre administrateur ? {'   '}</span>
              <label htmlFor="admin" className="switch">
                <input
                  name="is_admin"
                  type="checkbox"
                  id="admin"
                  defaultChecked={userToEdit.is_admin === 1}
                  onClick={(e) => {
                    setData((prevState) => ({
                      ...prevState,
                      is_admin: e.target.checked ? 1 : 0,
                    }));
                  }}
                />
                <span className="slider round" />
              </label>
            </div>

            {gardenInitialOptions.length > 0 && (
              <Select
                isMulti
                name="garden"
                defaultValue={gardenInitialOptions}
                placeholder="Choisissez votre jardin"
                options={gardenOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => {
                  handleSelectGardenChange(e);
                }}
              />
            )}

            {gardenInitialOptions.length === 0 && (
              <Select
                isMulti
                name="garden"
                placeholder="Choisissez votre jardin"
                options={gardenOptions}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={(e) => {
                  handleSelectGardenChange(e);
                }}
              />
            )}

            <div className="submitFormBtn">
              <input type="submit" value="Mettre à jour" />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default MemberEdition;
