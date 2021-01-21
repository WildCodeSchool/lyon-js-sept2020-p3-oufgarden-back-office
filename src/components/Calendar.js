import React, { useEffect /*  useState */ } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './style/Calendar.scss';
import { getEntity } from '../services/API';

const localizer = momentLocalizer(moment);
const MyCalendar = (props) => {
  /* const [myReservations, setMyReservations] = useState([]); */

  const {
    match: {
      params: { id },
    },
  } = props;
  useEffect(() => {
    getEntity('reservation', id).then((data) => console.log(data));
  });
  const now = new Date();
  const events = [
    {
      id: 0,
      title: 'All Day Event very long title',
      allDay: true,
      start: new Date(2019, 6, 0),
      end: new Date(2019, 6, 1),
    },
    {
      id: 1,
      title: 'Long Event',
      start: new Date(2019, 3, 7),
      end: new Date(2019, 3, 10),
    },
    {
      id: 2,
      title: 'Right now Time Event',
      start: now,
      end: now,
    },
  ];
  return (
    <div className="calendar-container" style={{ height: 700, width: 200 }}>
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
