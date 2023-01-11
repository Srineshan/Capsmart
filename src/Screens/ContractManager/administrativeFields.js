import React, { useState, useEffect } from 'react';
import { InputGroup, EditableText, Checkbox } from '@blueprintjs/core';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import Popover from '@mui/material/Popover';
import { GET, TenantID, POST } from './../dataSaver';
import { TimePicker } from "@blueprintjs/datetime";
import { GetDateFromHours } from './../../utils/formatting';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';
import style from './index.module.scss';

const switchTheme = createTheme({
    palette: {
        primary: {
            main: '#7165E3',
        },
    },
});

const AdministrativeFields = ({ getMetaData, services, serviceSelected, editService }) => {
    const [activity, setActivity] = useState([]);
    const [showAdminActivity, setShowAdminActivity] = useState(false);
    const [additionalSchedule, setAdditionalSchedule] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [adminActivity, setAdminActivity] = useState({
        activity: '',
        podRequired: false,
        schedule: 'WEEK',
        billable: false,
    });
    const [editAdminActivitySelected, setEditAdminActivitySelected] = useState(false);

    let specificDedicatedHoursList = [];
    services?.filter(data => ['Clinic Blocks', 'Surgery Session', 'On Call Coverage Duty Days']?.includes(data?.activityType?.activityType))?.map(data => {
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
        sessionAmount: '0',
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
        workingTimeFrom: new Date(),
        workingTimeTo: new Date(),
    })

    useEffect(() => {
        if (serviceSelected !== {}) {
            setSelectedValues();
        }
    }, [serviceSelected]);

    const setSelectedValues = () => {
        setMetadata({
            ...metadata,
            dedicatedHoursSpecified: serviceSelected?.dedicatedHoursSpecified,
            dedicatedHoursActivityType: serviceSelected?.hoursBorrowed?.activityType?.activityType,
            dedicatedHoursPerformingActivity: serviceSelected?.hoursBorrowed?.performingActivity?.activity,
            selectedActivities: serviceSelected?.activityResponse?.dataMap?.adminActivities,
            totalSession: serviceSelected?.totalSessions?.value || '0',
            workingTimeFrom: GetDateFromHours(serviceSelected?.workingPeriod?.from?.toString() || ''),
            workingTimeTo: GetDateFromHours(serviceSelected?.workingPeriod?.to?.toString() || ''),
            serviceDays: serviceSelected?.serviceDays,
            sessionAmount: serviceSelected?.payableAmount?.value,
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
        setMetadata({ ...metadata, serviceDays: serviceDays})
    }

    const getAdminActivityList = async () => {
        const { data: adminActivityList } = await GET(`contract-managment-service/contracts/adminActivity`);
        setActivity(adminActivityList);
    }

    const handleValueChange = (name, value) => {
        setMetadata({ ...metadata, [name]: value });
    }

    const activityToAdd = async () => {
      if(adminActivity?.activity === ''){
        ErrorToaster('Administrative Service Name is Mandatory');
        return;
      }
      if(activity?.map(data=>data?.activity).includes(adminActivity?.activity)){
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
            "billable": adminActivity?.billable
        }
        await POST(`contract-managment-service/contracts/adminActivity`, data)
            .then(response => {
                SuccessToaster('Activity Added to List');
                getAdminActivityList();
            })
            .catch(error => {
                ErrorToaster('Adding Activity To List Failed');
            })
        setAdminActivity({...adminActivity, activity:''})
    }

    const selectedHours = (index) => {
        let temp = services?.filter(data => ['Clinic Blocks', 'Surgery Session', 'On Call Coverage Duty Days']?.includes(data?.activityType?.activityType))?.map(data => data);
        let dedicatedHoursActivityType = temp[index]?.activityType?.activityType;
        let dedicatedHoursPerformingActivity = temp[index]?.activities?.map(data => data?.activity)?.join('-');
        setMetadata({ ...metadata, dedicatedHoursActivityType: dedicatedHoursActivityType, dedicatedHoursPerformingActivity: dedicatedHoursPerformingActivity, sessionAmount: temp[index]?.payableAmount?.value });
    }

    const handleAdminActivity = (name, value) => {
        setAdminActivity({ ...adminActivity, [name]: value });
    }

    const onSelectActivity = (id, checked) => {
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
      let editableData = metadata?.selectedActivities?.filter(data=>data?.activity === adminActivity?.activity)?.map(data=>data)[0];
      let temp = metadata?.selectedActivities?.filter(data=>data?.activity !== adminActivity?.activity)?.map(data=>data);
      temp.push({activity: adminActivity?.activity, billable: adminActivity?.billable, podRequired: adminActivity?.podRequired, id:editableData?.id, tenant:editableData?.tenant, schedule: adminActivity?.schedule});
      setMetadata({...metadata, selectedActivities: temp});
    }

    const submit = () => {
      if(showAdminActivity){
        activityToAdd();
      }else{
        editActivitySelected();
      }
    }

    console.log('date', metadata.selectedActivities);
    const updateWorkingPeriod = (e) => {
      let minTime= new Date(new Date(e).getTime() + (metadata?.totalSession * 60 * 60 * 1000));
      setMetadata({...metadata, workingTimeFrom:e, workingTimeTo:minTime});
    }

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Dedicated Hours For Administrative Services*</div>
                <div className={style.displayInRow}>
                    <div className={`${style.threeFieldWidth}`} >
                        <ThemeProvider theme={switchTheme}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        className={` ${style.textAlignLeft}`}
                                        checked={metadata?.dedicatedHoursSpecified}
                                        onChange={(e) => handleValueChange('dedicatedHoursSpecified', !metadata?.dedicatedHoursSpecified)}
                                    />
                                }
                                color='primary'
                                className={`${style.switchFontStyle} ${style.flexLeft}`}
                                label={metadata?.dedicatedHoursSpecified ? 'YES' : 'NO'}
                            />
                        </ThemeProvider>
                    </div>
                    {!metadata?.dedicatedHoursSpecified && (
                        <Select
                            displayEmpty
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
                    )}
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Allowable Administrative Duties & Function To Perform</div>
                <div>
                    {
                        activity?.map((data, index) => (
                            <div className={`${style.displayInRow} ${style.marginBottom10}`}>
                                <FormGroup className={`${style.marginLeft10}`}>
                                    <FormControlLabel control={<Checkbox checked={metadata?.selectedActivities?.map(activities => activities?.id)?.includes(data?.id)} onChange={(e) => onSelectActivity(data?.id, e.target.checked)} />} label={<Typography variant="body2" color="textSecondary">{data?.activity}</Typography>} />
                                </FormGroup>
                                <div className={`${style.chipStyle} ${style.redChip}`}>{data?.schedule}</div>
                                {data?.billable && <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>}
                                {data?.podRequired && <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>}
                                {metadata?.selectedActivities?.map(selectedActivity=>selectedActivity?.activity)?.includes(data?.activity) && <EditOutlinedIcon style={{ color: '#7165E3' }} onClick={()=>{setEditAdminActivitySelected(true);
                                  setAdminActivity({
                                    activity: data?.activity,
                                    podRequired: data?.podRequired,
                                    schedule: data?.schedule,
                                    billable: data?.billable,
                                });}} />}
                            </div>

                        ))
                    }
                </div>
            </div>

            {
                showAdminActivity || editAdminActivitySelected &&
                <div className={`${style.addonAddBox} ${style.marginTop20}`}>
                    <div className={`${style.addManagerGrid}`}>
                        <div className={style.extentionLableStyle}>Additional Administrative Services Name</div>
                        <InputGroup placeholder='Add-On Service Name' className={style.fullWidth} value={adminActivity?.activity} onChange={(e) => handleAdminActivity('activity', e.target.value)} />
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Classify As Billable Activity</div>
                        <div className={`${style.threeFieldWidth} `}>
                            <ThemeProvider theme={switchTheme}>
                                <FormControlLabel
                                    control={
                                        <Switch className={`${style.textAlignLeft}`} checked={adminActivity?.billable} onChange={(e) => handleAdminActivity('billable', !adminActivity?.billable)} />
                                    }
                                    color='primary'
                                    className={`${style.switchFontStyle} ${style.flexLeft} `}
                                    label={adminActivity?.billable ? 'YES' : 'NO'}
                                />
                            </ThemeProvider>
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <div className={style.extentionLableStyle}>Proof Of Completion / Documentation Required</div>
                        <div className={style.displayInRow}>
                            <div className={`${style.threeFieldWidth} `}>
                                <ThemeProvider theme={switchTheme}>
                                    <FormControlLabel
                                        control={
                                            <Switch className={`${style.textAlignLeft}`} checked={adminActivity?.podRequired} onChange={(e) => handleAdminActivity('podRequired', !adminActivity?.podRequired)} />
                                        }
                                        color='primary'
                                        className={`${style.switchFontStyle} ${style.flexLeft} `}
                                        label={adminActivity?.podRequired ? 'YES' : 'NO'}
                                    />
                                </ThemeProvider>
                            </div>
                            <div className={style.threeFieldWidth}>
                                <div className={style.extentionLableStyle}>Contracted Schedule*</div>
                                <Select
                                    displayEmpty
                                    SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                    className={`${style.fullWidth}`}
                                    value={adminActivity?.schedule}
                                    onChange={(e) => handleAdminActivity('schedule', e.target.value)}
                                >
                                    <MenuItem value="">Select Frequecy</MenuItem>
                                    <MenuItem value={'WEEK'}>Per Week</MenuItem>
                                    <MenuItem value={'MONTH'}>Per Month</MenuItem>
                                    <MenuItem value={'YEAR'}>Per Contract Year</MenuItem>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={`${style.twoCol} ${style.marginTop20}`}>
                            <button className={`${style.outlinedButton} ${style.fullWidth}`} onClick={(e) => {setShowAdminActivity(false); setEditAdminActivitySelected(false);}}>CANCEL</button>
                            <button className={`${style.buttonStyle} ${style.fullWidth}`} onClick={(e) => { submit() }}>SAVE</button>
                        </div>
                        <br />
                    </div>
                </div>
            }

            <div>
                {!showAdminActivity &&
                    <div className={`${style.addGrid} ${style.fullWidth} ${style.marginTop20}`}>
                        <InputGroup className={style.fullWidth} placeholder='New Additional Administrative Services Name' onChange={(e) => handleAdminActivity('activity', e.target.value)} />
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
                <div className={style.extentionLableStyle}>Separate Administrative Hours Specified*</div>
                <div className={`${style.threeFieldWidth}`}>
                    <TextField
                        size="small"
                        type="tel"
                        maxLength="3"
                        InputProps={{
                            endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                        }}
                        onChange={(e) =>e.target.value >= 0 && handleValueChange('totalSession', e.target.value)}
                        value={metadata?.totalSession}
                    />
                </div>
            </div>
            {
                metadata?.dedicatedHoursSpecified &&
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <div className={style.extentionLableStyle}>Administrative Services Payment Amount*</div>
                    <div className={`${style.displayInRow}`}>
                        <div className={`${style.threeFieldWidth}`}>
                            <TextField
                                size="small"
                                type="tel"
                                maxLength="5"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                }}
                                onChange={(e) =>e.target.value >= 0 && handleValueChange('sessionAmount', e.target.value)}
                                value={metadata?.sessionAmount}
                            />
                        </div>
                        <div className={style.verticalAlignCenter}>
                            <p className={`${style.extentionLableStyle} ${style.marginLeft20}`}>per Hour</p>
                        </div>
                    </div>
                </div>
            }

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <div className={style.extentionLableStyle}>Service Days*</div>
                <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected} />
            </div>
        </div>
    )
}

export default AdministrativeFields;
