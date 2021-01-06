import React from 'react';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import { Link } from 'react-router-dom';

import { makeEntityAdder } from '../services/API';
import './style/MemberCreation.scss';

const generator = require('generate-password');

const MemberCreation = (props) => {
  // Messages
  const required = 'Ce champ est obligatoire';
  const maxLength = 'Vous avez dépassé le nombre maximal de caractères.';

  // Error Component
  const errorMessage = (error) => {
    return (
      <div className="invalid-feedback">
        <p>{error}</p>
      </div>
    );
  };
  const { addToast } = useToasts();

  const { register, handleSubmit, errors, getValues } = useForm();
  const onSubmit = async (data, e) => {
    try {
      await makeEntityAdder('users')(data).then(() => {
        props.history.push('/adherents');
      });
      addToast('Membre crée avec succès', {
        appearance: 'success',
        autoDismiss: true,
      });
    } catch (err) {
      addToast('Email déjà utilisé', {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    e.target.reset();
  };

  // generation du mot de passe
  const generatedPassword = generator.generate({
    length: 8,
    numbers: true,
    strict: true,
  });

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Création d'un membre :</h3>

          <div>
            <label htmlFor="lastname">
              Nom:{' '}
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
            <label htmlFor="email">
              email
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
              />
            </label>

            {errors.email && <p role="alert">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="emailConfirmation">
              Confirmation de l'email{' '}
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
          <div className="submitFormBtn">
            <input type="submit" value="Créer le membre" />
          </div>
        </form>
      </div>
    </div>
  );
};
export default MemberCreation;
