import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  Appointments,
  AllDayPanel,
} from '@devexpress/dx-react-scheduler-material-ui';

import './style/Calendar.scss';

const currentDate = '2018-06-27';
const schedulerData = [
  {
    startDate: '2018-11-01T09:45',
    endDate: '2018-11-01T11:00',
    title: 'Meeting',
  },
  {
    startDate: '2018-11-01T12:00',
    endDate: '2018-11-01T13:30',
    title: 'Go to a gym',
  },
];

const Calendar = () => {
  return (
    <div className="calendar">
      <Paper>
        <Scheduler data={schedulerData} height={660}>
          <ViewState defaultCurrentDate={currentDate} />
          <WeekView startDayHour={9} endDayHour={19} />
          <Appointments />
          <AllDayPanel />
        </Scheduler>
      </Paper>
    </div>
  );
};

export default Calendar;
