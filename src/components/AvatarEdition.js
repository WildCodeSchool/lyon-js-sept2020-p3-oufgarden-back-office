import React from 'react';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';

import { makeEntityUpdater } from '../services/API';

const AvatarEdition = ({ id }) => {
  const { addToast } = useToasts();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data, e) => {
    const newData = {
      ...data,
    };
    const formData = new FormData();
    formData.append('picture', data.picture[0]);
    formData.append('data', JSON.stringify(newData));
    try {
      await makeEntityUpdater('users')(id, formData).then(() => {
        // props.history.push('/adherents');
        console.log('update image ok');
      });
      addToast('Image mise à jour avec succès', {
        appearance: 'success',
        autoDismiss: true,
      });
    } catch (err) {
      addToast("Erreur lors de la mise à jour de l'adhérent", {
        appearance: 'error',
        autoDismiss: true,
      });
    }
    e.target.reset();
  };

  return (
    <div>
      <div className="avatar-edition-container">
        <div className="title">
          <h2>Edition de l'image de profil</h2>
        </div>
        <form className="uploadRows">
          <div>
            <label htmlFor="picture">
              Votre image de profil :
              <input ref={register} type="file" name="picture" />
            </label>
          </div>
        </form>
        <form
          className="submit-avatar-edition"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="submitFormBtn">
            <input type="submit" value="Enregistrer" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AvatarEdition;
