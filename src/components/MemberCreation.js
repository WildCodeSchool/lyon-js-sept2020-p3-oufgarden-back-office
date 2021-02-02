import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import Select from 'react-select';
import { MdKeyboardBackspace } from 'react-icons/md';
import { IconContext } from 'react-icons';
import { makeEntityAdder, getCollection } from '../services/API';

import './style/MemberCreation.scss';

const generator = require('generate-password');

const MemberCreation = (props) => {
  const [gardenList, setGardenList] = useState([]);

  const { addToast } = useToasts();

  const { register, handleSubmit, errors, control, getValues } = useForm();

  useEffect(() => {
    getCollection('garden').then((data) => setGardenList(data));
  }, []);

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

  const onSubmit = async (data, e) => {
    // data is updated to add the array with garden ids, before submit

    console.log(data);
    const newData = {
      ...data,
      gardenArray: data.garden.map((elem) => elem.value),
    };
    const formData = new FormData();
    formData.append('picture', data.picture[0]);
    formData.append('data', JSON.stringify(newData));
    try {
      await makeEntityAdder('users')(formData)
        .then(() => {
          setGardenList([]);
        })
        .then(() => {
          props.history.push('/adherents');
        });
      addToast('Membre crée avec succès', {
        appearance: 'success',
        autoDismiss: true,
      });
    } catch (err) {
      addToast("Email déjà utilisé/erreur lors de la création de l'adhérent", {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    e.target.reset();
  };

  const handleBack = () => {
    props.history.push(`/adherents`);
  };

  // generate a random password
  const generatedPassword = generator.generate({
    length: 8,
    numbers: true,
    strict: true,
  });

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
          <h3>Création d'un membre</h3>
        </div>
        <form className="uploadRows">
          <div>
            <label htmlFor="picture">
              Votre image de profil :
              <input ref={register} type="file" name="picture" />
            </label>
          </div>
        </form>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="gender_marker">
              Civilité :{' '}
              <select name="gender_marker" ref={register({ required: true })}>
                <option value="madame">Mme</option>
                <option value="monsieur">M.</option>
                <option value="inconnu">Non précisé</option>
              </select>
            </label>
            {errors.gender_marker &&
              errors.gender_marker.type === 'required' &&
              errorMessage(required)}
          </div>
          <div>
            <label htmlFor="lastname">
              Nom :{' '}
              <input
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
            <label htmlFor="birthdate">
              Date de naissance :{' '}
              <input type="date" name="birthdate" ref={register} />
            </label>
          </div>

          <div>
            <label htmlFor="membership_start">
              Date de début d'adhésion :{' '}
              <input type="date" name="membership_start" ref={register} />
            </label>
          </div>

          <div>
            <label htmlFor="email">
              E-mail :{' '}
              <input
                id="email"
                name="email"
                aria-invalid={errors.email ? 'true' : 'false'}
                ref={register({
                  required,
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
            <label htmlFor="emailConfirmation">
              Confirmation de l'email :{' '}
              <input
                id="emailConfirmation"
                name="emailConfirmation"
                aria-invalid={errors.emailConfirmation ? 'true' : 'false'}
                ref={register({
                  required: true,
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
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Le format du numéro de téléphone est invalide',
                  },
                })}
              />
            </label>
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
            {errors.password &&
              errors.password.type === 'required' &&
              errorMessage(required)}
            {errors.password && <p role="alert">{errors.password.message}</p>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="label">Membre administrateur ? {'   '}</span>
            <label htmlFor="admin" className="switch">
              <input
                name="is_admin"
                type="checkbox"
                id="admin"
                value="true"
                ref={register}
              />
              <span className="slider round" />
            </label>
          </div>
          <div className="selct-garden-member">
            Selectionner un jardin :
            <Controller
              as={Select}
              options={gardenOptions}
              name="garden"
              isClearable
              isMulti
              control={control}
            />
          </div>

          <Controller
            as={Select}
            options={gardenOptions}
            name="garden"
            isClearable
            isMulti
            control={control}
            rules={{ required: true }}
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
