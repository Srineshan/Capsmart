import React, { useState, useEffect } from 'react';
import { InputGroup, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import { TimePicker } from "@blueprintjs/datetime";
import { GetDateFromHours } from './../../utils/formatting';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

import style from './index.module.scss';

const switchTheme = createTheme({
    palette: {
        primary: {
            main: '#7165E3',
        },
    },
});

const OnCallCoverageFields = ({ getMetaData, serviceSelected, timeCommitment }) => {
    const [metadata, setMetadata] = useState({
        min: '0',
        max: '0',
        frequency: 'WEEK',
        onCallCoverageFor: [],
        additionalScheduleValue: '0',
        additionalScheduleFrequency: 'WEEK',
        additionalScheduleRequired: true,
        billableService: true,
        rateType: 'HOURLY',
        sessionDuration: '0',
        sessionAmount: '0',
        totalSession: '0',
        totalSessionFrequency: 'YEAR',
        workingTimeFrom: new Date(),
        workingTimeTo: new Date(),
        serviceDays: {
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
            weekDays: false,
            weekEnds: false,
            monday: false
        },
        weekdaysCount: '0',
        weekendsCount: '0'
    });

    const [specified, setSpecified] = useState(0);

    useEffect(()=>{
      let additionalFreq = metadata?.additionalScheduleFrequency === 'WEEK' ? timeCommitment?.value || 0 : (timeCommitment?.value/2) || 0;
      let value = (parseInt(metadata?.min || '0') * timeCommitment?.value || 0) + (parseInt(metadata?.additionalScheduleValue || '0')  * additionalFreq);
      setSpecified(value);
    }, [metadata?.min, metadata?.additionalScheduleValue, metadata?.additionalScheduleFrequency, timeCommitment?.value])


    useEffect(() => {
        setSelectedValues();
    }, [serviceSelected]);

    const setSelectedValues = () => {
        setMetadata({
            ...metadata,
            min: serviceSelected?.contractedSchedule?.minimum?.value,
            max: serviceSelected?.contractedSchedule?.maximum?.value,
            frequency: serviceSelected?.contractedSchedule?.frequency,
            onCallCoverageFor: serviceSelected?.activityResponse?.dataMap?.onCallCoverageFor,
            additionalScheduleValue: serviceSelected?.additionalSchedule?.value,
            additionalScheduleFrequency: serviceSelected?.additionalSchedule?.frequency,
            additionalScheduleRequired: serviceSelected?.additionalSchedule?.scheduleRequired,
            billableService: serviceSelected?.billableService,
            rateType: serviceSelected?.rateType,
            sessionDuration: serviceSelected?.duration?.hours || '0',
            sessionAmount: serviceSelected?.payableAmount?.value,
            totalSession: serviceSelected?.totalSessions?.value,
            totalSessionFrequency: serviceSelected?.totalSessions?.frequency,
            workingTimeFrom: GetDateFromHours(serviceSelected?.workingPeriod?.from?.toString() || ''),
            workingTimeTo: GetDateFromHours(serviceSelected?.workingPeriod?.to?.toString() || ''),
            serviceDays: serviceSelected?.serviceDays,
        });
    }

    const limit5 = 5;

    console.log('data', metadata);

    useEffect(() => {
        getMetaData(metadata)
    }, [metadata])

    const handleValueChange = (name, value) => {
        setMetadata({ ...metadata, [name]: value });
    }

    const getServiceDaysMetadata = (serviceDays) => {
        setMetadata({ ...metadata, serviceDays: serviceDays})
    }

    const handleOnCallCoverageFor = (value, e) => {
        if (e.target.checked) {
            let temp = metadata?.onCallCoverageFor || [];
            temp.push(value)
            setMetadata({ ...metadata, onCallCoverageFor: temp });
        } else {
            let temp = metadata?.onCallCoverageFor?.filter(data => data !== value)?.map(data => data) || [];
            setMetadata({ ...metadata, onCallCoverageFor: temp });
        }
    }

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>On Call Coverage For *</div>
                <div className={style.spaceBetween}>
                    <FormGroup className={`${style.marginLeft10} ${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox checked={metadata?.onCallCoverageFor?.includes('InPatient')} onChange={(e) => handleOnCallCoverageFor('InPatient', e)} />} label={<Typography variant="body2" color="textSecondary">Inpatient</Typography>} />
                    </FormGroup>
                    <FormGroup className={`${style.marginLeft10} ${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox checked={metadata?.onCallCoverageFor?.includes('Ambulatory')} onChange={(e) => handleOnCallCoverageFor('Ambulatory', e)} />} label={<Typography variant="body2" color="textSecondary">Ambulatory</Typography>} />
                    </FormGroup>
                    <FormGroup className={`${style.marginLeft10} ${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox checked={metadata?.onCallCoverageFor?.includes('ED')} onChange={(e) => handleOnCallCoverageFor('ED', e)} />} label={<Typography variant="body2" color="textSecondary">ED</Typography>} />
                    </FormGroup>
                    <FormGroup className={`${style.marginLeft10} ${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox checked={metadata?.onCallCoverageFor?.includes('L & D')} onChange={(e) => handleOnCallCoverageFor('L & D', e)} />} label={<Typography variant="body2" color="textSecondary">L & D</Typography>} />
                    </FormGroup>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Service Days*</div>
                <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected} />
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Number of On Call Duty Days*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MIN</div>
                        <EditableText value={metadata?.min} placeholder='' onChange={(e) => handleValueChange('min', e)} type='number' min="0" className={style.serviceProvidedEditableTextStyle} />
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MAX</div>
                        <EditableText value={metadata?.max} placeholder='' onChange={(e) => handleValueChange('max', e)} type='number' min="0" className={style.serviceProvidedEditableTextStyle} />
                    </div>
                    <Select
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        className={`${style.fullWidth} ${style.marginLeft20}`}
                        value={metadata?.frequency}
                        onChange={(e) => handleValueChange('frequency', e.target.value)}
                    >
                        <MenuItem value="">Select Frequecy</MenuItem>
                        <MenuItem value={'WEEK'} disabled={timeCommitment?.frequency !== 'WEEKS_PER_CONTRACTYEAR'}>Per Week</MenuItem>
                        <MenuItem value={'MONTH'} disabled={timeCommitment?.frequency !== 'MONTHS_PER_CONTRACTYEAR'}>Per Month</MenuItem>
                    </Select>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Additional Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <ThemeProvider theme={switchTheme}>
                            <FormControlLabel
                                control={
                                    <Switch checked={metadata?.additionalSchedule} className={` ${style.textAlignLeft}`} />
                                }
                                color='primary'
                                onChange={(e) => handleValueChange('additionalScheduleRequired', !metadata?.additionalScheduleRequired)}
                                className={`${style.switchFontStyle} ${style.flexLeft}`}
                                label={metadata?.additionalScheduleRequired ? 'YES' : 'NO'}
                            />
                        </ThemeProvider>
                    </div>
                    {
                        metadata?.additionalScheduleRequired &&
                        <>
                            <InputGroup value={metadata?.additionalScheduleValue}
                                onChange={(e) => handleValueChange('additionalScheduleValue', e.target.value)}
                                className={` ${style.threeFieldWidth}`} />
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                                value={metadata?.additionalScheduleFrequency}
                                onChange={(e) => handleValueChange('additionalScheduleFrequency', e.target.value)}
                            >
                                <MenuItem value="">Select Frequecy</MenuItem>
                                <MenuItem value={'WEEK'} disabled={timeCommitment?.frequency !== 'WEEKS_PER_CONTRACTYEAR'}>Every Week</MenuItem>
                                <MenuItem value={'EVERY_OTHER_WEEK'} disabled={timeCommitment?.frequency !== 'WEEKS_PER_CONTRACTYEAR'}>Every Other Week</MenuItem>
                                <MenuItem value={'MONTH'} disabled={timeCommitment?.frequency !== 'MONTHS_PER_CONTRACTYEAR'}>Every Month</MenuItem>
                                <MenuItem value={'EVERY_OTHER_MONTH'} disabled={timeCommitment?.frequency !== 'MONTHS_PER_CONTRACTYEAR'}>Every Other Month</MenuItem>
                            </Select>
                        </>
                    }
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Billable Service*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <ThemeProvider theme={switchTheme}>
                            <FormControlLabel
                                control={
                                    <Switch checked={metadata?.billableService}
                                        className={` ${style.textAlignLeft}`} />
                                }
                                color='primary'
                                onChange={(e) => handleValueChange('billableService', !metadata?.billableService)}
                                className={`${style.switchFontStyle} ${style.flexLeft}`}
                                label={metadata?.billableService ? 'YES' : 'NO'}
                            />
                        </ThemeProvider>
                    </div>
                    {
                        // metadata?.billableService &&
                        // <Select
                        //     displayEmpty
                        //     SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        //     className={`${style.threeFieldWidth}`}
                        //     value={metadata?.rateType}
                        //     onChange={(e)=>handleValueChange('rateType',e.target.value)}
                        // >
                        //     <MenuItem value="">Select Frequecy</MenuItem>
                        //     <MenuItem value={'HOURLY'}>Hourly</MenuItem>
                        // </Select>
                    }

                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>On Call Duty Duration</div>
                <div className={`${style.threeFieldWidth}`}>
                    <TextField
                        size="small"
                        InputProps={{
                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                        }}
                        value={metadata?.sessionDuration}
                        onChange={(e) => handleValueChange('sessionDuration', e.target.value)}
                    />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>On Call Payment Amount*</div>
                <div className={`${style.displayInRow}`}>
                    <div className={`${style.threeFieldWidth}`}>
                        <TextField
                            size="small"
                            disabled={metadata?.sessionDuration === '' || metadata?.sessionDuration === '0' || metadata?.sessionDuration === undefined}
                            InputProps={{
                                startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                            }}
                            value={metadata?.sessionAmount}
                            onChange={(e) => handleValueChange('sessionAmount', e.target.value)}
                        />
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>$ {(metadata?.sessionAmount / metadata?.sessionDuration || 0).toFixed(2)} per Hour (Pro Rata)</p>
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Total Contracted Service Sessions*</div>
                <div className={style.twoCol}>
                <div className={`${style.spaceBetween} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                    <EditableText placeholder='' value={metadata?.totalSession} type='number' min="0"
                        className={style.editableSessionTextStyle}
                        onChange={(e) => {
                            let value = e.slice(0, e.slice());
                            handleValueChange('totalSession', value);
                        }} />
                    <div className={`${style.textElement} ${parseInt(metadata?.totalSession) === specified ? style.greenBase : style.redBase}`}>{specified} Specified</div>
                </div>
                    <div className={style.verticalAlignCenter}>
                        <p className={`${style.extentionLableStyle}`}>For {timeCommitment?.value} {timeCommitment?.frequency === 'WEEKS_PER_CONTRACTYEAR' ? 'Weeks' :'Months'} Per Contract Year</p>
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Allowable Working Day Hours For Service*</div>
                <div className={style.displayInRow}>
                    <TimePicker
                        useAmPm={false}
                        onChange={(e) => {
                            handleValueChange('workingTimeFrom', e);
                        }}
                        value={new Date(metadata?.workingTimeFrom)}
                    />
                    <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                    <TimePicker
                        useAmPm={false}
                        onChange={(e) => handleValueChange('workingTimeTo', e)}
                        value={new Date(metadata?.workingTimeTo)}
                        minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000))}
                    />
                </div>
            </div>
        </div>
    )
}

export default OnCallCoverageFields;
