import React from 'react';
import Calendar from '@ericz1803/react-google-calendar';
import { Link } from 'react-router-dom';

import './style/GoogleCalendar.scss';

require('dotenv').config();

function GoogleCalendar() {
  const API_KEY = `AIzaSyCRPjtIgWPGyLwLNPK-IL-2WgwOpXJaMfQ`; // a mettre dans le .env
  const calendars = [{ calendarId: 'teamoufgarden@gmail.com' }];

  return (
    <div className="googleContainer">
      <div className="button-calendar-container">
        <button type="button" className="button-calendar-list">
          <Link to="/calendar">Liste des agendas</Link>
        </button>
      </div>
      <Calendar apiKey={API_KEY} calendars={calendars} />
    </div>
  );
}

export default GoogleCalendar;
