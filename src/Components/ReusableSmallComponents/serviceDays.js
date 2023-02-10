import React, { useState, useEffect } from 'react';
import CommonCheckBox from '../CommonFields/CommonCheckBox';

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
  const [weekendLabel, setWeekendLabel] = useState('Weekends')

  useEffect(() => {
    if (selectedService !== {}) {
      setServiceDays(selectedService?.serviceDays);
    }
  }, [selectedService])

  useEffect(() => {
    if (serviceDays?.monday && serviceDays?.tuesday && serviceDays?.wednesday && serviceDays?.thursday && serviceDays?.friday) {
      setWeekdayLabel('Any Weekday');
    }
    else if (serviceDays?.monday || serviceDays?.tuesday || serviceDays?.wednesday || serviceDays?.thursday || serviceDays?.friday) {
      setWeekdayLabel('Weekdays Specific');
    } else {
      setWeekdayLabel('Weekdays');
    }

    if (serviceDays?.saturday && serviceDays?.sunday) {
      setWeekendLabel('Full Weekend');
    }
    else if (serviceDays?.saturday || serviceDays?.sunday) {
      setWeekendLabel('Partial Weekend');
    } else {
      setWeekendLabel('Weekends');
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

  console.log('weekdays checking console', serviceDays);

  const getLabel = (days) => {
    if (days === 'Weekdays') {
      if (serviceDays?.monday || serviceDays?.tuesday || serviceDays?.wednesday || serviceDays?.thursday || serviceDays?.friday) {
        return 'Weekdays Specific';
      } else if (serviceDays?.monday && serviceDays?.tuesday && serviceDays?.wednesday && serviceDays?.thursday && serviceDays?.friday) {
        return 'Any Weekday';
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
        <CommonCheckBox value="NA" checked={serviceDays?.weekDays} onChange={(e) => onWeekDaysCheck(e.target.checked)} label={weekdayLabel} />
        <CommonCheckBox value="NA" checked={serviceDays?.weekEnds} onChange={(e) => onWeekEndsCheck(e.target.checked)} label={weekendLabel} />
        <CommonCheckBox value="NA" checked={serviceDays?.isholidays} onChange={(e) => setServiceDays({ ...serviceDays, isholidays: e.target.checked })} label="Holidays" />
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
