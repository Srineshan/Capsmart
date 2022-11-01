import React, { useState, useEffect } from 'react';
import { InputGroup, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

import style from './index.module.scss';

const OnCallCoverageFields = ({getMetaData, serviceSelected}) => {
    const [metadata, setMetadata] = useState({
          min:'0',
          max:'0',
          frequency:'WEEK',
          onCallCoverageFor:[],
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
          weekendsCount:'0'
        })

        useEffect(()=>{
          setSelectedValues();
        }, [serviceSelected]);

        const setSelectedValues = () => {
          setMetadata({...metadata,
          min: serviceSelected?.contractedSchedule?.minimum?.value,
          max: serviceSelected?.contractedSchedule?.maximum?.value,
          frequency: serviceSelected?.contractedSchedule?.frequency,
          onCallCoverageFor:serviceSelected?.activityResponse?.dataMap?.onCallCoverageFor,
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

    const limit5 = 5;

    console.log('data',metadata);

    useEffect(()=>{
      getMetaData(metadata)
    },[metadata])

    const handleValueChange = (name, value) => {
      setMetadata({...metadata, [name]:value});
    }

    const getServiceDaysMetadata = (daysCount, serviceDays) => {
      setMetadata({...metadata, serviceDays:serviceDays, weekdaysCount:daysCount?.weekdays, weekendsCount:daysCount?.weekends})
    }

    const handleOnCallCoverageFor = (value,e) => {
      if(e.target.checked){
        let temp = metadata?.onCallCoverageFor;
        temp.push(value)
        setMetadata({...metadata, onCallCoverageFor:temp});
        console.log('temp',temp);
      }else{
        let temp = metadata?.onCallCoverageFor?.filter(data=>data !== value)?.map(data=>data);
        setMetadata({...metadata, onCallCoverageFor:temp});
        console.log('temp',temp);
      }
    }

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>On Call Coverage For *</div>
                <div className={style.spaceBetween}>
                    <FormGroup className={`${style.marginLeft10} ${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox checked={metadata?.onCallCoverageFor?.includes('InPatient')} onChange={(e)=>handleOnCallCoverageFor('InPatient',e)}/>}  label={<Typography variant="body2" color="textSecondary">Inpatient</Typography>} />
                    </FormGroup>
                    <FormGroup className={`${style.marginLeft10} ${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox  checked={metadata?.onCallCoverageFor?.includes('Ambulatory')} onChange={(e)=>handleOnCallCoverageFor('Ambulatory',e)}/>}  label={<Typography variant="body2" color="textSecondary">Ambulatory</Typography>} />
                    </FormGroup>
                    <FormGroup className={`${style.marginLeft10} ${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox checked={metadata?.onCallCoverageFor?.includes('ED')} onChange={(e)=>handleOnCallCoverageFor('ED',e)}/>}  label={<Typography variant="body2" color="textSecondary">ED</Typography>} />
                    </FormGroup>
                    <FormGroup className={`${style.marginLeft10} ${style.threeFieldWidth}`}>
                        <FormControlLabel control={<Checkbox checked={metadata?.onCallCoverageFor?.includes('L & D')} onChange={(e)=>handleOnCallCoverageFor('L & D',e)}/>}  label={<Typography variant="body2" color="textSecondary">L & D</Typography>} />
                    </FormGroup>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Service Days*</div>
                <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected}/>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Number of On Call Duty Days*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MIN</div>
                        <EditableText value={metadata?.min}  onChange={(e)=>handleValueChange('min',e)} type='number' className={style.serviceProvidedEditableTextStyle} />
                    </div>
                    <div className={`${style.displayInRow} ${style.editableTextOuterBorder} ${style.threeFieldWidth}`}>
                        <div className={style.textElement}>MAX</div>
                        <EditableText value={metadata?.max}  onChange={(e)=>handleValueChange('max',e)} type='number' className={style.serviceProvidedEditableTextStyle} />
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
                <div className={style.extentionLableStyle}>Additional Schedule*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <FormControlLabel
                            control={
                                <Switch checked={metadata?.additionalSchedule} className={` ${style.textAlignLeft}`} />
                            }
                            onChange={(e)=>handleValueChange('additionalScheduleRequired',!metadata?.additionalScheduleRequired)}
                            className={`${style.switchFontStyle} ${style.flexLeft}`}
                            label={metadata?.additionalScheduleRequired ? 'YES' : 'NO'}
                        />
                    </div>
                    <InputGroup value={metadata?.additionalScheduleValue}
                    onChange={(e) => handleValueChange('additionalScheduleValue',e.target.value)}
                    className={` ${style.threeFieldWidth}`} />
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
                                <Switch checked={metadata?.billableService}
                                className={` ${style.textAlignLeft}`} />
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
                        onChange={(e)=>handleValueChange('rateType',!metadata?.rateType)}
                    >
                        <MenuItem value="">Select Frequecy</MenuItem>
                        <MenuItem value={'HOURLY'}>Hourly</MenuItem>
                    </Select>
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
                        onChange={(e)=>handleValueChange('sessionDuration',e.target.value)}
                    />
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>On Call Payment Amount*</div>
                <div className={`${style.displayInRow}`}>
                    <div className={`${style.threeFieldWidth}`}>
                        <TextField
                            size="small"
                            InputProps={{
                                startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                            }}
                            value={metadata?.sessionAmount}
                            onChange={(e)=>handleValueChange('sessionAmount',e.target.value)}
                        />
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>$ 50 per Hour (Pro Rata)</p>
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Total Contracted Service Sessions*</div>
                <div className={style.twoCol}>
                    <div className={`${style.spaceBetween} ${style.editableTextOuterBorder} ${style.fullWidth}`}>
                        <EditableText value={metadata?.totalSession} placeholder="" type='number' onChange={(e)=>{
                          let value = e.slice(0, e.slice());
                          handleValueChange('totalSession', value);}}
                          className={style.editableSessionTextStyle} />
                        <div className={`${style.textElement} ${style.greenBase} ${style.redBase}`}>60 Specified</div>
                    </div>
                    <div className={style.verticalAlignCenter}>
                        <p className={`${style.extentionLableStyle}`}>For 48 Weeks Per Contract Year</p>
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Allowable Working Day Hours For Duty Days*</div>
                <div className={style.displayInRow}>
                    <InputGroup
                        value={metadata?.workingTimeFrom}
                        placeholder="HH:MM"
                        onChange={(e)=> handleValueChange('workingTimeFrom',e.target.value) }
                        className={style.threeFieldWidth}
                    />
                    <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop}`}>To</p>
                    <InputGroup
                        value={metadata?.workingTimeTo}
                        placeholder="HH:MM"
                        onChange={(e)=> handleValueChange('workingTimeTo',e.target.value) }
                        className={style.threeFieldWidth}
                    />
                </div>
            </div>
        </div>
    )
}

export default OnCallCoverageFields;
