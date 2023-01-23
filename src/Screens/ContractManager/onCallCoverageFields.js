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
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import { TimePicker } from "@blueprintjs/datetime";
import { GetDateFromHours } from './../../utils/formatting';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

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
    const [metadata, setMetadata] = useState({
        min: '0',
        max: '0',
        frequency: '',
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
        additionalActivity: [{ activity: '', weekdayFrom: null, weekdayTo: null, weekendFrom: null, weekendTo: null, patientMRNRequired: false, attendingDocRequired: false }],
        additionalActivityBillable: false,
        additionalActivityPaymentApprovalRequired: false,
        dependencyPayableAmount: '0',
        dependencyFrequency: 'PER_DAY',
    });

    const getAdditionalActivityData = (value) => {
        setMetadata({ ...metadata, additionalActivity: value });
    }

    const [specified, setSpecified] = useState(0);

    useEffect(() => {
        let additionalFreq = metadata?.additionalScheduleFrequency === 'WEEK' ? timeCommitment?.value || 0 : (timeCommitment?.value / 2) || 0;
        let value = (parseInt(metadata?.min || '0') * timeCommitment?.value || 0) + (parseInt(metadata?.additionalScheduleValue || '0') * additionalFreq);
        setSpecified(value);
    }, [metadata?.min, metadata?.additionalScheduleValue, metadata?.additionalScheduleFrequency, timeCommitment?.value])

    useEffect(() => {
        setSelectedValues();
    }, [serviceSelected]);

    console.log('selected', serviceSelected);

    const setSelectedValues = () => {
        let dependentActivities = [];
        serviceSelected?.dependentService?.additionalServices?.map(data => {
            dependentActivities.push(
                { activity: data?.activity?.activity, weekdayFrom: GetDateFromHours(data?.weekday?.from?.toString() || ''), weekdayTo: GetDateFromHours(data?.weekday?.to?.toString() || ''), weekendFrom: GetDateFromHours(data?.weekend?.from?.toString() || ''), weekendTo: GetDateFromHours(data?.weekend?.to?.toString() || ''), patientMRNRequired: data?.patientMRNRequired, attendingDocRequired: data?.attendingDocRequired }
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
        });
    }

    const limit5 = 5;

    console.log('data', metadata);

    useEffect(() => {
        getMetaData(metadata)
    }, [metadata])

    const handleValueChange = (name, value) => {
        console.log('inside handle value change function');
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
        let minTime = new Date(new Date(e).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000));
        setMetadata({ ...metadata, workingTimeFrom: e, workingTimeTo: minTime });
    }

    const addAdditionalEntry = () => {
        let temp = metadata?.additionalActivity;
        temp.push({ activity: '', weekdayFrom: null, weekdayTo: null, weekendFrom: null, weekendTo: null, patientMRNRequired: false, attendingDocRequired: false });
        console.log('temp inside additional entry func', temp)
        setMetadata({ ...metadata, aditionalActivity: temp });
    }

    console.log('Oncall metadata', metadata);

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
                            <InputGroup value={metadata?.additionalScheduleValue}
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
                        minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000))}
                    />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Additional on call billable service specified</div>
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
                    {metadata?.dependantServiceIncluded && (
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
                                <MenuItem value={null}>Select Frequecy</MenuItem>
                                <MenuItem value={'PER_DAY'} >Per Day</MenuItem>
                                <MenuItem value={'PER_SERVICE'} >Per Service</MenuItem>
                            </Select>
                            <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                                <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={() => addAdditionalEntry()} />
                            </div>
                        </>
                    )}
                </div>
            </div>
            {metadata?.dependantServiceIncluded && (
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Billable Service</div>
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
                </div>
            )}
            {metadata?.dependantServiceIncluded && (
                <>
                    <EditableTable additionalActivityData={metadata?.additionalActivity} getAdditionalActivityData={getAdditionalActivityData} />
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
