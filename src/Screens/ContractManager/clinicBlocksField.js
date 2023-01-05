import React, { useState, useEffect } from 'react';
import { InputGroup, EditableText, Checkbox } from '@blueprintjs/core';
import { TimePicker } from "@blueprintjs/datetime";
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
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

const ClinicBlocksFields = ({ getMetaData, serviceSelected, timeCommitment }) => {
    const [metadata, setMetadata] = useState({
        min: '0',
        max: '0',
        frequency: '',
        withNurse: '0',
        withoutNurse: '0',
        noTargetApplicable: false,
        targetWithNurse: '0',
        targetWithoutNurse: '0',
        targetNoTargetApplicable: false,
        additionalScheduleValue: '0',
        additionalScheduleFrequency: '',
        additionalScheduleRequired: true,
        billableService: true,
        rateType: 'HOURLY',
        sessionDuration: '0',
        sessionAmount: '0',
        totalSession: '0',
        totalSessionFrequency: '',
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

    useEffect(()=>{
      let additionalFreq = metadata?.additionalScheduleFrequency === 'WEEK' ? timeCommitment?.value || 0 : (timeCommitment?.value/2) || 0;
      let value = (parseInt(metadata?.min || '0') * timeCommitment?.value || 0) + (parseInt(metadata?.additionalScheduleValue || '0')  * additionalFreq);
      setSpecified(value);
    }, [metadata?.min, metadata?.additionalScheduleValue, metadata?.additionalScheduleFrequency, timeCommitment?.value])

    useEffect(() => {
        setSelectedValues();
    }, [serviceSelected]);

    console.log('time', timeCommitment);

    const setSelectedValues = () => {
        setMetadata({
            ...metadata,
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

    useEffect(() => {
        getMetaData(metadata);
    }, [metadata])

    const getServiceDaysMetadata = (serviceDays) => {
        setMetadata({ ...metadata, serviceDays: serviceDays})
    }

    const onAdditionalScheduleChange = (value) => {
      if(!value){
        setMetadata({ ...metadata, additionalScheduleRequired: value, additionalScheduleValue : '0' , additionalScheduleFrequency : ''})
      }else{
          setMetadata({ ...metadata, additionalScheduleRequired: value});
      }
    }

    const onTotalSessionChange = (e) => {
      if(e >= 0){
        let value = e.slice(0, limit5);
        handleValueChange('totalSession', value);
      }
    }

    const updateWorkingPeriod = (e) => {
      let minTime= new Date(new Date(e).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000));
      setMetadata({...metadata, workingTimeFrom:e, workingTimeTo:minTime});
    }

    const limit5 = 5;

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Regular Service Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MIN</div>
                        <EditableText placeholder="" type='tel' maxLength="2" value={metadata?.min} className={style.serviceProvidedEditableTextStyle} onChange={(e) => e >= 0 && handleValueChange('min', e)} />
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MAX</div>
                        <EditableText placeholder="" type='tel' maxLength="2" value={metadata?.max} className={style.serviceProvidedEditableTextStyle} onChange={(e) => e >= 0 && handleValueChange('max', e)} />
                    </div>
                    <Select
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        className={`${style.fullWidth} ${style.marginLeft20}`}
                        value={metadata?.frequency}
                        onChange={(e) => handleValueChange('frequency', e.target.value)}
                    >
                        <MenuItem value={''}>Select Frequecy</MenuItem>
                        <MenuItem value={'WEEK'} disabled={timeCommitment?.frequency !== 'WEEK'}>Per Week</MenuItem>
                        <MenuItem value={'MONTH'} disabled={timeCommitment?.frequency !== 'MONTH'}>Per Month</MenuItem>
                    </Select>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Patients Seen Target*</div>
                <div className={style.withNurseGrid}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <div className={style.textElement}>WITH NURSE</div>
                        <EditableText placeholder="" type='tel' maxLength="2" disabled={metadata?.noTargetApplicable} value={metadata?.withNurse} className={style.serviceProvidedEditableTextStyle} onChange={(e) =>e >= 0 && handleValueChange('withNurse', e)} />
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <div className={style.textElement}>WITHOUT NURSE</div>
                        <EditableText placeholder="" type='tel' maxLength="2" disabled={metadata?.noTargetApplicable} className={style.serviceProvidedEditableTextStyle} value={metadata?.withoutNurse} onChange={(e) =>e >= 0 && handleValueChange('withoutNurse', e)} />
                    </div>
                    <Checkbox label="No Target Applicable" checked={metadata?.noTargetApplicable} className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`} onChange={(e) => handleValueChange('noTargetApplicable', e.target.checked)} />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Scheduled Patient Target*</div>
                <div className={`${style.withNurseGrid} ${style.fullWidth}`}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <div className={style.textElement}>WITH NURSE</div>
                        <EditableText placeholder="" type='tel' maxLength="2" disabled={metadata?.targetNoTargetApplicable} value={metadata?.targetWithNurse} className={style.serviceProvidedEditableTextStyle} onChange={(e) =>e >= 0 && handleValueChange('targetWithNurse', e)} />
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <div className={style.textElement}>WITHOUT NURSE</div>
                        <EditableText placeholder="" type='tel' maxLength="2" disabled={metadata?.targetNoTargetApplicable} value={metadata?.targetWithoutNurse} className={style.serviceProvidedEditableTextStyle} onChange={(e) =>e >= 0 && handleValueChange('targetWithoutNurse', e)} />
                    </div>
                    <Checkbox label="No Target Applicable" checked={metadata?.targetNoTargetApplicable} className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`} onChange={(e) => handleValueChange('targetNoTargetApplicable', e.target.checked)} />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Additional Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <ThemeProvider theme={switchTheme}>
                            <FormControlLabel
                                control={
                                    <Switch checked={metadata?.additionalScheduleRequired} className={`${style.textAlignLeft}`} onChange={() => onAdditionalScheduleChange(!metadata?.additionalScheduleRequired)} />
                                }
                                color='primary'
                                className={`${style.switchFontStyle} ${style.flexLeft}`}
                                label={metadata?.additionalScheduleRequired ? 'YES' : 'NO'}
                            />
                        </ThemeProvider>
                    </div>
                    {metadata?.additionalScheduleRequired &&
                        <>
                            <InputGroup value={metadata?.additionalScheduleValue} type="tel" maxLength="2" onChange={(e) => e.target.value  >= 0 &&handleValueChange('additionalScheduleValue', e.target.value)} className={` ${style.threeFieldWidth}`} />
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                                value={metadata?.additionalScheduleFrequency}
                                onChange={(e) => handleValueChange('additionalScheduleFrequency', e.target.value)}
                            >
                                <MenuItem value={''}>Select Frequecy</MenuItem>
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
                                    <Switch checked={metadata?.billableService} className={` ${style.textAlignLeft}`} />
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
                <div className={style.extentionLableStyle}>Service Session Duration</div>
                <div className={`${style.threeFieldWidth}`}>
                    <TextField
                        size="small"
                        type="tel"
                        maxLength="3"
                        InputProps={{
                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                        }}
                        onChange={(e) =>e.target.value >= 0 && setMetadata({...metadata, sessionDuration:e.target.value, sessionAmount:'0'})}
                        value={metadata?.sessionDuration}
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
                            type="tel"
                            maxLength="5"
                            disabled={metadata?.sessionDuration === '' || metadata?.sessionDuration === '0' || metadata?.sessionDuration === undefined}
                            InputProps={{
                                startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                            }}
                            onChange={(e) =>e.target.value >= 0 && handleValueChange('sessionAmount', e.target.value)}
                            value={metadata?.sessionAmount}
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
                        <EditableText value={metadata?.totalSession} placeholder="" type='tel' maxLength="3" onChange={(e) => onTotalSessionChange(e)}
                            className={style.editableSessionTextStyle} />
                        <div className={`${style.textElement} ${parseInt(metadata?.totalSession) === specified ? style.greenBase : style.redBase} `}>{specified} Specified</div>
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <p className={`${style.extentionLableStyle}`}>For {timeCommitment?.value} {timeCommitment?.frequency === 'WEEK' ? 'Weeks' :'Months'} Per Contract Year</p>
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
                        minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.sessionDuration * 60 * 60 * 1000))}
                    />
                </div>
            </div>
        </div>
    )
}

export default ClinicBlocksFields;
