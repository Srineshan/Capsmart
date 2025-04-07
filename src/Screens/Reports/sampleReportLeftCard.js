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
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, addMonths,subYears,subDays, startOfQuarter, endOfQuarter, startOfYear, endOfYear, add, sub } from 'date-fns';
import SaveReport from './saveReport';
import { useParams } from 'react-router-dom';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

import style from './index.module.scss';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            // width: 250,
            // width: 250,
        },
    },
};
const SampleReportLeftCard = ({ getDataToUseInReport, isLoading }) => {
    const [showSaveReport, setShowSaveReport] = useState(false);
    const { reportType } = useParams();
    const isMyReport = window.location.pathname.includes("/myReport");
    const [activityType, setActivityType] = useState('Outpatient Clinic Service');
    const [activityPerformed, setActivityPerformed] = useState('Half Day Clinic Session');
    const [renewalreportingTimePeriod, setRenewalreportingTimePeriod] = useState(30);
    const [contractContinuationPolicy, setContractContinuationPolicy] = useState('ALL');
    const [contractStatus, setContractStatus] = useState('ACTIVE');
    const [podType, setPodType] = useState('Medical Staff Membership & Privileges');
    const [reportingTimePeriod, setReportingTimePeriod] = useState('Current Month');
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
    const [selectedTimesheetInterval, setSelectedTimesheetInterval] = useState([]);
    const [timesheetIntervals, setTimesheetIntervals] = useState([]);
    const [user, setUsers] = useState([]);
    const [from, setFrom] = useState(startOfMonth(new Date()));
    const [to, setTo] = useState(endOfMonth(new Date()));
    const generateMonthYearOptions = () => {
        const startDate = subYears(new Date(), 1); // Start from one year ago
        const monthsList = [];
      
        for (let i = 0; i < 24; i++) { // 12 previous months + 12 upcoming months
          const date = addMonths(startDate, i);
          monthsList.push(format(date, "MMMM yyyy")); // Format: March 2025
        }
      
        return monthsList;
      };
    const monthOptions = generateMonthYearOptions();
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "MMMM yyyy")); // Default: Current month & year
    let reportFilter = JSON.parse(sessionStorage.getItem('reportFilter'));
    let reportCategory = {
        activitiesOrServices: 'ACTIVITY',
        addOnActivities: 'ACTIVITY',
        timesheetProcessingSummary: 'TIMESHEET',
        listingOfTimesheetsNotPaid: 'TIMESHEET',
        staffReappointmentTracker: 'TIMESHEET',
        paymentsProcessingSummary: 'TIMESHEET',
        staffReappointmentsNotes: 'CONTRACT',
        staffReappointments: 'CONTRACT',
        contractDocumentsOnFile: 'CONTRACT',
        contractsWithABusinessEntity: 'CONTRACT',
        multiProviderContractsList: 'CONTRACT',
        currentRemitToAddressForActiveContracts: 'CONTRACT',
        nonCompliant: 'CONTRACT',
        activityStatusTracker: 'CONTRACT',
        paymentProcessingStatusTracker: 'TIMESHEET'
    }
    const defaultOption = ''

    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const userDetail = jwt(userDetails);
    const [currentUserDetails, setCurrentUserDetails] = useState();
    const [userId, setUserId] = useState(userDetail?.id);
    const [contractedServiceProviders, setContractedServiceProviders] = useState([]);
    const [initialValueSet, setInitialValueSet] = useState(false);
    console.log(isLoading, 'loading')
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
        initialValueSet: initialValueSet,
        selectedTimesheetInterval: selectedTimesheetInterval
    };

    useEffect(() => {
        setUserId(userDetail?.id);
        setUserDetails();
        getActivityLogger();
        // getContractAndUserList();
        if (reportType === 'paymentProcessingStatusTracker') {
            getTimesheetIntervals()
        }
    }, [])

    const setUserDetails = async () => {
        const { data: user } = await GET(`user-management-service/user/${userId}`);
        setCurrentUserDetails(user);
    }

    const getTimesheetIntervals = async () => {
        const { data: data } = await GET(`timesheet-management-service/timesheet/timesheetIntervals`);
        setTimesheetIntervals(data);
        if (data?.length !== 0) {
            setSelectedTimesheetInterval(selectedContractedServiceProvider !== '' && reportType !== "paymentProcessingStatusTracker" ? [defaultOption] : [`${format(startOfMonth(new Date()), 'yyyy-MM-dd')}%23${format(endOfMonth(new Date()), 'yyyy-MM-dd')}`])
        }
    }

    console.log("222222222222222222222222222222",departments)

    const getActivityLogger = async () => {
        const { data: user } = await GET(`user-management-service/user?userType=CONTRACTED_SERVICE_PROVIDER_USER`);
        setContractedServiceProviders(user);
    }
    console.log(currentUserDetails?.roles?.length >= 2, currentUserDetails?.roles?.length === 1, currentUserDetails?.roles?.filter(data => data?.roleName === "Activity Logger")?.length === 0)
    const getContractAndUserList = async () => {
        // if (reportType !== "staffReappointmentsNotes" && reportType !== "staffReappointments" &&
        //     reportType !== "contractDocumentsOnFile" && reportType !== "multiProviderContractsList" &&
        //     reportType !== "contractsWithABusinessEntity" && reportType !== "currentRemitToAddressForActiveContracts") {
        if (currentUserDetails?.roles?.length >= 2 || (currentUserDetails?.roles?.length === 1 && currentUserDetails?.roles?.filter(data => data?.roleName === "Activity Logger")?.length === 0)) {
            const { data: contractAndUserList } = await GET(`contract-managment-service/reports/filter/usersAndContracts?sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}&contracts=${dataToUseInReport?.selectedContracts}&reportCategory=${reportCategory[reportType]}`);
            setContractedServiceProviders(contractAndUserList?.users);
            if (selectedContractsToSend?.length === 0) {
                setContracts(contractAndUserList?.contracts);
            }
            if (selectedContractsToSend?.length === 0 && contractAndUserList?.contracts?.length === 1) {
                setSelectedContracts([contractAndUserList?.contracts?.[0]?.id]);
                setSelectedContractsToSend([contractAndUserList?.contracts?.[0]]);
            }
            if (contractAndUserList?.users?.length === 1) {
                setSelectedContractedServiceProvider([contractAndUserList?.users?.[0]?.id]);
                setSelectedContractedServiceProviderToSend([contractAndUserList?.users?.[0]]);
            }
        } else {
            if (currentUserDetails?.id !== undefined) {
                setSelectedContractedServiceProvider([currentUserDetails?.id]);
                setSelectedContractedServiceProviderToSend([currentUserDetails]);
            }
            setContracts(currentUserDetails?.contracts);
            if (selectedContractsToSend?.length === 0 && currentUserDetails?.contracts?.length === 1) {
                setSelectedContracts([currentUserDetails?.contracts?.[0]?.id]);
                setSelectedContractsToSend([currentUserDetails?.contracts?.[0]]);
            }
        }
        // }
    }

    const getAllDeptList = async () => {
        const { data: deptList } = await GET(`entity-service/department/${dataToUseInReport?.selectedSites}`);
        setDepartments(deptList)
    }

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
        // getContracts();
        if (currentUserDetails?.roles?.length === 1 && currentUserDetails?.roles?.map(data => data?.roleName)?.includes("Activity Logger")) {
            setSelectedContractedServiceProvider([currentUserDetails?.id]);
            setSelectedContractedServiceProviderToSend([currentUserDetails]);
        }
        // else {
        //     if (contractedServiceProviders?.length === 1 && contractedServiceProviders?.length !== 0) {
        //         setSelectedContractedServiceProvider([contractedServiceProviders?.[0]?.id]);
        //         setSelectedContractedServiceProviderToSend([contractedServiceProviders?.[0]]);
        //     }
        // }
        if (reportFilter) {
            const encodedArray = reportFilter?.intervals.map(encodeHashToPercent23);
            console.log(encodedArray, 'encodedArray', reportFilter?.intervals)
            setFrom(new Date(reportFilter?.startDate));
            setTo(new Date(reportFilter?.endDate));
            setSelectedContracts(reportFilter?.contracts);
            setSelectedSites(reportFilter?.sites);
            setSelectedDepartments(reportFilter?.departments);
            setReportingTimePeriod(reportFilter?.reportingTimePeriod);
            setSelectedContractedServiceProvider(reportFilter?.users);
            setContractContinuationPolicy(reportFilter?.contractPolicyType !== "" ? reportFilter?.contractPolicyType : 'ALL');
            setContractStatus(reportFilter?.contractStatus);
            setRenewalreportingTimePeriod(reportFilter?.renewalDays)
            setSelectedTimesheetInterval(reportFilter?.intervals ? encodedArray : [])
        }
    }, [currentUserDetails])

    useEffect(() => {
        if (reportFilter) {
            let sitesToShow = [];
            let departmentsToShow = [];
            let contractsToShow = [];
            let serviceProvidersToShow = [];
            departments?.map(data => {
                if (reportFilter?.departments?.includes(data?.id)) {
                    departmentsToShow.push(data)
                }
            })
            setSelectedDepartmentsToSend(departmentsToShow)
            contracts?.map(data => {
                if (reportFilter?.contracts?.includes(data?.id)) {
                    contractsToShow.push(data)
                }
            })
            setSelectedContractsToSend(contractsToShow)
            contractedServiceProviders?.map(data => {
                if (reportFilter?.users?.includes(data?.id)) {
                    serviceProvidersToShow.push(data)
                }
            })
            setSelectedContractedServiceProviderToSend(serviceProvidersToShow)
            console.log(sitesToShow, departmentsToShow, contractsToShow, serviceProvidersToShow, sites, departments, contracts, contractedServiceProviders)
        }
    }, [sites, departments, contracts, contractedServiceProviders])

    console.log(isMyReport)

    useEffect(() => {
        getDataToUseInReport(dataToUseInReport);
    }, [renewalreportingTimePeriod, selectedSites, selectedDepartments, contractContinuationPolicy, selectedContracts,
        podType, contractStatus, reportingTimePeriod, selectedContractedServiceProvider,
        selectedContractedServiceProviderToSend, from, to, initialValueSet, selectedTimesheetInterval]);

    useEffect(() => {
        let tempDept = [];
        setDepartments([]);
        selectedSitesToSend?.map(siteData => {
            siteData?.departmentList?.departments?.map(data => {
                // tempDept.push({ site: siteData, dept: data });
                tempDept.push(data);
            })
        });
        // let uniqueDepartments = tempDept.filter((ele, ind) => ind === tempDept.findIndex(elem => elem.id === ele.id && elem.id === ele.id));
        if (currentUserDetails?.roles?.length === 1 && currentUserDetails?.roles?.map(data => data?.roleName)?.includes("Activity Logger")) {
            setDepartments(tempDept);
            if (tempDept?.length === 1) {
                // setSelectedDepartments([tempDept?.[0]?.dept?.id]);
                // setSelectedDepartmentsToSend([tempDept?.[0]?.dept]);
                setSelectedDepartments([tempDept?.[0]?.id]);
                setSelectedDepartmentsToSend([tempDept?.[0]]);
            }
        } else {
            getAllDeptList();
        }
        // if (currentUserDetails?.roles?.length >= 2 || (currentUserDetails?.roles?.length === 1 && !currentUserDetails?.roles?.map(data => data?.roleName)?.includes("Activity Logger"))) {
        //     getAllDeptList();
        // }
    }, [selectedSitesToSend]);

    // useEffect(() => {
    //     getContractAndUserList();
    // }, isMyReport ? [currentUserDetails] : [selectedSitesToSend, selectedDepartmentsToSend, selectedContractsToSend, currentUserDetails]);

    useEffect(() => {
        if (reportType === "activitiesOrServices" || reportType === "paymentsProcessingSummary" || reportType === "addOnActivities" || reportType === "timesheetProcessingSummary" || reportType === "listingOfTimesheetsNotPaid" || reportType === "staffReappointmentTracker") {
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

    useEffect(() => {
        if (selectedSites?.length === 0) {
            if (sites?.length !== 1) {
                setSelectedSites([defaultOption]);
            }
        } else if (selectedSites?.length >= 2 && selectedSites.includes(defaultOption)) {
            setSelectedSites(selectedSites.filter(value => value !== defaultOption))
        }
        if (selectedDepartments?.length === 0) {
            if (departments?.length !== 1) {
                setSelectedDepartments([defaultOption]);
            }
        } else if (selectedDepartments?.length >= 2 && selectedDepartments.includes(defaultOption)) {
            setSelectedDepartments(selectedDepartments.filter(value => value !== defaultOption))
        }

        if (selectedContractedServiceProvider?.length === 0) {
            if (contractedServiceProviders?.length !== 1) {
                setSelectedContractedServiceProvider([defaultOption]);
            }
        } else if (selectedContractedServiceProvider?.length >= 2 && selectedContractedServiceProvider.includes(defaultOption)) {
            setSelectedContractedServiceProvider(selectedContractedServiceProvider.filter(value => value !== defaultOption))
        }

        if (selectedContracts?.length === 0) {
            if (contracts?.length !== 1) {
                setSelectedContracts([defaultOption]);
            }
        } else if (selectedContracts?.length >= 2 && selectedContracts.includes(defaultOption)) {
            setSelectedContracts(selectedContracts.filter(value => value !== defaultOption))
        }
        const timer = setTimeout(() => {
            setInitialValueSet(true);
        }, 2000);
        return () => clearTimeout(timer);

    }, [defaultOption, selectedSites, selectedDepartments, selectedContractedServiceProvider, selectedContracts]);

    const encodeHashToPercent23 = (str) => {
        const parts = str.split('#');
        const encodedParts = parts.map((part, index) => {
            return index < parts.length - 1 ? encodeURIComponent(part) + '%23' : encodeURIComponent(part);
        });
        return encodedParts.join('');
    };

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

    // const getContracts = () => {
    //     setContracts(currentUserDetails?.contracts);
    //     if (currentUserDetails?.contracts?.length === 1) {
    //         setSelectedContracts([currentUserDetails?.contracts?.[0]?.id]);
    //         setSelectedContractsToSend([currentUserDetails?.contracts?.[0]]);
    //     }
    // }

    const handleChangeSites = (event) => {
        const {
            target: { value },
        } = event;
        if (value?.length >= 2 && value[value?.length - 1] === defaultOption) {
            setSelectedSites([defaultOption]);
            setSelectedSitesToSend([]);
        } else {
            setSelectedSites(
                typeof value === 'string' ? value.split(',') : value
            );
            setSelectedSitesToSend(
                typeof value === 'string' ? sites?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : sites?.filter(data => value?.includes(data?.id))?.map(data => data),
            );
        }
        setSelectedDepartments([defaultOption]);
        setSelectedDepartmentsToSend([]);
        setSelectedContracts([defaultOption]);
        setSelectedContractsToSend([]);
        setSelectedContractedServiceProvider([defaultOption]);
        setSelectedContractedServiceProviderToSend([]);
    };

    const handleChangeDepartments = (event) => {
        const {
            target: { value },
        } = event;
        console.log(value[value?.length - 1], value)
        if (value?.length >= 2 && value[value?.length - 1] === defaultOption) {
            setSelectedDepartments([defaultOption]);
            setSelectedDepartmentsToSend([]);
        } else {
            setSelectedDepartments(
                typeof value === 'string' ? value.split(',') : value
            );
            setSelectedDepartmentsToSend(
                typeof value === 'string' ? departments?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : departments?.filter(data => value?.includes(data?.id))?.map(data => data),
            );
        }
        setSelectedContracts([defaultOption]);
        setSelectedContractsToSend([]);
        setSelectedContractedServiceProvider([defaultOption]);
        setSelectedContractedServiceProviderToSend([]);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
      };

    const handleChangeContracts = (event) => {
        const {
            target: { value },
        } = event;

        if (value?.length >= 2 && value[value?.length - 1] === defaultOption) {
            setSelectedContracts([defaultOption]);
            setSelectedContractsToSend([]);
        } else {
            setSelectedContracts(
                typeof value === 'string' ? value.split(',') : value
            );
            setSelectedContractsToSend(
                typeof value === 'string' ? contracts?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : contracts?.filter(data => value?.includes(data?.id))?.map(data => data),
            );
        }
        setSelectedContractedServiceProvider([defaultOption]);
        setSelectedContractedServiceProviderToSend([]);
    };

    const handleChangeContractedServiceProviders = (event) => {
        const {
            target: { value },
        } = event;
        if (value?.length >= 2 && value[value?.length - 1] === defaultOption) {
            setSelectedContractedServiceProvider([defaultOption]);
            setSelectedContractedServiceProviderToSend([]);
        } else {
            setSelectedContractedServiceProvider(
                typeof value === 'string' ? value.split(',') : value
            );
            setSelectedContractedServiceProviderToSend(
                typeof value === 'string' ? contractedServiceProviders?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : contractedServiceProviders?.filter(data => value?.includes(data?.id))?.map(data => data),
            );
        }
    };

    const handleChangeTimesheetInterval = (event) => {
        const {
            target: { value },
        } = event;
        console.log(event, value)

        if (value?.length >= 2 && value[value?.length - 1] === defaultOption && reportType !== "paymentProcessingStatusTracker") {
            setSelectedTimesheetInterval([defaultOption]);
        } else {
            setSelectedTimesheetInterval(
                typeof value === 'string' ? value.split(',') : value
            );
        }
    };

    return (
        <div>
            <div className={`${style.leftCard} ${style.leftCardDisplay} ${style.marginTop20} ${style.bigCalendarLeftCardWidth}`}>
                <div className={`${style.reporttypeLeftBackGround}`}>
                  <div className={style.reportLeftTextStyle}>Save Parameter Selection As My Report</div>
                </div>
                {(reportType === "staffReappointmentsNotes" || reportType === "staffReappointments" ||
                    reportType === "contractDocumentsOnFile" || reportType === "multiProviderContractsList" ||
                    reportType === "contractsWithABusinessEntity" || reportType === "currentRemitToAddressForActiveContracts" ||
                    reportType === 'nonCompliant' || reportType === "activityStatusTracker" || reportType === "paymentProcessingStatusTracker" || reportType === "staffReappointmentTracker") ? (
                    <>
                        {/* {reportType === "staffReappointmentsNotes" && (
                            <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                <InputLabel id="demo-simple-select-standard-label1">{reportType === "staffReappointmentsNotes" ? 'Renewal' : 'Expiration'} Time Frame</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label1"
                                    id="demo-simple-select-standard1"
                                    value={renewalreportingTimePeriod}
                                    onChange={(e) => { setRenewalreportingTimePeriod(e.target.value) }}
                                    label="Renewal Time Frame"
                                    disabled={isMyReport || isLoading}
                                >
                                    <MenuItem value={30} disabled={isMyReport || isLoading}>{reportType === "staffReappointmentsNotes" ? 'Renewal' : 'Expiration'} Within Next 30 days</MenuItem>
                                    <MenuItem value={60} disabled={isMyReport || isLoading}>{reportType === "staffReappointmentsNotes" ? 'Renewal' : 'Expiration'} Within Next 60 days</MenuItem>
                                    <MenuItem value={90} disabled={isMyReport || isLoading}>{reportType === "staffReappointmentsNotes" ? 'Renewal' : 'Expiration'} Within Next 90 days</MenuItem>
                                </Select>
                            </FormControl>
                        )} */}
                        {/* <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label2" className={style.headingtextStyle}>Site</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label2"
                                id="demo-multiple-name2"
                                multiple
                                value={selectedSites}
                                onChange={handleChangeSites}
                                MenuProps={MenuProps}
                                disabled={isMyReport || isLoading}
                            >
                                {sites?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All Sites</MenuItem>
                                )}
                                {sites?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {data?.siteName?.siteName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}
                       <FormControl variant="standard" sx={{ m: 1, width: "250px", marginTop: "20px" }}>
                        <InputLabel id="month-selector-label">Reporting Period</InputLabel>
                        <Select
                            labelId="month-selector-label"
                            id="month-selector"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            disabled={isMyReport || isLoading}
                        >
                            {monthOptions.map((month) => (
                            <MenuItem key={month} value={month}>
                                {month}
                            </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label2" className={style.headingtextStyle}>Departments</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label2"
                                id="demo-multiple-name2"
                                multiple
                                value={selectedDepartments}
                                onChange={handleChangeDepartments}
                                MenuProps={MenuProps}
                                disabled={isMyReport || isLoading}
                            >
                                {departments?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All</MenuItem>
                                )}
                                {departments?.map((data) => (
                                    // <MenuItem
                                    //     key={data?.dept?.id}
                                    //     value={data?.dept?.id}
                                    // >
                                    //     {`${data?.site?.siteName?.siteName} - ${data?.dept?.departmentName?.name}`}
                                    // </MenuItem>
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {data?.departmentName?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* <CommonSelectField
                            label="Departments"
                            value={selectedDepartments}
                            onChange={handleChangeDepartments}
                            firstOptionLabel={departments?.length >= 2 ? "All" : ""}
                            firstOptionValue={defaultOption}
                            valueList={departments?.map((data) => data?.id)}
                            labelList={departments?.map((data) => data?.departmentName?.name)}
                            disabledList={departments?.map(() => isMyReport || isLoading)}
                            disabledSelect={isMyReport || isLoading}
                            multiple={true}
                            // widthValue="250px"
                        /> */}
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label2" className={style.headingtextStyle}>Division / Speciality</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label2"
                                id="demo-multiple-name2"
                                multiple
                                value={selectedDepartments}
                                onChange={handleChangeDepartments}
                                MenuProps={MenuProps}
                                disabled={isMyReport || isLoading}
                            >
                                {departments?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All</MenuItem>
                                )}
                                {departments?.map((data) => (
                                    // <MenuItem
                                    //     key={data?.dept?.id}
                                    //     value={data?.dept?.id}
                                    // >
                                    //     {`${data?.site?.siteName?.siteName} - ${data?.dept?.departmentName?.name}`}
                                    // </MenuItem>
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {data?.departmentName?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label2" className={style.headingtextStyle}>Staff Type</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label2"
                                id="demo-multiple-name2"
                                multiple
                                value={selectedDepartments}
                                onChange={handleChangeDepartments}
                                MenuProps={MenuProps}
                                disabled={isMyReport || isLoading}
                            >
                                {departments?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All</MenuItem>
                                )}
                                {departments?.map((data) => (
                                    // <MenuItem
                                    //     key={data?.dept?.id}
                                    //     value={data?.dept?.id}
                                    // >
                                    //     {`${data?.site?.siteName?.siteName} - ${data?.dept?.departmentName?.name}`}
                                    // </MenuItem>
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {data?.departmentName?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label2" className={style.headingtextStyle}>Privilege Category</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label2"
                                id="demo-multiple-name2"
                                multiple
                                value={selectedDepartments}
                                onChange={handleChangeDepartments}
                                MenuProps={MenuProps}
                                disabled={isMyReport || isLoading}
                            >
                                {departments?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All Categories</MenuItem>
                                )}
                                {departments?.map((data) => (
                                    // <MenuItem
                                    //     key={data?.dept?.id}
                                    //     value={data?.dept?.id}
                                    // >
                                    //     {`${data?.site?.siteName?.siteName} - ${data?.dept?.departmentName?.name}`}
                                    // </MenuItem>
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {data?.departmentName?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label5" className={style.headingtextStyle}>Contract</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label5"
                                id="demo-multiple-name5"
                                multiple
                                value={selectedContracts}
                                onChange={handleChangeContracts}
                                disabled={isMyReport || isLoading}
                            // MenuProps={MenuProps}
                            >
                                {contracts?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All Contracts</MenuItem>
                                )}
                                {contracts?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {data?.contractName?.contractName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}
                        {(reportType === "contractDocumentsOnFile" || reportType === "currentRemitToAddressForActiveContracts" || reportType === "activityStatusTracker") && (
                            <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                <InputLabel id="demo-multiple-name-label5">Contracted Service Provider</InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label5"
                                    id="demo-multiple-name5"
                                    multiple
                                    value={selectedContractedServiceProvider}
                                    onChange={handleChangeContractedServiceProviders}
                                    MenuProps={MenuProps}
                                    disabled={isMyReport || isLoading}
                                >
                                    {contractedServiceProviders?.length >= 2 && (
                                        <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All Contracted Service Providers</MenuItem>
                                    )}
                                    {contractedServiceProviders?.map((data, index) => (
                                        <MenuItem
                                            key={index}
                                            value={data?.id}
                                            disabled={isMyReport || isLoading}
                                        >
                                            {`${data?.name?.firstName} ${data?.name?.lastName}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {reportType === "paymentProcessingStatusTracker" && (
                            <>
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-multiple-name-label5">Contracted Service Provider</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label5"
                                        id="demo-multiple-name5"
                                        value={selectedContractedServiceProvider}
                                        onChange={handleChangeContractedServiceProviders}
                                        MenuProps={MenuProps}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {contractedServiceProviders?.length >= 2 && (
                                            <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All Contracted Service Providers</MenuItem>
                                        )}
                                        {contractedServiceProviders?.map((data, index) => (
                                            <MenuItem
                                                key={index}
                                                value={data?.id}
                                                disabled={isMyReport || isLoading}
                                            >
                                                {`${data?.name?.firstName} ${data?.name?.lastName}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {(selectedContractedServiceProvider?.length === 1 && selectedContractedServiceProvider[0] !== '') ? (
                                    <FormControl variant="standard" sx={{ width: '250px', marginTop: '20px' }}>
                                        <InputLabel id="demo-multiple-name-label5">Timesheet Interval</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label2"
                                            id="demo-multiple-name2"
                                            multiple
                                            value={selectedTimesheetInterval}
                                            onChange={handleChangeTimesheetInterval}
                                            MenuProps={{ MenuProps }}
                                            disabled={isMyReport || isLoading}
                                        >
                                            {timesheetIntervals?.map((data) => (
                                                <MenuItem
                                                    key={data?.startDate}
                                                    value={`${data?.startDate}%23${data?.endDate}`}
                                                    disabled={isMyReport || isLoading}
                                                >
                                                    {`Timesheets for ${format(new Date(data?.startDate), 'MMMM yyyy')}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <FormControl variant="standard" sx={{ width: '250px', marginTop: '20px' }}>
                                        <InputLabel id="demo-multiple-name-label5">Timesheet Interval</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label2"
                                            id="demo-multiple-name2"
                                            value={selectedTimesheetInterval}
                                            onChange={(e) => setSelectedTimesheetInterval([e.target.value])}
                                            MenuProps={{ MenuProps }}
                                            disabled={isMyReport || isLoading}
                                        >
                                            {timesheetIntervals?.map((data) => (
                                                <MenuItem
                                                    key={data?.startDate}
                                                    value={`${data?.startDate}%23${data?.endDate}`}
                                                    disabled={isMyReport || isLoading}
                                                >
                                                    {`Timesheets for ${format(new Date(data?.startDate), 'MMMM yyyy')}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            </>
                        )}
                        {(reportType === "contractDocumentsOnFile" || reportType === "multiProviderContractsList" ||
                            reportType === "contractsWithABusinessEntity" || reportType === 'nonCompliant') && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-simple-select-standard-label3">Contract Status</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label3"
                                        id="demo-simple-select-standard3"
                                        value={contractStatus}
                                        onChange={(e) => { setContractStatus(e.target.value) }}
                                        MenuProps={MenuProps}
                                        disabled={isMyReport || isLoading}
                                    >
                                        <MenuItem value={'ACTIVE'} disabled={isMyReport || isLoading}>Active</MenuItem>
                                        <MenuItem value={'DRAFT'} disabled={isMyReport || isLoading}>Draft</MenuItem>
                                        <MenuItem value={'EXPIRED'} disabled={isMyReport || isLoading}>Expired</MenuItem>
                                        <MenuItem value={'TERMINATED'} disabled={isMyReport || isLoading}>Terminated</MenuItem>
                                        <MenuItem value={'ACTIVATION_READY'} disabled={isMyReport || isLoading}>Ready To Activate</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        {/* {reportType === "staffReappointmentsNotes" && (
                            <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                <InputLabel id="demo-simple-select-standard-label4">Contract Continuation Policy</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label4"
                                    id="demo-simple-select-standard4"
                                    value={contractContinuationPolicy}
                                    onChange={(e) => { setContractContinuationPolicy(e.target.value) }}
                                    label="Contract Continuation Policy"
                                    MenuProps={MenuProps}
                                    disabled={isMyReport || isLoading}
                                >
                                    <MenuItem value={'ALL'} disabled={isMyReport || isLoading}>All Contract Continuation Policy</MenuItem>
                                    <MenuItem value={'AUTORENEWAL'} disabled={isMyReport || isLoading}>Auto Renewal</MenuItem>
                                    <MenuItem value={'WRITTENCONTRACTEXTENSIONFORFIXEDTERM'} disabled={isMyReport || isLoading}>Written Contract Extension For Fixed Term</MenuItem>
                                    <MenuItem value={'NEWCONTRACTONEXPIRATION'} disabled={isMyReport || isLoading}>New Contract On Expiration</MenuItem>
                                    <MenuItem value={'ONETIMECONTRACTTERMINATEONEXPIRATION'} disabled={isMyReport || isLoading}>One Time Contract - Terminate On Expiration</MenuItem>
                                </Select>
                            </FormControl>
                        )} */}
                        {reportType === 'nonCompliant' && (
                            <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                <InputLabel id="demo-simple-select-standard-label4">Proof of Documentation</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label4"
                                    id="demo-simple-select-standard4"
                                    value={podType}
                                    onChange={(e) => { setPodType(e.target.value) }}
                                    label="Proof of Documentation"
                                    MenuProps={MenuProps}
                                    disabled={isMyReport || isLoading}
                                >
                                    {podTypes?.map((data, index) => (
                                        <MenuItem value={data} key={index} disabled={isMyReport || isLoading}>{data}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </>
                ) : (reportType === "activitiesOrServices" || reportType === "paymentsProcessingSummary" || reportType === "addOnActivities" || reportType === "timesheetProcessingSummary" || reportType === "listingOfTimesheetsNotPaid") ? (
                    <>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label1">Reporting Time Period</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label1"
                                id="demo-multiple-name1"
                                MenuProps={MenuProps}
                                value={reportingTimePeriod}
                                onChange={(e) => { setReportingTimePeriod(e.target.value) }}
                                disabled={isMyReport || isLoading}
                            >
                                <MenuItem value={'Current Week'} disabled={isMyReport || isLoading}>Current Week</MenuItem>
                                <MenuItem value={'Last Week'} disabled={isMyReport || isLoading}>Last Week</MenuItem>
                                <MenuItem value={'Current Month'} disabled={isMyReport || isLoading}>Current Month</MenuItem>
                                <MenuItem value={'Last Month'} disabled={isMyReport || isLoading}>Last Month</MenuItem>
                                <MenuItem value={'Current Qtr'} disabled={isMyReport || isLoading}>Current Quarter</MenuItem>
                                <MenuItem value={'Last Qtr'} disabled={isMyReport || isLoading}>Last Quarter</MenuItem>
                                <MenuItem value={'Current Year'} disabled={isMyReport || isLoading}>Current Year</MenuItem>
                                <MenuItem value={'Last Year'} disabled={isMyReport || isLoading}>Last Year</MenuItem>
                                <MenuItem value={'Custom'} disabled={isMyReport || isLoading}>Custom</MenuItem>
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
                                            minDate={sub(new Date(to), { years: 3 })}
                                            maxDate={new Date(to)}
                                            onChange={(e) => { setFrom(e) }}
                                            renderInput={(params) => <TextField {...params} inputProps={{
                                                ...params.inputProps,
                                                placeholder: "From", readOnly: true
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
                                            minDate={new Date(from)}
                                            maxDate={add(new Date(from), { years: 3 })}
                                            onChange={(e) => { setTo(e) }}
                                            renderInput={(params) => <TextField {...params} inputProps={{
                                                ...params.inputProps,
                                                placeholder: "To", readOnly: true
                                            }} />}
                                        />
                                    </LocalizationProvider>
                                </div>
                            </>
                        )}
                        {/* {reportType === "paymentsProcessingSummary" && (
                            <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                <InputLabel id="demo-multiple-name-label2">Departments</InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label2"
                                    id="demo-multiple-name2"
                                    readOnly
                                    disabled
                                    value={'All Departments'}
                                    MenuProps={MenuProps}
                                >
                                    <MenuItem
                                        value={'All Departments'}
                                    >
                                        All Departments
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        )} */}
                        {/* {(reportType === "activitiesOrServices" || reportType === "addOnActivities" || reportType === "timesheetProcessingSummary" || reportType === "listingOfTimesheetsNotPaid" || reportType === "staffReappointmentTracker" || reportType === "paymentsProcessingSummary") && (
                            <>
                                {reportType !== "paymentsProcessingSummary" && ( */}
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label2">Site</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label2"
                                id="demo-multiple-name2"
                                multiple
                                value={selectedSites}
                                onChange={handleChangeSites}
                                MenuProps={MenuProps}
                                disabled={isMyReport || isLoading}
                            >
                                {sites?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All Sites</MenuItem>
                                )}
                                {sites?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {data?.siteName?.siteName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* )}
                                {reportType !== "paymentsProcessingSummary" && ( */}
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label2">Departments</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label2"
                                id="demo-multiple-name2"
                                multiple
                                value={selectedDepartments}
                                onChange={handleChangeDepartments}
                                MenuProps={MenuProps}
                                disabled={isMyReport || isLoading}
                            >
                                {departments?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All Departments</MenuItem>
                                )}
                                {departments?.map((data) => (
                                    // <MenuItem
                                    //     key={data?.dept?.id}
                                    //     value={data?.dept?.id}
                                    // >
                                    //     {`${data?.site?.siteName?.siteName} - ${data?.dept?.departmentName?.name}`}
                                    // </MenuItem>
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {data?.departmentName?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* )} */}
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label5">Contract</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label5"
                                id="demo-multiple-name5"
                                multiple
                                value={selectedContracts}
                                onChange={handleChangeContracts}
                                // MenuProps={MenuProps}
                                disabled={isMyReport || isLoading}
                            >
                                {contracts?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All Contracts</MenuItem>
                                )}
                                {contracts?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {data?.contractName?.contractName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {/* {(currentUserDetails?.roles?.map(data => data?.roleName)?.includes("Reviewer") || currentUserDetails?.roles?.map(data => data?.roleName)?.includes("Approver") || currentUserDetails?.roles?.map(data => data?.roleName)?.includes("Accounts Payable") || currentUserDetails?.roles?.map(data => data?.roleName)?.includes("Contract Manager")) ? ( */}
                        {currentUserDetails?.roles?.length === 1 && currentUserDetails?.roles?.map(data => data?.roleName)?.includes("Activity Logger") ? (
                            <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                <InputLabel id="demo-multiple-name-label5">Contracted Service Provider</InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label5"
                                    id="demo-multiple-name5"
                                    value={selectedContractedServiceProvider}
                                    onChange={handleChangeContractedServiceProviders}
                                    MenuProps={MenuProps}
                                    disabled={isMyReport || isLoading}
                                >
                                    <MenuItem
                                        value={currentUserDetails?.id} disabled={isMyReport || isLoading}
                                    >
                                        {`${currentUserDetails?.name?.firstName} ${currentUserDetails?.name?.lastName}`}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                <InputLabel id="demo-multiple-name-label5">Contracted Service Provider</InputLabel>
                                <Select
                                    labelId="demo-multiple-name-label5"
                                    id="demo-multiple-name5"
                                    multiple
                                    value={selectedContractedServiceProvider}
                                    onChange={handleChangeContractedServiceProviders}
                                    MenuProps={MenuProps}
                                    disabled={isMyReport || isLoading}
                                >
                                    {contractedServiceProviders?.length >= 2 && (
                                        <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All Contracted Service Providers</MenuItem>
                                    )}
                                    {contractedServiceProviders?.map((data, index) => (
                                        <MenuItem
                                            key={index}
                                            value={data?.id}
                                            disabled={isMyReport || isLoading}
                                        >
                                            {`${data?.name?.firstName} ${data?.name?.lastName}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {/* ) : (
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
                        )} */}
                    </>
                    //     )}
                    // </>
                ) : reportType === "compensationCostAnalysis" ? (
                    <>
                        <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                            <InputLabel id="demo-multiple-name-label5">Contract</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label5"
                                id="demo-multiple-name5"
                                multiple
                                value={selectedContracts}
                                onChange={handleChangeContracts}
                                MenuProps={MenuProps}
                                disabled={isMyReport || isLoading}
                            >
                                {contracts?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isLoading}>All Contracts</MenuItem>
                                )}
                                {contracts?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {data?.contractName?.contractName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                ) : (
                    <>
                        {/* <div className={`${style.darkLabel} ${style.marginTop20}`}>Time Range:</div>
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
                        </FormControl> */}
                    </>
                )}
                {/* <button className={`${style.primaryButtonStyle} ${style.marginTop20}`} onClick={()=> setShowSaveReport(true)} >Save Parameter Selection As My Report</button> */}
            </div>
            {
                showSaveReport && (
                    <SaveReport getSaveReportDialog={getSaveReportDialog} />
                )
            }
        </div >
    )
}

export default SampleReportLeftCard;
