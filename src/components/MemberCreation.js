import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// import { useToasts } from 'react-toast-notifications';
import { Link } from 'react-router-dom';
import Select from 'react-select';

import {
  /* makeEntityAdder, */ getEntity,
  getCollection,
} from '../services/API';
import './style/MemberCreation.scss';

const generator = require('generate-password');

const MemberCreation = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [userToEdit, setUserToEdit] = useState([]);
  const [gardenList, setGardenList] = useState([]);
  const [gardenArray, setGardenArray] = useState([]);

  // MemberEdition was merged with MemberCreation | if there is an id in the props, then it's for edition
  useEffect(() => {
    getCollection('garden').then((data) => setGardenList(data));
  }, []);

  useEffect(() => {
    if (id) {
      getEntity('users', id).then((elem) => {
        setUserToEdit(elem);
      });
    }
  }, [id]);

  // const { addToast } = useToasts();

  const { register, handleSubmit, errors, getValues } = useForm();

  // Error messages for react hook form
  const required = 'Ce champ est obligatoire';
  const maxLength = 'Vous avez dépassé le nombre maximal de caractères.';

  // Error Component for react hook form
  const errorMessage = (error) => {
    return (
      <div className="invalid-feedback">
        <p>{error}</p>
      </div>
    );
  };

  // formatting the options for react-select
  const gardenOptions = gardenList.map((elem) => {
    return {
      value: elem.id,
      label: `${elem.name}`,
    };
  });

  const onSubmit = async (data /* , e */) => {
    // data is updated to add the array with garden ids, before submit
    const newData = {
      ...data,
      gardenArray,
    };
    console.log(newData);
    // try {
    //   await makeEntityAdder('users')(newData)
    //     .then(() => setGardenArray([]))
    //     .then(() => {
    //       props.history.push('/adherents');
    //     });
    //   addToast('Membre crée avec succès', {
    //     appearance: 'success',
    //     autoDismiss: true,
    //   });
    // } catch (err) {
    //   addToast('Email déjà utilisé', {
    //     appearance: 'error',
    //     autoDismiss: true,
    //   });
    // }
    // e.target.reset();
  };

  const handleSelectGardenChange = (elem) => {
    if (!elem) {
      setGardenArray([]);
    } else {
      setGardenArray(elem.map((e) => e.value));
    }
  };

  // generation du mot de passe
  const generatedPassword = generator.generate({
    length: 8,
    numbers: true,
    strict: true,
  });

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

      <div className="container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Création d'un membre :</h3>

          <div>
            <label htmlFor="gender">
              Civilité :{' '}
              <select name="gender" ref={register({ required: true })}>
                <option value="madame">Mme</option>
                <option value="monsieur">M.</option>
                <option value="inconnu">Non précisé</option>
              </select>
            </label>
            {errors.gender &&
              errors.gender.type === 'required' &&
              errorMessage(required)}
          </div>

          <div>
            <label htmlFor="lastname">
              Nom :{' '}
              <input
                type="text"
                name="lastname"
                ref={register({ required: true, maxLength: 50 })}
                defaultValue={userToEdit.lastname}
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
                type="text"
                name="firstname"
                ref={register({ required: true, maxLength: 50 })}
                defaultValue={userToEdit.firstname}
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
            <label htmlFor="birthdate">
              Date de naissance :{' '}
              <input
                type="date"
                name="birthdate"
                ref={register({ required: true })}
                defaultValue={userToEdit.birthdate}
              />
            </label>

            {errors.birthdate &&
              errors.birthdate.type === 'required' &&
              errorMessage(required)}
          </div>

          <div>
            <label htmlFor="membership_start">
              Date de début d'adhésion :{' '}
              <input
                type="date"
                name="membership_start"
                ref={register({ required: true })}
                defaultValue={userToEdit.membership_start}
              />
            </label>

            {errors.membership_start &&
              errors.membership_start.type === 'required' &&
              errorMessage(required)}
          </div>

          <div>
            <label htmlFor="email">
              E-mail :{' '}
              <input
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
                defaultValue={userToEdit.email}
              />
            </label>

            {errors.email && <p role="alert">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="emailConfirmation">
              Confirmation de l'email :{' '}
              <input
                id="emailConfirmation"
                name="emailConfirmation"
                aria-invalid={errors.emailConfirmation ? 'true' : 'false'}
                ref={register({
                  required: "L'email est obligatoire",
                  pattern: {
                    value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: "Le format de l'email est invalide",
                  },
                  validate: {
                    matchesPreviousEmail: (value) => {
                      const { email } = getValues();
                      return (
                        email === value || 'Les emails ne sont pas identiques'
                      );
                    },
                  },
                })}
                type="email"
                placeholder="example@mail.com"
              />
            </label>

            {errors.emailConfirmation && (
              <p role="alert">{errors.emailConfirmation.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone">
              Téléphone :{' '}
              <input
                type="text"
                name="phone"
                ref={register({
                  required: true,
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Le format du numéro de téléphone est invalide',
                  },
                })}
              />
            </label>

            {errors.phone &&
              errors.phone.type === 'required' &&
              errorMessage(required)}
            {errors.phone && <p role="alert">{errors.phone.message}</p>}
          </div>

          <div>
            <label htmlFor="password">
              Modifier le mot de passe (si nécessaire):{' '}
            </label>
            <input
              type="text"
              name="password"
              defaultValue={generatedPassword}
              ref={register({
                required: 'Le mot de passe est obligatoire',
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                  message:
                    'Format invalide : 8 caractères minimum avec au moins 1 chiffre',
                },
              })}
            />
            {errors.password && <p role="alert">{errors.password.message}</p>}
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

          <Select
            isMulti
            name="garden"
            placeholder="Jardin(s) lié(s) à l'adhérent"
            options={gardenOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(e) => {
              handleSelectGardenChange(e);
            }}
          />

          <div className="submitFormBtn">
            <input type="submit" value="Créer le membre" />
          </div>
        </form>
      </div>
    </div>
  );
};
export default MemberCreation;
