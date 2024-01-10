import React, { useState, useEffect } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import AddIcon from '@mui/icons-material/Add';
import Select from '@mui/material/Select';
import { TextArea, Icon, Dialog, Classes, Intent } from '@blueprintjs/core';
import Tooltip from '@mui/material/Tooltip';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import TextField from '@mui/material/TextField';
import { GET, TenantID, POST, DELETE } from './../dataSaver';
import { TimePicker } from "@blueprintjs/datetime";
import { GetDateFromHours } from './../../utils/formatting';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { sub, add } from 'date-fns';
import { CLINIC, SURGERY, ONCALL, PROCEDUREREADING } from '../../Constants';
import ServiceDays from '../../Components/ReusableSmallComponents/serviceDays';
import CommonInputField from '../../Components/CommonFields/CommonInputField';
import CommonCheckBox from '../../Components/CommonFields/CommonCheckBox';
import CommonSwitch from '../../Components/CommonFields/CommonSwitch';
import CommonTextField from '../../Components/CommonFields/CommonTextField';
import CommonLabel from '../../Components/CommonFields/CommonLabel';
import CommonDateField from '../../Components/CommonFields/CommonDateField';

import style from './index.module.scss';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

const TEXTFIELDLEN = 100;
const DESCLEN = 250;

const HITService = ({ getMetaData, services, serviceSelected, editService, isReset, getIsReset, sites, contractId, contractTermPeriod }) => {
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
        mileageRateApplicable: false,
        locationRequired: false,
    });
    const [editAdminActivitySelected, setEditAdminActivitySelected] = useState(false);
    const [serviceAgreementOnFile, setServiceAgreementOnFile] = useState(false);
    const [fileFields, setFileFields] = useState([]);
    const [fileFieldData, setFileFieldData] = useState({ documentType: '', fileName: '', documentDescription: '', file: null, filePath: '' });
    const [fullyExecutedContractData, setFullyExecutedContractData] = useState([]);
    const [isShowUploadDialog, setIsShowUploadDialog] = useState(false);
    const [fileItems, setFileItems] = useState([]);
    const [calendarStart, setCalendarStart] = useState(false);
    const [calendarEnd, setCalendarEnd] = useState(false);
    const [contractTermPeriodFrom, setContractTermPeriodFrom] = useState(null);
    const [contractTermPeriodTo, setContractTermPeriodTo] = useState(null);
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
        hourlyRate: '0',
        sessionDuration: '1',
        serviceRate: '0',
        serviceRateFrequency: 'SESSION',
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
        contractTermPeriodFrom: null,
        contractTermPeriodTo: null,
        contractedServiceFiles: [],
        serviceAgreementOnFile: false,
    })

    console.log('Contract Term Period', contractTermPeriod)

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

    const deleteFile = async (index, fileId) => {
        let temp = fullyExecutedContractData?.filter((data, indexValue) => indexValue !== index)?.map(data => data);
        setFullyExecutedContractData(temp);
        console.log('temp', temp, fileId)
        await DELETE(`contract-managment-service/contracts/contractedServiceFile/${fileId}`)
            .then(response => {
                SuccessToaster('File Deleted Successfully');
                setMetadata({ ...metadata, contractedServiceFiles: temp });
                // setFullyExecutedContractData(temp);
            })
            .catch(error => {
                ErrorToaster('File Upload Failed');
            })
    }

    useEffect(() => {
        getMetaData(metadata);
        // let fileData = [];
        //   contractDetail?.contractFiles?.map(data => {
        //     fileData.push({ id: data?.id, type: data?.documentType, name: data?.documentName, desc: data?.documentDescription, fileName: data?.fileName, file: null, filePath: data?.fileURL })
        //   })
        //   setFileFields(fileData);
    }, [metadata])

    useEffect(() => {
        getFileData();
    }, [fullyExecutedContractData])

    useEffect(() => {
        getTimeSheetWorkFlow();
        getUserData();
        getAdminActivityList();
        getFileData();
    }, [])

    const changeContractFile = (value) => {
        if (serviceAgreementOnFile?.length === 0 || value) {
            setServiceAgreementOnFile(value);
        }
    }

    const handleFileUpload = (e) => {
        if (fullyExecutedContractData?.filter(data => data?.fileName === e.target.files?.[0]?.name)?.length !== 0) {
            ErrorToaster('File already exist from previous upload in this contract');
            return;
        } else {
            setFileFieldData({ ...fileFieldData, file: e.target.files[0], fileName: e.target.files?.[0]?.name });
        }
    }

    const addNewDocumentField = async () => {
        let temp = fullyExecutedContractData;
        temp.push(fileFieldData);
        setFileFields(temp);
        setFullyExecutedContractData(temp);
        setFileFieldData({ documentType: '', fileName: '', documentDescription: '', fileName: '', file: null, filePath: '' });
        getFileData();

        const formData = new FormData();
        let file = fullyExecutedContractData?.map(data => data.file);
        formData.append('contractFiles', new Blob([JSON.stringify(fullyExecutedContractData?.map(data => data))], {
            type: "application/json"
        }));
        formData.append("contractId", new Blob([JSON.stringify(contractId)], {
            type: "application/json"
        }));
        file?.filter(data => data !== null)?.map(data => {
            console.log('contractFiels', data);
            formData.append('contractDocs', data);
        })
        await POST(`contract-managment-service/contracts/contractedServiceFile`, formData)
            .then(response => {
                SuccessToaster('File Uploaded Successfully');
                setMetadata({ ...metadata, contractedServiceFiles: response?.data || [] })
                setFullyExecutedContractData(response?.data);
                // console.log('response', response?.data);
            })
            .catch(error => {
                ErrorToaster('File Upload Failed');
            })
    }

    const handleFileChange = (e, name) => {
        setFileFieldData({ ...fileFieldData, [name]: e.target.value });
    }

    const getFileData = () => {
        let temp = [];
        console.log('entered', fullyExecutedContractData)
        for (let i = 0; i < fullyExecutedContractData?.length || 0; i++) {
            temp[i] = (
                <div className={`${style.documentCard} ${style.marginTop10}`} key={i}>
                    <div className={`${style.documentHITGrid}`}>
                        <a href={fullyExecutedContractData?.[i]?.fileURL} target="_blank">
                            <Tooltip title={'Preview'} arrow>
                                <ArticleOutlinedIcon sx={{ color: '#b0a9ef', fontSize: 35 }} />
                            </Tooltip>
                        </a>
                        <div className={style.marginTop}>
                            <p className={`${style.documentTextActive} ${style.leftAlign} ${style.removeUnderline}`} ><strong>{fullyExecutedContractData?.[i]?.type}</strong></p>
                            <p className={`${style.documentTextActive} ${style.leftAlign}`}><strong>{fullyExecutedContractData?.[i]?.fileName}</strong></p>
                        </div>
                        <div onClick={() => deleteFile(i, fullyExecutedContractData?.[i]?.id)} className={style.floatRight}>
                            <DeleteOutlineIcon sx={{ color: '#F94848' }} />
                        </div>
                    </div>
                </div>
            )
        }
        setFileItems(temp);
    }

    const resetMetadata = () => {
        setMetadata({
            dedicatedHoursSpecified: false,
            dedicatedHoursActivityType: '',
            dedicatedHoursPerformingActivity: '',
            totalSession: '0',
            totalSessionFrequency: 'NA',
            sessionAmount: '0',
            hourlyRate: '0',
            sessionDuration: '1',
            serviceRate: '0',
            serviceRateFrequency: 'SESSION',
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
            contractedServiceFiles: [],
            serviceAgreementOnFile: false,
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
                hourlyRate: (serviceSelected?.payableAmount?.value / serviceSelected?.duration?.hours) || 0,
                sessionDuration: serviceSelected?.duration?.hours || '1',
                serviceRate: serviceSelected?.serviceRate?.rate || '0',
                serviceRateFrequency: serviceSelected?.serviceRate?.rateFrequency,
                workflowId: serviceSelected?.workFlow?.id,
                workflowName: serviceSelected?.workFlow?.workFlowName?.name,
                activityApprovalWFRequired: serviceSelected?.activityApprovalWFRequired,
                approver: approver,
                contractedServiceFiles: serviceSelected?.contractedServiceFiles || [],
                serviceAgreementOnFile: serviceSelected?.serviceAgreementOnFile,
                // contractTermPeriodFrom: serviceSelected?.contractedSchedules?.
            });
            setFullyExecutedContractData(serviceSelected?.contractedServiceFiles || [])
        }
    }

    console.log('Metadata', contractTermPeriodFrom, contractTermPeriodTo);


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
        const { data: adminActivityList } = await GET(`contract-managment-service/contracts/clinicalInformativeActivity`);
        setActivity(adminActivityList);
    }

    const handleValueChange = (name, value) => {
        if (name === 'dedicatedHoursSpecified') {
            if (value) {
                setMetadata({ ...metadata, sessionDuration: '1', totalSession: '0', sessionAmount: '', totalSessionFrequency: 'NA', dedicatedHoursActivityType: '', dedicatedHoursPerformingActivity: '', dedicatedHoursSpecified: value });
            } else {
                setMetadata({ ...metadata, sessionDuration: '1', dedicatedHoursActivityType: '', sessionAmount: '', totalSession: '0', totalSessionFrequency: 'NA', dedicatedHoursPerformingActivity: '', dedicatedHoursSpecified: value });
            }
        }
        if (name === 'totalSessionFrequency' && value === "NA") {
            setMetadata({ ...metadata, [name]: value, totalSession: 0 })
        }
        else {
            setMetadata({ ...metadata, [name]: value });
        }
        if (name === 'sessionAmount') {
            setMetadata({ ...metadata, sessionAmount: value, hourlyRate: (value / metadata?.sessionDuration) || '0' })
        }
    }

    const activityToAdd = async () => {
        setIsLoading(true);
        if (adminActivity?.activity === '') {
            ErrorToaster('Clinical Informatics / HIT Service Name is Mandatory');
            return;
        }
        if (activity?.map(data => data?.activity).includes(adminActivity?.activity)) {
            ErrorToaster('Clinical Informatics / HIT Service Name Already Exists');
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
            "mileageRateApplicable": adminActivity?.mileageRateApplicable,
            "locationRequired": adminActivity?.locationRequired,
        }
        await POST(`contract-managment-service/contracts/clinicalInformativeActivity`, data)
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
                    serviceRate: data?.serviceRate?.rate,
                    serviceRateFrequency: data?.serviceRate?.rateFrequency,
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

    console.log('metadata', metadata);

    const editActivitySelected = () => {
        let editableData = metadata?.selectedActivities?.filter(data => data?.id === adminActivity?.id)?.map(data => data)[0];
        let temp = metadata?.selectedActivities?.filter(data => data?.id !== adminActivity?.id)?.map(data => data);
        temp.push({ activity: adminActivity?.activity, billable: adminActivity?.billable, mileageRateApplicable: adminActivity?.mileageRateApplicable, locationRequired: adminActivity?.locationRequired, podRequired: adminActivity?.podRequired, id: adminActivity?.id, tenant: editableData?.tenant, schedule: adminActivity?.schedule });
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



    return (
        <div>
            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Dedicated Hours For Clinical Informatics / HIT Services*' />
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
                        <CommonLabel value='Separate Clinical Informatics / HIT Hours Specified*' />
                        <div className={style.displayInRow}>
                            <div className={`${style.twoFieldWidth}`}>
                                <CommonTextField
                                    type="number"
                                    InputProps={{
                                        endAdornment: <InputAdornment position="end" sx={{ fontSize: 10 }}>Hours</InputAdornment>,
                                    }}
                                    onChange={(e) => e.target.value >= 0 && handleValueChange('totalSession', e.target.value.slice(0, 4))}
                                    value={metadata?.totalSession}
                                    disabled={metadata?.totalSessionFrequency === 'NA'}
                                />
                            </div>
                            <CommonSelectField className={` ${style.marginLeft20}`}
                                value={metadata?.totalSessionFrequency || 'NA'}
                                onChange={(e) => handleValueChange('totalSessionFrequency', e.target.value)}
                                firstOptionLabel={'Select Frequency'} firstOptionValue={'NA'}
                                valueList={['WEEK', 'MONTH', 'YEAR', 'NA']}
                                labelList={['Per Week', 'Per Month', 'Per Year', 'As Needed']}
                                disabledList={[false, false]} />
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Service Rate' />
                        <div className={`${style.displayInRow}`}>
                            <div className={`${style.threeFieldWidth}`}>
                                <CommonTextField
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>
                                    }}
                                    value={metadata?.serviceRate}
                                    onChange={(e) => e.target.value >= 0 && setMetadata({ ...metadata, serviceRate: parseFloat(e.target.value), sessionAmount: metadata?.serviceRateFrequency === "SESSION" ? parseFloat(e.target.value) : (parseFloat(e.target.value) * metadata?.totalSession) })}
                                />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Service Frequency' />
                        <div className={`${style.displayInRow}`}>
                            <div className={`${style.threeFieldWidth}`}>
                                <CommonSelectField
                                    value={metadata?.serviceRateFrequency || ''}
                                    onChange={(e) => setMetadata({ ...metadata, serviceRateFrequency: e.target.value, sessionAmount: (e.target.value === 'SESSION') ? metadata?.serviceRate : (metadata?.serviceRate * metadata?.totalSession) })}
                                    firstOptionLabel={'Select Frequency'} firstOptionValue={''}
                                    valueList={['SESSION', 'HOUR']}
                                    labelList={['Per Session', 'Per Hour']}
                                    disabledList={[false, false]} />
                            </div>
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value={metadata?.totalSessionFrequency === 'NA' ? 'Hourly Rate*' : 'Total Agreed to Compensation*'} />
                        <div className={`${style.displayInRow}`}>
                            <div className={`${style.threeFieldWidth}`}>
                                <CommonTextField
                                    type="number"
                                    InputProps={{
                                        startAdornment: <InputAdornment position="start" sx={{ fontSize: 10 }}>$</InputAdornment>,
                                    }}
                                    disabled={true}
                                    onChange={(e) => e.target.value >= 0 && handleValueChange('sessionAmount', (e.target.value).slice(0, 6))}
                                    value={metadata?.sessionAmount}
                                />
                            </div>
                            {metadata?.totalSessionFrequency !== 'NA' && <div className={style.verticalAlignCenter}>
                                <CommonLabel className={` ${style.marginLeft20}`} value={metadata?.totalSession !== 0 && metadata?.totalSession !== '' && metadata?.totalSession !== NaN ? `${(metadata?.sessionAmount / metadata?.totalSession).toFixed(2)} per Hour` : ''} />
                            </div>}
                        </div>
                    </div>
                </>
            }

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Allowable Clinical Informatics / HIT Duties & Function To Perform' />
                <div>

                    {/* <div className={`${style.displayInRow} ${style.marginBottom10}`}>
                        <CommonCheckBox className={`${style.marginLeft10}`} label="Epic 8 Training" />
                        <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>
                        <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>
                    </div>

                    <div className={`${style.displayInRow} ${style.marginBottom10}`}>
                        <CommonCheckBox className={`${style.marginLeft10}`} label="Epic 8 Implementation" />
                        <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>
                        <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>
                    </div> */}

                    {
                        activity?.map((data, index) => (
                            <div className={`${style.displayInRow} ${style.marginBottom10}`}>
                                {metadata?.selectedActivities?.map(activities => activities?.id)?.includes(data?.id) ? (
                                    <>
                                        <CommonCheckBox checked={metadata?.selectedActivities?.map(activities => activities?.id)?.includes(data?.id)} className={`${style.marginLeft10}`} onChange={(e) => onSelectActivity(data?.id, e.target.checked)} label={metadata?.selectedActivities?.filter(activity => activity?.id === data?.id)?.map(activity => activity?.activity)?.[0]} />
                                        {/* <div className={`${style.chipStyle} ${style.redChip}`}>{metadata?.selectedActivities?.filter(activities => activities?.id === data?.id)?.map(activities => activities?.schedule)[0]}</div> */}
                                        {metadata?.selectedActivities?.filter(activities => activities?.id === data?.id)?.map(activities => activities?.locationRequired)[0] && <div className={`${style.chipStyle} ${style.yellowChip}`}>Location</div>}
                                        {metadata?.selectedActivities?.filter(activities => activities?.id === data?.id)?.map(activities => activities?.mileageRateApplicable)[0] && <div className={`${style.chipStyle} ${style.orangeChip}`}>Mileage</div>}
                                        {metadata?.selectedActivities?.filter(activities => activities?.id === data?.id)?.map(activities => activities?.billable)[0] && <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>}
                                        {metadata?.selectedActivities?.filter(activities => activities?.id === data?.id)?.map(activities => activities?.podRequired)[0] && <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>}
                                    </>
                                ) : (<>
                                    <CommonCheckBox checked={metadata?.selectedActivities?.map(activities => activities?.id)?.includes(data?.id)} className={`${style.marginLeft10}`} onChange={(e) => onSelectActivity(data?.id, e.target.checked)} label={data?.activity} />

                                    {/* <div className={`${style.chipStyle} ${style.redChip}`}>{data?.schedule}</div> */}
                                    {data?.locationRequired && <div className={`${style.chipStyle} ${style.yellowChip}`}>Location</div>}
                                    {data?.mileageRateApplicable && <div className={`${style.chipStyle} ${style.orangeChip}`}>Mileage</div>}
                                    {data?.billable && <div className={`${style.chipStyle} ${style.blueChip}`}>Billable</div>}
                                    {data?.podRequired && <div className={`${style.chipStyle} ${style.greenChip}`}>POD</div>}
                                </>)}

                                {metadata?.selectedActivities?.map(selectedActivity => selectedActivity?.activity)?.includes(data?.activity) && <EditOutlinedIcon style={{ color: '#7165E3' }} onClick={() => {
                                    setEditAdminActivitySelected(true);
                                    let adminActivity = metadata?.selectedActivities?.filter(activities => activities?.id === data?.id)?.map(activities => activities)[0];
                                    setAdminActivity({
                                        id: adminActivity?.id,
                                        activity: adminActivity?.activity,
                                        podRequired: adminActivity?.podRequired,
                                        schedule: adminActivity?.schedule,
                                        billable: adminActivity?.billable,
                                        mileageRateApplicable: adminActivity?.mileageRateApplicable,
                                        locationRequired: adminActivity?.locationRequired,
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
                        <CommonLabel value='Additional Clinical Informatics / HIT Services Name' />
                        <CommonInputField placeholder='Clinical Informatics / HIT Service Name' className={style.fullWidth} value={adminActivity?.activity} onChange={(e) => handleAdminActivity('activity', e.target.value)} />
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Classify As Billable Activity' />
                        <div className={`${style.threeFieldWidth} `}>
                            <CommonSwitch label={adminActivity?.billable ? 'YES' : 'NO'} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} checked={adminActivity?.billable} onChange={(e) => handleAdminActivity('billable', !adminActivity?.billable)} />
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Is Mileage Required' />
                        <div className={`${style.threeFieldWidth} `}>
                            <CommonSwitch label={adminActivity?.mileageRateApplicable ? 'YES' : 'NO'} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} checked={adminActivity?.mileageRateApplicable} onChange={(e) => handleAdminActivity('mileageRateApplicable', !adminActivity?.mileageRateApplicable)} />
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Location Required' />
                        <div className={`${style.threeFieldWidth} `}>
                            <CommonSwitch label={adminActivity?.locationRequired ? 'YES' : 'NO'} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} checked={adminActivity?.locationRequired} onChange={(e) => handleAdminActivity('locationRequired', !adminActivity?.locationRequired)} />
                        </div>
                    </div>

                    <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                        <CommonLabel value='Proof Of Completion / Documentation Required' />
                        <div className={style.displayInRow}>
                            <div className={`${style.threeFieldWidth} `}>
                                <CommonSwitch label={adminActivity?.podRequired ? 'YES' : 'NO'} className={`${style.switchFontStyle} ${style.flexLeft} ${style.textAlignLeft}`} checked={adminActivity?.podRequired} onChange={(e) => handleAdminActivity('podRequired', !adminActivity?.podRequired)} />
                            </div>
                            {/* <div className={style.threeFieldWidth}>
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
                            </div> */}

                        </div>
                    </div>

                    <div>
                        <div className={` ${style.marginTop20}`}>
                            <button className={`${style.outlinedButton} `} onClick={(e) => { setShowAdminActivity(false); setEditAdminActivitySelected(false); }}>CANCEL</button>
                            <button className={`${style.buttonStyle}  ${isLoading ? style.disabled : ''}`} onClick={(e) => { submit() }}>SAVE</button>
                        </div>
                        <br />
                    </div>
                </div>
            }

            <div>
                {!showAdminActivity &&
                    <div className={`${style.addGrid} ${style.fullWidth} ${style.marginTop20}`}>
                        <CommonInputField className={style.fullWidth} placeholder='New Additional Clinical Informatics / HIT Services Name' onChange={(e) => handleAdminActivity('activity', e.target.value)} />
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


            {/* <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Service Days*' />
                <ServiceDays setMetaData={getServiceDaysMetadata} selectedService={serviceSelected} isReset={isReset} setIsReset={getIsReset} />
            </div> */}

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Service Agreement On File*' />
                <div>
                    <div>
                        <div className={`${style.spaceBetween}`}>
                            <CommonSwitch checked={metadata?.serviceAgreementOnFile} className={`${style.switchFontStyle} ${style.flexLeft}`}
                                label={metadata?.serviceAgreementOnFile ? 'YES' : "NO"}
                                onChange={() => setMetadata({ ...metadata, serviceAgreementOnFile: !metadata?.serviceAgreementOnFile })}
                            />
                            {metadata?.serviceAgreementOnFile && (
                                <div>
                                    <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} `}>
                                        <label for="file-upload" className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${contractStatus === "ACTIVE" ? style.disabledUploadButton : ''}`}>
                                            Upload File
                                        </label>
                                    </button>
                                    <input id="file-upload" type="file" accept="image/*, .pdf" onChange={(e) => { handleFileUpload(e); setIsShowUploadDialog(true) }} disabled={contractStatus === "ACTIVE" ? true : false} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        {fileItems}
                    </div>
                </div>
            </div>

            <div className={`${style.addManagerGrid} ${style.marginTop20}`}>
                <CommonLabel value='Effective Date*' />
                <div className={style.termPeriodGrid}>
                    <div>
                        <CommonDateField
                            open={calendarStart}
                            onOpen={() => setCalendarStart(true)}
                            onClose={() => setCalendarStart(false)}
                            minDate={new Date(contractTermPeriod?.start)}
                            maxDate={new Date(contractTermPeriod?.end)}
                            value={metadata?.contractTermPeriodFrom}
                            onChange={(newValue) => {
                                setMetadata({ ...metadata, 'contractTermPeriodFrom': newValue });
                            }}
                            InputProps={{
                                style: {
                                    fontSize: 14,
                                    height: 30,
                                },
                                // onFocus: e => {
                                //   setCalendarStart(true);
                                // },
                                // onBlur: e => {
                                //   setCalendarStart(false);
                                // }
                            }}
                            renderInput={(params) => <TextField {...params}
                                // onClick={() => setCalendarStart(true)}
                                inputProps={{
                                    ...params.inputProps,
                                    placeholder: "Start Date"
                                }} />}
                        />
                    </div>
                    <p className={`${style.toStyle} ${style.alignCenter}`}>To</p>
                    <div>
                        <CommonDateField
                            open={calendarEnd}
                            onOpen={() => setCalendarEnd(true)}
                            onClose={() => setCalendarEnd(false)}
                            value={metadata?.contractTermPeriodTo}
                            onChange={(newValue) => {
                                setMetadata({ ...metadata, 'contractTermPeriodTo': newValue });
                            }}
                            InputProps={{
                                style: {
                                    fontSize: 14,
                                    height: 30,
                                },
                            }}
                            minDate={contractTermPeriodFrom}
                            maxDate={new Date(contractTermPeriod?.end)}
                            renderInput={(params) => <TextField  {...params}
                                inputProps={{
                                    ...params.inputProps,
                                    placeholder: "End Date"
                                }} />}
                        />
                    </div>
                </div>
            </div>

            <Dialog isOpen={isShowUploadDialog} onClose={() => setIsShowUploadDialog(false)} className={`${style.cloneDialog} ${style.dialogPaddingBottom}`} canOutsideClickClose={false}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>ADD FILE DETAILS</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setIsShowUploadDialog(false)} />
                    </div>
                    <div className={style.extensionBorder}></div>
                    {/* {fullyExecutedContract && ( */}
                    <div>
                        <p className={`${style.fileNameTextStyle} ${style.marginTop10}`}>{fileFieldData?.fileName}</p>
                        <div>
                            <CommonSelectField value={fileFieldData?.documentType || 'Select...'} onChange={(e) => handleFileChange(e, 'documentType')}
                                className={`${style.fullWidth}`} firstOptionLabel={'Select...'} firstOptionValue={'Select...'}
                                valueList={['Agreement Draft', 'Executed Agreement', 'Contract Amendment', 'Exhibit', 'Appendix Addendum', 'Schedule', 'Attachment']}
                                labelList={['Agreement Draft', 'Executed Agreement', 'Contract Amendment', 'Exhibit', 'Appendix Addendum', 'Schedule', 'Attachment']}
                                disabledList={[false, false]} />
                        </div>
                        <CommonInputField className={`${style.fullWidth} ${style.marginTop10}`} placeholder="Document Name"
                            value={fileFieldData?.fileName}
                            maxLength={TEXTFIELDLEN}
                            onChange={(e) => handleFileChange(e, 'name')} />
                        <TextArea rows={4} placeholder="Document Description" value={fileFieldData?.documentDescription}
                            maxLength={DESCLEN} className={`${style.fullWidth} ${style.marginTop10}`} onChange={(e) => handleFileChange(e, 'documentDescription')} />
                        {/* <div>
              <CommonInputField value={fileFieldData?.fileName !== '' ? fileFieldData?.fileName : ''} leftElement={leftElement()} className={`${style.fullWidth} ${style.marginTop10}`} onChange={(e) => handleFileUpload(e)} />
            </div> */}
                    </div>
                    {/* )} */}
                    <div className={`${style.spaceBetween} ${style.marginTop}`}>
                        <div></div>
                        {(
                            (fileFieldData?.documentType === '' || fileFieldData?.fileName === '' || fileFieldData?.file === null) ?
                                <Tooltip title={'Enter All Values To Enable Upload'} arrow>
                                    <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} ${style.disabledUploadButton}`} >UPLOAD</button>
                                </Tooltip> :
                                <button className={`${style.addMoreButton} ${style.marginLeft20} ${style.selectedColor} ${style.cursorPointer} `} disabled={false} onClick={() => { addNewDocumentField(); setIsShowUploadDialog(false) }}>UPLOAD</button>
                        )}
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default HITService;
