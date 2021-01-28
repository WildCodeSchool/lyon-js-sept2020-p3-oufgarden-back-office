import React from 'react';
import './style/PublicCalendar.scss';

const PublicCalendar = () => {
  return (
    <div className="iframe-container">
      <iframe
        title="agenda-iframe"
        src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%237CB342&amp;ctz=Europe%2FParis&amp;src=dGVhbW91ZmdhcmRlbkBnbWFpbC5jb20&amp;src=ZnIuZnJlbmNoI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%23039BE5&amp;color=%230B8043"
        style={{ border: 'solid 1px #777' }}
        width="800"
        height="600"
        frameBorder="0"
        scrolling="no"
      />
    </div>
  );
};

export default PublicCalendar;
