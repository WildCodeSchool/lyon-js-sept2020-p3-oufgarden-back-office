import React from 'react';
import { Link } from 'react-router-dom';
import './style/ButtonListCreation.scss';

const ButtonListCreation = (props) => {
  const { attributes } = props;

  return (
    <div className="button-list-creation-container">
      <Link to={attributes.creation}>
        <div className="button-creation">Ajouter un {attributes.name}</div>
      </Link>
    </div>
  );
};
export default ButtonListCreation;
