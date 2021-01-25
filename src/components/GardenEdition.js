import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ZoneEdition from './ZoneEdition';
import { getEntity, makeEntityUpdater } from '../services/API';
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

const GardenEdition = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;
  const { register, handleSubmit, errors } = useForm();
  const [initialGarden, setInitialGarden] = useState();

  useEffect(() => {
    getEntity('garden', id).then((data) => setInitialGarden(data));
  }, []);

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
      // not sending input details
    };
    const formData = new FormData();
    formData.append('gardenPicture', data.gardenPicture[0]);
    formData.append('zonePicture', data.zonePicture[0]);
    // We use JSON.stringify here to send nested object in formdata
    formData.append('newData', JSON.stringify(newData));

    makeEntityUpdater('garden')(formData)
      .catch((err) => console.log(err.response.data))
      .then(() => {
        e.target.reset();
      })
      .then(() => props.history.push('/garden'));
  };

  return (
    <div className="garden-zone-edition-container">
      <div className="garden-edition-container">
        {initialGarden && (
          <div className="containerGarden">
            <h3>Edition d'un jardin :</h3>

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
                    defaultValue={initialGarden.name}
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
                    defaultValue={initialGarden.description}
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
                    defaultValue={initialGarden.exposition}
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
                    defaultValue={initialGarden.address.street}
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
                    defaultValue={initialGarden.address.city}
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
                    defaultValue={initialGarden.address.zip_code}
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
                <label htmlFor="zone_quantity">
                  Nombre de zones :{' '}
                  <input
                    type="text"
                    name="zone_quantity"
                    defaultValue={initialGarden.zone_quantity}
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
                  Nombre max d'usagers présents sur place :{' '}
                  <input
                    type="text"
                    name="max_users"
                    defaultValue={initialGarden.max_users}
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
              <div className="submitFormBtn">
                <input type="submit" value="Enregistrer" />
              </div>
            </form>
          </div>
        )}
      </div>
      <div className="zone-edition-container">
        <ZoneEdition />
      </div>
    </div>
  );
};

export default GardenEdition;
