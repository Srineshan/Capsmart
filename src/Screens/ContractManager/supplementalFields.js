import React, { useState, useEffect, useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import DatalistInput, { useComboboxControls } from 'react-datalist-input';
import { CLINIC, SURGERY, ONCALL, PROCEDUREREADING } from '../../Constants';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';
import { TimePicker } from "@blueprintjs/datetime";
import FormControl from '@mui/material/FormControl';
import { GetDateFromHours } from './../../utils/formatting';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import style from './index.module.scss';
import MultiSelectDisplay from '../../Components/ReusableSmallComponents/multiSelectDisplay';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

const SupplementalFields = ({ getMetaData, services, serviceSelected, editService, isReset, getIsReset }) => {
    const [additionalClinicSchedule, setAdditionalClinicSchedule] = useState(0);
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [totalContractedService, setTotalContractedService] = useState(0);
    const [isDedicatedHours, setIsDedicatedHours] = useState(false);
    const [availableActivities, setAvailableActivities] = useState([]);
    const { setValue, value } = useComboboxControls({ initialValue: '' });
    const [newServiceName, setNewServiceName] = useState('');
    const [supplementServiceName, setSupplementServiceName] = useState('');

    let specificDedicatedHoursList = [];
    services?.filter(data => [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(data?.activityType?.activityType))?.map(data => {
        let activityName = data?.activityType?.activityType;
        let activities = data?.activities?.map(data => data?.activity);
        let result = `${activityName} (${activities?.map(data => data)?.join(', ')})`
        specificDedicatedHoursList.push(result);
    });

    const getAvailableActivities = () => {
        let activitType = metadata?.dedicatedHoursActivityType !== '' ? [`${metadata?.dedicatedHoursActivityType}`] : [CLINIC, SURGERY, ONCALL, PROCEDUREREADING];
        let temp = [];
        services?.filter(data => activitType?.includes(data?.activityType?.activityType))?.map(data => {
            let activityName = data?.activityType?.activityType;
            let activities = data?.activities?.map(data => data?.activity);
            activities?.map(data => {
                temp.push(`${activityName} - ${data}`);
            })
        });
        setAvailableActivities(temp);
    }

    const getSelectedActivity = () => {
        let activityName = metadata?.dedicatedHoursActivityType;
        let activities = metadata?.dedicatedHoursPerformingActivity;
        let result = `${activityName} (${activities})`
        return result
    }

    const selectedHours = (index) => {
        // let temp = services?.findIndexOf(data => [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(data?.activityType?.activityType));
        // let temp;
        services?.filter(data => [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(data?.activityType?.activityType))?.map(data => {
            let activityName = data?.activityType?.activityType;
            let activities = data?.activities?.map(data => data?.activity);
            if (`${activityName} (${activities?.map(data => data)?.join(', ')})` === index) {
                let dedicatedHoursActivityType = data?.activityType?.activityType;
                let dedicatedHoursPerformingActivity = data?.activities?.map(data => data?.activity)?.join(', ');
                setMetadata({
                    ...metadata,
                    dedicatedHoursActivityType: dedicatedHoursActivityType,
                    dedicatedHoursPerformingActivity: dedicatedHoursPerformingActivity,
                    supplementServiceName: [],
                    billableService: data?.billableService,
                    rateType: data?.rateType,
                    sessionAmount: data?.payableAmount?.value,
                    sessionDuration: data?.duration?.hours,
                    totalSession: data?.totalSessions?.value,
                    totalSessionFrequency: data?.totalSessions?.frequency,
                    hourlyRate: data?.hourlyRate?.value,
                });
            }
        });
    }

    const [metadata, setMetadata] = useState({
        dedicatedHoursSpecified: false,
        dedicatedHoursActivityType: '',
        dedicatedHoursPerformingActivity: '',
        supplementServiceName: [],
        billableService: true,
        rateType: 'HOURLY',
        totalSession: '0',
        totalSessionFrequency: 'NA',
        sessionAmount: '',
        sessionDuration: '0',
        sessionsAsNeeded: false,
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
        weekendsCount: '0'
    })

    const resetMetadata = () => {
        setMetadata({
            dedicatedHoursSpecified: false,
            dedicatedHoursActivityType: '',
            dedicatedHoursPerformingActivity: '',
            supplementServiceName: [],
            billableService: true,
            rateType: 'HOURLY',
            totalSession: '0',
            totalSessionFrequency: 'NA',
            sessionAmount: '',
            sessionDuration: '0',
            sessionsAsNeeded: false,
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
            weekendsCount: '0'
        })
    }

    useEffect(() => {
        if (isReset) {
            console.log('inside reset function')
            resetMetadata();
            getIsReset(false);
        }

    }, [isReset])

    useEffect(() => {
        getAvailableActivities();
    }, [metadata?.dedicatedHoursActivityType])

    useEffect(() => {
        if (editService) {
            setSelectedValues();
        }
    }, [serviceSelected]);

    const setSelectedValues = () => {
        setMetadata({
            ...metadata,
            refId: serviceSelected?.refId,
            dedicatedHoursSpecified: serviceSelected?.dedicatedHoursSpecified,
            dedicatedHoursActivityType: serviceSelected?.hoursBorrowed?.activityType?.activityType,
            dedicatedHoursPerformingActivity: serviceSelected?.hoursBorrowed?.performingActivity?.activity,
            supplementServiceName: serviceSelected?.activities?.map(data => data?.activity),
            billableService: serviceSelected?.billableService,
            rateType: serviceSelected?.rateType,
            sessionAmount: serviceSelected?.payableAmount?.value,
            sessionDuration: serviceSelected?.duration?.hours || '0',
            totalSession: serviceSelected?.totalSessions?.value,
            sessionsAsNeeded: serviceSelected?.sessionsAsNeeded,
            totalSessionFrequency: serviceSelected?.totalSessions?.frequency,
            workingTimeFrom: GetDateFromHours(serviceSelected?.workingPeriod?.from?.toString() || ''),
            workingTimeTo: GetDateFromHours(serviceSelected?.workingPeriod?.to?.toString() || ''),
            serviceDays: serviceSelected?.serviceDays,
        });
    }

    const limit5 = 5;

    useEffect(() => {
        getMetaData(metadata)
    }, [metadata])

    const handleValueChange = (name, value) => {
        if (name === 'dedicatedHoursSpecified') {
            if (value) {
                setMetadata({ ...metadata, sessionDuration: '1', totalSession: '0', sessionAmount: '', totalSessionFrequency: 'NA', dedicatedHoursActivityType: '', dedicatedHoursPerformingActivity: '', dedicatedHoursSpecified: value });
            } else {
                setMetadata({ ...metadata, sessionDuration: '0', dedicatedHoursActivityType: '', sessionAmount: '', totalSession: '0', totalSessionFrequency: 'NA', dedicatedHoursPerformingActivity: '', dedicatedHoursSpecified: value });
            }
        }
        //  else if (name === 'dedicatedHoursActivityType') {
        //     setMetadata({ ...metadata, supplementServiceName: [], [name]: value });
        // } 
        else {
            setMetadata({ ...metadata, [name]: value });
        }
    }

    const getServiceDaysMetadata = (serviceDays) => {
        setMetadata({ ...metadata, serviceDays: serviceDays })
    }

    const addSupplementService = (value) => {
        let temp = metadata?.supplementServiceName;
        if (!temp?.includes(value)) {
            temp?.push(value);
            setMetadata({ ...metadata, supplementServiceName: temp });
        }
        setValue('');
    }

    const removeSupplementServiceName = (index) => {
        let temp = metadata?.supplementServiceName;
        setMetadata({ ...metadata, supplementServiceName: temp?.filter((data, indexValue) => index !== indexValue)?.map(data => data) });
    }

    const avilableActivityItems = useMemo(
        () =>
            availableActivities?.map((data) => ({
                value: data,
            })),
        [availableActivities],
    );

    const serviceNameToAdd = () => {
        let services = metadata.supplementServiceName;
        services.push(newServiceName);
        setMetadata({ ...metadata, supplementServiceName: services });
        setValue('');
    }

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Dedicated Hours For Supplemental Services*' />
                <div className={`${style.displayInRow} `}>
                    <CommonSwitch className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} label={metadata?.dedicatedHoursSpecified ? 'YES' : 'NO'} checked={metadata?.dedicatedHoursSpecified} onChange={(e) => handleValueChange('dedicatedHoursSpecified', !metadata?.dedicatedHoursSpecified)} />
                    {!metadata?.dedicatedHoursSpecified && (
                        <FormControl sx={{ width: 480 }}>
                            <CommonSelectField className={`${style.fullWidth}`}
                                value={getSelectedActivity() || ''}
                                onChange={(e) => selectedHours(e.target.value)}
                                firstOptionLabel={'Select source of hours for this service'} firstOptionValue={''}
                                valueList={specificDedicatedHoursList}
                                labelList={specificDedicatedHoursList}
                                disabledList={specificDedicatedHoursList?.map(data => false)} />
                        </FormControl>
                    )}
                </div>
            </div>
            {/* 
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Supplemental Services To Perform*' />
                <div>
                    <CommonSelectField className={`${style.fullWidth}`}
                        onChange={(e) => { addSupplementService(e.target.value) }}
                        firstOptionLabel={'Select Supplemental Services specified in contract'} firstOptionValue={''}
                        valueList={availableActivities}
                        labelList={availableActivities}
                        disabledList={availableActivities?.map(data => false)} />
                    {
                        metadata?.supplementServiceName?.length !== 0 && metadata?.supplementServiceName &&
                        <MultiSelectDisplay values={metadata?.supplementServiceName} removeItem={removeSupplementServiceName} />
                    }
                </div>
            </div> */}
            <div>
                <div className={`${style.addManagerGrid} ${style.marginTop20} `}>
                    <CommonLabel value='Supplement Services To Perform*' />
                    <div>
                        <div className={style.addGrid}>
                            <DatalistInput
                                value={value}
                                setValue={setValue}
                                items={avilableActivityItems || []} onSelect={(item) => addSupplementService(item.value)} className={style.fullWidth}
                                onChange={(e) => {
                                    setNewServiceName(e.target.value);
                                    const caret = e.target.selectionStart
                                    const element = e.target
                                    window.requestAnimationFrame(() => {
                                        element.selectionStart = caret
                                        element.selectionEnd = caret
                                    })

                                }}
                            />
                            <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer} `}>
                                <AddIcon sx={{ fontSize: 25, color: 'white' }}
                                    onClick={value !== '' && serviceNameToAdd}
                                />
                            </div>
                        </div>
                        {
                            metadata?.supplementServiceName?.length !== 0 && metadata?.supplementServiceName &&
                            <MultiSelectDisplay values={metadata?.supplementServiceName} removeItem={removeSupplementServiceName} />
                        }
                    </div>
                </div>
            </div>
            <>
                {metadata?.dedicatedHoursSpecified &&
                    <>
                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <CommonLabel value='Billable Service*' />
                            <div className={style.displayInRow}>
                                <div className={`${style.threeFieldWidth}`} >
                                    <CommonSwitch checked={metadata?.billableService} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft} `}
                                        onChange={() => setMetadata({ ...metadata, billableService: !metadata?.billableService, sessionAmount: '0' })}
                                        label={metadata?.billableService ? 'YES' : 'NO'} />
                                </div>
                                {
                                    // metadata?.billableService &&
                                    //   <Select
                                    //       displayEmpty
                                    //       SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                    //       className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                                    //       value={metadata?.rateType}
                                    //       onChange={(e)=>handleValueChange('rateType', e.target.value)}
                                    //   >
                                    //       <MenuItem value={'HOURLY'}>Hourly</MenuItem>
                                    //   </Select>
                                }
                            </div>
                        </div>

                        <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            <CommonLabel value='Separate Service Hours Specified*' />
                            <div className={style.grid3WithoutGap}>
                                <div className={`${style.threeFieldWidth}`}>
                                    <CommonTextField
                                        type="tel"
                                        maxLength="3"
                                        disabled={metadata?.sessionsAsNeeded}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                        }}
                                        onChange={(e) => e.target.value >= 0 && handleValueChange('totalSession', e.target.value)}
                                        value={metadata?.totalSession}
                                    />
                                </div>
                                <CommonSelectField className={`${style.threeFieldWidth} ${style.marginLeft20}`}
                                    onChange={(e) => handleValueChange('totalSessionFrequency', e.target.value)}
                                    value={metadata?.totalSessionFrequency || 'NA'}
                                    firstOptionLabel={'Select Frequency'} firstOptionValue={''}
                                    valueList={['WEEK', 'MONTH', 'YEAR']}
                                    labelList={['Per Week', 'Per Month', 'Per Contract Year']}
                                    disabledList={[false, false, false]}
                                    disabledSelect={metadata?.sessionsAsNeeded} />
                                <div className={`${style.threeFieldWidth} ${style.marginLeft20}`}>
                                    <CommonCheckBox value="NA"
                                        checked={metadata?.sessionsAsNeeded}
                                        onChange={(e) => setMetadata({ ...metadata, sessionsAsNeeded: e.target.checked, totalSession: 0, totalSessionFrequency: 'NA' })}
                                        label="As Needed" />
                                </div>
                            </div>
                        </div>

                        {
                            // <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                            //     <div className={style.extentionLableStyle}>Service Session Duration</div>
                            //     <div className={`${style.threeFieldWidth}`}>
                            //         <TextField
                            //             size="small"
                            //             type="tel"
                            //             maxLength="3"
                            //             InputProps={{
                            //                 endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                            //             }}
                            //             onChange={(e) =>e.target.value >= 0 && setMetadata({...metadata, sessionDuration:e.target.value, sessionAmount:'0'})}
                            //             value={metadata?.sessionDuration}
                            //         />
                            //     </div>
                            // </div>
                        }

                        {
                            metadata?.billableService &&
                            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                                <CommonLabel value='Supplemental Service Payment Amount*' />
                                <div className={`${style.displayInRow}`}>
                                    <div className={`${style.threeFieldWidth}`}>
                                        <CommonTextField
                                            type="tel"
                                            maxLength="5"
                                            disabled={metadata?.totalSession === '' || metadata?.totalSession === '0' || metadata?.totalSession === undefined}
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                            }}
                                            value={metadata?.sessionAmount}
                                            onChange={(e) => e.target.value >= 0 && handleValueChange('sessionAmount', e.target.value)}
                                        />
                                    </div>

                                    <div className={style.verticalAlignCenter}>
                                        {metadata?.sessionAmount !== '' && metadata?.sessionAmount !== '0' && <CommonLabel className={`${style.marginLeft20}`} value={metadata?.sessionsAsNeeded ? `${parseInt(metadata?.sessionAmount)?.toFixed(2)} per Hour (Pro Rata)` : `${(metadata?.sessionAmount / metadata?.totalSession || 0).toFixed(2)} per Hour (Pro Rata)`} />}
                                    </div>
                                </div>
                            </div>
                        }
                    </>
                }

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <CommonLabel value='Allowable Working Day Hours For Service*' />
                    <div className={style.displayInRow}>
                        <TimePicker
                            useAmPm={false}
                            onChange={(e) => {
                                handleValueChange('workingTimeFrom', e)
                            }}
                            value={metadata?.workingTimeFrom === null ? null : new Date(metadata?.workingTimeFrom)}
                        />
                        <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                        <TimePicker
                            useAmPm={false}
                            onChange={(e) => handleValueChange('workingTimeTo', e)}
                            value={metadata?.workingTimeTo === null ? null : new Date(metadata?.workingTimeTo)}
                        // minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.totalSession * 60 * 60 * 1000))}
                        />
                    </div>
                </div>

                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <CommonLabel value='Applicable Supplemental Workdays*' />
                    <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected} isReset={isReset} setIsReset={getIsReset} />
                </div>
            </>

        </div >
    )
}

export default SupplementalFields;
