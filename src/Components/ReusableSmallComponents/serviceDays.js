import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

import style from './index.module.scss';

const ServiceDays = ({setMetaData, selectedService}) => {
    const [daysCount, setDaysCount] = useState({weekdays:'', weekends:''});
    const [serviceDays, setServiceDays] = useState({
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      weekDays:false,
      weekEnds: false,
      monday: false
    });

    useEffect(()=>{
      setServiceDays(selectedService?.serviceDays);
    },[selectedService])

    useEffect(()=>{
      setMetaData(daysCount, serviceDays);
    }, [daysCount, serviceDays])

    useEffect(()=>{
      let weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      let weekEnds = ['saturday', 'sunday'];
      let weekDaysCount = 0;
      let weekEndsCount = 0;
      Object.keys(serviceDays || [])?.filter(data=>weekEnds?.map(days=>days)?.includes(data) && serviceDays[data] === true)?.map(data=>{
        weekEndsCount = weekEndsCount + 52;
      });
      Object.keys(serviceDays || [])?.filter(data=>weekDays?.map(days=>days)?.includes(data) && serviceDays[data] === true)?.map(data=>{
        weekDaysCount = weekDaysCount + 52;
      });
      console.log('dayscount', weekDaysCount,weekEndsCount );
      setDaysCount({...daysCount, weekdays: weekDaysCount, weekends: weekEndsCount});

    }, [serviceDays])

    const onWeekDaysCheck = (checked) => {
      if(checked){
        setServiceDays({...serviceDays,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        weekDays:checked,
        monday: true})
      }else{
        setServiceDays({...serviceDays,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        weekDays:checked,
        monday: false})
      }
    }

    const onWeekEndsCheck = (checked) => {
      if(checked){
        setServiceDays({...serviceDays,
        saturday: true,
        sunday: true,
        weekEnds:checked})
      }else{
        setServiceDays({...serviceDays,
        saturday: false,
        sunday: false,
        weekEnds:checked})
      }
    }

    return(
        <div>
            <div className={style.displayInRow}>
                <div className={`${style.displayInRow} ${style.fullWidth}`}>
                    <FormGroup className={`${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox value="NA" checked={serviceDays?.weekDays} onChange={(e)=>onWeekDaysCheck(e.target.checked)}/>} label={<Typography variant="body2" color="textSecondary">Weekdays</Typography>} />
                    </FormGroup>
                    <TextField
                        size="small"
                        value={daysCount?.weekdays}
                        onChange={(e)=> setDaysCount({...daysCount, weekdays:e.target.value})}
                        sx={{ fontSize: 15 }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Days</InputAdornment>,
                        }}
                        />
                </div>
                <div className={`${style.displayInRow} ${style.fullWidth}`}>
                    <FormGroup className={`${style.marginLeft10} ${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox value="NA" checked={serviceDays?.weekEnds} onChange={(e)=>onWeekEndsCheck(e.target.checked)}/>}  label={<Typography variant="body2" color="textSecondary">Weekends</Typography>} />
                    </FormGroup>
                    <TextField
                        size="small"
                        value={daysCount?.weekends}
                        onChange={(e)=> setDaysCount({...daysCount, weekends:e.target.value})}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                        }}
                    />
                </div>
                <div className={style.marginLeft10}>
                    <div className={`${style.greenBase} ${style.alignCenter}`}>{daysCount?.weekdays + daysCount?.weekends}</div>
                    <div className={style.totalTextStyle}>TOTAL</div>
                </div>
            </div>
            <div className={`${style.twoCol} ${style.marginTop10}`}>
                <div className={style.displayInRow}>
                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.monday ? `${style.selectedDay}` : ''}`} onClick={()=>setServiceDays({...serviceDays, monday:!serviceDays?.monday})}>M</div>
                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.tuesday ? `${style.selectedDay}` : ''}`} onClick={()=>setServiceDays({...serviceDays, tuesday:!serviceDays?.tuesday})}>T</div>
                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.wednesday ? `${style.selectedDay}` : ''}`} onClick={()=>setServiceDays({...serviceDays, wednesday:!serviceDays?.wednesday})}>W</div>
                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.thursday ? `${style.selectedDay}` : ''}`} onClick={()=>setServiceDays({...serviceDays, thursday:!serviceDays?.thursday})}>T</div>
                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.friday ? `${style.selectedDay}` : ''}`} onClick={()=>setServiceDays({...serviceDays, friday:!serviceDays?.friday})}>F</div>
                </div>
                <div className={style.displayInRow}>
                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.saturday ? `${style.selectedDay}` : ''}`} onClick={()=>setServiceDays({...serviceDays, saturday:!serviceDays?.saturday})}>S</div>
                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${serviceDays?.sunday ? `${style.selectedDay}` : ''}`} onClick={()=>setServiceDays({...serviceDays, sunday:!serviceDays?.sunday})}>S</div>
                </div>
            </div>
            <div className={`${style.daysWarningText} ${style.marginTop10}`}>
            Only specify days of the week for service if you are sure. Else do not specify.
            </div>
        </div>
    )
}

export default ServiceDays;
