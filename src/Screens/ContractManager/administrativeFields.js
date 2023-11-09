import React, { useState, useEffect } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
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
import { valueCheck } from "../../utils/valueCheck";
import { format } from "date-fns";

import style from './index.module.scss';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

const AdministrativeFields = ({ getMetaData, services, serviceSelected, editService, isReset, getIsReset, sites, contractId }) => {
    const [activity, setActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAdminActivity, setShowAdminActivity] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [title, setTitle] = useState([]);
    const [user, setUsers] = useState([]);
    const [adminActivity, setAdminActivity] = useState({
        activity: '',
        podRequired: false,
        schedule: 'WEEK',
        billable: false,
        asNeeded: false,
    });
    const [editAdminActivitySelected, setEditAdminActivitySelected] = useState(false);
    const contractStatus = sessionStorage.getItem('Selected Contract Status');

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
        activityApprovalWFRequired: false,
    })

    const [addOnWorkFlow, setAddOnWorkFlow] = useState([]);

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
    }, [serviceSelected, addOnWorkFlow, user]);

    const getTimeSheetWorkFlow = async () => {
        const { data: timesheetWorkFlow } = await GET('timesheet-management-service/workflow');
        if (timesheetWorkFlow) {
            setAddOnWorkFlow(timesheetWorkFlow);
        }
    }

    useEffect(() => {
        getMetaData(metadata);
    }, [metadata])

    useEffect(() => {
        getTimeSheetWorkFlow();
        getUserData();
        getAdminActivityList();
    }, [])

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
            activityApprovalWFRequired: false,
        })
    }

    const setSelectedValues = () => {

        let workflowData = addOnWorkFlow?.filter(data => data?.id === serviceSelected?.workFlow?.id)?.map(data => data?.workFlowMap?.workflow)[0] || {};
        let workFlowValues = Object?.values(workflowData);
        let approver = user?.filter(data => data?.id === workFlowValues?.[0]?.workFlowUser?.id)?.map(data => data)[0];
        if (Object.keys(serviceSelected)?.length !== 0) {
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
                workflowId: serviceSelected?.workFlow?.id,
                workflowName: serviceSelected?.workFlow?.workFlowName?.name,
                activityApprovalWFRequired: serviceSelected?.activityApprovalWFRequired,
                approver: approver,
            });
        }
    }



    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

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
        if (name === 'totalSessionFrequency' && value === 'NA') {
            setMetadata({ ...metadata, totalSessionFrequency: value, totalSession: 0 })
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
        services?.filter(data => [CLINIC, SURGERY, ONCALL, PROCEDUREREADING]?.includes(data?.activityType?.activityType))?.map(data => {
            let activityName = data?.activityType?.activityType;
            let activities = data?.activities?.map(data => data?.activity);
            if (`${activityName} (${activities?.map(data => data)?.join(', ')})` === index) {
                let dedicatedHoursActivityType = data?.activityType?.activityType;
                let dedicatedHoursPerformingActivity = data?.activities?.map(data => data?.activity)?.join(', ');
                console.log('data', data);
                setMetadata({
                    ...metadata,
                    dedicatedHoursActivityType: dedicatedHoursActivityType,
                    dedicatedHoursPerformingActivity: dedicatedHoursPerformingActivity,
                    sessionDuration: data?.duration?.hours,
                    totalSession: data?.totalSessions?.value,
                    totalSessionFrequency: data?.totalSessions?.frequency,
                    sessionAmount: data?.payableAmount?.value,
                    hourlyRate: data?.hourlyRate?.value,
                });
            }
        });
    }

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
        if (showAdminActivity) {
            activityToAdd();
        } else {
            editActivitySelected();
        }
    }

    const getUserData = async () => {
        let siteId = sites?.map(data => data?.id);
        let deptId = [];
        sites?.map(data => data?.departmentList?.departments?.map(dept => {
            deptId.push(`${data?.id}#${dept?.id}`);
        }))
        let encodedDept = encodeURIComponent(deptId);
        let uri = `user-management-service/user/workFlowUser?sites=${siteId}&sitedepartments=${encodedDept}&contractIdToIgnore=${contractId}`;
        const { data: userList } = await GET(uri);
        if (userList) {
            setUsers(userList);
            let temp = [];
            userList?.map(data => data?.sites?.sites?.map(site => {
                if (data?.name?.firstName && site?.siteName?.siteName && site?.siteResponsibility?.title) {
                    if (site?.siteResponsibility?.title !== "" && site?.siteResponsibility?.title !== undefined && site?.siteResponsibility?.title !== null) {
                        temp.push({ fname: data?.name?.firstName, lname: data?.name?.lastName, suffix: data?.name?.suffix?.suffix || '', site: site?.siteName?.siteName, title: site?.siteResponsibility?.title, id: data?.id, approver: data?.roles?.filter(role => role?.roleName === 'Approver')?.map(data => data)?.length !== 0 ? true : false, reviewer: data?.roles?.filter(role => role?.roleName === 'Reviewer')?.map(data => data)?.length !== 0 ? true : false });
                    }

                    site?.departmentList?.departments?.map(dept => {
                        if (dept?.departmentResponsibility?.title !== "" && dept?.departmentResponsibility?.title !== undefined && dept?.departmentResponsibility?.title !== null) {
                            temp.push({ fname: data?.name?.firstName, lname: data?.name?.lastName, suffix: data?.name?.suffix?.suffix || '', site: dept?.departmentName?.name, title: dept?.departmentResponsibility?.title, id: data?.id, approver: data?.roles?.filter(role => role?.roleName === 'Approver')?.map(data => data)?.length !== 0 ? true : false, reviewer: data?.roles?.filter(role => role?.roleName === 'Reviewer')?.map(data => data)?.length !== 0 ? true : false });
                        }
                    })
                }
            }))
            setTitle(temp);
        }
    }


    const updateWorkingPeriod = (e) => {
        setMetadata({ ...metadata, workingTimeFrom: e });
    }

    console.log('Metadata', metadata);

    const dataCheck = (value) => {
        if (editService) {
            return valueCheck(value);
        } else {
            return false;
        }
    };

    console.log(metadata?.selectedActivities)

    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Dedicated Hours For Administrative Services*'
                    className={!metadata?.dedicatedHoursSpecified && (dataCheck(metadata?.dedicatedHoursPerformingActivity) ? style.redLable : "")}
                />
                <div className={style.displayInRow}>
                    {/* <div className={`${style.threeFieldWidth}`} > */}
                    <CommonSwitch
                        className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`}
                        checked={metadata?.dedicatedHoursSpecified} label={metadata?.dedicatedHoursSpecified ? 'YES' : 'NO'}
                        onChange={(e) => handleValueChange('dedicatedHoursSpecified', !metadata?.dedicatedHoursSpecified)}
                    />
                    {/* </div> */}
                    {!metadata?.dedicatedHoursSpecified && (
                        <FormControl sx={{ width: 480 }}>
                            <Select
                                displayEmpty
                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
                                className={`${style.fullWidth}`}
                                onChange={(e) => selectedHours(e.target.value)}
                                value={`${metadata?.dedicatedHoursActivityType} (${metadata?.dedicatedHoursPerformingActivity})`}
                            >
                                <MenuItem value="">Select Dedicated Hours</MenuItem>
                                {
                                    specificDedicatedHoursList?.map((data, index) => (
                                        <MenuItem value={data}>{data}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
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
                        <CommonLabel value='Separate Administrative Hours Specified*'
                            className={dataCheck(metadata?.totalSession) ? style.redLable : ""}
                        />
                        <div className={style.displayInRow}>
                            <div className={`${style.twoFieldWidth}`}>
                                <CommonTextField
                                    type="number"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                    }}
                                    onChange={(e) => e.target.value >= 0 && handleValueChange('totalSession', e.target.value.slice(0, 4))}
                                    value={metadata?.totalSession}
                                    disabled={metadata?.totalSessionFrequency === "NA"}
                                />
                            </div>
                            <CommonSelectField className={` ${style.marginLeft20}`}
                                value={metadata?.totalSessionFrequency || ''}
                                onChange={(e) => handleValueChange('totalSessionFrequency', e.target.value)}
                                firstOptionLabel={'Select Frequency'} firstOptionValue={''}
                                valueList={['WEEK', 'MONTH', 'YEAR', 'NA']}
                                labelList={['Per Week', 'Per Month', 'Per Year', 'As Needed']}
                                disabledList={[false, false]} />
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Administrative Services Payment Amount*'
                            className={dataCheck(metadata?.sessionAmount) ? style.redLable : ""}
                        />
                        <div className={`${style.displayInRow}`}>
                            <div className={`${style.threeFieldWidth}`}>
                                <CommonTextField
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                    }}
                                    onChange={(e) => e.target.value >= 0 && handleValueChange('sessionAmount', (e.target.value).slice(0, 6))}
                                    value={metadata?.sessionAmount}
                                />
                            </div>
                            <div className={style.verticalAlignCenter}>
                                <CommonLabel className={` ${style.marginLeft20}`} value={metadata?.totalSession !== 0 && metadata?.totalSession !== '' && metadata?.totalSession !== '0' && metadata?.totalSession !== NaN ? `${(metadata?.sessionAmount / metadata?.totalSession).toFixed(2)} per Hour` : ''} />
                            </div>
                        </div>
                    </div>
                </>
            }

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Allowable Administrative Duties & Function To Perform'
                    className={editService && (!metadata?.selectedActivities || metadata?.selectedActivities.length === 0) || dataCheck(metadata?.selectedActivities) ? style.redLable : ""}
                />
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
                                    labelList={['NA', 'Per Week', 'Per Month', 'Per Year']}
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
                <CommonLabel value='Service Days*'
                    className={
                        metadata?.serviceDays === null ||
                            (metadata?.serviceDays !== undefined &&
                                Object?.values(metadata?.serviceDays)?.filter(
                                    (data) => data === true
                                )?.length === 0)
                            ? style.redLable
                            : ""
                    } />
                <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected} isReset={isReset} setIsReset={getIsReset} />
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Allowable Working Day Hours For Service*'
                    className={
                        format(metadata?.workingTimeTo || new Date(), "H") === "0" &&
                            format(metadata?.workingTimeFrom || new Date(), "H") === "0"
                            ? style.redLable
                            : ""
                    } />
                <div className={style.displayInRow}>
                    <TimePicker
                        useAmPm={false}
                        onChange={(e) => {
                            updateWorkingPeriod(e);
                        }}
                        disabled={contractStatus === "ACTIVE" ? true : false}
                        value={metadata?.workingTimeFrom === null ? null : new Date(metadata?.workingTimeFrom)}
                    />
                    <p className={`${style.marginLeft20} ${style.toStyle} ${style.marginTop} ${style.marginRight}`}>To</p>
                    <TimePicker
                        useAmPm={false}
                        onChange={(e) => {
                            handleValueChange('workingTimeTo', e);
                        }}
                        disabled={contractStatus === "ACTIVE" ? true : false}
                        value={metadata?.workingTimeTo === null ? null : new Date(metadata?.workingTimeTo)}
                    // minTime={new Date(new Date(metadata?.workingTimeFrom).getTime() + (metadata?.totalSession * 60 * 60 * 1000))}
                    />

                </div>
            </div>
            <div className={`${style.addManagerGrid}  ${style.marginTop20}`}>
                <CommonLabel value='Only Allow Upon Request / Notification Approval' />
                <CommonSwitch onChange={() => setMetadata({ ...metadata, activityApprovalWFRequired: !metadata?.activityApprovalWFRequired, approver: undefined })} checked={metadata?.activityApprovalWFRequired} />
            </div>
            {metadata?.activityApprovalWFRequired &&
                <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                    <CommonLabel value='Designate Request Approver*'
                        className={dataCheck(metadata?.approver) ? style.redLable : ""}
                    />
                    <CommonSelectField className={`${style.fullWidth} `}
                        defaultValue={metadata?.approver}
                        value={metadata?.approver ? metadata?.approver?.id : '0'}
                        onChange={(e) => { setMetadata({ ...metadata, approver: user.filter(data => data?.id === e.target.value)?.map(data => data)[0], approverTitle: title?.filter(titleData => titleData?.approver === true)?.map(data => data)[0] }) }}
                        firstOptionLabel={'Select Payment Approver'}
                        firstOptionValue={'0'}
                        valueList={title?.filter(titleData => titleData?.approver === true)?.map(data => data?.id)}
                        labelList={title?.filter(titleData => titleData?.approver === true)?.map(titleData => `${titleData?.fname} ${titleData?.lname}, ${titleData?.suffix}, ${titleData?.title} - ${titleData?.site}`)}
                        disabledList={title?.map(data => false)} />
                </div>
            }

        </div>
    )
}

export default AdministrativeFields;
