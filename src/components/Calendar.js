import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style/Calendar.scss';
import { getEntity } from '../services/API';

const localizer = momentLocalizer(moment);
const MyCalendar = (props) => {
  const [myReservations, setMyReservations] = useState([]);
  const [startingDate, setStartingDate] = useState([]);

  const {
    match: {
      params: { id },
    },
  } = props;
  useEffect(() => {
    getEntity('reservation', id).then((data) => {
      setMyReservations(data);
    });
  }, []);
  let tempStartingDate;
  useEffect(() => {
    if (myReservations.length !== 0) {
      const arr = myReservations[0].date.split('T');
      tempStartingDate = `${arr[0]}T${myReservations[0].start_time}`;
    }
    setStartingDate(tempStartingDate);
  }, [myReservations]);

  console.log(startingDate);

  const now = new Date();
  const events = [
    {
      id: 0,
      title: 'TEST',
      /* allDay: true, */
      start: new Date(startingDate),
      end: new Date(2021, 0, 19, 14),
      allDay: false,
    },
    {
      id: 1,
      title: 'Long Event',
      start: new Date(2021, 12, 7),
      end: new Date(2021, 12, 10),
    },
    {
      id: 2,
      title: 'Right now Time Event',
      start: now,
      end: now,
    },
  ];
  return (
    <div className="calendar-container">
      <Calendar
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultDate={moment().toDate()}
        localizer={localizer}
        views={['month', 'day', 'agenda']}
        min={new Date(2017, 10, 0, 10, 0, 0)}
        max={new Date(2017, 10, 0, 22, 0, 0)}
      />
    </div>
  );
};

export default MyCalendar;
