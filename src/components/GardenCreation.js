/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import _ from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import ButtonListCreation from './ButtonListCreation';

import { getCollection, makeEntityAdder, getEntity } from '../services/API';
import './style/GardenCreation.scss';

// Messages
const required = 'Ce champ est obligatoire';

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

  // stocker les infos de chaque zone
  const [inputList, setInputList] = useState([
    {
      zone_name: '',
      type: '',
      exposition: '',
      plantFamilyArray: [],
      description: '',
    },
  ]);
  useEffect(() => {
    getCollection('plantFamily').then((data) => setAllPlantFamilies(data));
  }, []);

  const options = allPlantFamilies.map((elem) => {
    return {
      value: elem.id,
      label: `${elem.main_category} -  ${elem.sub_category}`,
    };
  });

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const deepCopyList = _.cloneDeep(inputList);
    // const list = [...inputList]; careful, this does not work for nested arrays + it's a shallow copy

    deepCopyList[index][name] = value; // name = type => {type: value}
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
      max_users: data.max_users,
      zone_details:
        inputList.length === 1 &&
        inputList[0].zone_name === '' &&
        inputList[0].type === ''
          ? []
          : inputList,
    };
    const formData = new FormData();
    formData.append('gardenPicture', data.gardenPicture[0]);
    formData.append('zonePicture', data.zonePicture[0]);
    // We use JSON.stringify here to send nested object in formdata
    formData.append('newData', JSON.stringify(newData));

    makeEntityAdder('garden')(formData)
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
  };

  const handleChangeSelect = (elem, i) => {
    if (elem) {
      if (elem.length > 0) {
        const plantFamilySelection = { i, value: elem.map((e) => e.value) };
        const arrFamilyId = plantFamilySelection.value;
        const deepCopyList = _.cloneDeep(inputList);
        deepCopyList[i].plantFamilyArray = [...arrFamilyId];
        setInputList(deepCopyList);
      }
      if (!elem) {
        const deepCopyList = _.cloneDeep(inputList);
        deepCopyList[i].plantFamilyArray = [];
        setInputList(deepCopyList);
      }
    }
  };

  return (
    <div>
      <div className="containerGarden">
        <h3>Création d'un Jardin :</h3>

        <div>
          <div className="imgUploadContainer">
            {/*   Just to inform the team, the form here is necessary to make file upload working with react hook form  */}
            <form>
              <div className="uploadRows">
                <label htmlFor="gardenPicture">
                  Image du jardin:
                  <input ref={register} type="file" name="gardenPicture" />
                </label>
              </div>
              <div className="uploadRows">
                <label htmlFor="zonePicture">
                  Image des zones:
                  <input ref={register} type="file" name="zonePicture" />
                </label>
              </div>
            </form>
          </div>

          <form className="formContainer" onSubmit={handleSubmit(onSubmit)}>
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

            <div>
              <label htmlFor="max_users">
                Nombre maximal d'utilisateurs :{' '}
                <input
                  type="text"
                  name="max_users"
                  ref={register({
                    required: true,
                    pattern: {
                      value: /^[0-9]$|^[1-9][0-9]$|^(100)$/,
                      message: "Merci d'entrer un nombre",
                    },
                  })}
                />
              </label>

              {errors.max_users &&
                errors.max_users.type === 'required' &&
                errorMessage(required)}
              {errors.max_users && (
                <p role="alert">{errors.max_users.message}</p>
              )}
            </div>

            <div className="inputZoneCreation">
              <label htmlFor="zoneCreer">
                Création des zones
                {inputList.map((x, i) => {
                  return (
                    // not the best solution for the key but could not find another one - do not replace with Math.random()
                    <div key={i}>
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

                      <Select
                        isMulti
                        name="plantFamily"
                        placeholder="Choisissez la famille de plantes"
                        options={options}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(e) => {
                          handleChangeSelect(e, i);
                        }}
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
    </div>
  );
};
export default GardenCreation;
