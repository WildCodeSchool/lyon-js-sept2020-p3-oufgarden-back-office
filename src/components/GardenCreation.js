import React from 'react';
import { useForm } from 'react-hook-form';
import { makeEntityAdder } from '../services/API';
import './style/GardenCreation.scss';

// Messages
const required = 'Ce champ est obligatoire';
/* const maxLength = 'Vous avez dépassé le nombre maximal de caractères.'; */

// Error Component
const errorMessage = (error) => {
  return (
    <div className="invalid-feedback">
      <p>{error}</p>
    </div>
  );
};

const GardenCreation = (props) => {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data, e) => {
    makeEntityAdder('garden')(data)
      .then((elem) => {
        console.log(elem);
      })
      .then(() => props.history.push('/garden'))
      .catch((err) => {
        console.log(err.response.data);
        /* if (err.response.data.errorsByField[0].context !== undefined) {
          console.log(err.response.data.errorsByField[1].context.label);
        } else {
          console.log(err.response.data.errorsByField[0].message);
        } */
      });

    e.target.reset();
  };

  return (
    <div className="containerGarden">
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h3>Création d'un Jardin :</h3>

          <div>
            <label htmlFor="GardenName">
              Nom du jardin:{' '}
              <input
                type="text"
                name="name"
                ref={register({ required: true })}
              />
            </label>

            {errors.name &&
              errors.name.type === 'required' &&
              errorMessage(required)}
          </div>

          <div>
            <label htmlFor="Location">
              Description :{' '}
              <input
                type="text"
                name="description"
                ref={register({ required: true })}
              />
            </label>
          </div>
          <div>
            <label htmlFor="Location">
              Exposition :{' '}
              <input
                type="text"
                name="exposition"
                ref={register({ required: true })}
              />
            </label>
          </div>

          <div>
            <label htmlFor="Location">
              Adresse :{' '}
              <input
                type="text"
                name="address"
                ref={register({ required: true })}
              />
            </label>

            {errors.address &&
              errors.address.type === 'required' &&
              errorMessage(required)}
          </div>
          <div>
            <label htmlFor="zone">
              Nombre de zone :{' '}
              <input
                type="number"
                name="zone"
                ref={register({ required: true })}
              />
            </label>

            {errors.zone &&
              errors.zone.type === 'required' &&
              errorMessage(required)}
          </div>
          <div>
            <input type="submit" value="Créer le jardin" />
          </div>
        </form>
      </div>
    </div>
  );
};
export default GardenCreation;
