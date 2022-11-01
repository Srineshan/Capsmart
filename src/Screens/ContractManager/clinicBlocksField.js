import React, { useState, useEffect } from 'react';
import { InputGroup, EditableText, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

import style from './index.module.scss';

const ClinicBlocksFields = ({getMetaData, serviceSelected}) => {

    const [metadata,setMetadata] = useState({
      min:'0',
      max:'0',
      frequency:'WEEK',
      withNurse:'0',
      withoutNurse:'0',
      noTargetApplicable:true,
      targetWithNurse:'0',
      targetWithoutNurse:'0',
      targetNoTargetApplicable:true,
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
      targetWithNurse:serviceSelected?.scheduledPatientsTarget?.withNurse?.value,
      targetWithoutNurse:serviceSelected?.scheduledPatientsTarget?.withoutNurse?.value,
      targetNoTargetApplicable:serviceSelected?.scheduledPatientsTarget?.noTargetApplicable,
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

    const handleValueChange = (name, value) => {
      setMetadata({...metadata, [name]:value});
    }

    useEffect(()=>{
      getMetaData(metadata);
    },[metadata])

    const getServiceDaysMetadata = (daysCount, serviceDays) => {
      setMetadata({...metadata, serviceDays:serviceDays, weekdaysCount:daysCount?.weekdays, weekendsCount:daysCount?.weekends})
    }

    const limit5 = 5;

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Regular Clinic Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MIN</div>
                        <EditableText placeholder="" type='number' value={metadata?.min} className={style.serviceProvidedEditableTextStyle} onChange={(e)=>handleValueChange('min',e)}/>
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MAX</div>
                        <EditableText placeholder="" type='number' value={metadata?.max} className={style.serviceProvidedEditableTextStyle} onChange={(e)=>handleValueChange('max',e)}/>
                    </div>
                    <Select
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        className={`${style.fullWidth} ${style.marginLeft20}`}
                        value={metadata?.frequency}
                        onChange={(e)=>handleValueChange('frequency',e.target.value)}
                    >
                        <MenuItem value="">Select Frequecy</MenuItem>
                        <MenuItem value={'WEEK'}>Per Week</MenuItem>
                        <MenuItem value={'MONTH'}>Per Month</MenuItem>
                        <MenuItem value={'YEAR'}>Per Year</MenuItem>
                    </Select>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Patients Seen Target*</div>
                <div className={style.withNurseGrid}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <div className={style.textElement}>WITH NURSE</div>
                        <EditableText placeholder="" type='number' value={metadata?.withNurse} className={style.serviceProvidedEditableTextStyle} onChange={(e)=>handleValueChange('withNurse',e)}/>
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <div className={style.textElement}>WITHOUT NURSE</div>
                        <EditableText placeholder="" type='number' className={style.serviceProvidedEditableTextStyle} value={metadata?.withoutNurse} onChange={(e)=>handleValueChange('withoutNurse',e)}/>
                    </div>
                    <Checkbox label="No Target Applicable" checked={metadata?.noTargetApplicable} className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`} onChange={(e)=>handleValueChange('noTargetApplicable',e.target.checked)}/>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Scheduled Patient Target*</div>
                <div className={`${style.withNurseGrid} ${style.fullWidth}`}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <div className={style.textElement}>WITH NURSE</div>
                        <EditableText placeholder="" type='number' value={metadata?.targetWithNurse} className={style.serviceProvidedEditableTextStyle} onChange={(e)=>handleValueChange('targetWithNurse',e)}/>
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <div className={style.textElement}>WITHOUT NURSE</div>
                        <EditableText placeholder="" type='number' value={metadata?.targetWithoutNurse} className={style.serviceProvidedEditableTextStyle} onChange={(e)=>handleValueChange('targetWithoutNurse',e)}/>
                    </div>
                    <Checkbox label="No Target Applicable"  checked={metadata?.targetNoTargetApplicable} className={`${style.marginLeft20} ${style.fullWidth} ${style.verticalAlignCenter}`} onChange={(e)=>handleValueChange('targetNoTargetApplicable',e.target.checked)}/>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Additional Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <FormControlLabel
                            control={
                                <Switch checked={metadata?.additionalScheduleRequired} className={`${style.textAlignLeft}`} onChange={(e)=>handleValueChange('additionalScheduleRequired',e.target.checked)}/>
                            }
                            onChange={() => setMetadata({...metadata, additionalScheduleRequired: !metadata?.additionalScheduleRequired})}
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={metadata?.additionalScheduleRequired ? 'YES' : 'NO'}
                        />
                    </div>
                    <InputGroup value={metadata?.additionalScheduleValue} onChange={(e)=>handleValueChange('additionalScheduleValue',e.target.value)} className={` ${style.threeFieldWidth}`} />
                    <Select
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                        value={metadata?.additionalScheduleFrequency}
                        onChange={(e)=>handleValueChange('additionalScheduleFrequency',e.target.value)}
                    >
                        <MenuItem value="">Select Frequecy</MenuItem>
                        <MenuItem value={'WEEK'}>Every Other Week</MenuItem>
                        <MenuItem value={'MONTH'}>Every Other Month</MenuItem>
                        <MenuItem value={'YEAR'}>Every Other Year</MenuItem>
                    </Select>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Billable Service*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <FormControlLabel
                            control={
                                <Switch checked={metadata?.billableService} className={` ${style.textAlignLeft}`} />
                            }
                            onChange={(e)=>handleValueChange('billableService',!metadata?.billableService)}
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={metadata?.billableService ? 'YES' : 'NO'}
                        />
                    </div>
                    <Select
                        displayEmpty
                        SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                        className={`${style.threeFieldWidth}`}
                        value={metadata?.rateType}
                        onChange={(e)=>handleValueChange('rateType',e.target.value)}
                    >
                        <MenuItem value="">Select Frequecy</MenuItem>
                        <MenuItem value={'HOURLY'}>Hourly</MenuItem>
                    </Select>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Clinic Session Duration</div>
                <div className={`${style.threeFieldWidth}`}>
                    <TextField
                        size="small"
                        InputProps={{
                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                        }}
                        onChange={(e)=>handleValueChange('sessionDuration',e.target.value)}
                        value={metadata?.sessionDuration}
                    />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Clinic Session payment Amount*</div>
                <div className={`${style.displayInRow}`}>
                    <div className={`${style.threeFieldWidth}`}>
                        <TextField
                            size="small"
                            InputProps={{
                                startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                            }}
                            onChange={(e)=>handleValueChange('sessionAmount',e.target.value)}
                            value={metadata?.sessionAmount}
                        />
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>$ 300 per Hour (Pro Rata)</p>
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Total Contracted Service Sessions*</div>
                <div className={style.twoCol}>
                    <div className={`${style.spaceBetween} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <EditableText value={metadata?.totalSession} placeholder="" type='number' onChange={(e)=>
                          {
                            let value = e.slice(0, limit5);
                            handleValueChange('totalSession',value);
                          }}
                          className={style.editableSessionTextStyle} />
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
                <div className={style.extentionLableStyle}>Allowable Working Day Hours For Clinic*</div>
                <div className={style.displayInRow}>
                    <InputGroup
                        placeholder="HH:MM"
                        onChange={(e)=>handleValueChange('workingTimeFrom',e.target.value)}
                        value={metadata?.workingTimeFrom}
                        className={style.threeFieldWidth}
                    />
                    <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                    <InputGroup
                        placeholder="HH:MM"
                        onChange={(e)=>handleValueChange('workingTimeTo',e.target.value)}
                        value={metadata?.workingTimeTo}
                        className={style.threeFieldWidth}
                    />
                </div>
            </div>
        </div>
    )
}

export default ClinicBlocksFields;
