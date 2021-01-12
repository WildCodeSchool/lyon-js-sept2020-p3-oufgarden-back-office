import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './style/Calendar.scss';

function Calendar() {
  const handleDateClick = (dateClickInfo) => {
    console.log(dateClickInfo.dateStr);
  };
  return (
    <div className="calendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        dateClick={handleDateClick}
        initialView="dayGridMonth"
      />
    </div>
  );
}
export default Calendar;
