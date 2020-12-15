import React from 'react';
import { useForm } from 'react-hook-form';
/* import { makeEntityAdder } from '../services/API'; */
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

const GardenCreation = () => {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => console.log(data);
  /* const onSubmit = (data, e) => {
    makeEntityAdder('users')(data)
      .then((elem) => {
        console.log(elem);
      })
      .then(() => props.history.push('/adherents'))
      .catch((err) => {
        console.log(err.response.data);
        if (err.response.data.errorsByField[0].context !== undefined) {
          console.log(err.response.data.errorsByField[1].context.label);
        } else {
          console.log(err.response.data.errorsByField[0].message);
        }
      });

    e.target.reset();
  }; */

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
            <label htmlFor="NumberOfCase">
              Nombre de parselle :{' '}
              <input
                type="number"
                name="case"
                ref={register({ required: true })}
              />
            </label>

            {errors.case &&
              errors.case.type === 'required' &&
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
