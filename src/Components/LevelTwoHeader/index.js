import React, {useEffect, useState} from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import CrossPink from '../../images/crossPink.png';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import {format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths} from 'date-fns';

import style from './index.module.scss';

const LevelTwoHeader = ({heading, updatedTime, onCloseLevel2}) => {
    const [timeFrame, setTimeFrame] = useState('This Week');
    const [showCustomRangeSelection, setShowCustomRangeSelection] = useState(true);
    const [from, setFrom] = useState(startOfWeek(new Date()));
    const [to, setTo] = useState(endOfWeek(new Date()));
 
    useEffect(()=> {
        let differenceMonthsCount = (timeFrame === 'Last 60 days' ? 2 : timeFrame === 'Last 90 days' ? 3 : 0)
        if(timeFrame === 'This Week'){
            setFrom(startOfWeek(new Date()));
            setTo(endOfWeek(new Date()));
        } else if(timeFrame === 'Last 60 days' || timeFrame === 'Last 90 days'){
            setFrom(subMonths(new Date(), differenceMonthsCount));
            setTo(new Date());
        } else {
            return;
        }
    }, [timeFrame])

    const handleChange = (event) => {
        setTimeFrame(event.target.value);
        if(event.target.value === "Custom Period"){
            setShowCustomRangeSelection(true)
        }
    };
    return(
        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
            <div className={`${style.displayInRow}`}>
                <div className={`${style.userNameStyle} ${style.alignCenter} `}>
                    {heading}
                </div>
                <div className={`${style.loginStatus} ${style.marginLeft10}`}>
                    {updatedTime}
                </div>
            </div>
            <div className={`${style.displayInRow}`}>
                <div className={style.marginRight}>
                    {`${format(new Date(from), 'MM-dd-yyyy')} to ${format(new Date(to), 'MM-dd-yyyy')}`}
                </div>
                <FormControl sx={{ minWidth: 180, fontSize: 20 }} className={`${style.reduceMarginTop} ${style.marginLeft20}`} size="small">
                    <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={timeFrame}
                        onChange={handleChange}
                    >
                        <MenuItem value={'This Week'}>This Week</MenuItem>
                        <MenuItem value={'Last Week'}>Last Week</MenuItem>
                        <MenuItem value={'Last Month'}>Last Month</MenuItem>
                        <MenuItem value={'Last 60 days'}>Last 60 days</MenuItem>
                        <MenuItem value={'Last 90 days'}>Last 90 days</MenuItem>
                        <MenuItem value={'Custom Period'}>Custom Period</MenuItem>
                    </Select>
                </FormControl>
                {(timeFrame === "Custom Period" && showCustomRangeSelection) && (
                    <div className={style.customTimeFrameCard}>
                        <div className={style.spaceBetween}>
                            <div className={style.customTimeFrameHeading}>
                            CUSTOM PERIOD
                            </div>
                            <CloseIcon fontSize="small" onClick={()=> setShowCustomRangeSelection(false)} className={style.cursorPointer} />
                        </div>
                        <div className={`${style.dividerStyle} ${style.marginTop10}`}></div>
                        <div className={style.marginTop10}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                InputProps={{
                                    style: {
                                        fontSize: 14,
                                        height: 30,
                                    }
                                }}
                                value={from}
                                onChange={(e) => setFrom(e)}
                                renderInput={(params) => <TextField {...params} inputProps={{
                                ...params.inputProps,
                                placeholder: "From"
                                }}/>}
                            />
                            </LocalizationProvider>
                        </div>
                        <div className={style.marginTop10}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                InputProps={{
                                    style: {
                                        fontSize: 14,
                                        height: 30,
                                    }
                                }}
                                value={to}
                                onChange={(e) => setTo(e)}
                                renderInput={(params) => <TextField {...params} inputProps={{
                                ...params.inputProps,
                                placeholder: "To"
                                }}/>}
                            />
                            </LocalizationProvider>
                        </div>
                        <div className={style.customRangeHelpStyle}>
                        Period of interest should not exceed 365 days
                        </div>
                    </div>
                )}
                <img src={CrossPink} alt="cross" className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft20}`} onClick={() => onCloseLevel2()}  />
            </div>
        </div>
    )
}

export default LevelTwoHeader;