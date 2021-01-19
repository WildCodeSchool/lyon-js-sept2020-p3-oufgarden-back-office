import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  WeekView,
  Appointments,
  Toolbar,
  ViewSwitcher,
  DateNavigator,
  AppointmentTooltip,
  Resources,
} from '@devexpress/dx-react-scheduler-material-ui';
import './style/Calendar.scss';

import { appointments, users } from './CalendarData';

const resources = [
  {
    fieldName: 'userId',
    title: 'Participant',
    instances: users,
  },
];

const Calendar = () => {
  const [data, setData] = useState(appointments);

  const commitChanges = ({ added, changed, deleted }) => {
    let dataChange = data;

    if (added) {
      const startingAddedId =
        dataChange.length > 0 ? dataChange[dataChange.length - 1].id + 1 : 0;
      dataChange = [...dataChange, { id: startingAddedId, ...added }];
    }
    if (changed) {
      dataChange = dataChange.map((appointment) =>
        changed[appointment.id]
          ? { ...appointment, ...changed[appointment.id] }
          : appointment
      );
    }
    if (deleted !== undefined) {
      dataChange = dataChange.filter(
        (appointment) => appointment.id !== deleted
      );
    }

    return setData(dataChange);
  };

  return (
    <div className="calendar">
      <Paper>
        <Scheduler data={data} height={660}>
          <EditingState onCommitChanges={commitChanges} />
          <ViewState
            defaultCurrentDate="2018-07-25"
            defaultCurrentViewName="Week"
          />

          <DayView startDayHour={8} endDayHour={20} />
          <WeekView startDayHour={8} endDayHour={20} />
          <Toolbar />
          <DateNavigator />
          <ViewSwitcher />
          <Appointments />
          <AppointmentTooltip showCloseButton showDeleteButton />
          <Resources data={resources} />
        </Scheduler>
      </Paper>
    </div>
  );
};

export default Calendar;
