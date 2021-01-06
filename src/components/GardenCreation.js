/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';

import { getCollection, makeEntityAdder, getEntity } from '../services/API';
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
  const { register, handleSubmit, errors, control } = useForm();
  const [allPlantFamilies, setAllPlantFamilies] = useState([]);
  const [Garden, setGarden] = useState([]);

  const [inputList, setInputList] = useState([
    {
      zone_name: '',
      type: '',
      exposition: '',
      plantFamilyArray: [],
      description: '',
    },
  ]);

  // test pour react select
  const options = allPlantFamilies.map((elem) => {
    return {
      value: elem.id,
      label: `${elem.main_category} -  ${elem.sub_category}`,
    };
  });
  const {
    match: {
      params: { id },
    },
  } = props;
  useEffect(() => {
    getCollection('plantFamily').then((data) => setAllPlantFamilies(data));
  }, []);
  useEffect(() => {
    getEntity('garden', id).then((data) => setGarden(data));
  }, [id]);

  console.log(Garden);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const deepCopyList = _.cloneDeep(inputList);
    // const list = [...inputList]; careful, this does not work for nested arrays + it's a shallow copy

    deepCopyList[index][name] = value;
    setInputList(deepCopyList);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const deepCopyList = _.cloneDeep(inputList);
    deepCopyList.splice(index, 1);
    setInputList(deepCopyList);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    const deepCopyList = _.cloneDeep(inputList);
    deepCopyList.push({
      zone_name: '',
      type: '',
      exposition: '',
      plantFamilyArray: [],
      description: '',
    });
    setInputList(deepCopyList);
  };

  const onSubmit = (data, e) => {
    const newData = {
      address: {
        address_city: data.address_city,
        address_street: data.address_street,
        address_zipcode: data.address_zipcode,
      },
      name: data.name,
      description: data.description,
      exposition: data.exposition,
      zone_quantity: data.zone_quantity,
      zone_details:
        inputList.length === 1 &&
        inputList[0].zone_name === '' &&
        inputList[0].type === ''
          ? []
          : inputList,
    };
    console.log(newData);
    makeEntityAdder('garden')(newData)
      .then((elem) => {
        console.log(elem);
      })
      .catch((err) => console.log(err.response.data))
      .then(() => {
        e.target.reset();
        setInputList([
          {
            zone_name: '',
            type: '',
            exposition: '',
            plantFamilyArray: [],
            description: '',
          },
        ]);
      })
      .then(() => props.history.push('/garden'));
    //   .catch((err) => {
    //     console.log(err.response.data);
    //     /* if (err.response.data.errorsByField[0].context !== undefined) {
    //       console.log(err.response.data.errorsByField[1].context.label);
    //     } else {
    //       console.log(err.response.data.errorsByField[0].message);
    //     } */
    //   });
  };

  const handleChangeSelect = (elem, i) => {
    console.log(elem);
    if (elem.length > 0) {
      const plantFamilySelection = { i, value: elem.map((e) => e.value) };
      const arrFamilyId = plantFamilySelection.value;
      const deepCopyList = _.cloneDeep(inputList);
      deepCopyList[i].plantFamilyArray = [...arrFamilyId];
      setInputList(deepCopyList);
      console.log(plantFamilySelection);
    }
    if (elem.length === 0) {
      const deepCopyList = _.cloneDeep(inputList);
      deepCopyList[i].plantFamilyArray = [];
      setInputList(deepCopyList);
    }
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
                defaultValue={Garden.name}
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
              Adresse (rue) :{' '}
              <input
                type="text"
                name="address_street"
                ref={register({ required: true })}
              />
            </label>

            {errors.address_street &&
              errors.address_street.type === 'required' &&
              errorMessage(required)}
          </div>
          <div>
            <label htmlFor="Location">
              Adresse (ville) :{' '}
              <input
                type="text"
                name="address_city"
                ref={register({ required: true })}
              />
            </label>

            {errors.address_city &&
              errors.address_city.type === 'required' &&
              errorMessage(required)}
          </div>

          <div>
            <label htmlFor="Location">
              Code postal :{' '}
              <input
                type="text"
                name="address_zipcode"
                // rajouter une validation sur le code postal
                ref={register({
                  required: true,
                  pattern: {
                    value: /^(?:[0-8]\d|9[0-8])\d{3}$/,
                    message: 'Le format du code postal est invalide',
                  },
                })}
              />
            </label>

            {errors.address_zipcode &&
              errors.address_zipcode.type === 'required' &&
              errorMessage(required)}
            {errors.address_zipcode && (
              <p role="alert">{errors.address_zipcode.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="pic_plan">
              Plan : <input className="inputPics" type="file" name="pic_plan" />
            </label>
          </div>

          <div>
            <label htmlFor="zone_quantity">
              Nombre de zones :{' '}
              <input
                type="text"
                name="zone_quantity"
                ref={register({
                  required: true,
                  pattern: {
                    value: /^[0-9]$|^[1-9][0-9]$|^(100)$/,
                    message: "Merci d'entrer un nombre",
                  },
                })}
              />
            </label>

            {errors.zone_quantity &&
              errors.zone_quantity.type === 'required' &&
              errorMessage(required)}
            {errors.zone_quantity && (
              <p role="alert">{errors.zone_quantity.message}</p>
            )}
          </div>
          <div className="inputZoneCreation">
            <label htmlFor="zoneCreer">
              Zone à creer :
              {inputList.map((x, i) => {
                return (
                  // not the best solution for the key but could not find another one - do not replace with Math.random()
                  <div key={new Date()}>
                    <input
                      name="zone_name"
                      type="text"
                      placeholder="Nom de la zone"
                      value={x.zone_name}
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    <input
                      name="type"
                      type="text"
                      placeholder="Quelle type de zone ? Serre, compost, potager.."
                      value={x.type}
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    <input
                      name="description"
                      type="text"
                      placeholder="Description de la zone"
                      value={x.description}
                      onChange={(e) => handleInputChange(e, i)}
                    />
                    <input
                      name="exposition"
                      type="text"
                      placeholder="Exposition"
                      value={x.exposition}
                      onChange={(e) => handleInputChange(e, i)}
                    />

                    <Controller
                      name="plantfamily"
                      control={control}
                      defaultValue=""
                      render={({ onChange, value }) => (
                        <Select
                          options={options}
                          onChange={(e) => {
                            onChange(e.value);
                            handleChangeSelect(e, i);
                          }}
                          value={value}
                          isMulti
                        />
                      )}
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

          <div className="submitFormBtn">
            <input type="submit" value="Créer le jardin" />
          </div>
        </form>
      </div>
    </div>
  );
};
export default GardenCreation;
