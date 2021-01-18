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

const currentDate = '2021-01-18';
const schedulerData = [
  {
    startDate: '2021-01-22T09:45',
    endDate: '2021-01-22T11:00',
    title: 'Meeting',
  },
  {
    startDate: '2021-01-18T12:00',
    endDate: '2021-01-18T13:30',
    title: 'Go to a gym',
  },
  {
    startDate: '2021-01-19',
    endDate: '2021-01-19',
    title: 'all day event',
    allDay: 1,
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
