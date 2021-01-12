import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './style/Calendar.scss';

function Calendar() {
  const handleDateClick = (dateClickInfo) => {
    console.log(dateClickInfo.dateStr);
  };
  return (
    <div className="calendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        headerToolbar={{
          left: 'dayGridMonth,timeGridWeek,timeGridDay',
          center: 'title',
          right: 'prevYear,prev,next,nextYear',
        }}
        views={{
          dayGridMonth: {
            // name of view
            titleFormat: { day: '2-digit', month: '2-digit', year: 'numeric' },
            // other view-specific options here
          },
        }}
        dateClick={handleDateClick}
        initialView="timeGridWeek"
        events={[
          { title: 'event 1', date: '2021-01-13' },
          { title: 'event 2', date: '2021-01-15' },
        ]}
      />
    </div>
  );
}
export default Calendar;
