import React, { useState, useEffect } from 'react';
import { EditableText, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import { TimePicker } from "@blueprintjs/datetime";
import { GetDateFromHours } from './../../utils/formatting';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';
import CommonInputField from '../../Components/CommonFields/CommonInputField';

import style from './index.module.scss';

const switchTheme = createTheme({
    palette: {
        primary: {
            main: '#7165E3',
        },
    },
});

const SurgerySessionFields = ({ getMetaData, serviceSelected, timeCommitment }) => {
    const limit5 = 5;

    const [metadata, setMetadata] = useState({
        min: '0',
        max: '0',
        frequency: '',
        withNurse: '0',
        withoutNurse: '0',
        noTargetApplicable: false,
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
    });
    const [specified, setSpecified] = useState(0);

    useEffect(() => {
        let additionalFreq = metadata?.additionalScheduleFrequency === 'WEEK' ? timeCommitment?.value || 0 : (timeCommitment?.value / 2) || 0;
        let value = (parseInt(metadata?.min || '0') * timeCommitment?.value || 0) + (parseInt(metadata?.additionalScheduleValue || '0') * additionalFreq);
        setSpecified(value);
    }, [metadata?.min, metadata?.additionalScheduleValue, metadata?.additionalScheduleFrequency, timeCommitment?.value])


    useEffect(() => {
        setSelectedValues();
    }, [serviceSelected]);

    const setSelectedValues = () => {
        setMetadata({
            ...metadata,
            refId: serviceSelected?.refId,
            min: serviceSelected?.contractedSchedule?.minimum?.value,
            max: serviceSelected?.contractedSchedule?.maximum?.value,
            frequency: serviceSelected?.contractedSchedule?.frequency,
            withNurse: serviceSelected?.patientsSeenTarget?.withNurse?.value,
            withoutNurse: serviceSelected?.patientsSeenTarget?.withoutNurse?.value,
            noTargetApplicable: serviceSelected?.patientsSeenTarget?.noTargetApplicable,
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


    useEffect(() => {
        getMetaData(metadata)
    }, [metadata])

    const handleValueChange = (name, value) => {
        setMetadata({ ...metadata, [name]: value });
    }

    const getServiceDaysMetadata = (serviceDays) => {
        setMetadata({ ...metadata, serviceDays: serviceDays })
    }

    const setpatientTarget = (value) => {
        setMetadata({ ...metadata, withNurse: value, withoutNurse: value });
    }

    const updateWorkingPeriod = (e) => {
        // let minTime = new Date(new Date(e).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000));
        setMetadata({ ...metadata, workingTimeFrom: e });
    }

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Regular Service Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MIN</div>
                        <EditableText type='tel' maxLength="2" placeholder='' value={metadata?.min} className={style.serviceProvidedEditableTextStyle} onChange={(e) => e >= 0 && handleValueChange('min', e)} />
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MAX</div>
                        <EditableText value={metadata?.max} placeholder='' type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} onChange={(e) => e >= 0 && handleValueChange('max', e)} />
                    </div>
                    <Select
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        className={`${style.fullWidth} ${style.marginLeft20}`}
                        onChange={(e) => handleValueChange('frequency', e.target.value)}
                        value={metadata?.frequency}
                    >
                        <MenuItem value={''}>Select Frequecy</MenuItem>
                        <MenuItem value={'WEEK'} disabled={timeCommitment?.frequency !== 'WEEK'}>Per Week</MenuItem>
                        <MenuItem value={'MONTH'} disabled={timeCommitment?.frequency !== 'MONTH'}>Per Month</MenuItem>
                    </Select>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Service Cases Target*</div>
                <div className={`${style.displayInRow}`}>
                    <CommonInputField value={metadata?.withNurse} disabled={metadata?.noTargetApplicable} className={` ${style.threeFieldWidth}`} onChange={(e) => { setpatientTarget(e.target.value) }} />
                    <Checkbox label="No Target Applicable" value={metadata?.noTargetApplicable} className={`${style.marginLeft20} ${style.threeFieldWidth} `} onChange={(e) => handleValueChange('noTargetApplicable', e.target.checked)} />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Additional Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <ThemeProvider theme={switchTheme}>
                            <FormControlLabel
                                control={
                                    <Switch checked={metadata?.additionalScheduleRequired} className={` ${style.textAlignLeft}`} onChange={(e) => setMetadata({ ...metadata, additionalScheduleRequired: !metadata?.additionalScheduleRequired, additionalScheduleValue: '0', additionalScheduleFrequency: '' })} />
                                }
                                color='primary'
                                className={`${style.switchFontStyle} ${style.flexLeft}`}
                                label={metadata?.additionalScheduleRequired ? 'YES' : 'NO'}
                            />
                        </ThemeProvider>
                    </div>
                    {metadata?.additionalScheduleRequired &&
                        (
                            <>
                                <CommonInputField value={metadata?.additionalClinicScheduleValue}
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
                                    <MenuItem value={'WEEK'} disabled={timeCommitment?.frequency !== 'WEEK'}>Every Week</MenuItem>
                                    <MenuItem value={'EVERY_OTHER_WEEK'} disabled={timeCommitment?.frequency !== 'WEEK'}>Every Other Week</MenuItem>
                                    <MenuItem value={'MONTH'} disabled={timeCommitment?.frequency !== 'MONTH'}>Every Month</MenuItem>
                                    <MenuItem value={'EVERY_OTHER_MONTH'} disabled={timeCommitment?.frequency !== 'MONTH'}>Every Other Month</MenuItem>
                                </Select>
                            </>
                        )}

                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Billable Service*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <ThemeProvider theme={switchTheme}>
                            <FormControlLabel
                                control={
                                    <Switch checked={metadata?.billableService} className={` ${style.textAlignLeft}`}
                                        onChange={(e) => setMetadata({ ...metadata, billableService: !metadata?.billableService, sessionAmount: '0' })}
                                    />
                                }
                                color='primary'
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
                        //     onChange={(e)=>handleValueChange('rateType', e.target.value)}
                        //     value={metadata?.rateType}
                        // >
                        //     <MenuItem value="">Select Frequecy</MenuItem>
                        //     <MenuItem value={'HOURLY'}>Hourly</MenuItem>
                        // </Select>
                    }
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Service Session Duration</div>
                <div className={`${style.threeFieldWidth}`}>
                    <TextField
                        size="small"
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
                    <div className={style.extentionLableStyle}>Service Session payment Amount*</div>
                    <div className={`${style.displayInRow}`}>
                        <div className={`${style.threeFieldWidth}`}>
                            <TextField
                                size="small"
                                disabled={metadata?.sessionDuration === '' || metadata?.sessionDuration === '0' || metadata?.sessionDuration === undefined}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
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
            }
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
                        <p className={`${style.extentionLableStyle}`}>For {timeCommitment?.value} {timeCommitment?.frequency === 'WEEK' ? 'Weeks' : 'Months'} Per Contract Year</p>
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Service Days*</div>
                <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected} />
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


        </div>
    )
}

export default SurgerySessionFields;
