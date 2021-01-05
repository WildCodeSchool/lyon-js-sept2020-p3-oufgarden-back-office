import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getCollection, makeEntityAdder } from '../services/API';
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

  // test pour react select
  /*  const options = allPlantFamilies.map((elem) => {
    return {
      value: elem.id,
      label: `${elem.main_category} -  ${elem.sub_category}`,
    };
  }); */
  useEffect(() => {
    getCollection('plantFamily').then((data) => setAllPlantFamilies(data));
  }, []);
  const handleCheckboxChange = (target, index) => {
    // the index is the index of the zone creation part of the form
    if (target.checked) {
      const id = +target.id;
      const list = [...inputList];
      list[index].plantFamilyArray = [...list[index].plantFamilyArray, id];
      setInputList(list);
    } else if (!target.checked) {
      const id = +target.id;
      const list = [...inputList];
      list[index].plantFamilyArray = list[index].plantFamilyArray.filter(
        (plantId) => plantId !== id
      );
      setInputList(list);
    }
  };

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
      {
        zone_name: '',
        type: '',
        exposition: '',
        plantFamilyArray: [],
        description: '',
      },
    ]);
  };

  // format de l'objet data: {
  //   "name": "",
  //   "description": "",
  //   "exposition": "",
  //   "address_street": "",
  //   "address_city": "",
  //   "address_zipcode": "",
  //   "zone_quantity": "0"
  // }

  const onSubmit = (data, e) => {
    console.log(data);
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
      zone_details: [...inputList],
    };
    console.log(newData);
    makeEntityAdder('garden')(newData)
      .then((elem) => {
        console.log(elem);
      })
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
                ref={register({ required: true })}
              />
            </label>

            {errors.address_zipcode &&
              errors.address_zipcode.type === 'required' &&
              errorMessage(required)}
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
                type="number"
                name="zone_quantity"
                ref={register({ required: true })}
              />
            </label>

            {errors.zone_quantity &&
              errors.zone_quantity.type === 'required' &&
              errorMessage(required)}
          </div>
          <div className="inputZoneCreation">
            <label htmlFor="zoneCreer">
              Zone à creer :
              {inputList.map((x, i) => {
                return (
                  <div>
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

                    {/* <Controller
                      as={<ReactSelect />}
                      options={options}
                      name="ReactSelect"
                      isClearable
                      control={control}
                      isMulti
                    /> */}

                    {allPlantFamilies &&
                      allPlantFamilies.map((plantFamily) => {
                        return (
                          <div key={plantFamily.id}>
                            <label
                              htmlFor="{plantFamily.main_category + ' - ' +
                                  plantFamily.sub_category}"
                            >
                              <input
                                type="checkbox"
                                id={plantFamily.id}
                                name={`${plantFamily.main_category} - ${plantFamily.sub_category}`}
                                onChange={(e) =>
                                  handleCheckboxChange(e.target, i)
                                }
                              />
                              {`${plantFamily.main_category} - ${plantFamily.sub_category}`}
                            </label>
                          </div>
                        );
                      })}

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
