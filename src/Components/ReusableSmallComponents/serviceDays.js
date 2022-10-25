import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography'; 
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';

import style from './index.module.scss';

const ServiceDays = () => {
    const [weekdaysCount, setWeekdaysCount] = useState(0);
    const  [weekendsCount, setWeekendsCount] = useState('');
    return(
        <div>
            <div className={style.displayInRow}>
                <div className={`${style.displayInRow} ${style.fullWidth}`}>
                    <FormGroup className={`${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox value="NA" />} label={<Typography variant="body2" color="textSecondary">Weekdays</Typography>} />
                    </FormGroup>
                    <TextField
                        size="small"
                        value={weekdaysCount}
                        onChange={(e)=> setWeekdaysCount(e.target.value)}
                        sx={{ fontSize: 15 }}
                        InputProps={{
                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Days</InputAdornment>,
                        }}
                        />
                </div>
                <div className={`${style.displayInRow} ${style.fullWidth}`}>
                    <FormGroup className={`${style.marginLeft10} ${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox value="NA" />}  label={<Typography variant="body2" color="textSecondary">Weekends</Typography>} />
                    </FormGroup>
                    <TextField
                        size="small"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Days</InputAdornment>,
                        }}
                    />
                </div>
                <div className={style.marginLeft10}>
                    <div className={`${style.greenBase} ${style.alignCenter}`}>182</div>
                    <div className={style.totalTextStyle}>TOTAL</div>
                </div>
            </div>
            <div className={`${style.twoCol} ${style.marginTop10}`}>
                <div className={style.displayInRow}>
                    <div className={`${style.dayStyle} ${style.selectedDay} ${style.alignCenter} ${style.cursorPointer}`}>M</div>
                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer}`}>T</div>
                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer}`}>W</div>
                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer}`}>T</div>
                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer}`}>F</div>
                </div>
                <div className={style.displayInRow}>
                    <div className={`${style.dayStyle} ${style.selectedDay} ${style.alignCenter} ${style.cursorPointer}`}>S</div>
                    <div className={`${style.dayStyle} ${style.selectedDay} ${style.alignCenter} ${style.cursorPointer}`}>S</div>
                </div>
            </div>
            <div className={`${style.daysWarningText} ${style.marginTop10}`}>
            Only specify days of the week for service if you are sure. Else do not specify.
            </div>
        </div>
    )
}

export default ServiceDays;