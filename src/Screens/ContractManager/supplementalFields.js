import React, { useState, useEffect } from 'react';
import { InputGroup, EditableText } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';

import style from './index.module.scss';
import MultiSelectDisplay from '../../Components/ReusableSmallComponents/multiSelectDisplay';

const SupplementalFields = ({getMetaData, services, serviceSelected, editService}) => {
    const [workingPeriodFrom, setWorkingPeriodFrom] = useState('');
    const [workingPeriodTo, setWorkingPeriodTo] = useState('');
    const [additionalClinicSchedule, setAdditionalClinicSchedule] = useState(0);
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [totalContractedService, setTotalContractedService] = useState(0);
    const [isDedicatedHours, setIsDedicatedHours] = useState(false);

    const [supplementServiceName, setSupplementServiceName] = useState('');
    let specificDedicatedHoursList = [];
    services?.filter(data=>['Clinic Blocks','Surgery Session','On Call Coverage Duty Days']?.includes(data?.activityType?.activityType))?.map(data=>{
      let activityName = data?.activityType?.activityType;
      let activities = data?.activities?.map(data=>data?.activity);
      let result = `${activityName} (${activities?.map(data=>data)?.join(', ')})`
      specificDedicatedHoursList.push(result);
    });

    const selectedHours = (index) => {
      let temp = services?.filter(data=>['Clinic Blocks','Surgery Session','On Call Coverage Duty Days']?.includes(data?.activityType?.activityType))?.map(data=>data);
      let dedicatedHoursActivityType = temp[index]?.activityType?.activityType;
      let dedicatedHoursPerformingActivity = temp[index]?.activities?.map(data=>data?.activity)?.join('-');
      setMetadata({...metadata,
        dedicatedHoursActivityType:dedicatedHoursActivityType,
        dedicatedHoursPerformingActivity:dedicatedHoursPerformingActivity,
        billableService:temp[index]?.billableService,
        rateType:temp[index]?.rateType,
        sessionAmount:temp[index]?.payableAmount?.value,
        sessionDuration:temp[index]?.duration?.hours,
        totalSession:temp[index]?.totalSessions?.value,
        totalSessionFrequency:temp[index]?.totalSessions?.frequency,
        workingTimeFrom:temp[index]?.workingPeriod?.from,
        workingTimeTo:temp[index]?.workingPeriod?.to,
        serviceDays:temp[index]?.serviceDays,
      });
    }

    const [metadata, setMetadata] = useState({
          dedicatedHoursSpecified:false,
          dedicatedHoursActivityType:'',
          dedicatedHoursPerformingActivity:'',
          supplementServiceName:[],
          billableService:true,
          rateType:'HOURLY',
          totalSession:'0',
          totalSessionFrequency:'YEAR',
          sessionAmount:'',
          sessionDuration:'0',
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
          if(editService){
            setSelectedValues();
          }
        }, [serviceSelected]);

        const setSelectedValues = () => {
          setMetadata({...metadata,
          dedicatedHoursSpecified:serviceSelected?.dedicatedHoursSpecified,
          dedicatedHoursActivityType:serviceSelected?.hoursBorrowed?.activityType?.activityType,
          dedicatedHoursPerformingActivity:serviceSelected?.hoursBorrowed?.performingActivity?.activity,
          supplementServiceName:serviceSelected?.activities?.map(data=>data?.activity),
          billableService:serviceSelected?.billableService,
          rateType:serviceSelected?.rateType,
          sessionAmount:serviceSelected?.payableAmount?.value,
          sessionDuration:serviceSelected?.duration?.hours,
          totalSession:serviceSelected?.totalSessions?.value,
          totalSessionFrequency:serviceSelected?.totalSessions?.frequency,
          workingTimeFrom:serviceSelected?.workingPeriod?.from,
          workingTimeTo:serviceSelected?.workingPeriod?.to,
          serviceDays:serviceSelected?.serviceDays,
          });
        }


    const limit5 = 5;

    useEffect(()=>{
      getMetaData(metadata)
    },[metadata])
    console.log('metadata',metadata);

    const handleValueChange = (name, value) => {
      if(name === 'dedicatedHoursSpecified' && value){
        setMetadata({...metadata, dedicatedHoursActivityType:'', dedicatedHoursPerformingActivity:'', dedicatedHoursSpecified:value});
      }else{
        setMetadata({...metadata, [name]:value});
      }
    }

    const getServiceDaysMetadata = (daysCount, serviceDays) => {
      setMetadata({...metadata, serviceDays:serviceDays, weekdaysCount:daysCount?.weekdays, weekendsCount:daysCount?.weekends})
    }

    const addSupplementService = () => {
      let temp = metadata?.supplementServiceName;
      if(!temp?.includes(supplementServiceName)){
        temp?.push(supplementServiceName);
        setMetadata({...metadata, supplementServiceName: temp});
      }
      setSupplementServiceName('');
    }

    const removeSupplementServiceName = (index) => {
      let temp = metadata?.supplementServiceName;
      setMetadata({...metadata, supplementServiceName: temp?.filter((data,indexValue)=>index !== indexValue)?.map(data=>data)});

      console.log('removed',temp?.filter((data,indexValue)=>index !== indexValue)?.map(data=>data))
    }

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Dedicated Hours For Supplemental Services*</div>
                <div className={`${style.displayInRow} `}>
                    <FormControlLabel
                        control={
                            <Switch className={`${style.textAlignLeft}`} checked={metadata?.dedicatedHoursSpecified} onChange={(e) => handleValueChange('dedicatedHoursSpecified',!metadata?.dedicatedHoursSpecified)}  />
                        }
                        className={`${style.switchFontStyle} ${style.flexLeft} `}
                        label={metadata?.dedicatedHoursSpecified ? 'YES' : 'NO'}
                    />
                    {!metadata?.dedicatedHoursSpecified && (
                        <Select
                            displayEmpty
                            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                            className={`${style.fullWidth}`}
                            onChange={(e)=>selectedHours(e.target.value)}
                        >
                            <MenuItem value="">Select source of hours for this service</MenuItem>
                            {
                              specificDedicatedHoursList?.map((data,index)=>(
                                <MenuItem value={index}>{data}</MenuItem>
                              ))
                            }
                        </Select>
                    )}
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Supplemental Services To Perform*</div>
                <div>
                    <div className={`${style.fullWidth} ${style.addGrid}`}>
                        <InputGroup className={style.fullWidth} placeholder="Add Supplemental Services specified in contract" value={supplementServiceName} onChange={(e)=>setSupplementServiceName(e.target.value)}/>
                        <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`}>
                            <AddIcon sx={{ fontSize: 25, color: 'white' }} onClick={addSupplementService}/>
                        </div>
                    </div>
                    {
                     metadata?.supplementServiceName?.length !== 0 && metadata?.supplementServiceName &&
                       <MultiSelectDisplay values={metadata?.supplementServiceName} removeItem={removeSupplementServiceName}/>
                    }
                </div>
            </div>
            {metadata?.dedicatedHoursSpecified && (
                <>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Billable Service*</div>
                        <div className={style.displayInRow}>
                            <div className={`${style.threeFieldWidth}`} >
                                <FormControlLabel
                                    control={
                                        <Switch checked={metadata?.billableService} className={` ${style.textAlignLeft} `} />
                                    }
                                    onChange={() => handleValueChange('billableService', !metadata?.billableService)}
                                    className={`${style.switchFontStyle} ${style.flexLeft}`}
                                    label={metadata?.billableService ? 'YES' : 'NO'}
                                />
                            </div>
                            {
                              metadata?.billableService &&
                                <Select
                                    displayEmpty
                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                    className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                                    value={metadata?.rateType}
                                    onChange={(e)=>handleValueChange('rateType', e.target.value)}
                                >
                                    <MenuItem value={'HOURLY'}>Hourly</MenuItem>
                                </Select>
                            }
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Separate Service Hours Specified*</div>
                        <div className={style.displayInRow}>
                            <div className={`${style.threeFieldWidth}`}>
                                <TextField
                                    size="small"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                    }}
                                    onChange={(e)=>handleValueChange('totalSession', e.target.value)}
                                    value={metadata?.totalSession}
                                />
                            </div>
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                                onChange={(e)=>handleValueChange('totalSessionFrequency', e.target.value)}
                                value={metadata?.totalSessionFrequency}
                            >
                                <MenuItem value="">Select Frequecy</MenuItem>
                                <MenuItem value={'MONTH'}>Per Month</MenuItem>
                                <MenuItem value={'YEAR'}>Per Contract Year</MenuItem>
                            </Select>
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
                                onChange={(e)=>handleValueChange('sessionDuration',e.target.value)}
                                value={metadata?.sessionDuration}
                            />
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Supplemental Service Payment Amount*</div>
                        <div className={`${style.displayInRow}`}>
                            <div className={`${style.threeFieldWidth}`}>
                                <TextField
                                    size="small"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                    }}
                                    value={metadata?.sessionAmount}
                                    onChange={(e)=>handleValueChange('sessionAmount', e.target.value)}
                                />
                            </div>
                            <div className={style.verticalAlignCenter}>
                                <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>{metadata?.sessionAmount / metadata?.totalSession || 0} per Hour (Pro Rata)</p>
                            </div>
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Applicable Supplemental Workdays*</div>
                        <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected}/>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Allowable Working Day Hours For Service*</div>
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
                </>
            )}
        </div>
    )
}

export default SupplementalFields;
