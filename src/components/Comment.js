import React from 'react';
import { MdDelete } from 'react-icons/md';
import { IconContext } from 'react-icons';
import { confirmAlert } from 'react-confirm-alert';
import { useToasts } from 'react-toast-notifications';
import dayjs from 'dayjs';
import { makeEntityDeleter } from '../services/API';
import 'react-confirm-alert/src/react-confirm-alert.css';
import './style/Comment.scss';

const Comment = ({
  avatar,
  firstname,
  lastname,
  date,
  comment,
  commentId,
  refresh,
}) => {
  const { addToast } = useToasts();

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirmez la suppression',
      message: 'Etes vous sûr de vouloir supprimer ce commentaire ?',
      buttons: [
        {
          label: 'Confirmer',
          onClick: async () => {
            try {
              await makeEntityDeleter('comments')(id);
              refresh();
            } catch (err) {
              addToast(
                'Un problème est survenu lors de la suppression du commentaire',
                {
                  appearance: 'error',
                  autoDismiss: true,
                }
              );
            }
          },
        },
        {
          label: 'Annuler',
          onClick: () => null,
        },
      ],
    });
  };

  return (
    <div className="comment">
      <div className="show-comment">
        <div className="show-comment-details-user">
          <img className="show-comment-avatar" alt="utilisateur" src={avatar} />
          <div className="show-comment-name">{`${firstname} ${lastname}`}</div>
          <div className="show-comment-date">
            {dayjs(date).format('DD/MM/YYYY, HH:mm')}
          </div>
        </div>
        <div className="show-comment-message">{comment}</div>
      </div>
      <div className="icon-container">
        <IconContext.Provider value={{ className: 'react-icons' }}>
          <MdDelete
            size={25}
            onClick={() => {
              handleDelete(commentId);
            }}
          />
        </IconContext.Provider>
      </div>
    </div>
  );
};

export default Comment;
