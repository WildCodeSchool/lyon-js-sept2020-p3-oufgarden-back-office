import React from 'react';
import { Link } from 'react-router-dom';
import './style/ButtonListCreation.scss';

const ButtonListCreation = (props) => {
  const { attributes } = props;

  return (
    <div className="button-list-creation-container">
      <button type="button" className="button-list">
        <Link to={attributes.list}>Listes {attributes.names}</Link>
      </button>
      <button type="button" className="button-creation">
        <Link to={attributes.creation}>Ajouter un {attributes.name}</Link>
      </button>
    </div>
  );
};
export default ButtonListCreation;
