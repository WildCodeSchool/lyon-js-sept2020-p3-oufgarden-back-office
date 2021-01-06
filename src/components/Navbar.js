import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { useToasts } from 'react-toast-notifications';
import history from '../history';
import API from '../services/API';
import './style/Navbar.scss';

const Navbar = () => {
  if (history.location.pathname === '/') {
    return false;
  }
  const { addToast } = useToasts();
  const logout = async () => {
    try {
      await API.get('/login');
      addToast('Déconnecté avec succès !', {
        appearance: 'success',
        autoDismiss: true,
      });
      history.push('/');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="navbar">
      <div className="logo" />
      <ul>
        <li>
          <Link to="/adherents">Adhérents</Link>
        </li>
        <li>
          <Link to="/garden">Jardins</Link>
        </li>
        <li>
          <Link to="/articles">Articles</Link>
        </li>
        <li>
          <Link to="/category">Catégories</Link>
        </li>
        <li>
          <Link to="/calendar">Agenda</Link>
        </li>
      </ul>
      <div className="containerLogoutButton">
        <button className="btn-logout" type="button" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default withRouter(Navbar);
