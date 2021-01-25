import React, { useState, useEffect } from 'react';

import _ from 'lodash';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import ButtonListCreation from './ButtonListCreation';

import { getCollection, makeEntityAdder, getEntity } from '../services/API';
import './style/GardenCreation.scss';

const ZoneEdition = () => {
  const [allPlantFamilies, setAllPlantFamilies] = useState([]);

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
    // We use JSON.stringify here to send neste object in formdata
    formData.append('newData', JSON.stringify(newData));

    makeEntityAdder('garden')(formData)
      // .then((elem) => {
      //   console.log(elem);
      // })
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

  return <div></div>;
};

export default ZoneEdition;
