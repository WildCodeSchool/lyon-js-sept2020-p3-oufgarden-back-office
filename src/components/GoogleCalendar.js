import React from 'react';
import Calendar from '@ericz1803/react-google-calendar';

import './style/GoogleCalendar.scss';

require('dotenv').config();

function GoogleCalendar() {
  const API_KEY = `AIzaSyCRPjtIgWPGyLwLNPK-IL-2WgwOpXJaMfQ`; // a mettre dans le .env
  const calendars = [{ calendarId: 'teamoufgarden@gmail.com' }];

  return (
    <div className="googleContainer">
      <Calendar apiKey={API_KEY} calendars={calendars} />
    </div>
  );
}

export default GoogleCalendar;
