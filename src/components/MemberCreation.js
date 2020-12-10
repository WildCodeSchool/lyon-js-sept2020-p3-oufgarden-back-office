import React from 'react';
import { useForm } from 'react-hook-form';
import { makeEntityAdder } from '../services/API';

import './style/MemberCreation.scss';
const generator = require('generate-password');

// Messages
const required = 'Ce champ est obligatoire';
const maxLength = 'Vous avez dépassé le nombre maximal de caractères.';

// Error Component
const errorMessage = (error) => {
  return (
    <div className='invalid-feedback'>
      <p>{error}</p>
    </div>
  );
};

const MemberCreation = () => {
  const { register, handleSubmit, errors, getValues } = useForm();
  const onSubmit = (data, e) => {
    makeEntityAdder('users')(data)
      .then((e) => {
        console.log(e);
      })
      .catch((err) => {
        console.log(err.response.data);
        if (err.response.data.errorsByField[0].context !== undefined) {
          console.log(err.response.data.errorsByField[1].context.label);
        } else {
          console.log(err.response.data.errorsByField[0].message);
        }
      });

    console.log(data);
    e.target.reset();
  };

  //generation du mot de passe
  let generatedPassword = generator.generate({
    length: 8,
    numbers: true,
  });

  return (
    <div className='container'>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Création d'un membre :</h3>

          <div>
            <label>Nom: </label>
            <input
              type='text'
              name='lastname'
              ref={register({ required: true, maxLength: 50 })}
            />
            {errors.lastname &&
              errors.lastname.type === 'required' &&
              errorMessage(required)}
            {errors.lastname &&
              errors.lastname.type === 'maxLength' &&
              errorMessage(maxLength)}
          </div>

          <div>
            <label>Prénom: </label>
            <input
              type='text'
              name='firstname'
              ref={register({ required: true, maxLength: 50 })}
            />
            {errors.Firstname &&
              errors.Firstname.type === 'required' &&
              errorMessage(required)}
            {errors.Firstname &&
              errors.Firstname.type === 'maxLength' &&
              errorMessage(maxLength)}
          </div>

          <div>
            <label>Email: </label>
            <input
              name='email'
              ref={register({
                required: "L'email est obligatoire",
                pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Mauvais format',
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>
          <div>
            <label>Confirmation de l'email: </label>
            <input
              name='emailConfirmation'
              ref={register({
                required: "Merci de confirmer l'email !",
                pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: 'Mauvais format',
                validate: {
                  matchesPreviousEmail: (value) => {
                    const { email } = getValues();
                    return (
                      email === value || 'Les emails ne sont pas identiques'
                    );
                  },
                },
              })}
            />
            {errors.emailConfirmation && (
              <p>{errors.emailConfirmation.message}</p>
            )}
          </div>

          <div>
            <label>Modifier le mot de passe (si nécessaire): </label>
            <input
              type='text'
              name='password'
              defaultValue={generatedPassword}
              ref={register({
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                  message:
                    'Format invalide : 8 caractères minimum avec au moins 1 chiffre',
                },
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor='admin'>Membre administrateur ?</label>
            <input
              name='is_admin'
              type='checkbox'
              id='admin'
              value='true'
              ref={register}
            />
          </div>
          <div>
            <input type='submit' value='Créer le membre' />
          </div>
        </form>
      </div>
    </div>
  );
};
export default MemberCreation;
