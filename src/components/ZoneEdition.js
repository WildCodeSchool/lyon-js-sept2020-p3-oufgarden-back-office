import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import _ from 'lodash';

import { useForm, Controller } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';

import { getCollection, makeEntityAdder } from '../services/API';
import './style/GardenCreation.scss';

const ZoneEdition = (props) => {
  const { handleSubmit, control } = useForm();
  const [allPlantFamilies, setAllPlantFamilies] = useState([]);

  const [initialZones, setInitialZones] = useState([]);
  const [plantFamilyInitialOptions, setPlantFamilyInitialOptions] = useState(
    []
  );

  const { addToast } = useToasts();
  useEffect(() => {
    if (initialZones.length > 0 && allPlantFamilies.length > 0) {
      const plantFamilyOptionsArray = [];
      initialZones.forEach((initialZone) => {
        const newArray = allPlantFamilies
          .filter((plantFamily) =>
            initialZone.plantFamilyArray.includes(plantFamily.id)
          )
          .map((plantFamily) => {
            return {
              value: plantFamily.id,
              label: `${plantFamily.main_category} - ${plantFamily.sub_category}`,
            };
          });
        plantFamilyOptionsArray.push(newArray);
      });

      setPlantFamilyInitialOptions(plantFamilyOptionsArray);
    }
  }, [initialZones, allPlantFamilies]);

  // list of the zones of the current garden
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

  useEffect(() => {
    getCollection(`garden/${+props.id}/zones`).then((data) => {
      setInitialZones(
        data.map((zoneInfo) => {
          return {
            ...zoneInfo,
            zone_name: zoneInfo.name,
            plantFamilyArray: zoneInfo.plantFamily_concat_string
              ? zoneInfo.plantFamily_concat_string
                  .split(',')
                  .map((number) => +number)
              : [],
          };
        })
      );
      if (data.length > 0) {
        setInputList(
          data.map((zoneInfo) => {
            return {
              ...zoneInfo,
              zone_name: zoneInfo.name,
              plantFamilyArray: zoneInfo.plantFamily_concat_string
                ? zoneInfo.plantFamily_concat_string
                    .split(',')
                    .map((number) => +number)
                : [],
            };
          })
        );
      }
    });
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

  const onSubmit = () => {
    // get garden id also ?
    const newData = {
      zone_details:
        inputList.length === 1 &&
        inputList[0].zone_name === '' &&
        inputList[0].type === ''
          ? []
          : inputList,
    };

    makeEntityAdder(`garden/${+props.id}/zones`)(newData)
      .catch((err) => {
        addToast('Problème lors de la modification du jardin', {
          appearance: 'error',
          autoDismiss: true,
        });
        console.log(err.response.data);
      })
      .then(() => {
        addToast('Modifications enregistrées', {
          appearance: 'success',
          autoDismiss: true,
        });
        setTimeout(props.redirect, 2000);
      });
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
    }
    if (!elem) {
      const deepCopyList = _.cloneDeep(inputList);
      deepCopyList[i].plantFamilyArray = [];
      setInputList(deepCopyList);
    }
  };

  return (
    <div className="containerGarden">
      <form className="formContainer" onSubmit={handleSubmit(onSubmit)}>
        <div className="inputZoneCreation">
          <p className="info">
            Attention, modifier les zones entrainera la suppression de
            l'historique des actions utilisateurs
          </p>
          <label htmlFor="zoneCreer">
            Modifier les zones :
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
                    defaultValue={x.zone_name || ''}
                  />
                  <input
                    name="type"
                    type="text"
                    placeholder="Quelle type de zone ? Serre, compost, potager.."
                    value={x.type}
                    onChange={(e) => handleInputChange(e, i)}
                    defaultValue={x.type || ''}
                  />
                  <input
                    name="description"
                    type="text"
                    placeholder="Description de la zone"
                    value={x.description}
                    onChange={(e) => handleInputChange(e, i)}
                    defaultValue={x.description || ''}
                  />
                  <input
                    name="exposition"
                    type="text"
                    placeholder="Exposition"
                    value={x.exposition}
                    onChange={(e) => handleInputChange(e, i)}
                    defaultValue={x.exposition || ''}
                  />

                  {plantFamilyInitialOptions.length > 0 && (
                    <Controller
                      name="plantfamily"
                      control={control}
                      render={({ onChange }) => (
                        <Select
                          options={options}
                          defaultValue={plantFamilyInitialOptions[i]}
                          onChange={(e) => {
                            onChange(e);
                            handleChangeSelect(e, i);
                          }}
                          isMulti
                        />
                      )}
                    />
                  )}

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
          <input type="submit" value="Enregistrer" />
        </div>
      </form>
    </div>
  );
};

export default ZoneEdition;
