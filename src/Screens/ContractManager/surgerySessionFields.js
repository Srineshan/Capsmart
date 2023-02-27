import React, { useState, useEffect } from 'react';
import { EditableText } from '@blueprintjs/core';
import InputAdornment from '@mui/material/InputAdornment';
import { TimePicker } from "@blueprintjs/datetime";
import { GetDateFromHours } from './../../utils/formatting';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import { SpecifiedCountCalculator } from './specifiedCountCalculator';

import style from './index.module.scss';

const SurgerySessionFields = ({ getMetaData, serviceSelected, timeCommitment, isReset, getIsReset }) => {
    const limit5 = 5;

    const [metadata, setMetadata] = useState({
        min: '0',
        max: '0',
        frequency: 'NA',
        withNurse: '0',
        withoutNurse: '0',
        noTargetApplicable: false,
        additionalScheduleValue: '0',
        additionalScheduleFrequency: 'NA',
        additionalScheduleRequired: true,
        billableService: true,
        rateType: 'HOURLY',
        sessionDuration: '0',
        sessionAmount: '0',
        totalSession: '0',
        totalSessionFrequency: 'YEAR',
        workingTimeFrom: null,
        workingTimeTo: null,
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
        let contractedSchedules = [{
            minimum: { value: metadata?.min },
            maximum: { value: metadata?.max },
            frequency: metadata?.frequency
        }]
        setSpecified(SpecifiedCountCalculator(contractedSchedules, timeCommitment, metadata?.additionalScheduleFrequency, metadata?.additionalScheduleValue));
    }, [metadata?.frequency, metadata?.min, metadata?.additionalScheduleValue, metadata?.additionalScheduleFrequency, timeCommitment?.value])


    useEffect(() => {
        setSelectedValues();
    }, [serviceSelected]);

    useEffect(() => {
        if (isReset) {
            resetMetadata();
            getIsReset(false);
        }
    }, [isReset])

    const resetMetadata = () => {
        setMetadata({
            min: '0',
            max: '0',
            frequency: 'NA',
            withNurse: '0',
            withoutNurse: '0',
            noTargetApplicable: false,
            additionalScheduleValue: '0',
            additionalScheduleFrequency: 'NA',
            additionalScheduleRequired: true,
            billableService: true,
            rateType: 'HOURLY',
            sessionDuration: '0',
            sessionAmount: '0',
            totalSession: '0',
            totalSessionFrequency: 'YEAR',
            workingTimeFrom: null,
            workingTimeTo: null,
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
    }

    const setSelectedValues = () => {
        setMetadata({
            ...metadata,
            refId: serviceSelected?.refId,
            min: serviceSelected?.contractedSchedules?.[0]?.minimum?.value,
            max: serviceSelected?.contractedSchedules?.[0]?.maximum?.value,
            frequency: serviceSelected?.contractedSchedules?.[0]?.frequency,
            withNurse: serviceSelected?.patientsSeenTargets?.[0]?.withNurse?.value,
            withoutNurse: serviceSelected?.patientsSeenTargets?.[0]?.withoutNurse?.value,
            noTargetApplicable: serviceSelected?.patientsSeenTargets?.[0]?.noTargetApplicable,
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
                <CommonLabel value='Regular Service Schedule*' />
                <div className={style.displayInRow}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MIN</div>
                        <EditableText type='tel' maxLength="2" placeholder='' value={metadata?.min} className={style.serviceProvidedEditableTextStyle} onChange={(e) => e >= 0 && handleValueChange('min', e)} />
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MAX</div>
                        <EditableText value={metadata?.max} placeholder='' type='tel' maxLength="2" className={style.serviceProvidedEditableTextStyle} onChange={(e) => e >= 0 && handleValueChange('max', e)} />
                    </div>
                    <CommonSelectField className={`${style.fullWidth} ${style.marginLeft20}`}
                        onChange={(e) => handleValueChange('frequency', e.target.value)}
                        value={metadata?.frequency}
                        firstOptionLabel={'Select Frequecy'} firstOptionValue={''}
                        valueList={['WEEK', 'MONTH']}
                        labelList={['Per Week', 'Per Month']}
                        disabledList={[false, false]} />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Service Cases Target*' />
                <div className={`${style.displayInRow}`}>
                    <CommonInputField value={metadata?.withNurse} disabled={metadata?.noTargetApplicable} className={` ${style.threeFieldWidth}`} onChange={(e) => { setpatientTarget(e.target.value) }} />
                    <CommonCheckBox label="No Target Applicable" value={metadata?.noTargetApplicable} className={`${style.marginLeft20} ${style.threeFieldWidth} `} onChange={(e) => handleValueChange('noTargetApplicable', e.target.checked)} />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Additional Schedule*' />
                <div className={style.grid3}>
                    <div className={`${style.fullWidth}`} >
                        <CommonSwitch checked={metadata?.additionalScheduleRequired} label={metadata?.additionalScheduleRequired ? 'YES' : 'NO'} className={`${style.textAlignLeft} ${style.switchFontStyle} ${style.flexLeft}`} onChange={(e) => setMetadata({ ...metadata, additionalScheduleRequired: !metadata?.additionalScheduleRequired, additionalScheduleValue: '0', additionalScheduleFrequency: '' })} />
                    </div>
                    {metadata?.additionalScheduleRequired &&
                        (
                            <>
                                <CommonInputField value={metadata?.additionalScheduleValue}
                                    onChange={(e) => handleValueChange('additionalScheduleValue', e.target.value)}
                                    className={` ${style.fullWidth} ${style.marginLeft20}`} />
                                <CommonSelectField className={`${style.fullWidth} ${style.marginLeft20}`}
                                    value={metadata?.additionalScheduleFrequency || ''}
                                    onChange={(e) => handleValueChange('additionalScheduleFrequency', e.target.value)}
                                    firstOptionLabel={'Select Frequecy'} firstOptionValue={''}
                                    valueList={['WEEK', 'EVERY_OTHER_WEEK', 'MONTH', 'EVERY_OTHER_MONTH']}
                                    labelList={['Every Week', 'Every Other Week', 'Every Month', 'Every Other Month']}
                                    disabledList={[false, false, false, false]} />
                            </>
                        )}

                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Billable Service*' />
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <CommonSwitch checked={metadata?.billableService} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
                            onChange={(e) => setMetadata({ ...metadata, billableService: !metadata?.billableService, sessionAmount: '0' })}
                            label={metadata?.billableService ? 'YES' : 'NO'}
                        />
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
                <CommonLabel value='Service Session Duration' />
                <div className={`${style.threeFieldWidth}`}>
                    <CommonTextField
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
                    <CommonLabel value='Service Session payment Amount*' />
                    <div className={`${style.displayInRow}`}>
                        <div className={`${style.threeFieldWidth}`}>
                            <CommonTextField
                                disabled={metadata?.sessionDuration === '' || metadata?.sessionDuration === '0' || metadata?.sessionDuration === undefined}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                }}
                                value={metadata?.sessionAmount}
                                onChange={(e) => handleValueChange('sessionAmount', e.target.value)}
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
                        <EditableText placeholder='' value={metadata?.totalSession} type='number' min="0"
                            className={style.editableSessionTextStyle}
                            onChange={(e) => {
                                let value = e.slice(0, e.slice());
                                handleValueChange('totalSession', value);
                            }} />
                        <div className={`${style.textElement} ${parseInt(metadata?.totalSession) === specified ? style.greenBase : style.redBase}`}>{specified} Minimum Specified</div>
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <CommonLabel value={`For ${timeCommitment?.value} ${timeCommitment?.frequency === 'WEEK' ? 'Weeks' : 'Months'} Per Contract Year`} />
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Service Days*' />
                <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected} isReset={isReset} setIsReset={getIsReset} />
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Allowable Working Day Hours For Service*' />
                <div className={style.displayInRow}>
                    <TimePicker
                        useAmPm={false}
                        onChange={(e) => {
                            updateWorkingPeriod(e);
                        }}
                        value={metadata?.workingTimeFrom === null ? null : new Date(metadata?.workingTimeFrom)}
                    />
                    <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                    <TimePicker
                        useAmPm={false}
                        onChange={(e) => handleValueChange('workingTimeTo', e)}
                        value={metadata?.workingTimeTo === null ? null : new Date(metadata?.workingTimeTo)}
                    // minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000))}
                    />
                </div>
            </div>


        </div >
    )
}

export default SurgerySessionFields;
