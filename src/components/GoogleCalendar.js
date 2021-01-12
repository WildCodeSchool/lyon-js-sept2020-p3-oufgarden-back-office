import React from 'react';
import Iframe from 'react-iframe';
import './style/GoogleCalendar.scss';

function GoogleCalendar() {
  const urlAgenda =
    'https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;bgcolor=%23ffffff&amp;ctz=Europe%2FParis&amp;src=dGVhbW91ZmdhcmRlbkBnbWFpbC5jb20&amp;src=ZnIuZnJlbmNoI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&amp;color=%23039BE5&amp;color=%230B8043';

  return (
    <div className="googleIframe">
      <Iframe
        url={urlAgenda}
        width="450px"
        height="450px"
        id="myId"
        className="myClassname"
        display="initial"
      />
    </div>
  );
}

export default GoogleCalendar;
