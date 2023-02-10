import React, { useState, useEffect } from 'react';
import { EditableText, Checkbox } from '@blueprintjs/core';
import { TimePicker } from "@blueprintjs/datetime";
import { format } from 'date-fns';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import { GetDateFromHours } from './../../utils/formatting';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

import style from './index.module.scss';
import ScheduleAndTargetSameTable from './scheduleAndTargetSameTable';
import AddScheduleAndTargetForDifferentPeriods from './addScheduleAndTrgetForDifferentPeriods';

const ClinicBlocksFields = ({ getMetaData, serviceSelected, timeCommitment, contractTermPeriod }) => {
    const [schedulesField, setSchedulesField] = useState([]);
    const [differentTargets, setDifferentTargets] = useState(false);
    const [selectedScheduleRow, setSelectedScheduleRow] = useState();
    const [addScheduleAndTargetForDifferentPeriods, setAddScheduleAndTargetForDifferentPeriods] = useState(false);
    const [newClinicRow, setNewClinicRow] = useState({ startDate: new Date(), endDate: new Date(), min: 0, max: 0, frequency: 'WEEK', seenWithNurse: 0, seenWithoutNurse: 0, seenNoTarget: false, targetWithNurse: 0, targetWithoutNurse: 0, targetNoTarget: false })
    const [metadata, setMetadata] = useState({
        contractedSchedules: [],
        patientsSeenTargets: [],
        scheduledPatientsTargets: [],
        min: '0',
        max: '0',
        frequency: 'WEEK',
        withNurse: '0',
        withoutNurse: '0',
        noTargetApplicable: false,
        targetWithNurse: '0',
        targetWithoutNurse: '0',
        targetNoTargetApplicable: false,
        additionalScheduleValue: '0',
        additionalScheduleFrequency: '',
        additionalScheduleRequired: true,
        scheduleAndTargetSame: true,
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

    // useEffect(() => {
    //     if (Object.entries(serviceSelected)?.length === 0) {
    //         setMetadata({
    //             ...metadata,
    //             contractedSchedules: [{
    //                 "minimum": {
    //                     "value": 0
    //                 },
    //                 "maximum": {
    //                     "value": 0
    //                 },
    //                 "frequency": "WEEK",
    //                 "startDate": format(new Date(contractTermPeriod?.start), 'yyyy-MM-dd').toString(),
    //                 "endDate": format(new Date(contractTermPeriod?.end), 'yyyy-MM-dd').toString()
    //             }],
    //             patientsSeenTargets: [{
    //                 "withNurse": {
    //                     "value": 0
    //                 },
    //                 "withoutNurse": {
    //                     "value": 0
    //                 },
    //                 "startDate": format(new Date(contractTermPeriod?.start), 'yyyy-MM-dd').toString(),
    //                 "endDate": format(new Date(contractTermPeriod?.end), 'yyyy-MM-dd').toString(),
    //                 "noTargetApplicable": false
    //             }],
    //             scheduledPatientsTargets: [{
    //                 "withNurse": {
    //                     "value": 0
    //                 },
    //                 "withoutNurse": {
    //                     "value": 0
    //                 },
    //                 "startDate": format(new Date(contractTermPeriod?.start), 'yyyy-MM-dd').toString(),
    //                 "endDate": format(new Date(contractTermPeriod?.end), 'yyyy-MM-dd').toString(),
    //                 "noTargetApplicable": false
    //             }],
    //         })
    //     }
    // }, [contractTermPeriod])
    const [specified, setSpecified] = useState(0);

    const onNewClinicChange = (value, index) => {
        let contractedScheduleTemp = metadata?.contractedSchedules;
        contractedScheduleTemp[index] = ({
            "minimum": {
                "value": parseInt(value?.min)
            },
            "maximum": {
                "value": parseInt(value?.max)
            },
            "frequency": value?.frequency,
            "startDate": format(new Date(value?.startDate), 'yyyy-MM-dd').toString(),
            "endDate": format(new Date(value?.endDate), 'yyyy-MM-dd').toString(),
        });
        let patientSeenTemp = metadata?.patientsSeenTargets;
        patientSeenTemp[index] = ({
            "withNurse": {
                "value": parseInt(value?.seenWithNurse)
            },
            "withoutNurse": {
                "value": parseInt(value?.seenWithoutNurse)
            },
            "startDate": format(new Date(value?.startDate), 'yyyy-MM-dd').toString(),
            "endDate": format(new Date(value?.endDate), 'yyyy-MM-dd').toString(),
            "noTargetApplicable": value?.seenNoTarget
        })
        let targetTemp = metadata?.scheduledPatientsTargets;
        targetTemp[index] = ({
            "withNurse": {
                "value": parseInt(value?.targetWithNurse)
            },
            "withoutNurse": {
                "value": parseInt(value?.targetWithoutNurse)
            },
            "startDate": format(new Date(value?.startDate), 'yyyy-MM-dd').toString(),
            "endDate": format(new Date(value?.endDate), 'yyyy-MM-dd').toString(),
            "noTargetApplicable": value?.targetNoTarget
        })
        setMetadata({ ...metadata, contractedSchedules: contractedScheduleTemp, patientsSeenTargets: patientSeenTemp, scheduledPatientsTargets: targetTemp });
        setNewClinicRow(value);
    }

    console.log('contract Term period', metadata);

    useEffect(() => {
        if (Object.entries(serviceSelected)?.length !== 0) {
            setSelectedValues();
        }
    }, [serviceSelected]);

    useEffect(() => {
        getMetaData(metadata);
    }, [metadata])

    const getAddScheduleAndTargetForDifferentPeriods = (value) => {
        setAddScheduleAndTargetForDifferentPeriods(value);
    }

    const setSelectedValues = () => {
        let tempContractedSchedules = serviceSelected?.contractedSchedules || [];
        tempContractedSchedules?.map(data => {
            data.startDate = new Date(data?.startDate);
            data.endDate = new Date(data?.endDate);
        });
        let tempPatientsSeenTargets = serviceSelected?.patientsSeenTargets || [];
        tempPatientsSeenTargets?.map(data => {
            data.startDate = new Date(data?.startDate);
            data.endDate = new Date(data?.endDate);
        })
        let tempScheduledPatientsTargets = serviceSelected?.scheduledPatientsTargets || [];
        tempScheduledPatientsTargets?.map(data => {
            data.startDate = new Date(data?.startDate);
            data.endDate = new Date(data?.endDate);
        })

        console.log('temp', tempContractedSchedules, tempPatientsSeenTargets, tempScheduledPatientsTargets);
        setMetadata({
            ...metadata,
            refId: serviceSelected?.refId,
            contractedSchedules: [],
            patientsSeenTargets: tempPatientsSeenTargets,
            scheduledPatientsTargets: tempScheduledPatientsTargets,
            min: serviceSelected?.contractedSchedule?.minimum?.value,
            max: serviceSelected?.contractedSchedule?.maximum?.value,
            frequency: serviceSelected?.contractedSchedule?.frequency,
            withNurse: serviceSelected?.patientsSeenTarget?.withNurse?.value,
            withoutNurse: serviceSelected?.patientsSeenTarget?.withoutNurse?.value,
            noTargetApplicable: serviceSelected?.patientsSeenTarget?.noTargetApplicable,
            targetWithNurse: serviceSelected?.scheduledPatientsTarget?.withNurse?.value,
            targetWithoutNurse: serviceSelected?.scheduledPatientsTarget?.withoutNurse?.value,
            targetNoTargetApplicable: serviceSelected?.scheduledPatientsTarget?.noTargetApplicable,
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

    const handleValueChange = (name, value) => {
        setMetadata({ ...metadata, [name]: value });
    }

    const getServiceDaysMetadata = (serviceDays) => {
        setMetadata({ ...metadata, serviceDays: serviceDays })
    }

    const onAdditionalScheduleChange = (value) => {
        if (!value) {
            setMetadata({ ...metadata, additionalScheduleRequired: value, additionalScheduleValue: '0', additionalScheduleFrequency: '' })
        } else {
            setMetadata({ ...metadata, additionalScheduleRequired: value });
        }
    }

    const onTotalSessionChange = (e) => {
        if (e >= 0) {
            let value = e.slice(0, limit5);
            handleValueChange('totalSession', value);
        }
    }

    const updateWorkingPeriod = (e) => {
        setMetadata({ ...metadata, workingTimeFrom: e });
    }

    const onScheduleContractYearChange = (value) => {
        setMetadata({ ...metadata, scheduleAndTargetSame: value, contractedSchedules: [], patientsSeenTargets: [], scheduledPatientsTargets: [] });
    }

    const onSameTargetChange = (targetName, value, name) => {
        let temp = metadata[targetName];
        if (name === 'minimum' || name === 'maximum' || name === 'withNurse' || name === 'withoutNurse') {
            temp[0][name] = {
                value: parseInt(value) || 0,
            }
        }
        else if (name === 'noTargetApplicable' && value) {
            temp[0][name] = value;
            temp[0]['withNurse'] = {
                value: 0
            }
            temp[0]['withoutNurse'] = {
                value: 0
            }
        }
        else {
            temp[0][name] = value;
        }
        setMetadata({ ...metadata, [targetName]: temp });
    }

    const limit5 = 5;

    console.log('selected', selectedScheduleRow);

    return (
        <div>
            {/* <div className={`${style.addManagerGrid} ${style.marginTop20}`}>

                <div className={style.extentionLableStyle}></div>
                <div className={style.termPeriodWithAddGrid}>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                InputProps={{
                                    style: {
                                        fontSize: 14,
                                        height: 30,
                                    },
                                    onFocus: e => {
                                        // setCalendarStart(true);
                                    },
                                    onBlur: e => {
                                        // setCalendarStart(false);
                                    }
                                }}
                                renderInput={(params) => <TextField {...params}
                                    // onClick={() => setCalendarStart(true)}
                                    inputProps={{
                                        ...params.inputProps,
                                        placeholder: "Start Date"
                                    }} />}
                            />
                        </LocalizationProvider>
                    </div>
                    <p className={`${style.toStyle} ${style.alignCenter}`}></p>
                    <div >
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                // open={calendarEnd}
                                // onOpen={() => setCalendarEnd(true)}
                                // onClose={() => setCalendarEnd(false)}
                                // value={contractTermPeriodTo}
                                // onChange={(newValue) => {
                                //     setContractTermPeriodTo(newValue);
                                // }}
                                InputProps={{
                                    style: {
                                        fontSize: 14,
                                        height: 30,
                                    },
                                    onFocus: e => {
                                        // setCalendarEnd(true);
                                    },
                                    onBlur: e => {
                                        // setCalendarEnd(false);
                                    }
                                }}
                                // minDate={contractTermPeriodFrom}
                                // maxDate={add(new Date(), { years: 5 })}
                                renderInput={(params) => <TextField  {...params}
                                    //  onClick={() => setCalendarEnd(true)}
                                    inputProps={{
                                        ...params.inputProps,
                                        placeholder: "End Date"
                                    }} />}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                        <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={incrementScheduleSet} />
                    </div>
                </div>
            </div> */}
            {/* {
                schedulesField
            } */}


            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Schedule And Target Are Same For Full Contract Year' />
                <div className={style.spaceBetween}>
                    <div className={`${style.threeFieldWidth}`} >
                        <CommonSwitch checked={metadata?.scheduleAndTargetSame} className={`${style.textAlignLeft} ${style.switchFontStyle} ${style.flexLeft}`}
                            label={metadata?.scheduleAndTargetSame ? 'YES' : 'NO'}
                        // onChange={(e) => onScheduleContractYearChange(!metadata?.scheduleAndTargetSame)}
                        />
                    </div>
                    {!metadata?.scheduleAndTargetSame && (
                        <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                            <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={() => { setSelectedScheduleRow(metadata?.contractedSchedules?.length || 0); setAddScheduleAndTargetForDifferentPeriods(true); }} />
                        </div>
                    )}
                </div>
            </div>

            {metadata?.scheduleAndTargetSame && (
                <>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Regular Service Schedule*' />
                        <div className={style.displayInRow}>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MIN</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.contractedSchedules?.[0]?.minimum?.value} onChange={(e) => onSameTargetChange('contractedSchedules', e, 'minimum')} />
                            </div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                                <div className={style.textElement}>MAX</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.contractedSchedules?.[0]?.maximum?.value} onChange={(e) => onSameTargetChange('contractedSchedules', e, 'maximum')} />
                            </div>
                            <CommonSelectField className={`${style.fullWidth} ${style.marginLeft20}`}
                                value={metadata?.contractedSchedules?.[0]?.frequency || ''}
                                onChange={(e) => onSameTargetChange('contractedSchedules', e.target.value, 'frequency')}
                                firstOptionLabel={'Select Frequecy'} firstOptionValue={''}
                                valueList={['WEEK', 'MONTH']}
                                labelList={['Per Week', 'Per Month']}
                                disabledList={[false, false]} />
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Patients Seen Target*' />
                        <div className={style.withNurseGrid}>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                <div className={style.textElement}>WITH NURSE</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.patientsSeenTargets?.[0]?.withNurse?.value} onChange={(e) => onSameTargetChange('patientsSeenTargets', e, 'withNurse')} />
                            </div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                <div className={style.textElement}>WITHOUT NURSE</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.patientsSeenTargets?.[0]?.withoutNurse?.value} onChange={(e) => onSameTargetChange('patientsSeenTargets', e, 'withoutNurse')} />
                            </div>
                            <CommonCheckBox label="No Target Applicable" className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`} checked={metadata?.patientsSeenTargets?.[0]?.noTargetApplicable} onChange={(e) => onSameTargetChange('patientsSeenTargets', e.target.checked, 'noTargetApplicable')} />
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Scheduled Patient Target*' />
                        <div className={`${style.withNurseGrid} ${style.fullWidth}`}>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                <div className={style.textElement}>WITH NURSE</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.scheduledPatientsTargets?.[0]?.withNurse?.value} onChange={(e) => onSameTargetChange('scheduledPatientsTargets', e, 'withNurse')} />
                            </div>
                            <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                                <div className={style.textElement}>WITHOUT NURSE</div>
                                <EditableText placeholder="" type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} value={metadata?.scheduledPatientsTargets?.[0]?.withoutNurse?.value} onChange={(e) => onSameTargetChange('scheduledPatientsTargets', e, 'withoutNurse')} />
                            </div>
                            <CommonCheckBox label="No Target Applicable" className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`} checked={metadata?.scheduledPatientsTargets?.[0]?.noTargetApplicable} onChange={(e) => onSameTargetChange('scheduledPatientsTargets', e.target.checked, 'noTargetApplicable')} />
                        </div>
                    </div>
                </>
            )}

            {(!metadata?.scheduleAndTargetSame || metadata?.contractedSchedules?.length > 1) && (
                <div>
                    <div className={`${style.tableHeader} ${style.marginTop10}`}>
                        <div className={style.scheduleTableGrid1}>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >APPLICABLE PERIOD</p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >SCHEDULE</p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >PATIENT SEEN</p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >PATIENTS SCHEDULED</p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                        </div>
                        <div className={style.scheduleTableGrid2}>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >FROM - TO</p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >MIN</p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >MAX</p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >W / NURSE </p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >WO / NURSE</p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >W / NURSE </p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} >WO / NURSE</p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                            <p className={`${style.tableHeaderFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`} ></p>
                        </div>
                    </div>
                    <div className={`${style.tableData} ${style.scheduleTableGrid2} ${style.alternativeBackgroundColor}`}>
                        <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>Jan 1 - MAR 31, 2022</p>
                        <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>3</p>
                        <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>-</p>
                        <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>PER MONTH</p>
                        <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>15</p>
                        <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>8</p>
                        <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}></p>
                        <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>15</p>
                        <p className={`${style.tableDataFontStyle} ${style.verticalAlignCenter} ${style.flexCenter}`}>8</p>
                        <div className={`${style.verticalAlignCenter} ${style.flexCenter} ${style.cursorPointer}`}>
                            <EditIcon style={{ color: "#7165E3" }} />
                        </div>
                        <div className={`${style.verticalAlignCenter} ${style.flexCenter} ${style.cursorPointer}`}>
                            <CloseIcon style={{ color: "#FF6562" }} />
                        </div>
                    </div>
                </div>
            )}

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Additional Schedule*' />
                <div className={`${style.grid3}`}>
                    <div className={`${style.fullWidth}`} >
                        <CommonSwitch checked={metadata?.additionalScheduleRequired} label={metadata?.additionalScheduleRequired ? 'YES' : 'NO'} className={`${style.textAlignLeft} ${style.switchFontStyle} ${style.flexLeft}`} onChange={() => onAdditionalScheduleChange(!metadata?.additionalScheduleRequired)} />
                    </div>
                    {metadata?.additionalScheduleRequired &&
                        <>
                            <CommonInputField value={metadata?.additionalScheduleValue} type="tel" maxLength="2" onChange={(e) => e.target.value >= 0 && handleValueChange('additionalScheduleValue', e.target.value)} className={` ${style.fullWidth}`} />
                            <CommonSelectField className={`${style.fullWidth}`}
                                value={metadata?.additionalScheduleFrequency || ''}
                                onChange={(e) => handleValueChange('additionalScheduleFrequency', e.target.value)}
                                firstOptionLabel={'Select Frequecy'} firstOptionValue={''}
                                valueList={['WEEK', 'EVERY_OTHER_WEEK', 'MONTH', 'EVERY_OTHER_MONTH']}
                                labelList={['Every Week', 'Every Other Week', 'Every Month', 'Every Other Month']}
                                disabledList={[timeCommitment?.frequency !== 'WEEK', timeCommitment?.frequency !== 'WEEK', timeCommitment?.frequency !== 'MONTH', timeCommitment?.frequency !== 'MONTH']} />
                        </>
                    }
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Billable Service*' />
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <CommonSwitch checked={metadata?.billableService}
                            onChange={(e) => handleValueChange('billableService', !metadata?.billableService)}
                            className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
                            label={metadata?.billableService ? 'YES' : 'NO'} />
                    </div>
                    {
                        // metadata?.billableService &&
                        //   <Select
                        //       displayEmpty
                        //       SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        //       className={`${style.threeFieldWidth}`}
                        //       value={metadata?.rateType}
                        //       onChange={(e)=>handleValueChange('rateType',e.target.value)}
                        //   >
                        //       <MenuItem value="">Select Frequecy</MenuItem>
                        //       <MenuItem value={'HOURLY'}>Hourly</MenuItem>
                        //   </Select>
                    }

                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Service Session Duration' />
                <div className={`${style.threeFieldWidth}`}>
                    <CommonTextField
                        type="tel"
                        maxLength="3"
                        InputProps={{
                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                        }}
                        onChange={(e) => e.target.value >= 0 && setMetadata({ ...metadata, sessionDuration: e.target.value, sessionAmount: '0' })}
                        value={metadata?.sessionDuration}
                    />
                </div>
            </div>
            {
                metadata?.billableService &&
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <CommonLabel value='Service Session payment Amount*' />
                    <div className={`${style.displayInRow}`}>
                        <div className={`${style.threeFieldWidth}`}>
                            <CommonTextField
                                type="tel"
                                maxLength="5"
                                disabled={metadata?.sessionDuration === '' || metadata?.sessionDuration === '0' || metadata?.sessionDuration === undefined}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                }}
                                onChange={(e) => e.target.value >= 0 && handleValueChange('sessionAmount', e.target.value)}
                                value={metadata?.sessionAmount}
                            />
                        </div>
                        <div className={style.verticalAlignCenter}>
                            <CommonLabel className={`${style.marginLeft20}`} value={`$ ${(metadata?.sessionAmount / metadata?.sessionDuration || 0).toFixed(2)} per Hour (Pro Rata)`} />
                        </div>
                    </div>
                </div>
            }
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Total Contracted Service Sessions*' />
                <div className={style.twoCol}>
                    <div className={`${style.spaceBetween} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <EditableText value={metadata?.totalSession} placeholder="" type='tel' maxLength="3" onChange={(e) => onTotalSessionChange(e)}
                            className={style.editableSessionTextStyle} />
                        <div className={`${style.textElement} ${parseInt(metadata?.totalSession) === specified ? style.greenBase : style.redBase} `}>{specified} Specified</div>
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <CommonLabel value={`For ${timeCommitment?.value} ${timeCommitment?.frequency === 'WEEK' ? 'Weeks' : 'Months'} Per Contract Year`} />
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Service Days*' />
                <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected} />
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Allowable Working Day Hours For Service*' />
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

            {addScheduleAndTargetForDifferentPeriods && (
                <AddScheduleAndTargetForDifferentPeriods getAddScheduleAndTargetForDifferentPeriods={getAddScheduleAndTargetForDifferentPeriods} initialValue={newClinicRow} onNewClinicChange={onNewClinicChange} selectedScheduleRow={selectedScheduleRow} metadata={metadata} />
            )}
        </div>
    )
}

export default ClinicBlocksFields;
