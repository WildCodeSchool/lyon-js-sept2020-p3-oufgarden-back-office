/* eslint-disable camelcase */
/* eslint-disable no-shadow */
// import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { getEntity, makeEntityUpdater } from '../services/API';

const MemberEdition = (props) => {
  const [email, setEmail] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const required = 'Ce champ est obligatoire';
  const maxLength = 'Vous avez dépassé le nombre maximal de caractères.';
  const { register, handleSubmit, errors } = useForm();
  const errorMessage = (error) => {
    return (
      <div className="invalid-feedback">
        <p>{error}</p>
      </div>
    );
  };
  const {
    match: {
      params: { id },
    },
  } = props;
  useEffect(() => {
    getEntity('users', id).then((elem) => {
      setEmail(elem.email);
      setFirstname(elem.firstname);
      setLastname(elem.lastname);
    });
  }, [id]);

  const onUpdate = async (data) => {
    console.log(data);
    const { firstname, lastname, email, is_admin, password } = data;
    let newData = { firstname, lastname, email, is_admin, password };
    if (password.length === 0) {
      newData = { firstname, lastname, email, is_admin };
    }

    try {
      await makeEntityUpdater('users')(id, newData).then(() => {
        props.history.push('/adherents');
      });
    } catch (err) {
      if (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className="container">
      <div className="button-user-container">
        <button type="button" className="button-user-list">
          <Link to="/adherents">Listes Adhérents</Link>
        </button>
        <button type="button" className="button-user">
          <Link to="/adherents/creation">Nouvel Adhérent</Link>
        </button>
      </div>
      <div>
        <form onSubmit={handleSubmit(onUpdate)}>
          <h3>Modification de l'utilisateur :</h3>

          <div>
            <label htmlFor="lastname">
              Nom:{' '}
              <input
                defaultValue={lastname}
                type="text"
                name="lastname"
                ref={register({ required: true, maxLength: 50 })}
              />
            </label>

            {errors.lastname &&
              errors.lastname.type === 'required' &&
              errorMessage(required)}
            {errors.lastname &&
              errors.lastname.type === 'maxLength' &&
              errorMessage(maxLength)}
          </div>

          <div>
            <label htmlFor="firstname">
              Prénom:{' '}
              <input
                defaultValue={firstname}
                type="text"
                name="firstname"
                ref={register({ required: true, maxLength: 50 })}
              />
            </label>

            {errors.firstname &&
              errors.firstname.type === 'required' &&
              errorMessage(required)}
            {errors.firstname &&
              errors.firstname.type === 'maxLength' &&
              errorMessage(maxLength)}
          </div>

          <div>
            <label htmlFor="email">
              email
              <input
                defaultValue={email}
                id="email"
                name="email"
                aria-invalid={errors.email ? 'true' : 'false'}
                ref={register({
                  required: "L'email est obligatoire",
                  pattern: {
                    value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: "Le format de l'email est invalide",
                  },
                })}
                type="email"
                placeholder="example@mail.com"
              />
            </label>

            {errors.email && <p role="alert">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password">
              Password:{' '}
              <input
                // defaultValue=""
                type="text"
                name="password"
                ref={register({ required: false, maxLength: 50 })}
              />
            </label>
            {/* 
            {errors.firstname &&
              errors.firstname.type === 'required' &&
              errorMessage(required)} */}
            {/* {errors.firstname &&
              errors.firstname.type === 'maxLength' &&
              errorMessage(maxLength)} */}
          </div>

          <div>
            <label htmlFor="admin">
              Membre administrateur ?{' '}
              <input
                name="is_admin"
                type="checkbox"
                id="admin"
                value="true"
                ref={register}
              />
            </label>
          </div>
          <div>
            <input type="submit" value="Créer le membre" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberEdition;
