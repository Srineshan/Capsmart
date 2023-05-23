import React, { useState, useEffect } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import { GET, TenantID, POST } from './../dataSaver';
import { TimePicker } from "@blueprintjs/datetime";
import { GetDateFromHours } from './../../utils/formatting';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { CLINIC, SURGERY, ONCALL, PROCEDUREREADING } from '../../Constants';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonLabel from '../../Components/CommonFields/CommonLabel';

import style from './index.module.scss';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

const AdministrativeFields = ({ getMetaData, services, serviceSelected, editService, isReset, getIsReset }) => {
    const [activity, setActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAdminActivity, setShowAdminActivity] = useState(false);
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [adminActivity, setAdminActivity] = useState({
        activity: '',
        podRequired: false,
        schedule: 'WEEK',
        billable: false,
        asNeeded: false,
    });
    const [editAdminActivitySelected, setEditAdminActivitySelected] = useState(false);

    let specificDedicatedHoursList = [];
    services?.filter(data => [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(data?.activityType?.activityType))?.map(data => {
        let activityName = data?.activityType?.activityType;
        let activities = data?.activities?.map(data => data?.activity);
        let result = `${activityName} (${activities?.map(data => data)?.join(', ')})`
        specificDedicatedHoursList.push(result);
    });

    const [metadata, setMetadata] = useState({
        dedicatedHoursSpecified: false,
        dedicatedHoursActivityType: '',
        dedicatedHoursPerformingActivity: '',
        totalSession: '0',
        totalSessionFrequency: 'NA',
        sessionAmount: '0',
        sessionDuration: '0',
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
        selectedActivities: [],
        weekdaysCount: '0',
        weekendsCount: '0',
        workingTimeFrom: null,
        workingTimeTo: null,
    })

    useEffect(() => {
        if (isReset) {
            resetMetadata();
            getIsReset(false);
        }
    }, [isReset])

    useEffect(() => {
        if (serviceSelected !== {}) {
            setSelectedValues();
        }
    }, [serviceSelected]);

    const resetMetadata = () => {
        setMetadata({
            dedicatedHoursSpecified: false,
            dedicatedHoursActivityType: '',
            dedicatedHoursPerformingActivity: '',
            totalSession: '0',
            totalSessionFrequency: 'NA',
            sessionAmount: '0',
            sessionDuration: '0',
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
            selectedActivities: [],
            weekdaysCount: '0',
            weekendsCount: '0',
            workingTimeFrom: null,
            workingTimeTo: null,
        })
    }

    const setSelectedValues = () => {
        setMetadata({
            ...metadata,
            refId: serviceSelected?.refId,
            dedicatedHoursSpecified: serviceSelected?.dedicatedHoursSpecified,
            dedicatedHoursActivityType: serviceSelected?.hoursBorrowed?.activityType?.activityType,
            dedicatedHoursPerformingActivity: serviceSelected?.hoursBorrowed?.performingActivity?.activity,
            selectedActivities: serviceSelected?.activityResponse?.dataMap?.adminActivities,
            totalSession: serviceSelected?.totalSessions?.value || '0',
            totalSessionFrequency: serviceSelected?.totalSessions?.frequency || 'NA',
            workingTimeFrom: GetDateFromHours(serviceSelected?.workingPeriod?.from?.toString() || ''),
            workingTimeTo: GetDateFromHours(serviceSelected?.workingPeriod?.to?.toString() || ''),
            serviceDays: serviceSelected?.serviceDays,
            sessionAmount: serviceSelected?.payableAmount?.value,
            sessionDuration: serviceSelected?.duration?.hours || '0',
        });
    }

    useEffect(() => {
        getMetaData(metadata);
    }, [metadata])

    useEffect(() => {
        getAdminActivityList();
    }, [])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const limit5 = 5;

    const getServiceDaysMetadata = (serviceDays) => {
        setMetadata({ ...metadata, serviceDays: serviceDays })
    }

    const getAdminActivityList = async () => {
        const { data: adminActivityList } = await GET(`contract-managment-service/contracts/adminActivity`);
        setActivity(adminActivityList);
    }

    const handleValueChange = (name, value) => {
        if (name === 'dedicatedHoursSpecified') {
            if (value) {
                setMetadata({ ...metadata, sessionDuration: '1', totalSession: '0', sessionAmount: '', totalSessionFrequency: 'NA', dedicatedHoursActivityType: '', dedicatedHoursPerformingActivity: '', dedicatedHoursSpecified: value });
            } else {
                setMetadata({ ...metadata, sessionDuration: '0', dedicatedHoursActivityType: '', sessionAmount: '', totalSession: '0', totalSessionFrequency: 'NA', dedicatedHoursPerformingActivity: '', dedicatedHoursSpecified: value });
            }
        }
        else {
            setMetadata({ ...metadata, [name]: value });
        }
    }

    const activityToAdd = async () => {
        setIsLoading(true);
        if (adminActivity?.activity === '') {
            ErrorToaster('Administrative Service Name is Mandatory');
            return;
        }
        if (activity?.map(data => data?.activity).includes(adminActivity?.activity)) {
            ErrorToaster('Administrative Service Name Already Exists');
            return;
        }
        let data = {
            "activity": adminActivity?.activity,
            "tenant": {
                "id": TenantID
            },
            "podRequired": adminActivity?.podRequired,
            "schedule": adminActivity?.schedule,
            "billable": adminActivity?.billable,
            "asNeeded": adminActivity?.asNeeded,
        }
        await POST(`contract-managment-service/contracts/adminActivity`, data)
            .then(response => {
                SuccessToaster('Activity Added to List');
                getAdminActivityList();
            })
            .catch(error => {
                ErrorToaster('Adding Activity To List Failed');
            })
        setAdminActivity({ ...adminActivity, activity: '' })
        setShowAdminActivity(false);
        setEditAdminActivitySelected(false);
        setIsLoading(false);
    }

    const selectedHours = (index) => {
        // let temp = services?.findIndexOf(data => [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(data?.activityType?.activityType));
        // let temp;
        services?.filter(data => [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(data?.activityType?.activityType))?.map(data => {
            let activityName = data?.activityType?.activityType;
            let activities = data?.activities?.map(data => data?.activity);
            if (`${activityName} (${activities?.map(data => data)?.join(', ')})` === index) {
                let dedicatedHoursActivityType = data?.activityType?.activityType;
                let dedicatedHoursPerformingActivity = data?.activities?.map(data => data?.activity)?.join('-');
                console.log('data', data);
                setMetadata({
                    ...metadata,
                    dedicatedHoursActivityType: dedicatedHoursActivityType,
                    dedicatedHoursPerformingActivity: dedicatedHoursPerformingActivity,
                    sessionDuration: data?.duration?.hours,
                    totalSession: data?.totalSessions?.value,
                    totalSessionFrequency: data?.totalSessions?.frequency,
                    sessionAmount: data?.payableAmount?.value,
                });
            }
        });
    }

    // const selectedHours = (index) => {
    //     console.log('check', index)
    //     let temp = services?.filter(data => [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(data?.activityType?.activityType))?.map(data => data);
    //     let dedicatedHoursActivityType = temp[index]?.activityType?.activityType;
    //     let dedicatedHoursPerformingActivity = temp[index]?.activities?.map(data => data?.activity)?.join('-');
    //     console.log('check', dedicatedHoursActivityType, dedicatedHoursPerformingActivity);
    //     setMetadata({ ...metadata, dedicatedHoursActivityType: dedicatedHoursActivityType, dedicatedHoursPerformingActivity: dedicatedHoursPerformingActivity, sessionAmount: temp[index]?.payableAmount?.value });
    // }

    const handleAdminActivity = (name, value) => {
        if (name === 'schedule' && value !== 'NA') {
            setAdminActivity({ ...adminActivity, [name]: value, asNeeded: false })
        } else if (name === 'schedule' && adminActivity?.asNeeded) {
            setAdminActivity({ ...adminActivity, [name]: "NA" });
        } else {
            setAdminActivity({ ...adminActivity, [name]: value });
        }
    }

    const onSelectActivity = (id, checked) => {
        console.log('activities', activity);
        if (checked) {
            let temp = metadata?.selectedActivities || [];
            temp.push(activity?.filter(data => data?.id === id)?.map(data => data)[0]);
            setMetadata({ ...metadata, selectedActivities: temp });
        } else {
            let temp = metadata?.selectedActivities?.filter(data => data?.id !== id)?.map(data => data);
            setMetadata({ ...metadata, selectedActivities: temp });
        }
    }

    const editActivitySelected = () => {
        let editableData = metadata?.selectedActivities?.filter(data => data?.id === adminActivity?.id)?.map(data => data)[0];
        let temp = metadata?.selectedActivities?.filter(data => data?.id !== adminActivity?.id)?.map(data => data);
        temp.push({ activity: adminActivity?.activity, billable: adminActivity?.billable, podRequired: adminActivity?.podRequired, id: adminActivity?.id, tenant: editableData?.tenant, schedule: adminActivity?.schedule });
        setMetadata({ ...metadata, selectedActivities: temp });
        setShowAdminActivity(false);
        setEditAdminActivitySelected(false);
    }

    const submit = () => {
        console.log('submit func', showAdminActivity);
        if (showAdminActivity) {
            console.log('inside if func', showAdminActivity);
            activityToAdd();
        } else {
            console.log('inside else func', showAdminActivity);
            editActivitySelected();
        }
    }

    const updateWorkingPeriod = (e) => {
        // let minTime = new Date(new Date(e).getTime() + (metadata?.totalSession * 60 * 60 * 1000));
        setMetadata({ ...metadata, workingTimeFrom: e });
    }

    console.log('selected format', `${metadata?.dedicatedHoursActivityType} (${metadata?.dedicatedHoursPerformingActivity?.replace('-', ', ')})`, specificDedicatedHoursList)

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Dedicated Hours For Administrative Services*' />
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <CommonSwitch
                            className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
                            checked={metadata?.dedicatedHoursSpecified} label={metadata?.dedicatedHoursSpecified ? 'YES' : 'NO'}
                            onChange={(e) => handleValueChange('dedicatedHoursSpecified', !metadata?.dedicatedHoursSpecified)}
                        />
                    </div>
                    {!metadata?.dedicatedHoursSpecified && (
                        <Select
                            displayEmpty
                            defaultValue={`${metadata?.dedicatedHoursActivityType} (${metadata?.dedicatedHoursPerformingActivity?.replace('-', ', ')})`}
                            SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                            className={`${style.fullWidth}`}
                            onChange={(e) => selectedHours(e.target.value)}
                            value={`${metadata?.dedicatedHoursActivityType} (${metadata?.dedicatedHoursPerformingActivity?.replace('-', ', ')})`}
                        >
                            <MenuItem value="">Select Dedicated Hours</MenuItem>
                            {
                                specificDedicatedHoursList?.map((data, index) => (
                                    <MenuItem value={data}>{data}</MenuItem>
                                ))
                            }
                        </Select>
                        // <CommonSelectField className={`${style.fullWidth}`}
                        // onChange={(e) => selectedHours(e.target.value)}
                        // value={`${metadata?.dedicatedHoursActivityType} (${metadata?.dedicatedHoursPerformingActivity?.replace('-', ', ')})` || ''}
                        //  firstOptionLabel={'Select Dedicated Hours'} firstOptionValue={''}
                        // valueList={specificDedicatedHoursList}
                        // labelList={specificDedicatedHoursList}
                        // disabledList={specificDedicatedHoursList?.map(data => false)} />
                    )}
                </div>
            </div>
            {
                metadata?.dedicatedHoursSpecified &&
                <>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Separate Administrative Hours Specified*' />
                        <div className={style.displayInRow}>
                            <div className={`${style.twoFieldWidth}`}>
                                <CommonTextField
                                    type="tel"
                                    maxLength="3"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                    }}
                                    onChange={(e) => e.target.value >= 0 && handleValueChange('totalSession', e.target.value)}
                                    value={metadata?.totalSession}
                                />
                            </div>
                            <CommonSelectField className={` ${style.marginLeft20}`}
                                value={metadata?.totalSessionFrequency || 'NA'}
                                onChange={(e) => handleValueChange('totalSessionFrequency', e.target.value)}
                                firstOptionLabel={'Select Frequency'} firstOptionValue={'NA'}
                                valueList={['WEEK', 'MONTH']}
                                labelList={['Per Week', 'Per Month']}
                                disabledList={[false, false]} />
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Administrative Services Payment Amount*' />
                        <div className={`${style.displayInRow}`}>
                            <div className={`${style.threeFieldWidth}`}>
                                <CommonTextField
                                    type="tel"
                                    maxLength="5"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                    }}
                                    onChange={(e) => e.target.value >= 0 && handleValueChange('sessionAmount', e.target.value)}
                                    value={metadata?.sessionAmount}
                                />
                            </div>
                            <div className={style.verticalAlignCenter}>
                                <CommonLabel className={` ${style.marginLeft20}`} value={metadata?.totalSession !== 0 && metadata?.totalSession !== '' ? `${(metadata?.sessionAmount / metadata?.totalSession).toFixed(2)} per Hour` : ''} />
                            </div>
                        </div>
                    </div>
                </>
            }

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Allowable Administrative Duties & Function To Perform' />
                <div>
                    {
                        activity?.map((data, index) => (
                            <div className={`${style.displayInRow} ${style.marginBottom10}`}>
                                {metadata?.selectedActivities?.map(activities => activities?.id)?.includes(data?.id) ? (
                                    <>
                                        <CommonCheckBox checked={metadata?.selectedActivities?.map(activities => activities?.id)?.includes(data?.id)} className={`${style.marginLeft10}`} onChange={(e) => onSelectActivity(data?.id, e.target.checked)} label={metadata?.selectedActivities?.filter(activity => activity?.id === data?.id)?.map(activity => activity?.activity)?.[0]} />
                                        <div className={`${style.chipStyle} ${style.redChip}`}>{metadata?.selectedActivities?.filter(activities => activities?.id === data?.id)?.map(activities => activities?.schedule)[0]}</div>
                                        {metadata?.selectedActivities?.filter(activities => activities?.id === data?.id)?.map(activities => activities?.billable)[0] && <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>}
                                        {metadata?.selectedActivities?.filter(activities => activities?.id === data?.id)?.map(activities => activities?.podRequired)[0] && <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>}
                                    </>
                                ) : (<>
                                    <CommonCheckBox checked={metadata?.selectedActivities?.map(activities => activities?.id)?.includes(data?.id)} className={`${style.marginLeft10}`} onChange={(e) => onSelectActivity(data?.id, e.target.checked)} label={data?.activity} />

                                    <div className={`${style.chipStyle} ${style.redChip}`}>{data?.schedule}</div>
                                    {data?.billable && <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>}
                                    {data?.podRequired && <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>}
                                </>)}

                                {
                                    // metadata?.selectedActivities?.map(data => data?.id).includes(data?.id) ? <>
                                    //     <div className={`${style.chipStyle} ${style.redChip}`}>{metadata?.selectedActivities?.filter(activity => activity?.id === data?.id)?.map(activity => activity?.schedule)?.[0] || ''}</div>
                                    //     {metadata?.selectedActivities?.filter(activity => activity?.id === data?.id)?.map(activity => activity?.billable)?.[0] && <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>}
                                    //     {metadata?.selectedActivities?.filter(activity => activity?.id === data?.id)?.map(activity => activity?.podRequired)?.[0] && <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>}
                                    // </> :
                                    //     <>
                                    //         <div className={`${style.chipStyle} ${style.redChip}`}>{data?.schedule}</div>
                                    //         {data?.billable && <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>}
                                    //         {data?.podRequired && <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>}
                                    //     </>
                                }

                                {metadata?.selectedActivities?.map(selectedActivity => selectedActivity?.activity)?.includes(data?.activity) && <EditOutlinedIcon style={{ color: '#7165E3' }} onClick={() => {
                                    setEditAdminActivitySelected(true);
                                    let adminActivity = metadata?.selectedActivities?.filter(activities => activities?.id === data?.id)?.map(activities => activities)[0];
                                    setAdminActivity({
                                        id: adminActivity?.id,
                                        activity: adminActivity?.activity,
                                        podRequired: adminActivity?.podRequired,
                                        schedule: adminActivity?.schedule,
                                        billable: adminActivity?.billable,
                                        asNeeded: adminActivity?.asNeeded,
                                    });
                                }} />}
                            </div>

                        ))
                    }
                </div>
            </div>

            {
                (showAdminActivity || editAdminActivitySelected) &&
                <div className={`${style.addonAddBox} ${style.marginTop20}`}>
                    <div className={`${style.addManagerGrid}`}>
                        <CommonLabel value='Additional Administrative Services Name' />
                        <CommonInputField placeholder='Administrative Service Name' className={style.fullWidth} value={adminActivity?.activity} onChange={(e) => handleAdminActivity('activity', e.target.value)} />
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Classify As Billable Activity' />
                        <div className={`${style.threeFieldWidth} `}>
                            <CommonSwitch label={adminActivity?.billable ? 'YES' : 'NO'} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} checked={adminActivity?.billable} onChange={(e) => handleAdminActivity('billable', !adminActivity?.billable)} />
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Proof Of Completion / Documentation Required' />
                        <div className={style.displayInRow}>
                            <div className={`${style.threeFieldWidth} `}>
                                <CommonSwitch label={adminActivity?.podRequired ? 'YES' : 'NO'} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} checked={adminActivity?.podRequired} onChange={(e) => handleAdminActivity('podRequired', !adminActivity?.podRequired)} />
                            </div>
                            <div className={style.threeFieldWidth}>
                                <CommonLabel value='Frequency*' />
                                <CommonSelectField className={`${style.fullWidth}`}
                                    value={adminActivity?.schedule || ''}
                                    onChange={(e) => handleAdminActivity('schedule', e.target.value)}
                                    firstOptionLabel={'Select Frequency'} firstOptionValue={''}
                                    valueList={['NA', 'WEEK', 'MONTH', 'YEAR']}
                                    labelList={['NA', 'Per Week', 'Per Month', 'Per Contract Year']}
                                    disabledList={[false, false, false, false, false]} />
                            </div>
                            <div className={`${style.marginTop20} ${style.marginLeft20}`}>
                                <CommonCheckBox checked={adminActivity?.asNeeded} label='As Needed' onChange={(e) => setAdminActivity({ ...adminActivity, asNeeded: e.target.checked, schedule: 'NA' })} />
                            </div>

                        </div>
                    </div>

                    <div>
                        <div className={`${style.twoCol} ${style.marginTop20}`}>
                            <button className={`${style.outlinedButton} ${style.fullWidth}`} onClick={(e) => { setShowAdminActivity(false); setEditAdminActivitySelected(false); }}>CANCEL</button>
                            <button className={`${style.buttonStyle} ${style.fullWidth} ${isLoading ? style.disabled : ''}`} onClick={(e) => { submit() }}>SAVE</button>
                        </div>
                        <br />
                    </div>
                </div>
            }

            <div>
                {!showAdminActivity &&
                    <div className={`${style.addGrid} ${style.fullWidth} ${style.marginTop20}`}>
                        <CommonInputField className={style.fullWidth} placeholder='New Additional Administrative Services Name' onChange={(e) => handleAdminActivity('activity', e.target.value)} />
                        <div className={`${style.addStyle} ${style.alignCenter} ${style.cursorPointer}`} >
                            <AddIcon sx={{ fontSize: 25, color: 'white' }} aria-describedby={id} onClick={(e) => setShowAdminActivity(true)} />
                        </div>
                    </div>}
                {/* <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    >
                    <div className={style.administrativePopoverStyle}>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">All Activities</Typography>} />
                            </FormGroup>
                        </div>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter} ${style.selectedAdministrativeCardStyle}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="#7165E3">Administrative & Business Reports Creation</Typography>} />
                            </FormGroup>
                            <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>
                            <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>
                        </div>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Administrative & Business Records Maintenance</Typography>} />
                            </FormGroup>
                        </div>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Credentials Committee Meeting</Typography>} />
                            </FormGroup>
                        </div>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter} ${style.selectedAdministrativeCardStyle}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="#7165E3">Corrective Action Plan Participation</Typography>} />
                            </FormGroup>
                        </div>
                        <div className={`${style.displayInRow} ${style.administrativeCardStyle} ${style.verticalAlignCenter}`}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox />}  label={<Typography variant="body2" color="textSecondary">Contractor Clinic / OR Schedule Maintenance (Weekly)</Typography>} />
                            </FormGroup>
                        </div>
                    </div>
                </Popover> */}
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
                    // minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.totalSession * 60 * 60 * 1000))}
                    />
                </div>
            </div>

        </div>
    )
}

export default AdministrativeFields;
