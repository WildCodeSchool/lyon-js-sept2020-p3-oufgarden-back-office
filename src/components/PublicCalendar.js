import React from 'react';
import './style/PublicCalendar.scss';

const PublicCalendar = () => {
  return (
    <div className="iframe-container">
      <iframe
        title="agenda-iframe"
        src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=Europe%2FParis&amp;title=%C3%89v%C3%A8nements%20de%20Ouf&amp;showTitle=1&amp;showNav=1&amp;showDate=1&amp;showPrint=0&amp;showTabs=1&amp;showCalendars=0&amp;showTz=0&amp;mode=MONTH&amp;src=N29hZ2ZhZWM1MjdhdjdjcnIwN3ZsYWVnMzRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;color=%230B8043"
        style={{ borderWidth: '0' }}
        width="800"
        height="600"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};

export default PublicCalendar;
