import React, { useState, useEffect} from 'react';
import { InputGroup, EditableText, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

import style from './index.module.scss';

const SurgerySessionFields = ({getMetaData, serviceSelected}) => {
    const limit5 = 5;

    const [metadata,setMetadata] = useState({
      min:'0',
      max:'0',
      frequency:'WEEK',
      withNurse:'0',
      withoutNurse:'0',
      noTargetApplicable:false,
      additionalScheduleValue:'0',
      additionalScheduleFrequency:'WEEK',
      additionalScheduleRequired:true,
      billableService:true,
      rateType:'HOURLY',
      sessionDuration:'0',
      sessionAmount:'0',
      totalSession:'0',
      totalSessionFrequency:'YEAR',
      workingTimeFrom:'',
      workingTimeTo:'',
      serviceDays:{
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
      weekdaysCount:'0',
      weekendsCount:'0',
    })

    useEffect(()=>{
      setSelectedValues();
    }, [serviceSelected]);

    const setSelectedValues = () => {
      setMetadata({...metadata,
      min: serviceSelected?.contractedSchedule?.minimum?.value,
      max: serviceSelected?.contractedSchedule?.maximum?.value,
      frequency: serviceSelected?.contractedSchedule?.frequency,
      withNurse:serviceSelected?.patientsSeenTarget?.withNurse?.value,
      withoutNurse:serviceSelected?.patientsSeenTarget?.withoutNurse?.value,
      noTargetApplicable:serviceSelected?.patientsSeenTarget?.noTargetApplicable,
      additionalScheduleValue:serviceSelected?.additionalSchedule?.value,
      additionalScheduleFrequency:serviceSelected?.additionalSchedule?.frequency,
      additionalScheduleRequired:serviceSelected?.additionalSchedule?.scheduleRequired,
      billableService:serviceSelected?.billableService,
      rateType:serviceSelected?.rateType,
      sessionDuration:serviceSelected?.duration?.hours,
      sessionAmount:serviceSelected?.payableAmount?.value,
      totalSession:serviceSelected?.totalSessions?.value,
      totalSessionFrequency:serviceSelected?.totalSessions?.frequency,
      workingTimeFrom:serviceSelected?.workingPeriod?.from,
      workingTimeTo:serviceSelected?.workingPeriod?.to,
      serviceDays:serviceSelected?.serviceDays,
    });
    }


    useEffect(()=>{
      getMetaData(metadata)
    },[metadata])

    const handleValueChange = (name, value) => {
      setMetadata({...metadata, [name]:value});
    }

    const getServiceDaysMetadata = (daysCount, serviceDays) => {
      setMetadata({...metadata, serviceDays:serviceDays, weekdaysCount:daysCount?.weekdays, weekendsCount:daysCount?.weekends})
    }

    const setpatientTarget = (value) => {
      setMetadata({...metadata, withNurse:value, withoutNurse:value});
    }

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Regular Service Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MIN</div>
                        <EditableText type='number' placeholder='' value={metadata?.min} className={style.serviceProvidedEditableTextStyle} onChange={(e)=>handleValueChange('min',e)}/>
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MAX</div>
                        <EditableText value={metadata?.max} placeholder='' type='number' className={style.serviceProvidedEditableTextStyle} onChange={(e)=>handleValueChange('max',e)}/>
                    </div>
                    <Select
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        className={`${style.fullWidth} ${style.marginLeft20}`}
                        onChange={(e)=>handleValueChange('frequency',e.target.value)}
                        value={metadata?.frequency}
                    >
                        <MenuItem value="">Select Frequecy</MenuItem>
                        <MenuItem value={'WEEK'}>Per Week</MenuItem>
                        <MenuItem value={'MONTH'}>Per Month</MenuItem>
                        <MenuItem value={'YEAR'}>Per Contract Year</MenuItem>
                    </Select>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Service Cases Target*</div>
                <div className={`${style.displayInRow}`}>
                    <InputGroup  value={metadata?.withNurse} disabled={metadata?.noTargetApplicable} className={` ${style.threeFieldWidth}`} onChange={(e)=>{setpatientTarget(e.target.value)}}/>
                    <Checkbox label="No Target Applicable" value={metadata?.noTargetApplicable} className={`${style.marginLeft20} ${style.threeFieldWidth} `} onChange={(e)=>handleValueChange('noTargetApplicable', e.target.checked)}/>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Additional Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <FormControlLabel
                            control={
                                <Switch checked={metadata?.additionalScheduleRequired} className={` ${style.textAlignLeft}`} />
                            }
                            onChange={(e)=>handleValueChange('additionalScheduleRequired', !metadata?.additionalScheduleRequired)}
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={metadata?.additionalScheduleRequired ? 'YES' : 'NO'}
                        />
                    </div>
                    {metadata?.additionalScheduleRequired &&
                      (
                        <>
                          <InputGroup value={metadata?.additionalClinicScheduleValue}
                          onChange={(e)=>handleValueChange('additionalScheduleValue', e.target.value)}
                          className={` ${style.threeFieldWidth}`}/>

                          <Select
                              displayEmpty
                              SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                              className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                              value = {metadata?.additionalScheduleFrequency}
                              onChange={(e)=>handleValueChange('additionalScheduleFrequency', e.target.value)}
                          >
                              <MenuItem value="">Select Frequecy</MenuItem>
                              <MenuItem value={'WEEK'}>Every Other Week</MenuItem>
                              <MenuItem value={'MONTH'}>Every Other Month</MenuItem>
                              <MenuItem value={'YEAR'}>Every Other Year</MenuItem>
                          </Select>
                        </>
                      )}

                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Billable Service*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <FormControlLabel
                            control={
                                <Switch checked={metadata?.billableService} className={` ${style.textAlignLeft}`}
                                onChange={(e)=>handleValueChange('billableService', !metadata?.billableService)}
                                />
                                }
                                className={`${style.switchFontStyle} ${style.flexLeft}`}
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
                <div className={style.extentionLableStyle}>Service Session Duration</div>
                <div className={`${style.threeFieldWidth}`}>
                    <TextField
                        size="small"
                        InputProps={{
                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                        }}
                        value={metadata?.sessionDuration}
                        onChange={(e)=>handleValueChange('sessionDuration', e.target.value)}
                    />
                </div>
            </div>

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
                            onChange={(e)=>handleValueChange('sessionAmount', e.target.value)}
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
                        <EditableText placeholder='' value={metadata?.totalSession} type='number'
                        className={style.editableSessionTextStyle}
                        onChange={(e)=>{
                          let value = e.slice(0, e.slice());
                          handleValueChange('totalSession', value);}}/>
                        <div className={`${style.textElement} ${style.greenBase} ${style.redBase}`}>60 Specified</div>
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <p className={`${style.extentionLableStyle}`}>For 48 Weeks Per Contract Year</p>
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Service Days*</div>
                <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected}/>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Allowable Working Day Hours For Service*</div>
                <div className={style.displayInRow}>
                    <InputGroup
                        value={metadata?.workingTimeFrom}
                        placeholder="HH:MM"
                        className={style.threeFieldWidth}
                        onChange={(e)=>handleValueChange('workingTimeFrom', e.target.value)}
                    />
                    <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                    <InputGroup
                        placeholder="HH:MM"
                        onChange={(e)=>handleValueChange('workingTimeTo', e.target.value)}
                        className={style.threeFieldWidth}
                        value={metadata?.workingTimeTo}
                    />
                </div>
            </div>
        </div>
    )
}

export default SurgerySessionFields;
