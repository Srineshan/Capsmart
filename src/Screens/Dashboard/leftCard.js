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
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, addMonths, subYears, subDays, startOfQuarter, endOfQuarter, startOfYear, endOfYear, add, sub } from 'date-fns';
import { useParams } from 'react-router-dom';
import { Tooltip } from "@mui/material";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

import style from './index.module.scss';
import CommonMultiSelectField from '../../Components/CommonFields/CommonMultiSelectField';

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
const LeftCard = ({ getDataToUseInReport, isLoading }) => {
    const [showSaveReport, setShowSaveReport] = useState(false);
    const { reportType, myReportIdFromUrl } = useParams();
    const isMyReport = window.location.pathname.includes("/myReport");
    const myReportId = sessionStorage.getItem('myReportId')
    const [activityType, setActivityType] = useState('Outpatient Clinic Service');
    const [activityPerformed, setActivityPerformed] = useState('Half Day Clinic Session');
    const [renewalreportingTimePeriod, setRenewalreportingTimePeriod] = useState(30);
    const [noOfDays, setNoOfDays] = useState(30);
    const [trackerTabName, setTrackerTabName] = useState('medical_directive_tab');
    const [contractContinuationPolicy, setContractContinuationPolicy] = useState('ALL');
    const [contractStatus, setContractStatus] = useState('ACTIVE');
    const [podType, setPodType] = useState('Medical Staff Membership & Privileges');
    const [reportingTimePeriod, setReportingTimePeriod] = useState('Current Month');
    const [selectedSites, setSelectedSites] = useState([]);
    const [selectedSitesToSend, setSelectedSitesToSend] = useState([]);
    const [selectedContractsToSend, setSelectedContractsToSend] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedDepartmentsToSend, setSelectedDepartmentsToSend] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedGroupsToSend, setSelectedGroupsToSend] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedAuthorsToSend, setSelectedAuthorsToSend] = useState([]);
    const [sites, setSites] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [groups, setGroups] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [selectedContracts, setSelectedContracts] = useState([]);
    const [staffType, setStaffType] = useState([]);
    const [selectedStaffType, setSelectedStaffType] = useState([]);
    const [selectedStaffTypeToSend, setSelectedStaffTypeToSend] = useState([]);
    const [privilegeCategory, setPrivilegeCategory] = useState([]);
    const [selectedPrivilegeCategory, setSelectedPrivilegeCategory] = useState([]);
    const [selectedPrivilegeCategoryToSend, setSelectedPrivilegeCategoryToSend] = useState([]);
    const [selectedContractedServiceProvider, setSelectedContractedServiceProvider] = useState([]);
    const [selectedContractedServiceProviderToSend, setSelectedContractedServiceProviderToSend] = useState([]);
    const [selectedTimesheetInterval, setSelectedTimesheetInterval] = useState([]);
    const [timesheetIntervals, setTimesheetIntervals] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState('');
    const [selectedApplicationType, setSelectedApplicationType] = useState('');
    const [workflowLevel, setWorkflowLevel] = useState('All');
    const [selectedReappointmentStatus, setSelectedReappointmentStatus] = useState('');
    const [selectedApplicationSentStatus, setSelectedApplicationSentStatus] = useState('All');
    const [user, setUsers] = useState([]);
    const [from, setFrom] = useState(startOfMonth(new Date()));
    const [to, setTo] = useState(endOfMonth(new Date()));
    const [selectedCombinations, setSelectedCombinations] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState([]);
    const [selectedServiceArea, setSelectedServiceArea] = useState([]);
    // const selectedDepartmentName = departments?.find(data => data?.id === selectedDepartments)?.departmentName?.name;
    const selectedDepartmentNames = departments
        ?.filter(dep => selectedDepartments.includes(dep.id))
        ?.map(dep => dep.departmentName?.name);
    console.log("selectedDepartmentName", selectedDepartmentsToSend)

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
    let reportFilter = (sessionStorage.getItem('reportFilter') && sessionStorage.getItem('reportFilter') !== "undefined") ? JSON.parse(sessionStorage.getItem('reportFilter')) : {};
    let reportCategory = {
        activitiesOrServices: 'ACTIVITY',
        addOnActivities: 'ACTIVITY',
        timesheetProcessingSummary: 'TIMESHEET',
        listingOfTimesheetsNotPaid: 'TIMESHEET',
        staffReappointmentTracker: 'TIMESHEET',
        locumStaffRenewalStatusTracker: 'TIMESHEET',
        paymentsProcessingSummary: 'TIMESHEET',
        staffReappointmentsNotes: 'CONTRACT',
        staffReappointments: 'CONTRACT',
        contractDocumentsOnFile: 'CONTRACT',
        contractsWithABusinessEntity: 'CONTRACT',
        multiProviderContractsList: 'CONTRACT',
        currentRemitToAddressForActiveContracts: 'CONTRACT',
        nonCompliant: 'CONTRACT',
        staffbyTypes: 'CONTRACT',
        paymentProcessingStatusTracker: 'TIMESHEET',
        locumStaffbyTypes: 'CONTRACT',
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
        selectedGroups: selectedGroups,
        selectedAuthors: selectedAuthors,
        selectedDepartmentsToSend: selectedDepartmentsToSend,
        selectedGroupsToSend: selectedGroupsToSend,
        selectedAuthorsToSend: selectedAuthorsToSend,
        selectedStaffType: selectedStaffType,
        selectedStaffTypeToSend: selectedStaffTypeToSend,
        sites: sites,
        contractStatus: contractStatus,
        selectedContracts: selectedContracts,
        selectedContractsToSend: selectedContractsToSend,
        podType: podType,
        reportingTimePeriod: reportingTimePeriod,
        from: format(new Date(from), 'yyyy-MM-dd'),
        to: format(new Date(to), 'yyyy-MM-dd'),
        fromToDisplay: format(new Date(from), 'MMM dd, yyyy'),
        toToDisplay: format(new Date(to), 'MMM dd, yyyy'),
        selectedContractedServiceProvider: selectedContractedServiceProvider,
        selectedContractedServiceProviderToSend: selectedContractedServiceProviderToSend,
        initialValueSet: initialValueSet,
        selectedPrivilegeCategory: selectedPrivilegeCategory,
        selectedPrivilegeCategoryToSend: selectedPrivilegeCategoryToSend,
        selectedPosition: selectedPosition,
        selectedApplicationType: selectedApplicationType,
        selectedReappointmentStatus: selectedReappointmentStatus,
        selectedApplicationSentStatus: selectedApplicationSentStatus,
        selectedWorkflowLevel: workflowLevel,
        noOfDays: noOfDays,
        tab: trackerTabName
    };

    useEffect(() => {
        setUserId(userDetail?.id);
        setUserDetails();
        getActivityLogger();
        getStaffType();
        getStaffList();
        getGroupList();
        getPrivilegeCategory();
        // getContractAndUserList();
        if (reportType === 'paymentProcessingStatusTracker') {
            getTimesheetIntervals()
        }
    }, [])

    console.log('Selected Application Status:', selectedApplicationSentStatus);

    console.log("selectedStaffTypeToSend", selectedDepartments, selectedStaffType, selectedDepartmentsToSend, selectedStaffTypeToSend)

    useEffect(() => {
        const controller = new AbortController(); // Create an AbortController instance
        const signal = controller.signal;
        getPrivilegeCategory(signal);
        return () => controller.abort();
        console.log(selectedStaffType, 'selectedStaffType')
    }, [selectedStaffType])

    const transformedOptions = departments?.flatMap((department) => {
        const departmentEntry = {
            value: department?.id,
            label: department?.departmentName?.name,
            type: 'department'
        };

        const serviceAreaEntries = department.serviceAreas?.map((serviceArea) => ({
            value: `${department.id}|${serviceArea.id}`,
            label: (
                <span className={style.marginLeft20}>
                    {serviceArea?.name}
                </span>
            ),
            type: 'serviceArea'
        })) || [];

        return [departmentEntry, ...serviceAreaEntries]; // Include department first, then service areas
    }) || [];

    const handleChangeDept = (e) => {
        console.log(e.target.value)
        const selectedValues = Array.from(e.target.value);
        setSelectedCombinations(selectedValues);

        const departments = [];
        const serviceAreas = [];

        selectedValues.forEach(value => {
            const [departmentId, serviceAreaId] = value.split("|");
            if (departmentId) departments.push(departmentId);
            if (serviceAreaId) serviceAreas.push(serviceAreaId);
        });

        console.log("Selected Departments:", departments);
        console.log("Selected Service Areas:", serviceAreas);
        console.log(selectedValues)
    };


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

    console.log("222222222222222222222222222222", departments)

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

    const getStaffType = async () => {
        const { data: applicant } = await GET(
            `entity-service/applicantType`
        );
        const filteredApplicant = applicant.filter(item => item.id !== "66dc4517788741fedc982f05");
        setStaffType(filteredApplicant)
    }

    const getStaffList = async () => {
        const response = await GET(
            `user-management-service/user/allStaffs?status=ACTIVE&roles=${"Author / Owner"}`
        );
        console.log(response.data);
        setAuthors(response?.data || [])
    }

    const getGroupList = async () => {
        const response = await GET(
            `medical-directive-service/medicalDirectiveGroup`
        );
        console.log(response.data);
        setGroups(response?.data)
    }

    const getPrivilegeCategory = async (signal) => {
        let url = `entity-service/privilege`

        if (selectedStaffType?.[0] !== '') {
            url += `?applicantTypeIds=${selectedStaffType?.[0] === '' ? [] : selectedStaffType}`
        }

        const { data: privilege } = await GET(url, { signal });
        console.log(privilege, 'selectedStaffType')
        setPrivilegeCategory(privilege);
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
            const encodedArray = reportFilter?.intervals?.map(encodeHashToPercent23);
            console.log(encodedArray, 'encodedArray', reportFilter?.intervals)
            if (reportFilter?.startDate)
                setFrom(new Date(reportFilter?.startDate));
            if (reportFilter?.endDate)
                setTo(new Date(reportFilter?.endDate));
            // setSelectedSites(reportFilter?.sites);
            setSelectedDepartments(reportFilter?.departmentSpecialties ? reportFilter?.departmentSpecialties?.map(data => data?.split('#')?.length > 1 ? data?.split('#')?.[1] : data) : []);
            setSelectedGroups(reportFilter?.groupIds ? reportFilter?.groupIds : []);
            setSelectedAuthors(reportFilter?.authorIds ? reportFilter?.authorIds : []);
            setWorkflowLevel(reportFilter?.currentLevel ? reportFilter?.currentLevel : 'All')
            setSelectedStaffType(reportFilter?.applicantTypeId ? reportFilter?.applicantTypeId : [])
            setSelectedPrivilegeCategory(reportFilter?.privilegingCategoryId ? reportFilter?.privilegingCategoryId : [])
            setSelectedPosition(reportFilter?.positionType ? reportFilter?.positionType?.[0] : '')
            setSelectedApplicationType(reportFilter?.applicationCreationType ? reportFilter?.applicationCreationType?.[0] : '')
        }
    }, [currentUserDetails, myReportId])

    useEffect(() => {
        console.log(reportFilter, 'reportFilter')
        if (Object.keys(reportFilter).length !== 0) {
            console.log(reportFilter, 'reportFilter')
            let sitesToShow = [];
            let departmentsToShow = [];
            let groupsToShow = [];
            let authorsToShow = [];
            let staffsToShow = [];
            let privilegeCategoryToShow = [];
            departments?.map(data => {
                if (reportFilter?.departmentSpecialties?.includes(data?.id)) {
                    departmentsToShow.push(data?.id?.split('#')?.length > 1 ? data?.id?.split('#')?.[1] : data?.id)
                }
            })
            setSelectedDepartmentsToSend(departmentsToShow)
            groups?.map(data => {
                if (reportFilter?.groupIds?.includes(data?.id)) {
                    groupsToShow.push(data)
                }
            })
            setSelectedGroupsToSend(groupsToShow)
            authors?.map(data => {
                if (reportFilter?.authorIds?.includes(data?.id)) {
                    authorsToShow.push(data)
                }
            })
            setSelectedAuthorsToSend(authorsToShow)
            staffType?.map(data => {
                if (reportFilter?.applicantTypeId?.includes(data?.id)) {
                    staffsToShow.push(data)
                }
            })
            setSelectedStaffTypeToSend(staffsToShow)
            privilegeCategory?.map(data => {
                if (reportFilter?.privilegingCategoryId?.includes(data?.id)) {
                    privilegeCategoryToShow.push(data)
                }
            })
            setSelectedPrivilegeCategoryToSend(privilegeCategoryToShow)
            console.log(sitesToShow, departmentsToShow, privilegeCategory, staffType, sites, departments, contracts, contractedServiceProviders)
        }
    }, [sites, departments, privilegeCategory, staffType])

    console.log(isMyReport)

    useEffect(() => {
        getDataToUseInReport(dataToUseInReport);
    }, [renewalreportingTimePeriod, selectedSites, selectedDepartments, selectedPrivilegeCategory, selectedStaffType,
        podType, contractStatus, reportingTimePeriod, selectedApplicationType, selectedReappointmentStatus,
        selectedPosition, from, to, initialValueSet, selectedTimesheetInterval, selectedApplicationSentStatus, workflowLevel, selectedAuthors, selectedGroups, noOfDays, trackerTabName]);

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
            setSelectedDepartments(selectedDepartments?.filter(value => value !== defaultOption))
        }

        if (selectedGroups?.length === 0) {
            if (groups?.length !== 1) {
                setSelectedGroups([defaultOption]);
            }
        } else if (selectedGroups?.length >= 2 && selectedGroups.includes(defaultOption)) {
            setSelectedGroups(selectedGroups?.filter(value => value !== defaultOption))
        }

        if (selectedAuthors?.length === 0) {
            if (authors?.length !== 1) {
                setSelectedAuthors([defaultOption]);
            }
        } else if (selectedAuthors?.length >= 2 && selectedAuthors.includes(defaultOption)) {
            setSelectedAuthors(selectedAuthors?.filter(value => value !== defaultOption))
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

        if (selectedStaffType?.length === 0) {
            if (staffType?.length !== 1) {
                setSelectedStaffType([defaultOption]);
            }
        } else if (selectedStaffType?.length >= 2 && selectedStaffType.includes(defaultOption)) {
            setSelectedStaffType(selectedStaffType.filter(value => value !== defaultOption))
        }

        if (selectedPrivilegeCategory?.length === 0) {
            if (privilegeCategory?.length !== 1) {
                setSelectedPrivilegeCategory([defaultOption]);
            }
        } else if (selectedPrivilegeCategory?.length >= 2 && selectedPrivilegeCategory.includes(defaultOption)) {
            setSelectedPrivilegeCategory(selectedPrivilegeCategory.filter(value => value !== defaultOption))
        }
        const timer = setTimeout(() => {
            setInitialValueSet(true);
        }, 2000);
        return () => clearTimeout(timer);

    }, [defaultOption, selectedSites, selectedDepartments, selectedContractedServiceProvider, selectedContracts, selectedStaffType, selectedPrivilegeCategory, selectedGroups, selectedAuthors]);

    useEffect(() => {
        if (myReportIdFromUrl)
            getMyReportDetails();
    }, [myReportIdFromUrl])

    const getMyReportDetails = async () => {
        const { data: report } = await GET(`application-management-service/report/myReport/${myReportIdFromUrl}`);
        sessionStorage.setItem('reportFilter', JSON.stringify(report?.report?.filters));
        sessionStorage.setItem('myReportContent', JSON.stringify(report?.report));
        sessionStorage.setItem('myReportId', myReportIdFromUrl);
    }

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

    const handleChangeGroups = (event) => {
        const {
            target: { value },
        } = event;
        console.log(value[value?.length - 1], value)
        if (value?.length >= 2 && value[value?.length - 1] === defaultOption) {
            setSelectedGroups([defaultOption]);
            setSelectedGroupsToSend([]);
        } else {
            setSelectedGroups(
                typeof value === 'string' ? value.split(',') : value
            );
            setSelectedGroupsToSend(
                typeof value === 'string' ? groups?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : groups?.filter(data => value?.includes(data?.id))?.map(data => data),
            );
        }
        setSelectedContracts([defaultOption]);
        setSelectedContractsToSend([]);
        setSelectedContractedServiceProvider([defaultOption]);
        setSelectedContractedServiceProviderToSend([]);
    };

    const handleChangeAuthors = (event) => {
        const {
            target: { value },
        } = event;
        console.log(value[value?.length - 1], value)
        if (value?.length >= 2 && value[value?.length - 1] === defaultOption) {
            setSelectedAuthors([defaultOption]);
            setSelectedAuthorsToSend([]);
        } else {
            setSelectedAuthors(
                typeof value === 'string' ? value.split(',') : value
            );
            setSelectedAuthorsToSend(
                typeof value === 'string' ? authors?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : authors?.filter(data => value?.includes(data?.id))?.map(data => data),
            );
        }
        setSelectedContracts([defaultOption]);
        setSelectedContractsToSend([]);
        setSelectedContractedServiceProvider([defaultOption]);
        setSelectedContractedServiceProviderToSend([]);
    };

    const handleChangeStaffType = (event) => {
        const {
            target: { value },
        } = event;
        console.log(value[value?.length - 1], value)
        if (value?.length >= 2 && value[value?.length - 1] === defaultOption) {
            setSelectedStaffType([defaultOption]);
            setSelectedStaffTypeToSend([]);
        } else {
            setSelectedStaffType(
                typeof value === 'string' ? value.split(',') : value
            );
            setSelectedStaffTypeToSend(
                typeof value === 'string' ? staffType?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : staffType?.filter(data => value?.includes(data?.id))?.map(data => data),
            );
        }
        setSelectedPrivilegeCategory([defaultOption]);
        setSelectedPrivilegeCategoryToSend([]);
    }

    // const handleChangePrivilegeCategory = (event) => {
    //     const {
    //         target: { value },
    //     } = event;
    //     console.log(value[value?.length - 1], value)
    //     if (value?.length >= 2 && value[value?.length - 1] === defaultOption) {
    //         setSelectedPrivilegeCategory([defaultOption]);
    //         setSelectedPrivilegeCategoryToSend([]);
    //     } else {
    //         setSelectedPrivilegeCategory(
    //             typeof value === 'string' ? value.split(',') : value
    //         );
    //         setSelectedPrivilegeCategoryToSend(
    //             typeof value === 'string' ? privilegeCategory?.filter(data => value.split(',')?.includes(data?.id))?.map(data => data) : privilegeCategory?.filter(data => value?.includes(data?.id))?.map(data => data),
    //         );
    //     }
    // }

    const handleChangePrivilegeCategory = (event) => {
        const {
            target: { value },
        } = event;

        const selected = typeof value === 'string' ? value.split(',') : value;
        const previous = selectedPrivilegeCategory;

        // Handle "All Categories"
        if (selected.length >= 2 && selected[selected.length - 1] === defaultOption) {
            setSelectedPrivilegeCategory([defaultOption]);
            setSelectedPrivilegeCategoryToSend([]);
            return;
        }

        // Identify the item that was added or removed
        const difference = selected.length > previous.length
            ? selected.find((id) => !previous.includes(id))
            : previous.find((id) => !selected.includes(id));

        const changedItem = privilegeCategory.find((item) => item.id === difference);
        const categoryName = changedItem?.category;

        if (!categoryName) return;

        // All IDs in this category
        const matchingIds = privilegeCategory
            .filter((item) => item.category === categoryName)
            .map((item) => item.id);

        let updatedSelected;

        if (selected.length > previous.length) {
            // ➕ User added one → select the entire group
            updatedSelected = Array.from(new Set([...previous, ...matchingIds]));
        } else {
            // ➖ User removed one → remove the entire group
            updatedSelected = previous.filter((id) => !matchingIds.includes(id));
        }

        setSelectedPrivilegeCategory(updatedSelected);

        const selectedData = privilegeCategory.filter((item) =>
            updatedSelected.includes(item.id)
        );
        setSelectedPrivilegeCategoryToSend(selectedData);
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

    console.log(selectedPosition, 'selectedPosition', selectedPosition === "")

    return (
        <div>
            <div className={`${style.leftCard} ${style.leftCardDisplay} ${style.marginTop20} ${style.bigCalendarLeftCardWidth}`}>

                <>
                    <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                        <InputLabel id="demo-multiple-name-label1" className={style.headingtextStyle}>Reporting Time Period</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label1"
                            id="demo-multiple-name1"
                            MenuProps={MenuProps}
                            value={reportingTimePeriod}
                            onChange={(e) => { setReportingTimePeriod(e.target.value) }}
                            disabled={isLoading}
                            className={`${style.textAlignLeft} ${style.Font}`}
                        >
                            <MenuItem value={'Current Week'} disabled={isLoading}>Current Week</MenuItem>
                            <MenuItem value={'Last Week'} disabled={isLoading}>Last Week</MenuItem>
                            <MenuItem value={'Current Month'} disabled={isLoading}>Current Month</MenuItem>
                            <MenuItem value={'Last Month'} disabled={isLoading}>Last Month</MenuItem>
                            <MenuItem value={'Current Qtr'} disabled={isLoading}>Current Quarter</MenuItem>
                            <MenuItem value={'Last Qtr'} disabled={isLoading}>Last Quarter</MenuItem>
                            <MenuItem value={'Current Year'} disabled={isLoading}>Current Year</MenuItem>
                            <MenuItem value={'Last Year'} disabled={isLoading}>Last Year</MenuItem>
                            <MenuItem value={'Custom'} disabled={isLoading}>Custom</MenuItem>
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
                    <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                        <InputLabel id="demo-multiple-name-label2" className={style.headingtextStyle}>Departments</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label2"
                            id="demo-multiple-name2"
                            multiple
                            value={selectedDepartments}
                            onChange={handleChangeDepartments}
                            MenuProps={MenuProps}
                            disabled={isLoading}
                            className={style.textAlignLeft}
                            renderValue={(selected) => {
                                if (selected?.length === 1) {
                                    const dept = departments?.find(dep => dep?.id === selected[0]);
                                    console.log("")
                                    return dept?.departmentName?.name || 'All';
                                } else if (selected.length > 1) {
                                    return `${selected.length} Selected`;
                                } else {
                                    return '';
                                }
                            }}
                        >
                            {departments?.length >= 2 && (
                                <MenuItem value={defaultOption} disabled={isLoading}>All</MenuItem>
                            )}
                            {departments?.map((data) => (
                                <MenuItem
                                    key={data?.id}
                                    value={data?.id}
                                    disabled={isLoading}
                                >
                                    {data?.departmentName?.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedDepartments?.filter(Boolean).length > 0 && (
                        <div className={`${style.grid2Gap} ${style.marginLeft5}`}>
                            {selectedDepartments.map((id) => {
                                const dept = departments?.find(dep => dep?.id === id);
                                return (
                                    <div key={id} className={`${style.spaceBetween} ${style.marginRight5} ${style.filterBackground}`}>
                                        <div className={`${style.filtertextStyle}`}>{dept?.departmentName?.name}</div>
                                        <Tooltip title="Remove Filter" arrow>
                                            <CancelOutlinedIcon
                                                sx={{
                                                    fontSize: 15,
                                                    color: "#06617A",
                                                    marginLeft: "5px",
                                                }}
                                                className={style.cursorPointer}
                                                onClick={() => {
                                                    const updatedDepartments = selectedDepartments.filter(depId => depId !== id);
                                                    setSelectedDepartments(updatedDepartments);

                                                    const updatedDepartmentsToSend = departments
                                                        ?.filter(data => updatedDepartments.includes(data?.id))
                                                        ?.map(data => data);

                                                    setSelectedDepartmentsToSend(updatedDepartmentsToSend);
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                        <InputLabel id="demo-multiple-name-label2" className={style.headingtextStyle}>Staff Type</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label2"
                            id="demo-multiple-name2"
                            multiple
                            value={selectedStaffType}
                            onChange={handleChangeStaffType}
                            MenuProps={MenuProps}
                            disabled={isLoading}
                            className={style.textAlignLeft}
                        >
                            {staffType?.length >= 2 && (
                                <MenuItem value={defaultOption} disabled={isLoading}>All</MenuItem>
                            )}
                            {staffType?.map((data) => (
                                <MenuItem
                                    key={data?.id}
                                    value={data?.id}
                                    disabled={isLoading}
                                >
                                    {data?.applicantType}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedStaffType?.filter(Boolean).length > 0 && (
                        <div className={`${style.grid2Gap} ${style.marginLeft5}`}>
                            {selectedStaffType.map((id) => {
                                const dept = staffType?.find(dep => dep?.id === id);
                                return (
                                    <div key={id} className={`${style.spaceBetween} ${style.marginRight5} ${style.filterBackground}`}>
                                        <div className={`${style.filtertextStyle}`}>{dept?.applicantType}</div>
                                        <Tooltip title="Remove Filter" arrow>
                                            <CancelOutlinedIcon
                                                sx={{
                                                    fontSize: 15,
                                                    color: "#06617A",
                                                    marginLeft: "5px",
                                                }}
                                                className={style.cursorPointer}
                                                onClick={() => {
                                                    const updatedDepartments = selectedStaffType.filter(depId => depId !== id);
                                                    setSelectedStaffType(updatedDepartments);

                                                    const updatedDepartmentsToSend = staffType
                                                        ?.filter(data => updatedDepartments.includes(data?.id))
                                                        ?.map(data => data);

                                                    setSelectedStaffTypeToSend(updatedDepartmentsToSend);
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                    <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                        <InputLabel id="demo-multiple-name-label2" className={style.headingtextStyle}>Privilege Category</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label2"
                            id="demo-multiple-name2"
                            multiple
                            value={selectedPrivilegeCategory}
                            onChange={handleChangePrivilegeCategory}
                            MenuProps={MenuProps}
                            disabled={isLoading}
                            className={style.textAlignLeft}
                        >
                            {privilegeCategory?.length >= 2 && (
                                <MenuItem value={defaultOption} disabled={isLoading}>All Categories</MenuItem>
                            )}
                            {privilegeCategory?.map((data) => (
                                <MenuItem
                                    key={data?.id}
                                    value={data?.id}
                                    disabled={isLoading}
                                >
                                    {data?.category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {selectedPrivilegeCategory?.filter(Boolean).length > 0 && (
                        <div className={`${style.grid2Gap} ${style.marginLeft5}`}>
                            {selectedPrivilegeCategory.map((id) => {
                                const dept = privilegeCategory?.find(dep => dep?.id === id);
                                return (
                                    <div key={id} className={`${style.spaceBetween} ${style.marginRight5} ${style.filterBackground}`}>
                                        <div className={`${style.filtertextStyle}`}>{dept?.category}</div>
                                        <Tooltip title="Remove Filter" arrow>
                                            <CancelOutlinedIcon
                                                sx={{
                                                    fontSize: 15,
                                                    color: "#06617A",
                                                    marginLeft: "5px",
                                                }}
                                                className={style.cursorPointer}
                                                onClick={() => {
                                                    const privilege = privilegeCategory.find(privilege => privilege?.id === id);
                                                    const categoryName = privilege?.category;

                                                    if (!categoryName) return;

                                                    const matchingIds = privilegeCategory
                                                        .filter(item => item.category === categoryName)
                                                        .map(item => item.id);

                                                    const updatedSelected = selectedPrivilegeCategory.filter(
                                                        (id) => !matchingIds.includes(id)
                                                    );
                                                    setSelectedPrivilegeCategory(updatedSelected);

                                                    const updatedData = privilegeCategory.filter((item) =>
                                                        updatedSelected.includes(item.id)
                                                    );
                                                    setSelectedPrivilegeCategoryToSend(updatedData);
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </>
            </div>

        </div >
    )
}

export default LeftCard;
