import React, { useEffect, useState } from 'react';
import { EditableText } from '@blueprintjs/core';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { TimePicker } from "@blueprintjs/datetime";
import FormControlLabel from '@mui/material/FormControlLabel';
import style from './index.module.scss';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

const EditableTable = ({ additionalActivityData, getAdditionalActivityData, serviceDays }) => {
    const [additionalActivity, setAdditionalActivity] = useState(additionalActivityData);
    const [activityTableRows, setActivityTableRows] = useState([]);

    useEffect(() => {
        if (additionalActivity?.length === 0) {
            setAdditionalActivity(additionalActivityData);
        }
    }, []);

    useEffect(() => {
        let temp = additionalActivity;
        if (!serviceDays?.weekDays) {
            temp?.map(data => {
                data.weekdayFrom = null;
                data.weekdayTo = null;
            });
        }
        if (!serviceDays?.weekEnds) {
            temp?.map(data => {
                data.weekendFrom = null;
                data.weekendTo = null;
            });
        }
        if (!ServiceDays?.isholidays) {
            temp?.map(data => {
                data.holidayFrom = null;
                data.holidayTo = null;
            });
        }
        setAdditionalActivity(temp);
        getAdditionalActivityData(additionalActivity);
    }, [serviceDays])

    useEffect(() => {
        getAdditionalActivityData(additionalActivity)
    }, [additionalActivity?.length, additionalActivity])

    useEffect(() => {
        getActivitytableRows();
    }, [additionalActivity, additionalActivity?.length, serviceDays])

    const switchTheme = createTheme({
        palette: {
            primary: {
                main: '#7165E3',
            },
        },
    });

    const handleActivityChange = (value, index, name) => {
        let temp = additionalActivity;
        temp?.filter((data, indexVal) => index === indexVal)?.map(data => {
            data[name] = value;
        })
        setAdditionalActivity(temp);
        getActivitytableRows();
    }

    const getActivitytableRows = () => {
        let temp = [];
        for (let i = 0; i < additionalActivity?.length; i++) {
            temp[i] = (
                <div className={`${style.tableData} ${style.editableTableGridStyle} ${style.alternativeBackgroundColor} ${style.verticalAlignCenter}`} key={i}>
                    <EditableText placeholder='Enter Service' value={additionalActivity?.[i]?.activity} onChange={(e) => handleActivityChange(e, i, 'activity')} />
                    <div className={`${style.displayInRow}`}>
                        <TimePicker
                            useAmPm={false}
                            disabled={!serviceDays?.weekDays}
                            onChange={(e) => {
                                handleActivityChange(e, i, 'weekdayFrom');
                            }}
                            className={style.reducedTimeWidth}
                            value={new Date(additionalActivity?.[i]?.weekdayFrom || new Date())}
                        />
                        <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                        <TimePicker
                            useAmPm={false}
                            disabled={!serviceDays?.weekDays}
                            onChange={(e) => {
                                handleActivityChange(e, i, 'weekdayTo');
                            }}
                            value={new Date(additionalActivity?.[i]?.weekdayTo || new Date())}
                        />
                    </div>


                    <div className={style.displayInRow}>
                        <TimePicker
                            useAmPm={false}
                            disabled={!serviceDays?.weekEnds}
                            onChange={(e) => {
                                handleActivityChange(e, i, 'weekendFrom');
                            }}
                            value={new Date(additionalActivity?.[i]?.weekendFrom || new Date())}
                        />
                        <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                        <TimePicker
                            useAmPm={false}
                            disabled={!serviceDays?.weekEnds}
                            onChange={(e) => {
                                handleActivityChange(e, i, 'weekendTo');
                            }}
                            value={new Date(additionalActivity?.[i]?.weekendTo || new Date())}
                        />
                    </div>

                    <div className={style.displayInRow}>
                        <TimePicker
                            useAmPm={false}
                            disabled={!serviceDays?.isholidays}
                            onChange={(e) => {
                                handleActivityChange(e, i, 'holidayFrom');
                            }}
                            value={new Date(additionalActivity?.[i]?.holidayFrom || new Date())}
                        />
                        <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                        <TimePicker
                            useAmPm={false}
                            disabled={!serviceDays?.isholidays}
                            onChange={(e) => {
                                handleActivityChange(e, i, 'holidayTo');
                            }}
                            value={new Date(additionalActivity?.[i]?.holidayFrom || new Date())}
                        />
                    </div>

                    <ThemeProvider theme={switchTheme}>
                        <FormControlLabel
                            control={
                                <Switch
                                    className={` ${style.textAlignLeft}`} checked={additionalActivity?.[i]?.patientMRNRequired}
                                    onChange={e => handleActivityChange(!additionalActivity?.[i]?.patientMRNRequired, i, 'patientMRNRequired')} />
                            }
                            color='primary'
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={additionalActivity?.[i]?.patientMRNRequired ? 'YES' : 'NO'}
                        />
                    </ThemeProvider>
                    <ThemeProvider theme={switchTheme}>
                        <FormControlLabel
                            control={
                                <Switch
                                    key={`Attending Doc Required${i}`}
                                    className={` ${style.textAlignLeft}`}
                                    defaultChecked={additionalActivity?.[i]?.attendingDocRequired}
                                    onChange={e => handleActivityChange(!additionalActivity?.[i]?.attendingDocRequired, i, 'attendingDocRequired')}
                                />
                            }
                            color='primary'
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={additionalActivity?.[i]?.attendingDocRequired ? 'YES' : 'NO'}
                        />
                    </ThemeProvider>
                </div>

            )
        }
        setActivityTableRows(temp);
    }

    console.log('data', additionalActivity)


    return (
        <div>
            <div className={`${style.tableHeader} ${style.editableTableGridStyle} ${style.marginTop10}`}>
                <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} >ADDITIONAL ON CALL SERVICE</p>
                <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} >WEEKDAY HOURS</p>
                <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} >WEEKEND HOURS</p>
                <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} >HOLIDAY HOURS</p>
                <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} >REQUIRE PATIENT MRN</p>
                <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter}`} >REQUIRE ATTENDING DOC</p>
            </div>
            {
                activityTableRows
            }
        </div>
    )
}

export default EditableTable;