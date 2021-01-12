import React from 'react';
import { Link } from 'react-router-dom';
import './style/ButtonListCreation.scss';

const ButtonListCreation = (props) => {
  const { link } = props;
  return (
    <div className="button-list-creation-container">
      <button type="button" className="button-list">
        <Link to={link.list}>Listes Adhérents</Link>
      </button>
      <button type="button" className="button-creation">
        <Link to={link.creation}>Nouvel Adhérent</Link>
      </button>
    </div>
  );
};
export default ButtonListCreation;
