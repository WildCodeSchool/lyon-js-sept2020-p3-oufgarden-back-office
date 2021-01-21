import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import { MdKeyboardBackspace } from 'react-icons/md';
import { IconContext } from 'react-icons';
// import { Link } from 'react-router-dom';
import Select from 'react-select';
import dayjs from 'dayjs';
// import ButtonListCreation from './ButtonListCreation';

import {
  makeEntityAdder,
  getEntity,
  getCollection,
  makeEntityUpdater,
} from '../services/API';
import './style/MemberCreation.scss';

const generator = require('generate-password');

const MemberCreation = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const [userToEdit, setUserToEdit] = useState({});
  const [gardenList, setGardenList] = useState([]);
  const [gardenArray, setGardenArray] = useState([]);
  const [gardenInitialOptions, setGardenInitialOptions] = useState([]);
  const [forUpdate, setForUpdate] = useState(false);

  const { addToast } = useToasts();

  const {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    getValues,
  } = useForm();

  // MemberEdition was merged with MemberCreation | if there is an id in the props, then it's for edition
  useEffect(() => {
    if (id) {
      setForUpdate(true);
    }
    getCollection('garden').then((data) => setGardenList(data));
  }, []);

  useEffect(() => {
    if (forUpdate) {
      getEntity('users', id).then((data) => {
        setUserToEdit(() => ({
          ...data,
          birthdate: dayjs(data.birthdate).format('YYYY-MM-DD'),
          membership_start: dayjs(data.membership_start).format('YYYY-MM-DD'),
          user_creation: dayjs(data.user_creation).format('YYYY-MM-DD'),
        }));
        setGardenArray(() =>
          data.garden_id_concat
            ? data.garden_id_concat.split(',').map((gardenId) => +gardenId)
            : []
        );
      });
    }
  }, [forUpdate]);

  useEffect(() => {
    setValue('gender_marker', userToEdit.gender_marker);
  }, [userToEdit]);

  useEffect(() => {
    if (gardenArray.length > 0) {
      setGardenInitialOptions(() =>
        gardenList
          .filter((garden) => gardenArray.includes(garden.id))
          .map((garden) => {
            return {
              value: garden.id,
              label: `${garden.name}`,
            };
          })
      );
    }
  }, [gardenArray]);

  useEffect(() => {
    if (gardenInitialOptions.length > 0) {
      // setValue comes from react hook form and enables to set default value
      setValue('garden', gardenInitialOptions);
    }
  }, [gardenInitialOptions]);

  // Error messages for react hook form
  const required = 'Ce champ est obligatoire';
  const maxLength = 'Vous avez dépassé le nombre maximal de caractères.';

  // Error Component for react hook form
  const errorMessage = (error) => {
    return (
      <div className="invalid-feedback">
        <p>{error}</p>
      </div>
    );
  };

  // formatting the options for react-select
  const gardenOptions = gardenList.map((elem) => {
    return {
      value: elem.id,
      label: `${elem.name}`,
    };
  });

  const onSubmit = async (data, e) => {
    // data is updated to add the array with garden ids, before submit

    if (!forUpdate) {
      const newData = {
        ...data,
        gardenArray: data.garden.map((elem) => elem.value),
      };
      const formData = new FormData();
      formData.append('picture', data.picture[0]);
      formData.append('data', JSON.stringify(newData));
      try {
        await makeEntityAdder('users')(formData)
          .then(() => {
            setGardenArray([]);
            setGardenList([]);
            setUserToEdit([]);
            setGardenInitialOptions([]);
          })
          .then(() => {
            props.history.push('/adherents');
          });
        addToast('Membre crée avec succès', {
          appearance: 'success',
          autoDismiss: true,
        });
      } catch (err) {
        addToast(
          "Email déjà utilisé/erreur lors de la création de l'adhérent",
          {
            appearance: 'error',
            autoDismiss: true,
          }
        );
      }
      e.target.reset();
    } else if (forUpdate) {
      // here remove password if null
      let newData = {};
      if (!data.garden) {
        newData = { data };
        setGardenArray([]);
      } else {
        newData = {
          ...data,
          gardenArray: data.garden.map((elem) => elem.value),
        };
      }

      console.log(gardenArray);
      if (newData.password === '') {
        delete newData.password;
        delete newData.passwordConfirmation;
      }
      const formData = new FormData();
      formData.append('picture', data.picture[0]);
      formData.append('data', JSON.stringify(newData));
      try {
        await makeEntityUpdater('users')(id, formData)
          .then(() => {
            setGardenArray([]);
            setGardenList([]);
            setUserToEdit([]);
            setGardenInitialOptions([]);
          })
          .then(() => {
            props.history.push('/adherents');
          });
        addToast('Membre mis à jour avec succès', {
          appearance: 'success',
          autoDismiss: true,
        });
      } catch (err) {
        addToast('Erreur lors de la mise à jour', {
          appearance: 'error',
          autoDismiss: true,
        });
      }
      e.target.reset();
    }
  };

  const handleBack = () => {
    props.history.push(`/adherents`);
  };

  // generate a random password
  const generatedPassword = generator.generate({
    length: 8,
    numbers: true,
    strict: true,
  });
  // Fusion MemberEdition Start here !

  useEffect(() => {
    if (id) {
      getEntity('users', id).then((elem) => {
        setUserToEdit(elem);
      });
    }
  }, [id]);

  return (
    <div>
      <div className="container">
        <h3>Création d'un membre :</h3>
        <form className="uploadRows">
          <div>
            <label htmlFor="picture">
              Votre image de profil:
              <input ref={register} type="file" name="picture" />
            </label>
          </div>
        </form>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IconContext.Provider value={{ className: 'react-icons' }}>
            <MdKeyboardBackspace
              size={25}
              className="back"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                handleBack();
              }}
            />
          </IconContext.Provider>
          <h3>Création d'un membre :</h3>

          <div>
            <label htmlFor="gender_marker">
              Civilité :{' '}
              <select
                name="gender_marker"
                ref={register({ required: !forUpdate })}
              >
                <option value="madame">Mme</option>
                <option value="monsieur">M.</option>
                <option value="inconnu">Non précisé</option>
              </select>
            </label>
            {errors.gender_marker &&
              errors.gender_marker.type === 'required' &&
              errorMessage(required)}
          </div>

          <div>
            <label htmlFor="lastname">
              Nom :{' '}
              <input
                type="text"
                name="lastname"
                ref={register({ required: !forUpdate, maxLength: 50 })}
                defaultValue={userToEdit.lastname}
              />
            </label>

            {errors.lastname &&
              errors.lastname.type === 'required' &&
              errorMessage(required)}
            {errors.lastname &&
              errors.lastname.type === 'maxLength' &&
              errorMessage(maxLength)}
          </div>

          <div>
            <label htmlFor="firstname">
              Prénom:{' '}
              <input
                type="text"
                name="firstname"
                ref={register({ required: !forUpdate, maxLength: 50 })}
                defaultValue={userToEdit.firstname}
              />
            </label>

            {errors.firstname &&
              errors.firstname.type === 'required' &&
              errorMessage(required)}
            {errors.firstname &&
              errors.firstname.type === 'maxLength' &&
              errorMessage(maxLength)}
          </div>

          <div>
            <label htmlFor="birthdate">
              Date de naissance :{' '}
              <input
                type="date"
                name="birthdate"
                ref={register}
                defaultValue={userToEdit.birthdate}
              />
            </label>
          </div>

          <div>
            <label htmlFor="membership_start">
              Date de début d'adhésion :{' '}
              <input
                type="date"
                name="membership_start"
                ref={register}
                defaultValue={userToEdit.membership_start}
              />
            </label>
          </div>

          <div>
            <label htmlFor="email">
              E-mail :{' '}
              <input
                id="email"
                name="email"
                aria-invalid={errors.email ? 'true' : 'false'}
                ref={register({
                  required: !forUpdate,
                  pattern: {
                    value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                    message: "Le format de l'email est invalide",
                  },
                })}
                type="email"
                placeholder="example@mail.com"
                defaultValue={userToEdit.email}
              />
            </label>

            {errors.email && <p role="alert">{errors.email.message}</p>}
          </div>
          {/* // for now, no email confirmation on update, would be better to add one */}
          {!forUpdate && (
            <div>
              <label htmlFor="emailConfirmation">
                Confirmation de l'email :{' '}
                <input
                  id="emailConfirmation"
                  name="emailConfirmation"
                  aria-invalid={errors.emailConfirmation ? 'true' : 'false'}
                  ref={register({
                    required: !forUpdate,
                    pattern: {
                      value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      message: "Le format de l'email est invalide",
                    },
                    validate: !forUpdate && {
                      matchesPreviousEmail: (value) => {
                        const { email } = getValues();
                        return (
                          email === value || 'Les emails ne sont pas identiques'
                        );
                      },
                    },
                  })}
                  type="email"
                  placeholder="example@mail.com"
                />
              </label>

              {errors.emailConfirmation && (
                <p role="alert">{errors.emailConfirmation.message}</p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="phone">
              Téléphone :{' '}
              <input
                type="text"
                name="phone"
                defaultValue={userToEdit.phone}
                ref={register({
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Le format du numéro de téléphone est invalide',
                  },
                })}
              />
            </label>
            {errors.phone && <p role="alert">{errors.phone.message}</p>}
          </div>

          {!forUpdate && (
            <div>
              <label htmlFor="password">
                Modifier le mot de passe (si nécessaire):{' '}
              </label>
              <input
                type="text"
                name="password"
                defaultValue={generatedPassword}
                ref={register({
                  required: 'Le mot de passe est obligatoire',
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                    message:
                      'Format invalide : 8 caractères minimum avec au moins 1 chiffre',
                  },
                })}
              />
              {errors.password &&
                errors.password.type === 'required' &&
                errorMessage(required)}
              {errors.password && <p role="alert">{errors.password.message}</p>}
            </div>
          )}
          {forUpdate && (
            <>
              <div>
                <label htmlFor="password">
                  Nouveau mot de passe :
                  <input
                    type="password"
                    name="password"
                    placeholder="******"
                    ref={register({
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message:
                          'Format invalide : 8 caractères minimum avec au moins 1 chiffre',
                      },
                    })}
                  />
                </label>
                {errors.password && (
                  <p role="alert">{errors.password.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="passwordConfirmation">
                  Confirmation du nouveau mot de passe :{' '}
                  <input
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    aria-invalid={
                      errors.passwordConfirmation ? 'true' : 'false'
                    }
                    ref={register({
                      pattern: {
                        value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                        message:
                          'Format invalide : 8 caractères minimum avec au moins 1 chiffre',
                      },
                      validate: {
                        matchesPreviousPassword: (value) => {
                          const { password } = getValues();
                          return (
                            password === value ||
                            'Les mots de passe ne sont pas identiques'
                          );
                        },
                      },
                    })}
                    type="password"
                    placeholder="******"
                  />
                </label>

                {errors.passwordConfirmation && (
                  <p role="alert">{errors.passwordConfirmation.message}</p>
                )}
              </div>
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="label">Membre administrateur ? {'   '}</span>
            <label htmlFor="admin" className="switch">
              <input
                name="is_admin"
                type="checkbox"
                id="admin"
                value="true"
                ref={register}
                defaultChecked={userToEdit.is_admin}
              />
              <span className="slider round" />
            </label>
          </div>

          {gardenInitialOptions && (
            <Controller
              as={Select}
              options={gardenOptions}
              name="garden"
              isClearable
              isMulti
              control={control}
              defaultValue={gardenInitialOptions}
            />
          )}

          <div className="submitFormBtn">
            <input
              type="submit"
              value={forUpdate ? 'Mettre à jour' : 'Créer le membre'}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
export default MemberCreation;
