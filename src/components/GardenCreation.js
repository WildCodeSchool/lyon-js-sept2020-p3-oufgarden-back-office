import React, { useState } from 'react';
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
  const [inputList, setInputList] = useState([
    { name: '', Type: '', variety: '', quantity: '', date_plantation: '' },
  ]);
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([
      ...inputList,
      { name: '', Type: '', variety: '', quantity: '', date_plantation: '' },
    ]);
  };

  const onSubmit = (data, e) => {
    console.log(data);
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
        <form
          method="POST"
          encType="multipart/form-data"
          action="http://localhost:5000"
          className="formContainer"
          onSubmit={handleSubmit(onSubmit)}
        >
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
          {/* partie upload */}
          <div>
            <label htmlFor="pic_profile">
              Photo du jardin :{' '}
              <input className="inputPics" type="file" name="pic_profile" />
            </label>
          </div>

          <div>
            <label htmlFor="Location">
              Description :{' '}
              <input
                type="textarea"
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
            <label htmlFor="pic_plan">
              Plan : <input className="inputPics" type="file" name="pic_plan" />
            </label>
          </div>

          <div>
            <label htmlFor="zone_number">
              Nombre de zone :{' '}
              <input
                type="number"
                name="zone_number"
                ref={register({ required: true })}
              />
            </label>

            {errors.zone_number &&
              errors.zone_number.type === 'required' &&
              errorMessage(required)}
          </div>
          <div className="inputZoneCreation">
            <label htmlFor="zoneCreer">
              Zone à creer :
              {inputList.map((x, i) => {
                return (
                  <div key={x.name}>
                    <input
                      name="name"
                      placeholder="Nom de la Zone"
                      value={x.name}
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    <input
                      name="type"
                      placeholder="Quelle type de zone ? serre, compost, potager.."
                      value={x.type}
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    <input
                      name="variety"
                      placeholder="Variété de plante"
                      value={x.variety}
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    <input
                      type="number"
                      name="quantity"
                      placeholder="Quantité de plante"
                      value={x.quantity}
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    <span>Date de mise en terre :</span>
                    <input
                      type="date"
                      name="date_plantation"
                      placeholder="Date de mise en terre"
                      value={x.date_plantation}
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    <div className="btn-box">
                      {inputList.length - 1 === i && (
                        <button type="button" onClick={handleAddClick}>
                          Ajouter
                        </button>
                      )}
                      {inputList.length !== 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveClick(i)}
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </label>
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
