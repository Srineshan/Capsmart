import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

import style from './index.module.scss';

const ServiceDays = ({ setMetaData, selectedService }) => {
  const [serviceDays, setServiceDays] = useState({
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    weekDays: false,
    weekEnds: false,
    isholidays: false,
    monday: false,
    weekdaysSpecific: false,
    weekendsSpecific: false,
  });
  const [weekdayLabel, setWeekdayLabel] = useState('Weekdays');

  useEffect(() => {
    setServiceDays(selectedService?.serviceDays);
  }, [selectedService])

  useEffect(() => {
    if (!serviceDays?.monday || !serviceDays?.tuesday || !serviceDays?.wednesday || !serviceDays?.thursday || !serviceDays?.friday) {
      setWeekdayLabel('Weekdays Specific');
    } else {
      setWeekdayLabel('Weekdays');
    }
    setMetaData(serviceDays);
  }, [serviceDays])

  // useEffect(() => {
  //   let weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  //   let weekEnds = ['saturday', 'sunday'];
  //   let weekDaysCount = 0;
  //   let weekEndsCount = 0;
  //   Object.keys(serviceDays || [])?.filter(data => weekEnds?.map(days => days)?.includes(data) && serviceDays[data] === true)?.map(data => {
  //     weekEndsCount = weekEndsCount + 52;
  //   });
  //   Object.keys(serviceDays || [])?.filter(data => weekDays?.map(days => days)?.includes(data) && serviceDays[data] === true)?.map(data => {
  //     weekDaysCount = weekDaysCount + 52;
  //   });
  // }, [serviceDays])

  const onWeekDaysCheck = (checked) => {
    if (checked) {
      setServiceDays({
        ...serviceDays,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        weekDays: checked,
        monday: true,
        weekdaysSpecific: false
      })
    } else {
      setServiceDays({
        ...serviceDays,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        weekDays: checked,
        monday: false
      })
    }
  }

  const onWeekEndsCheck = (checked) => {
    if (checked) {
      setServiceDays({
        ...serviceDays,
        saturday: true,
        sunday: true,
        weekEnds: checked,
        weekendsSpecific: false,
      })
    } else {
      setServiceDays({
        ...serviceDays,
        saturday: false,
        sunday: false,
        weekEnds: checked
      })
    }
  }

  const getLabel = (days) => {
    if (days === 'Weekdays') {
      if (!serviceDays?.monday || !serviceDays?.tuesday || !serviceDays?.wednesday || !serviceDays?.thursday || !serviceDays?.friday) {
        return 'Weekdays Specific';
      } else {
        return 'Weekdays';
      }
    }
    else {
      return 'Weekends';
    }
  }

  console.log('weekdays label', weekdayLabel)

  return (
    <div>
      <div className={`${style.serviceDaysGrid}`}>
        <div className={`${style.displayInRow} ${style.fullWidth}`}>
          <FormGroup >
            <FormControlLabel control={<Checkbox value="NA" checked={serviceDays?.weekDays} onChange={(e) => onWeekDaysCheck(e.target.checked)} />} label={<Typography variant="body2" color="textSecondary">{weekdayLabel}</Typography>} />
          </FormGroup>
        </div>
        <div className={`${style.displayInRow} ${style.fullWidth}`}>
          <FormGroup className={`${style.marginLeft10}`}>
            <FormControlLabel control={<Checkbox value="NA" checked={serviceDays?.weekEnds} onChange={(e) => onWeekEndsCheck(e.target.checked)} />} label={<Typography variant="body2" color="textSecondary">Weekends</Typography>} />
          </FormGroup>
        </div>
        <div className={`${style.displayInRow} ${style.fullWidth}`}>
          <FormGroup className={`${style.marginLeft10}`}>
            <FormControlLabel control={<Checkbox value="NA" checked={serviceDays?.isholidays} onChange={(e) => setServiceDays({ ...serviceDays, isholidays: e.target.checked })} />} label={<Typography variant="body2" color="textSecondary">Holidays</Typography>} />
          </FormGroup>
        </div>
      </div>
      <div className={`${style.serviceDaysGrid} ${style.marginTop10}`}>
        <div className={style.displayInRow}>
          <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.monday ? `${style.selectedDay}` : ''}`} onClick={() => setServiceDays({ ...serviceDays, monday: !serviceDays?.monday, weekdaysSpecific: true })}>M</div>
          <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.tuesday ? `${style.selectedDay}` : ''}`} onClick={() => setServiceDays({ ...serviceDays, tuesday: !serviceDays?.tuesday, weekdaysSpecific: true })}>T</div>
          <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.wednesday ? `${style.selectedDay}` : ''}`} onClick={() => setServiceDays({ ...serviceDays, wednesday: !serviceDays?.wednesday, weekdaysSpecific: true })}>W</div>
          <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.thursday ? `${style.selectedDay}` : ''}`} onClick={() => setServiceDays({ ...serviceDays, thursday: !serviceDays?.thursday, weekdaysSpecific: true })}>T</div>
          <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.friday ? `${style.selectedDay}` : ''}`} onClick={() => setServiceDays({ ...serviceDays, friday: !serviceDays?.friday, weekdaysSpecific: true })}>F</div>
        </div>
        <div className={style.displayInRow}>
          <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.saturday ? `${style.selectedDay}` : ''}`} onClick={() => setServiceDays({ ...serviceDays, saturday: !serviceDays?.saturday, weekendsSpecific: true })}>S</div>
          <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.sunday ? `${style.selectedDay}` : ''}`} onClick={() => setServiceDays({ ...serviceDays, sunday: !serviceDays?.sunday, weekendsSpecific: true })}>S</div>
        </div>
      </div>
      <div className={`${style.daysWarningText} ${style.marginTop10}`}>
        Only specify days of the week for service if you are sure. Else do not specify.
      </div>
    </div>
  )
}

export default ServiceDays;
