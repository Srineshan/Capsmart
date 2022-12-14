import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CloseIcon from '@mui/icons-material/Close';
import CrossPink from '../../images/crossPink.png';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, subDays } from 'date-fns';
import AddNewEntity from '../../images/addEntity.png'
import AddRefresh from '../../images/refreshEntity.png'
import { Icon, Intent } from "@blueprintjs/core";

import style from './index.module.scss';

const LevelTwoHeader = ({ heading, updatedTime, onCloseLevel2, needDateFilter, getFrom, getTo, getAddEntityDialog, setIsEdit, needHeader }) => {
    const [timeFrame, setTimeFrame] = useState('This Week');
    const [showCustomRangeSelection, setShowCustomRangeSelection] = useState(true);
    const [from, setFrom] = useState(startOfWeek(new Date()));
    const [to, setTo] = useState(endOfWeek(new Date()));

    useEffect(() => {
        if (needDateFilter) {
            let differenceDaysCount = (timeFrame === 'Last 60 days' ? 60 : timeFrame === 'Last 90 days' ? 90 : 0)
            if (timeFrame === 'This Week') {
                setFrom(startOfWeek(new Date()));
                setTo(endOfWeek(new Date()));
                getFrom(startOfWeek(new Date()));
                getTo(endOfWeek(new Date()));
            } else if (timeFrame === 'Last Week') {
                setFrom(subDays(startOfWeek(new Date()), 7));
                setTo(subDays(startOfWeek(new Date()), 1));
                getFrom(subDays(startOfWeek(new Date()), 7));
                getTo(subDays(startOfWeek(new Date()), 1));
            } else if (timeFrame === 'Last Month') {
                setFrom(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
                setTo(subDays(startOfMonth(new Date()), 1));
                getFrom(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
                getTo(subDays(startOfMonth(new Date()), 1));
            } else if (timeFrame === 'Last 60 days' || timeFrame === 'Last 90 days') {
                setFrom(subDays(new Date(), differenceDaysCount));
                setTo(new Date());
                getFrom(subDays(new Date(), differenceDaysCount));
                getTo(new Date());
            } else {
                return;
            }
        }
    }, [timeFrame])

    const handleChange = (event) => {
        setTimeFrame(event.target.value);
        if (event.target.value === "Custom Period") {
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
                {needDateFilter && (
                    <>
                        <div className={`${style.marginRight} ${style.dateRangeTextStyle}`}>
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
                                    <CloseIcon fontSize="small" onClick={() => setShowCustomRangeSelection(false)} className={style.cursorPointer} />
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
                                            onChange={(e) => { setFrom(e); getFrom(e) }}
                                            renderInput={(params) => <TextField {...params} inputProps={{
                                                ...params.inputProps,
                                                placeholder: "From"
                                            }} />}
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
                                            onChange={(e) => { setTo(e); getTo(e) }}
                                            renderInput={(params) => <TextField {...params} inputProps={{
                                                ...params.inputProps,
                                                placeholder: "To"
                                            }} />}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className={style.customRangeHelpStyle}>
                                    Period of interest should not exceed 365 days
                                </div>
                            </div>
                        )}
                    </>
                )}

                {!needHeader && (<img src={CrossPink} alt="cross" className={`${style.crossStyle} ${style.cursorPointer} ${style.marginLeft20}`} onClick={() => onCloseLevel2()} />)}

                {needHeader && (
                    <>
                        <img src={AddRefresh} className={`${style.colorFileStyle} ${style.marginLeft20}`} alt='' />
                        <img src={AddNewEntity} onClick={() => { getAddEntityDialog(true); setIsEdit(false) }} className={`${style.colorFileStyle} ${style.marginLeft20}`} alt='' />
                        <Link to={"/Screens/ReferenceList/superAdminDashboard"}> <Icon icon="cross" size={25} intent={Intent.DANGER} className={`${style.marginLeft20} ${style.marginBottom5}`} /> </Link>
                    </>
                )}
            </div>
        </div>
    )
}

export default LevelTwoHeader;