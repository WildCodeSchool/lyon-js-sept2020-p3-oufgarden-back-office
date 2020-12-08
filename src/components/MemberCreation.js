import React from 'react';
import { useForm } from 'react-hook-form';
import './style/MemberCreation.scss';

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
  const onSubmit = (data) => console.log(data);

  return (
    <div className='container'>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Création d'un membre :</h3>
          {/*---------------- bouton nom -------------------*/}
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
          {/*---------------- champ prenom -------------------*/}
          <div>
            <label>Prénom: </label>
            <input
              type='text'
              name='Firstname'
              ref={register({ required: true, maxLength: 50 })}
            />
            {errors.Firstname &&
              errors.Firstname.type === 'required' &&
              errorMessage(required)}
            {errors.Firstname &&
              errors.Firstname.type === 'maxLength' &&
              errorMessage(maxLength)}
          </div>
          {/* --------------- email + verification email----- */}
          <div>
            <label>Email: </label>
            <input
              name='email'
              ref={register({
                required: "L'email est obligatoire !",
                pattern: /^\S+@\S+$/i,
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
                pattern: /^\S+@\S+$/i,
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
          {/*---------------- bouton creer -------------------*/}
          <div>
            <input type='submit' value='Créer le membre' />
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberCreation;
