import React, { useState, useEffect } from 'react';
import { EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import { TimePicker } from "@blueprintjs/datetime";
import { GetDateFromHours } from './../../utils/formatting';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';
import CommonInputField from '../../Components/CommonFields/CommonInputField';

import style from './index.module.scss';
import EditableTable from './editableTable';

const switchTheme = createTheme({
    palette: {
        primary: {
            main: '#7165E3',
        },
    },
});

const OnCallCoverageFields = ({ getMetaData, serviceSelected, timeCommitment }) => {
    console.log('servce Slected', serviceSelected);
    const [metadata, setMetadata] = useState({
        min: '0',
        max: '0',
        frequency: 'WEEK',
        onCallCoverageFor: [],
        additionalScheduleValue: '0',
        additionalScheduleFrequency: '',
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
        weekendsCount: '0',
        dependantServiceIncluded: false,
        additionalActivity: [{ activity: '', weekdayFrom: null, weekdayTo: null, weekendFrom: null, weekendTo: null, holidayFrom: null, holidayTo: null, patientMRNRequired: false, attendingDocRequired: false }],
        additionalActivityBillable: false,
        additionalActivityPaymentApprovalRequired: false,
        dependencyPayableAmount: '0',
        dependencyFrequency: 'PER_DAY',
        patientMRNRequired: false,
        attendingDocRequired: false,
        customizedSchedule: true,
        weekdayFrom: null,
        weekdayTo: null,
        weekdayDuration: 0,
        weekdayMin: 0,
        weekdayMax: 0,
        weekdayFrequency: 'WEEK',
        weekdayStartDate: new Date(),
        weekdayEndDate: new Date(),
        weekendFrom: null,
        weekendTo: null,
        weekendStartday: '',
        weekendEndday: '',
        weekendDuration: 0,
        weekendMin: 0,
        weekendMax: 0,
        weekendFrequency: 'WEEK',
        weekendStartDate: new Date(),
        weekendEndDate: new Date(),
        holidayFrom: null,
        holidayTo: null,
        holidayFrequency: 'WEEK',
        holidayTerm: 'PRIOR_DAY',
        holidayDuration: 0,
        holidayMin: 0,
        holidayMax: 0,
    });

    const onCustomizeFieldOptionChange = (value) => {
        if (value) {
            setMetadata({
                ...metadata,
                customizedSchedule: value,
                weekdayFrom: null,
                weekdayTo: null,
                weekdayDuration: 0,
                weekdayMin: 0,
                weekdayMax: 0,
                weekdayFrequency: 'WEEK',
                weekdayStartDate: new Date(),
                weekdayEndDate: new Date(),
                weekendFrom: null,
                weekendTo: null,
                weekendStartday: '',
                weekendEndday: '',
                weekendDuration: 0,
                weekendMin: 0,
                weekendMax: 0,
                weekendFrequency: 'WEEK',
                weekendStartDate: new Date(),
                weekendEndDate: new Date(),
                holidayFrom: null,
                holidayTo: null,
                holidayFrequency: 'WEEK',
                holidayTerm: 'PRIOR_DAY',
                holidayDuration: 0,
                holidayMin: 0,
                holidayMax: 0,
                patientMRNRequired: false,
                attendingDocRequired: false,
            })

        } else {
            setMetadata({ ...metadata, customizedSchedule: value })
        }
    }

    const getAdditionalActivityData = (value) => {
        setMetadata({ ...metadata, additionalActivity: value });
    }

    const [specified, setSpecified] = useState(0);

    console.log('test', serviceSelected?.patientMRNRequired, serviceSelected?.attendingDocRequired, serviceSelected?.customizedSchedule);

    useEffect(() => {
        let additionalFreq = metadata?.additionalScheduleFrequency === 'WEEK' ? timeCommitment?.value || 0 : (timeCommitment?.value / 2) || 0;
        let value = (parseInt(metadata?.min || '0') * timeCommitment?.value || 0) + (parseInt(metadata?.additionalScheduleValue || '0') * additionalFreq);
        setSpecified(value);
    }, [metadata?.min, metadata?.additionalScheduleValue, metadata?.additionalScheduleFrequency, timeCommitment?.value])

    useEffect(() => {
        if (Object.entries(serviceSelected)?.length !== 0) {
            setSelectedValues();
        }
    }, [serviceSelected]);


    const setSelectedValues = () => {
        console.log('console check', serviceSelected);
        let dependentActivities = [];
        serviceSelected?.dependentService?.additionalServices?.map(data => {
            dependentActivities.push(
                { activity: data?.activity?.activity, weekdayFrom: GetDateFromHours(data?.weekday?.from?.toString() || ''), weekdayTo: GetDateFromHours(data?.weekday?.to?.toString() || ''), weekendFrom: GetDateFromHours(data?.weekend?.from?.toString() || ''), weekendTo: GetDateFromHours(data?.weekend?.to?.toString() || ''), holidayFrom: GetDateFromHours(data?.holiday?.from?.toString() || ''), holidayTo: GetDateFromHours(data?.holiday?.to?.toString() || ''), patientMRNRequired: data?.patientMRNRequired, attendingDocRequired: data?.attendingDocRequired }
            )
        })

        setMetadata({
            ...metadata,
            refId: serviceSelected?.refId,
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
            additionalActivity: dependentActivities,
            additionalActivityBillable: serviceSelected?.dependentService?.billableService,
            additionalActivityPaymentApprovalRequired: serviceSelected?.dependentService?.paymentApprovalRequired,
            dependencyPayableAmount: serviceSelected?.dependentService?.payableAmount?.value,
            dependencyFrequency: serviceSelected?.dependentService?.frequency,
            dependantServiceIncluded: serviceSelected?.dependantServiceIncluded,
            weekdayFrom: GetDateFromHours(serviceSelected?.customschedule?.weekday?.from?.toString() || ''),
            weekdayTo: GetDateFromHours(serviceSelected?.customschedule?.weekday?.to?.toString() || ''),
            weekdayDuration: serviceSelected?.customschedule?.weekday?.duration?.hours,
            weekdayMin: serviceSelected?.customschedule?.weekday?.target?.minimum?.value,
            weekdayMax: serviceSelected?.customschedule?.weekday?.target?.maximum?.value,
            weekdayFrequency: serviceSelected?.customschedule?.weekday?.target?.frequency,
            weekendFrom: GetDateFromHours(serviceSelected?.customschedule?.weekend?.from?.toString() || ''),
            weekendTo: GetDateFromHours(serviceSelected?.customschedule?.weekend?.to?.toString() || ''),
            weekendStartday: serviceSelected?.customschedule?.weekend?.startDay,
            weekendEndday: serviceSelected?.customschedule?.weekend?.endDay,
            weekendDuration: serviceSelected?.customschedule?.weekend?.duration?.hours,
            weekendMin: serviceSelected?.customschedule?.weekend?.target?.minimum?.value,
            weekendMax: serviceSelected?.customschedule?.weekend?.target?.maximum?.value,
            weekendFrequency: serviceSelected?.customschedule?.weekend?.target?.frequency,
            holidayFrom: GetDateFromHours(serviceSelected?.customschedule?.holiday?.from?.toString() || ''),
            holidayTo: GetDateFromHours(serviceSelected?.customschedule?.holiday?.to?.toString() || ''),
            holidayFrequency: serviceSelected?.customschedule?.holiday?.target?.frequency,
            holidayTerm: serviceSelected?.customschedule?.holiday?.holidayTerm,
            holidayDuration: serviceSelected?.customschedule?.holiday?.duration?.hours,
            holidayMin: serviceSelected?.customschedule?.holiday?.target?.minimum?.value,
            holidayMax: serviceSelected?.customschedule?.holiday?.target?.maximum?.value,
            patientMRNRequired: serviceSelected?.patientMRNRequired,
            attendingDocRequired: serviceSelected?.attendingDocRequired,
            customizedSchedule: serviceSelected?.customizedSchedule,
        });
    }

    console.log('service Days', metadata?.serviceDays);

    const limit5 = 5;


    useEffect(() => {
        getMetaData(metadata)
    }, [metadata])

    const handleValueChange = (name, value) => {
        setMetadata({ ...metadata, [name]: value });
    }

    const getServiceDaysMetadata = (serviceDays) => {
        setMetadata({ ...metadata, serviceDays: serviceDays })
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

    const onTotalSessionChange = (e) => {
        if (e >= 0) {
            let value = e.slice(0, e.slice());
            handleValueChange('totalSession', value);
        }
    }

    const updateWorkingPeriod = (e) => {
        setMetadata({ ...metadata, workingTimeFrom: e });
    }

    const addAdditionalEntry = () => {
        let temp = metadata?.additionalActivity;
        temp.push({ activity: '', weekdayFrom: null, weekdayTo: null, weekendFrom: null, weekendTo: null, holidayfrom: null, holidayTo: null, patientMRNRequired: false, attendingDocRequired: false });
        setMetadata({ ...metadata, aditionalActivity: temp });
    }

    const onCustomizeFieldChange = (value, name) => {
        setMetadata({ ...metadata, [name]: value });
    }


    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>On Call Coverage For *</div>
                <div className={style.spaceBetween}>
                    <FormGroup className={`${style.threeFieldWidth}`}>
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
                <div className={style.extentionLableStyle}>Allowable Service Days*</div>
                <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected} />
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Same On Call Schedule For All Days</div>
                <div className={style.onCallBillableGrid}>
                    <ThemeProvider theme={switchTheme}>
                        <FormControlLabel
                            control={
                                <Switch checked={metadata?.customizedSchedule} className={` ${style.textAlignLeft}`} />
                            }
                            color='primary'
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={metadata?.customizedSchedule ? 'YES' : 'NO'}
                            onChange={(e) => onCustomizeFieldOptionChange(!metadata?.customizedSchedule)}
                        />
                    </ThemeProvider>
                </div>
            </div>
            {!metadata?.customizedSchedule && (
                <div className={`${style.addonAddBox} ${style.marginTop20}`}>
                    <div className={`${style.addManagerGrid}`}>
                        <div className={style.extentionLableStyle}>Weekday</div>
                        <div className={style.displayInRow}>
                            <TimePicker
                                useAmPm={false}
                                onChange={(e) => {
                                    onCustomizeFieldChange(e, 'weekdayFrom');
                                }}
                                disabled={!metadata?.serviceDays?.weekDays}
                                value={new Date(metadata?.weekdayFrom)}
                            />
                            <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                            <TimePicker
                                useAmPm={false}
                                onChange={(e) => {
                                    onCustomizeFieldChange(e, 'weekdayTo');
                                }}
                                disabled={!metadata?.serviceDays?.weekDays}
                                value={new Date(metadata?.weekdayTo)}
                            />
                            <div className={` ${style.marginLeft20} ${style.durationWidth}`}>
                                <TextField
                                    size="small"
                                    type="tel"
                                    maxLength="3"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                    }}
                                    inputProps={{
                                        style: {
                                            height: 15,
                                        },
                                    }}
                                    disabled={!metadata?.serviceDays?.weekDays}
                                    value={metadata?.weekdayDuration}
                                    onChange={(e) => e.target.value >= 0 && onCustomizeFieldChange(e.target.value, 'weekdayDuration')}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Number of On Call Duty Days*</div>
                        <div className={style.displayInRow}>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MIN</div>
                                <EditableText value={metadata?.weekdayMin} placeholder='' disabled={!metadata?.serviceDays?.weekDays} onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekdayMin')} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
                            </div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MAX</div>
                                <EditableText value={metadata?.weekdayMax} placeholder='' disabled={!metadata?.serviceDays?.weekDays} onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekdayMax')} type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
                            </div>
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.fullWidth} ${style.marginLeft20}`}
                                value={metadata?.weekdayFrequency}
                                onChange={(e) => onCustomizeFieldChange(e.target.value, 'weekdayFrequency')}
                                disabled={!metadata?.serviceDays?.weekDays}
                            >
                                <MenuItem value="">Select Frequecy</MenuItem>
                                <MenuItem value={'WEEK'} disabled={timeCommitment?.frequency !== 'WEEK'}>Per Week</MenuItem>
                                <MenuItem value={'MONTH'} disabled={timeCommitment?.frequency !== 'MONTH'}>Per Month</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Weekend</div>
                        <div>
                            <div className={style.displayInRow}>
                                <div className={style.displayInRow}>
                                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${metadata?.weekendStartday === 'FRIDAY' ? style.selectedDay : ''}`} onClick={() => onCustomizeFieldChange('FRIDAY', 'weekendStartday')}>F</div>
                                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${metadata?.weekendStartday === 'SATURDAY' ? style.selectedDay : ''}`} onClick={() => onCustomizeFieldChange('SATURDAY', 'weekendStartday')}>S</div>
                                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${metadata?.weekendStartday === 'SUNDAY' ? style.selectedDay : ''}`} onClick={() => onCustomizeFieldChange('SUNDAY', 'weekendStartday')}>S</div>
                                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${metadata?.weekendStartday === 'MONDAY' ? style.selectedDay : ''}`} onClick={() => onCustomizeFieldChange('MONDAY', 'weekendStartday')}>M</div>
                                </div>
                                <div className={style.alignCenter}>
                                    <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop10} ${style.marginRight}`}>To</p>
                                </div>
                                <div className={`${style.displayInRow} ${style.marginLeft20}`}>
                                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${metadata?.weekendEndday === 'FRIDAY' ? style.selectedDay : ''}`} onClick={() => onCustomizeFieldChange('FRIDAY', 'weekendEndday')}>F</div>
                                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${metadata?.weekendEndday === 'SATURDAY' ? style.selectedDay : ''}`} onClick={() => onCustomizeFieldChange('SATURDAY', 'weekendEndday')}>S</div>
                                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${metadata?.weekendEndday === 'SUNDAY' ? style.selectedDay : ''}`} onClick={() => onCustomizeFieldChange('SUNDAY', 'weekendEndday')}>S</div>
                                    <div className={`${style.dayStyle} ${style.alignCenter} ${style.cursorPointer} ${metadata?.weekendEndday === 'MONDAY' ? style.selectedDay : ''}`} onClick={() => onCustomizeFieldChange('MONDAY', 'weekendEndday')}>M</div>
                                </div>

                            </div>
                            <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                <TimePicker
                                    useAmPm={false}
                                    onChange={(e) => {
                                        onCustomizeFieldChange(e, 'weekendFrom');
                                    }}
                                    disabled={!metadata?.serviceDays?.weekEnds}
                                    value={new Date(metadata?.weekendFrom)}
                                />
                                <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                                <TimePicker
                                    useAmPm={false}
                                    onChange={(e) => {
                                        onCustomizeFieldChange(e, 'weekendTo');
                                    }}
                                    disabled={!metadata?.serviceDays?.weekEnds}
                                    value={new Date(metadata?.weekendTo)}
                                />
                                <div className={` ${style.marginLeft20} ${style.durationWidth}`}>
                                    <TextField
                                        size="small"
                                        type="tel"
                                        maxLength="3"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                        }}
                                        inputProps={{
                                            style: {
                                                height: 15,
                                            },
                                        }}
                                        disabled={!metadata?.serviceDays?.weekEnds}
                                        value={metadata?.weekendDuration}
                                        onChange={(e) => e.target.value >= 0 && onCustomizeFieldChange(e.target.value, 'weekendDuration')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Number of On Call Duty Days*</div>
                        <div className={style.displayInRow}>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MIN</div>
                                <EditableText value={metadata?.weekendMin} disabled={!metadata?.serviceDays?.weekEnds} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekendMin')} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
                            </div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MAX</div>
                                <EditableText value={metadata?.weekendMax} disabled={!metadata?.serviceDays?.weekEnds} placeholder='' onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'weekendMax')} type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
                            </div>
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.fullWidth} ${style.marginLeft20}`}
                                value={metadata?.weekendFrequency}
                                onChange={(e) => onCustomizeFieldChange(e.target.value, 'weekendFrequency')}
                                disabled={!metadata?.serviceDays?.weekEnds}
                            >
                                <MenuItem value="">Select Frequecy</MenuItem>
                                <MenuItem value={'WEEK'} disabled={timeCommitment?.frequency !== 'WEEK'}>Per Week</MenuItem>
                                <MenuItem value={'MONTH'} disabled={timeCommitment?.frequency !== 'MONTH'}>Per Month</MenuItem>
                            </Select>
                        </div>
                    </div>
                    {/* <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Prior To Holiday</div>
                    <div className={style.displayInRow}>
                        <TimePicker
                            useAmPm={false}
                        />
                        <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                        <TimePicker
                            useAmPm={false}
                        />
                        <div className={` ${style.marginLeft20} ${style.durationWidth}`}>
                            <TextField
                                size="small"
                                type="tel"
                                maxLength="3"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                }}
                                inputProps={{
                                    style: {
                                        height: 15,
                                    },
                                }}
                            // value={metadata?.sessionDuration}
                            // onChange={(e) => e.target.value >= 0 && setMetadata({ ...metadata, sessionDuration: e.target.value, sessionAmount: '0' })}
                            />
                        </div>
                    </div>
                </div> */}
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Holiday</div>
                        <div>
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.threeFieldWidth}`}
                                value={metadata?.holidayTerm}
                                disabled={!metadata?.serviceDays?.isholidays}
                                onChange={(e) => onCustomizeFieldChange(e.target.value, 'holidayTerm')}
                            >
                                <MenuItem value="">Select Holiday</MenuItem>
                                <MenuItem value={'PRIOR_DAY'}>Prior to Holiday</MenuItem>
                                <MenuItem value={'ON_DAY'}>On Holiday</MenuItem>
                                <MenuItem value={'NEXT_DAT'}>Next to Holiday</MenuItem>
                            </Select>
                            <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                <TimePicker
                                    useAmPm={false}
                                    onChange={(e) => {
                                        onCustomizeFieldChange(e, 'holidayFrom');
                                    }}
                                    value={metadata?.holidayFrom}
                                    disabled={!metadata?.serviceDays?.isholidays}
                                />
                                <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                                <TimePicker
                                    useAmPm={false}
                                    onChange={(e) => {
                                        onCustomizeFieldChange(e, 'holidayTo');
                                    }}
                                    value={metadata?.holidayTo}
                                    disabled={!metadata?.serviceDays?.isholidays}
                                />
                                <div className={`${style.marginLeft20} ${style.durationWidth}`}>
                                    <TextField
                                        size="small"
                                        type="tel"
                                        maxLength="3"
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                        }}
                                        inputProps={{
                                            style: {
                                                height: 15,
                                            },
                                        }}
                                        disabled={!metadata?.serviceDays?.isholidays}
                                        value={metadata?.holidayDuration}
                                        onChange={(e) => e.target.value >= 0 && onCustomizeFieldChange(e.target.value, 'holidayDuration')}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Number of On Call Duty Days*</div>
                        <div className={style.displayInRow}>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MIN</div>
                                <EditableText value={metadata?.holidayMin} placeholder='' disabled={!metadata?.serviceDays?.isholidays} onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'holidayMin')} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
                            </div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MAX</div>
                                <EditableText value={metadata?.holidayMax} placeholder='' disabled={!metadata?.serviceDays?.isholidays} onChange={(e) => e >= 0 && onCustomizeFieldChange(e, 'holidayMax')} type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
                            </div>
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.fullWidth} ${style.marginLeft20}`}
                                value={metadata?.holidayFrequency}
                                onChange={(e) => onCustomizeFieldChange('holidayFrequency', e.target.value)}
                                disabled={!metadata?.serviceDays?.isholidays}
                            >
                                <MenuItem value="">Select Frequecy</MenuItem>
                                <MenuItem value={'WEEK'} disabled={timeCommitment?.frequency !== 'WEEK'}>Per Week</MenuItem>
                                <MenuItem value={'MONTH'} disabled={timeCommitment?.frequency !== 'MONTH'}>Per Month</MenuItem>
                            </Select>
                        </div>
                    </div>
                    {/* <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Next to holiday</div>
                    <div className={style.displayInRow}>
                        <TimePicker
                            useAmPm={false}
                        />
                        <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                        <TimePicker
                            useAmPm={false}
                        />
                        <div className={` ${style.marginLeft20} ${style.durationWidth}`}>
                            <TextField
                                size="small"
                                type="tel"
                                maxLength="3"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                }}
                                inputProps={{
                                    style: {
                                        height: 15,
                                    },
                                }}
                            // value={metadata?.sessionDuration}
                            // onChange={(e) => e.target.value >= 0 && setMetadata({ ...metadata, sessionDuration: e.target.value, sessionAmount: '0' })}
                            />
                        </div>
                    </div>
                </div> */}
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Require Patient MRN</div>
                        <div className={style.onCallBillableGrid}>
                            <ThemeProvider theme={switchTheme}>
                                <FormControlLabel
                                    control={
                                        <Switch className={` ${style.textAlignLeft}`} checked={metadata?.patientMRNRequired} onChange={() => setMetadata({ ...metadata, 'patientMRNRequired': !metadata?.patientMRNRequired })} />
                                    }
                                    color='primary'
                                    checked={metadata?.patientMRNRequired}
                                    className={`${style.switchFontStyle} ${style.flexLeft}`}
                                    label={metadata?.patientMRNRequired ? 'YES' : 'NO'}
                                />
                            </ThemeProvider>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Require Patient Doc</div>
                        <div className={style.onCallBillableGrid}>
                            <ThemeProvider theme={switchTheme}>
                                <FormControlLabel
                                    control={
                                        <Switch className={` ${style.textAlignLeft}`} checked={metadata?.attendingDocRequired} onChange={() => setMetadata({ ...metadata, 'attendingDocRequired': !metadata?.attendingDocRequired })} />
                                    }
                                    color='primary'
                                    className={`${style.switchFontStyle} ${style.flexLeft}`}
                                    label={metadata?.attendingDocRequired ? 'YES' : 'NO'}
                                />
                            </ThemeProvider>
                        </div>
                    </div>
                </div>
            )}
            {metadata?.customizedSchedule && (
                <>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Number of On Call Duty Days*</div>
                        <div className={style.displayInRow}>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MIN</div>
                                <EditableText value={metadata?.min} placeholder='' onChange={(e) => e >= 0 && handleValueChange('min', e)} type='tel' maxLength='2' className={style.serviceProvidedEditableTextStyle} />
                            </div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MAX</div>
                                <EditableText value={metadata?.max} placeholder='' onChange={(e) => e >= 0 && handleValueChange('max', e)} type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} />
                            </div>
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.fullWidth} ${style.marginLeft20}`}
                                value={metadata?.frequency}
                                onChange={(e) => handleValueChange('frequency', e.target.value)}
                            >
                                <MenuItem value="">Select Frequecy</MenuItem>
                                <MenuItem value={'WEEK'} disabled={timeCommitment?.frequency !== 'WEEK'}>Per Week</MenuItem>
                                <MenuItem value={'MONTH'} disabled={timeCommitment?.frequency !== 'MONTH'}>Per Month</MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Require Patient MRN</div>
                        <div className={style.onCallBillableGrid}>
                            <ThemeProvider theme={switchTheme}>
                                <FormControlLabel
                                    control={
                                        <Switch checked={metadata?.patientMRNRequired} className={` ${style.textAlignLeft}`} onChange={() => handleValueChange('patientMRNRequired', !metadata?.patientMRNRequired)} />
                                    }
                                    color='primary'
                                    className={`${style.switchFontStyle} ${style.flexLeft}`}
                                    label={metadata?.patientMRNRequired ? 'YES' : 'NO'}
                                />
                            </ThemeProvider>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Attending Doc Required</div>
                        <div className={style.onCallBillableGrid}>
                            <ThemeProvider theme={switchTheme}>
                                <FormControlLabel
                                    control={
                                        <Switch checked={metadata?.attendingDocRequired} className={` ${style.textAlignLeft}`} onChange={() => handleValueChange('attendingDocRequired', !metadata?.attendingDocRequired)} />
                                    }
                                    color='primary'
                                    className={`${style.switchFontStyle} ${style.flexLeft}`}
                                    label={metadata?.attendingDocRequired ? 'YES' : 'NO'}
                                />
                            </ThemeProvider>
                        </div>
                    </div>
                </>
            )}

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
                                onChange={(e) => setMetadata({ ...metadata, additionalScheduleRequired: !metadata?.additionalScheduleRequired, additionalScheduleValue: '0', additionalScheduleFrequency: '' })}
                                className={`${style.switchFontStyle} ${style.flexLeft}`}
                                label={metadata?.additionalScheduleRequired ? 'YES' : 'NO'}
                            />
                        </ThemeProvider>
                    </div>
                    {
                        metadata?.additionalScheduleRequired &&
                        <>
                            <CommonInputField value={metadata?.additionalScheduleValue}
                                onChange={(e) => e.target.value >= 0 && handleValueChange('additionalScheduleValue', e.target.value)}
                                className={` ${style.threeFieldWidth}`} />
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                                value={metadata?.additionalScheduleFrequency}
                                onChange={(e) => handleValueChange('additionalScheduleFrequency', e.target.value)}
                            >
                                <MenuItem value="">Select Frequecy</MenuItem>
                                <MenuItem value={'WEEK'} disabled={timeCommitment?.frequency !== 'WEEK'}>Every Week</MenuItem>
                                <MenuItem value={'EVERY_OTHER_WEEK'} disabled={timeCommitment?.frequency !== 'WEEK'}>Every Other Week</MenuItem>
                                <MenuItem value={'MONTH'} disabled={timeCommitment?.frequency !== 'MONTH'}>Every Month</MenuItem>
                                <MenuItem value={'EVERY_OTHER_MONTH'} disabled={timeCommitment?.frequency !== 'MONTH'}>Every Other Month</MenuItem>
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
                                onChange={(e) => setMetadata({ ...metadata, billableService: !metadata?.billableService, sessionAmount: '0' })}
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
                        type="tel"
                        maxLength="3"
                        InputProps={{
                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                        }}
                        value={metadata?.sessionDuration}
                        onChange={(e) => e.target.value >= 0 && setMetadata({ ...metadata, sessionDuration: e.target.value, sessionAmount: '0' })}
                    />
                </div>
            </div>
            {
                metadata?.billableService &&
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>On Call Payment Amount*</div>
                    <div className={`${style.displayInRow}`}>
                        <div className={`${style.threeFieldWidth}`}>
                            <TextField
                                size="small"
                                type="tel"
                                maxLength="5"
                                disabled={metadata?.sessionDuration === '' || metadata?.sessionDuration === '0' || metadata?.sessionDuration === undefined}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                                }}
                                value={metadata?.sessionAmount}
                                onChange={(e) => e.target.value >= 0 && handleValueChange('sessionAmount', e.target.value)}
                            />
                        </div>
                        <div className={style.verticalAlignCenter}>
                            <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>$ {(metadata?.sessionAmount / metadata?.sessionDuration || 0).toFixed(2)} per Hour (Pro Rata)</p>
                        </div>
                    </div>
                </div>
            }
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Total Contracted Service Sessions*</div>
                <div className={style.twoCol}>
                    <div className={`${style.spaceBetween} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <EditableText placeholder='' value={metadata?.totalSession} type='tel' maxLength="3"
                            className={style.editableSessionTextStyle}
                            onChange={(e) => onTotalSessionChange(e)} />
                        <div className={`${style.textElement} ${parseInt(metadata?.totalSession) === specified ? style.greenBase : style.redBase}`}>{specified} Specified</div>
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <p className={`${style.extentionLableStyle}`}>For {timeCommitment?.value} {timeCommitment?.frequency === 'WEEK' ? 'Weeks' : 'Months'} Per Contract Year</p>
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Allowable Working Day Hours For Service*</div>
                <div className={style.displayInRow}>
                    <TimePicker
                        useAmPm={false}
                        onChange={(e) => {
                            updateWorkingPeriod(e);
                        }}
                        value={new Date(metadata?.workingTimeFrom)}
                    />
                    <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                    <TimePicker
                        useAmPm={false}
                        onChange={(e) => handleValueChange('workingTimeTo', e)}
                        value={new Date(metadata?.workingTimeTo)}
                    // minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000))}
                    />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Any Additional On Call Services Specified</div>
                <div className={style.onCallBillableGrid}>
                    <ThemeProvider theme={switchTheme}>
                        <FormControlLabel
                            control={
                                <Switch checked={metadata?.dependantServiceIncluded} className={` ${style.textAlignLeft}`} />
                            }
                            color='primary'
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={metadata?.dependantServiceIncluded ? 'YES' : 'NO'}
                            onChange={(e) => handleValueChange('dependantServiceIncluded', !metadata?.dependantServiceIncluded)}
                        />
                    </ThemeProvider>
                </div>
            </div>
            {metadata?.dependantServiceIncluded && (
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Billable Service</div>
                    <div className={metadata?.additionalActivityBillable ? style.onCallBillableGrid : style.spaceBetween}>
                        <ThemeProvider theme={switchTheme}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={metadata?.additionalActivityBillable} className={` ${style.textAlignLeft}`} onChange={() => setMetadata({ ...metadata, additionalActivityBillable: !metadata?.additionalActivityBillable })} />
                                }
                                color='primary'
                                className={`${style.switchFontStyle} ${style.flexLeft}`}
                                label={metadata?.additionalActivityBillable ? 'YES' : 'NO'}
                            />
                        </ThemeProvider>
                        {
                            metadata?.additionalActivityBillable && (
                                <>
                                    <div className={`${style.fullWidth}`}>
                                        <TextField
                                            value={metadata?.dependencyPayableAmount}
                                            onChange={(e) => setMetadata({ ...metadata, dependencyPayableAmount: e.target.value })}
                                            size="small"
                                            type="number"
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                                            }}
                                        />
                                    </div>
                                    <Select
                                        displayEmpty
                                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                        className={`${style.fullWidth}`}
                                        value={metadata?.dependencyFrequency}
                                        onChange={(e) => setMetadata({ ...metadata, dependencyFrequency: e.target.value })}
                                    >
                                        <MenuItem value={null}>Select Payment Basis</MenuItem>
                                        <MenuItem value={'PER_DAY'} >Per On Call Day</MenuItem>
                                        <MenuItem value={'PER_SERVICE'} >Per Service Performed</MenuItem>
                                    </Select>
                                </>
                            )
                        }

                        <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                            <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={() => addAdditionalEntry()} />
                        </div>
                    </div>
                </div>
            )}
            {metadata?.dependantServiceIncluded && (
                <>
                    <EditableTable additionalActivityData={metadata?.additionalActivity} getAdditionalActivityData={getAdditionalActivityData} serviceDays={metadata?.serviceDays} />
                    <>

                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <div className={style.extentionLableStyle}>Require Approval For Payment</div>
                            <ThemeProvider theme={switchTheme}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={metadata?.additionalActivityPaymentApprovalRequired}
                                            onChange={e => setMetadata({ ...metadata, additionalActivityPaymentApprovalRequired: !metadata?.additionalActivityPaymentApprovalRequired })} className={` ${style.textAlignLeft}`} />
                                    }
                                    color='primary'
                                    className={`${style.switchFontStyle} ${style.flexLeft}`}
                                    label={metadata?.additionalActivityPaymentApprovalRequired ? 'YES' : 'NO'}
                                />
                            </ThemeProvider>
                        </div>
                        {metadata?.additionalActivityPaymentApprovalRequired &&
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <div className={style.extentionLableStyle}>Designate Request Approver*</div>
                                <Select
                                    displayEmpty
                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                    className={`${style.fullWidth}`}
                                >
                                    <MenuItem value="">Select Approver</MenuItem>
                                </Select>
                            </div>
                        }
                    </>


                </>
            )}
        </div>
    )
}

export default OnCallCoverageFields;
