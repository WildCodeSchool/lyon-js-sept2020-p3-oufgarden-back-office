import React from 'react';
import Calendar from '@ericz1803/react-google-calendar';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';

import './style/GoogleCalendar.scss';

require('dotenv').config();

function GoogleCalendar() {
  const API_KEY = `AIzaSyCRPjtIgWPGyLwLNPK-IL-2WgwOpXJaMfQ`; // a mettre dans le .env
  const calendars = [{ calendarId: 'teamoufgarden@gmail.com' }];
  const styles = {
    calendar: {
      borderWidth: '1px', // make outer edge of calendar thicker
    },

    today: css`
      color: red;
      border: 1px solid red;
    `,
  };

  return (
    <div className="googleContainer">
      <div className="button-calendar-container">
        <button type="button" className="button-calendar-list">
          <Link to="/calendar">Liste des agendas</Link>
        </button>
      </div>
      <Calendar apiKey={API_KEY} calendars={calendars} styles={styles} />
    </div>
  );
}

export default GoogleCalendar;
