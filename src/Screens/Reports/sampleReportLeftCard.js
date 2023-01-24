import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import Select from '@mui/material/Select';
import { GET } from './../dataSaver';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, subDays, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';
import SaveReport from './saveReport';
import { useParams } from 'react-router-dom';

import style from './index.module.scss';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const SampleReportLeftCard = ({ getDataToUseInReport, getIsUpdated }) => {
    const [showSaveReport, setShowSaveReport] = useState(false);
    const { reportType } = useParams();
    const [activityType, setActivityType] = useState('Outpatient Clinic Service');
    const [activityPerformed, setActivityPerformed] = useState('Half Day Clinic Session');
    const [renewalreportingTimePeriod, setRenewalreportingTimePeriod] = useState(30);
    const [contractContinuationPolicy, setContractContinuationPolicy] = useState('');
    const [contractStatus, setContractStatus] = useState('ACTIVE');
    const [podType, setPodType] = useState('Medical Staff Membership & Privileges');
    const [reportingTimePeriod, setReportingTimePeriod] = useState('Current Week');
    const [selectedSites, setSelectedSites] = useState([]);
    const [selectedSitesToSend, setSelectedSitesToSend] = useState([]);
    const [selectedContractsToSend, setSelectedContractsToSend] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedDepartmentsToSend, setSelectedDepartmentsToSend] = useState([]);
    const [sites, setSites] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [selectedContracts, setSelectedContracts] = useState([]);
    const [selectedContractedServiceProvider, setSelectedContractedServiceProvider] = useState([]);
    const [selectedContractedServiceProviderToSend, setSelectedContractedServiceProviderToSend] = useState([]);
    const [user, setUsers] = useState([]);
    const [from, setFrom] = useState(startOfWeek(new Date()));
    const [to, setTo] = useState(endOfWeek(new Date()));
    let reportFilter = JSON.parse(sessionStorage.getItem('reportFilter'));

    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const userDetail = jwt(userDetails);
    const [currentUserDetails, setCurrentUserDetails] = useState();
    const [userId, setUserId] = useState(userDetail?.id);

    useEffect(() => {
        setUserId(userDetail?.id);
        setUserDetails();
    }, [])

    const setUserDetails = async () => {
        const { data: user } = await GET(`user-management-service/user/${userId}`);
        setCurrentUserDetails(user);
    }

    let dataToUseInReport = {
        renewalreportingTimePeriod: renewalreportingTimePeriod,
        selectedSites: selectedSites,
        selectedSitesToSend: selectedSitesToSend,
        selectedDepartments: selectedDepartments,
        selectedDepartmentsToSend: selectedDepartmentsToSend,
        contractContinuationPolicy: contractContinuationPolicy,
        sites: sites,
        contractStatus: contractStatus,
        selectedContracts: selectedContracts,
        selectedContractsToSend: selectedContractsToSend,
        podType: podType,
        reportingTimePeriod: reportingTimePeriod,
        from: format(new Date(from), 'yyyy-MM-dd'),
        to: format(new Date(to), 'yyyy-MM-dd'),
        fromToDisplay: format(new Date(from), 'MM-dd-yyyy'),
        toToDisplay: format(new Date(to), 'MM-dd-yyyy'),
        selectedContractedServiceProvider: selectedContractedServiceProvider,
        selectedContractedServiceProviderToSend: selectedContractedServiceProviderToSend,
    };

    const podTypes = ['Medical Staff Membership & Privileges',
        'Primary Speciality Board Certification',
        'Secondary Specialty Board Certification',
        'Liability Insurance Certificate',
        'Workers Compensation Insurance Certificate',
        'Tail Insurance Coverage Certificate',
        'Medical license Certificate',
        'Drug Enforcement Administration (DEA) License',
        'Controlled Substance DEA Registration Certificate'];

    useEffect(() => {
        getSites();
        getContracts();
        setSelectedContractedServiceProvider(currentUserDetails?.id);
        setSelectedContractedServiceProviderToSend(currentUserDetails);
        if (reportFilter) {
            setFrom(new Date(reportFilter?.startDate));
            setTo(new Date(reportFilter?.endDate));
            setSelectedContracts(reportFilter?.contracts);
            setSelectedSites(reportFilter?.sites);
            setSelectedDepartments(reportFilter?.departments);
            setReportingTimePeriod(reportFilter?.reportingTimePeriod);
        }
    }, [currentUserDetails])

    console.log(reportFilter)

    useEffect(() => {
        getDataToUseInReport(dataToUseInReport);
    }, [renewalreportingTimePeriod, selectedSites, selectedDepartments, contractContinuationPolicy, selectedContracts,
        podType, contractStatus, reportingTimePeriod, selectedContractedServiceProvider,
        selectedContractedServiceProviderToSend, from, to]);

    useEffect(() => {
        let tempDept = [];
        setDepartments([]);
        selectedSitesToSend?.map(siteData => {
            siteData?.departmentList?.departments?.map(data => {
                tempDept.push(data);
            })
        });
        let uniqueDepartments = tempDept.filter((ele, ind) => ind === tempDept.findIndex(elem => elem.id === ele.id && elem.id === ele.id));
        setDepartments(uniqueDepartments);
    }, [selectedSitesToSend]);

    useEffect(() => {
        if (reportType === "activitiesOrServices" || reportType === "paymentsProcessingSummary") {
            const quarter = Math.floor((new Date().getMonth() / 3));
            const lastyear = new Date(new Date().getFullYear() - 1, 0, 1);
            if (reportingTimePeriod === 'Current Week') {
                setFrom(startOfWeek(new Date()));
                setTo(endOfWeek(new Date()));
            } else if (reportingTimePeriod === 'Last Week') {
                setFrom(subDays(startOfWeek(new Date()), 7));
                setTo(subDays(startOfWeek(new Date()), 1));
            } else if (reportingTimePeriod === 'Current Month') {
                setFrom(startOfMonth(new Date()));
                setTo(endOfMonth(new Date()));
            } else if (reportingTimePeriod === 'Last Month') {
                setFrom(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
                setTo(subDays(startOfMonth(new Date()), 1));
            } else if (reportingTimePeriod === 'Current Qtr') {
                setFrom(startOfQuarter(new Date()));
                setTo(endOfQuarter(new Date()));
            } else if (reportingTimePeriod === 'Last Qtr') {
                setFrom(new Date(new Date().getFullYear(), quarter * 3 - 3, 1));
                setTo(subDays(startOfQuarter(new Date()), 1));
            } else if (reportingTimePeriod === 'Current Year') {
                setFrom(startOfYear(new Date()));
                setTo(endOfYear(new Date()));
            } else if (reportingTimePeriod === 'Last Year') {
                setFrom(new Date(new Date(lastyear.getFullYear(), 0, 1)));
                setTo(subDays(startOfYear(new Date()), 1));
            } else {
                return;
            }
        }
    }, [reportingTimePeriod])

    const handleChange = (event) => {
        setActivityType(event.target.value);
    };

    const handleChangeActivityPerformed = (event) => {
        setActivityPerformed(event.target.value);
    };

    const getSaveReportDialog = (value) => {
        setShowSaveReport(value);
    }

    // const getSites = async () => {
    //     const {data:sites} = await GET('entity-service/sites');
    //     if(sites){
    //       setSites(sites);
    //   }
    // }

    // const getContracts = async() => {
    //     const {data: contracts} = await GET(`contract-managment-service/contracts`);
    //     setContracts(contracts?.contractList);
    // };

    // const getUsersData = async() => {
    //     const {data: user} = await GET('user-management-service/user');
    //     if(user){
    //       setUsers(user);
    //     }
    // }

    const getSites = () => {
        setSites(currentUserDetails?.sites?.sites);
        if (currentUserDetails?.sites?.sites?.length === 1) {
            setSelectedSites([currentUserDetails?.sites?.sites?.[0]?.id]);
            setSelectedSitesToSend([currentUserDetails?.sites?.sites?.[0]]);
        }
    }

    const getContracts = () => {
        setContracts(currentUserDetails?.contracts);
        if (currentUserDetails?.contracts?.length === 1) {
            setSelectedContracts([currentUserDetails?.contracts?.[0]?.id]);
            setSelectedContractsToSend([currentUserDetails?.contracts?.[0]]);
        }
    }

    const handleChangeSites = (event) => {
        const {
            target: { value },
        } = event;
        getIsUpdated(true);
        setSelectedSites(
            typeof value === 'string' ? value.split(',') : value
        );
        setSelectedSitesToSend(
            typeof value === 'string' ? sites?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : sites?.filter(data => value?.includes(data?.id))?.map(data => data),
        );
    };

    const handleChangeDepartments = (event) => {
        const {
            target: { value },
        } = event;
        getIsUpdated(true);
        setSelectedDepartments(
            typeof value === 'string' ? value.split(',') : value
        );
        setSelectedDepartmentsToSend(
            typeof value === 'string' ? departments?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : departments?.filter(data => value?.includes(data?.id))?.map(data => data),
        );
    };

    const handleChangeContracts = (event) => {
        const {
            target: { value },
        } = event;
        getIsUpdated(true);
        setSelectedContracts(
            typeof value === 'string' ? value.split(',') : value
        );
        setSelectedContractsToSend(
            typeof value === 'string' ? contracts?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : contracts?.filter(data => value?.includes(data?.id))?.map(data => data),
        );
    };

    const handleChangeContractedServiceProviders = (event) => {
        const {
            target: { value },
        } = event;
        getIsUpdated(true);
        setSelectedContractedServiceProvider(
            typeof value === 'string' ? value.split(',') : value
        );
        setSelectedContractedServiceProviderToSend(
            typeof value === 'string' ? user?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : user?.filter(data => value?.includes(data?.id))?.map(data => data),
        );
    };

    return (
        <div>
            <div className={`${style.leftCard} ${style.marginTop20} ${style.bigCalendarLeftCardWidth}`}>
                <div className={style.reportTypeTextStyle}>Reporting Parameter Selection For This Report</div>
                {(reportType === "upcomingContractRenewals" || reportType === "oneTimeContract") ? (
                    <>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label1">Renewal Time Frame</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label1"
                                id="demo-simple-select-standard1"
                                value={renewalreportingTimePeriod}
                                onChange={(e) => { setRenewalreportingTimePeriod(e.target.value); getIsUpdated(true) }}
                                label="Renewal Time Frame"
                            >
                                <MenuItem value={30}>Renewal within Next 30 days</MenuItem>
                                <MenuItem value={60}>Renewal within Next 60 days</MenuItem>
                                <MenuItem value={90}>Renewal within Next 90 days</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label2">Site</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label2"
                                id="demo-multiple-name2"
                                multiple
                                value={selectedSites}
                                onChange={handleChangeSites}
                                MenuProps={MenuProps}
                            >
                                {sites?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                    >
                                        {data?.siteName?.siteName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label3">Departments</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label3"
                                id="demo-multiple-name3"
                                multiple
                                value={selectedDepartments}
                                onChange={handleChangeDepartments}
                                MenuProps={MenuProps}
                            >
                                {departments?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                    >
                                        {data?.departmentName?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {reportType !== "oneTimeContract" && (
                            <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                <InputLabel id="demo-simple-select-standard-label4">Contract Continuation Policy</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label4"
                                    id="demo-simple-select-standard4"
                                    value={contractContinuationPolicy}
                                    onChange={(e) => { setContractContinuationPolicy(e.target.value); getIsUpdated(true) }}
                                    label="Contract Continuation Policy"
                                    MenuProps={MenuProps}
                                >
                                    <MenuItem value={'AUTORENEWAL'}>Auto Renewal</MenuItem>
                                    <MenuItem value={'WRITTENCONTRACTEXTENSIONFORFIXEDTERM'}>Written Contract Extension For Fixed Term</MenuItem>
                                    <MenuItem value={'NEWCONTRACTONEXPIRATION'}>New Contract On Expiration</MenuItem>
                                    <MenuItem value={'ONETIMECONTRACTTERMINATEONEXPIRATION'}>One Time Contract - Terminate On Expiration</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </>
                ) : (reportType === "activitiesOrServices" || reportType === "paymentsProcessingSummary") ? (
                    <>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label1">Reporting Time Period</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label1"
                                id="demo-multiple-name1"
                                MenuProps={MenuProps}
                                value={reportingTimePeriod}
                                onChange={(e) => { setReportingTimePeriod(e.target.value); getIsUpdated(true) }}
                            >
                                <MenuItem value={'Current Week'}>Current Week</MenuItem>
                                <MenuItem value={'Last Week'}>Last Week</MenuItem>
                                <MenuItem value={'Current Month'}>Current Month</MenuItem>
                                <MenuItem value={'Last Month'}>Last Month</MenuItem>
                                <MenuItem value={'Current Qtr'}>Current Quarter</MenuItem>
                                <MenuItem value={'Last Qtr'}>Last Quarter</MenuItem>
                                <MenuItem value={'Current Year'}>Current Year</MenuItem>
                                <MenuItem value={'Last Year'}>Last Year</MenuItem>
                                <MenuItem value={'Custom'}>Custom</MenuItem>
                            </Select>
                        </FormControl>
                        {reportingTimePeriod === "Custom" && (
                            <>
                                <div className={style.marginTop10}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            InputProps={{
                                                style: {
                                                    fontSize: 14,
                                                    height: 30,
                                                }
                                            }}
                                            value={from}
                                            onChange={(e) => { setFrom(e); getIsUpdated(true) }}
                                            renderInput={(params) => <TextField {...params} inputProps={{
                                                ...params.inputProps,
                                                placeholder: "From"
                                            }} />}
                                        />
                                    </LocalizationProvider>
                                </div>
                                <div className={style.marginTop10}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DatePicker
                                            InputProps={{
                                                style: {
                                                    fontSize: 14,
                                                    height: 30,
                                                }
                                            }}
                                            value={to}
                                            onChange={(e) => { setTo(e); getIsUpdated(true) }}
                                            renderInput={(params) => <TextField {...params} inputProps={{
                                                ...params.inputProps,
                                                placeholder: "To"
                                            }} />}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </>
                        )}
                        {reportType === "activitiesOrServices" && (
                            <>
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-multiple-name-label2">Site</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label2"
                                        id="demo-multiple-name2"
                                        multiple
                                        value={selectedSites}
                                        onChange={handleChangeSites}
                                        MenuProps={MenuProps}
                                    >
                                        {sites?.map((data) => (
                                            <MenuItem
                                                key={data?.id}
                                                value={data?.id}
                                            >
                                                {data?.siteName?.siteName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-multiple-name-label2">Departments</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label2"
                                        id="demo-multiple-name2"
                                        multiple
                                        value={selectedDepartments}
                                        onChange={handleChangeDepartments}
                                        MenuProps={MenuProps}
                                    >
                                        {departments?.map((data) => (
                                            <MenuItem
                                                key={data?.id}
                                                value={data?.id}
                                            >
                                                {data?.departmentName?.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-multiple-name-label5">Contract</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label5"
                                        id="demo-multiple-name5"
                                        multiple
                                        value={selectedContracts}
                                        onChange={handleChangeContracts}
                                        MenuProps={MenuProps}
                                    >
                                        {contracts?.map((data) => (
                                            <MenuItem
                                                key={data?.id}
                                                value={data?.id}
                                            >
                                                {data?.contractName?.contractName}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-multiple-name-label5">Contracted Service Provider</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label5"
                                        id="demo-multiple-name5"
                                        value={selectedContractedServiceProvider}
                                        onChange={handleChangeContractedServiceProviders}
                                        MenuProps={MenuProps}
                                    >
                                        <MenuItem
                                            value={currentUserDetails?.id}
                                        >
                                            {`${currentUserDetails?.name?.firstName} ${currentUserDetails?.name?.lastName}`}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </>
                        )}
                    </>
                ) : reportType === "nonCompliant" ? (
                    <>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label1">Site</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label1"
                                id="demo-multiple-name1"
                                multiple
                                value={selectedSites}
                                onChange={handleChangeSites}
                                MenuProps={MenuProps}
                            >
                                {sites?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                    >
                                        {data?.siteName?.siteName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label2">Departments</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label2"
                                id="demo-multiple-name2"
                                multiple
                                value={selectedDepartments}
                                onChange={handleChangeDepartments}
                                MenuProps={MenuProps}
                            >
                                {departments?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                    >
                                        {data?.departmentName?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label5">Contract</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label5"
                                id="demo-multiple-name5"
                                multiple
                                value={selectedContracts}
                                onChange={handleChangeContracts}
                                MenuProps={MenuProps}
                            >
                                {contracts?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                    >
                                        {data?.contractName?.contractName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label3">Contract Status</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label3"
                                id="demo-simple-select-standard3"
                                value={contractStatus}
                                onChange={(e) => { setContractStatus(e.target.value); getIsUpdated(true) }}
                                label="Contract Continuation Policy"
                                MenuProps={MenuProps}
                            >
                                <MenuItem value={'ACTIVE'}>Active</MenuItem>
                                <MenuItem value={'DRAFT'}>Draft</MenuItem>
                                <MenuItem value={'EXPIRED'}>Expired</MenuItem>
                                <MenuItem value={'TERMINATED'}>Terminated</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label4">Proof of Documentation</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label4"
                                id="demo-simple-select-standard4"
                                value={podType}
                                onChange={(e) => { setPodType(e.target.value); getIsUpdated(true) }}
                                label="Proof of Documentation"
                                MenuProps={MenuProps}
                            >
                                {podTypes?.map((data, index) => (
                                    <MenuItem value={data} key={index}>{data}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                ) : (
                    <>
                        <div className={`${style.darkLabel} ${style.marginTop20}`}>Time Range:</div>
                        <select
                            name="action"
                            id="action"
                            className={`${style.fullWidth} ${style.marginTop}`}>
                            <option value="Feb 12, 2022 - Mar 13, 2022" >
                                Feb 12, 2022 - Mar 13, 2022
                            </option>
                        </select>
                        <FormControl variant="standard" sx={{ m: 1, maxWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={activityType}
                                onChange={handleChange}
                                label="Activity Type"
                            >
                                <MenuItem value={'Outpatient Clinic Service'}>Outpatient Clinic Service</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Performed</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={activityPerformed}
                                onChange={handleChangeActivityPerformed}
                                label="Activity Performed"
                            >
                                <MenuItem value={'Half Day Clinic Session'}>Half Day Clinic Session</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Type</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={activityType}
                                onChange={handleChange}
                                label="Activity Type"
                            >
                                <MenuItem value={'Outpatient Clinic Service'}>Outpatient Clinic Service</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, minWidth: '95%', marginTop: '20px' }}>
                            <InputLabel id="demo-simple-select-standard-label">Activity Performed</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={activityPerformed}
                                onChange={handleChangeActivityPerformed}
                                label="Activity Performed"
                            >
                                <MenuItem value={'Half Day Clinic Session'}>Half Day Clinic Session</MenuItem>
                            </Select>
                        </FormControl>
                    </>
                )}
                {/* <button className={`${style.primaryButtonStyle} ${style.marginTop20}`} onClick={()=> setShowSaveReport(true)} >Save Parameter Selection As My Report</button> */}
            </div>
            {showSaveReport && (
                <SaveReport getSaveReportDialog={getSaveReportDialog} />
            )}
        </div>
    )
}

export default SampleReportLeftCard;
