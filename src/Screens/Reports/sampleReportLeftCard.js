import React, { useEffect, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import Select from '@mui/material/Select';
import { GET, POST } from './../dataSaver';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, addMonths, subYears, subDays, startOfQuarter, endOfQuarter, startOfYear, endOfYear, add, sub, addQuarters, addDays, addWeeks } from 'date-fns';
import SaveReport from './saveReport';
import { useParams } from 'react-router-dom';
import { Tooltip } from "@mui/material";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';

import style from './index.module.scss';
import CommonMultiSelectField from '../../Components/CommonFields/CommonMultiSelectField';
import CommonSearchField from '../../Components/CommonFields/CommonSearchField';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            overflowY: 'auto', // ✅ enables scrolling
            // Optional for better look:
            scrollbarWidth: 'thin',
            overscrollBehavior: 'contain',
        },
    },
};
const SampleReportLeftCard = ({ getDataToUseInReport, isLoading }) => {
    const [showSaveReport, setShowSaveReport] = useState(false);
    const { reportType, scheduleId } = useParams();
    const isMyReport = window.location.pathname.includes("/myReport");
    const isScheduledReport = window.location.pathname.includes("/scheduledReport");
    const myReportId = sessionStorage.getItem('myReportId')
    const [activityType, setActivityType] = useState('Outpatient Clinic Service');
    const [activityPerformed, setActivityPerformed] = useState('Half Day Clinic Session');
    const [renewalreportingTimePeriod, setRenewalreportingTimePeriod] = useState(30);
    const [noOfDays, setNoOfDays] = useState(30);
    const [trackerTabName, setTrackerTabName] = useState(reportType === "medicalDirectivesTracker" ? 'medical_directive_tab' : 'policy_and_procedure_tab');
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
    const [selectedPosition, setSelectedPosition] = useState('PERMANENT');
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
    const [searchTerm, setSearchTerm] = useState('');
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
        tab: trackerTabName,
        search: searchTerm
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
        const response = await POST(
            `user-management-service/user/allStaffs?status=ACTIVE&roles=${"Author / Owner"}`, {}
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
            console.log(encodedArray, 'encodedArray', reportFilter, reportFilter?.tab)
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
            setTrackerTabName(reportFilter?.tab || '')
        }
    }, [currentUserDetails, myReportId, scheduleId, isScheduledReport])

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
        selectedPosition, from, to, initialValueSet, selectedTimesheetInterval, selectedApplicationSentStatus, workflowLevel, selectedAuthors, selectedGroups, noOfDays, trackerTabName, searchTerm]);

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
        } else if (reportingTimePeriod === 'Next Week') {
            setFrom(addDays(startOfWeek(new Date()), 7));
            setTo(addWeeks(endOfWeek(new Date()), 1));
        } else if (reportingTimePeriod === 'Current Month') {
            setFrom(startOfMonth(new Date()));
            setTo(endOfMonth(new Date()));
        } else if (reportingTimePeriod === 'Last Month') {
            setFrom(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));
            setTo(subDays(startOfMonth(new Date()), 1));
        } else if (reportingTimePeriod === 'Next Month') {
            setFrom(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1));
            setTo(addMonths(endOfMonth(new Date()), 1));
        } else if (reportingTimePeriod === 'Current Qtr') {
            setFrom(startOfQuarter(new Date()));
            setTo(endOfQuarter(new Date()));
        } else if (reportingTimePeriod === 'Last Qtr') {
            setFrom(new Date(new Date().getFullYear(), quarter * 3 - 3, 1));
            setTo(subDays(startOfQuarter(new Date()), 1));
        } else if (reportingTimePeriod === 'Next Qtr') {
            setFrom(addQuarters(startOfQuarter(new Date()), 1));
            setTo(endOfQuarter(addQuarters(startOfQuarter(new Date()), 1)));
        } else if (reportingTimePeriod === 'Current Year') {
            setFrom(startOfYear(new Date()));
            setTo(endOfYear(new Date()));
        } else if (reportingTimePeriod === 'Last Year') {
            setFrom(new Date(new Date(lastyear.getFullYear(), 0, 1)));
            setTo(subDays(startOfYear(new Date()), 1));
        } else if (reportingTimePeriod === 'Next Year') {
            const nextYear = new Date().getFullYear() + 1;
            setFrom(new Date(nextYear, 0, 1));
            setTo(new Date(nextYear, 11, 31));
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

    // useEffect(() => {
    //     if (myReportIdFromUrl)
    //         getMyReportDetails();
    // }, [myReportIdFromUrl])

    // const getMyReportDetails = async () => {
    //     const { data: report } = await GET(`application-management-service/report/myReport/${myReportIdFromUrl}`);
    //     sessionStorage.setItem('reportFilter', JSON.stringify(report?.report?.filters));
    //     sessionStorage.setItem('myReportContent', JSON.stringify(report?.report));
    //     sessionStorage.setItem('myReportId', myReportIdFromUrl);
    // }

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
        // setSelectedContracts([defaultOption]);
        // setSelectedContractsToSend([]);
        // setSelectedContractedServiceProvider([defaultOption]);
        // setSelectedContractedServiceProviderToSend([]);
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
                <Tooltip title="Save This Parameter Selection As My Report" arrow>
                    <div className={`${style.reporttypeLeftBackGround}`}>
                        <div className={`${style.reportLeftTextStyle} ${style.cursorPointer}`} onClick={() => setShowSaveReport(true)}>{!isMyReport ? 'Save Parameter Selection' : "Update Parameter Selection"}</div>
                    </div>
                </Tooltip>
                <div className={style.marginTop20}>
                    {(!isMyReport && !isScheduledReport) && (
                        <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={(e) => setSearchTerm(e.target.value)} searchData={[]} handleShowForSearch={() => { }} isOnClickAvailable={false} placeholder={'Search'} />
                    )}
                </div>
                {(reportType === "staffReappointmentsNotes" || reportType === "staffReappointments" || reportType === "locumRenewalOrExtensionApplicationsSummary" || reportType === "privilegedStaffSummary" ||
                    reportType === "submittedApplicationsReviewSummary" || reportType === "staffReappointmentTracker" || reportType === "ohipBillingNumbersByCareProvider" || reportType === "careProviderCareerMilestoneSummary" ||
                    reportType === "declinedOrNotRenewedStaffSummary" || reportType === "reappointmentApplicationNotStarted" || reportType === "currentNotesSummary" || reportType === "staffReappointmentStatusSummary" || reportType === "staffbyTypes" || reportType === "locumStaffbyTypes" || reportType === "locumStaffRenewalStatusTracker" || reportType === "privilegedStaffSummary" || reportType === "careProvidersSummary"
                    || reportType === "workflow" || reportType === "currentMedicalDirectives" || reportType === "retiredMedicalDirectives" || reportType === "upcomingForReview" || reportType === "medicalDirectivesTracker" || reportType === "expiredDocumentsSummaryForStaff" || reportType === "documentsExpirationSummaryForStaff" || reportType === "appointmentHistorySummary" || reportType === "inactiveStaffSummary"
                    || reportType === "currentPolicyAndProcedures" || reportType === "retiredPolicyAndProcedures" || reportType === "policyAndProceduresWorkflow" || reportType === "policyAndProceduresUpcomingForReview" || reportType === "policyAndProceduresTracker"
                    || reportType === "newStaffAppointmentsSummary" || reportType === "inactiveStaffSummaryByMonth" || reportType === "staffUploadedDocumentsSummary" || reportType === "locumTermExpirationSummary" || reportType === "renewedLocumStaff") ? (
                    <>
                        {reportType !== "staffReappointmentTracker" && reportType !== "ohipBillingNumbersByCareProvider" && reportType !== "privilegedStaffSummary" && reportType !== "locumStaffbyTypes" && reportType !== "currentNotesSummary" && reportType !== "staffbyTypes" && reportType !== "locumStaffRenewalStatusTracker" && reportType !== 'staffReappointmentStatusSummary' && reportType !== "workflow" && reportType !== "currentMedicalDirectives" && reportType !== "retiredMedicalDirectives" && reportType !== "upcomingForReview" && reportType !== "medicalDirectivesTracker" && reportType !== "reappointmentApplicationNotStarted" && reportType !== "locumRenewalOrExtensionApplicationsSummary" && reportType !== "declinedOrNotRenewedStaffSummary"
                            && reportType !== "currentPolicyAndProcedures" && reportType !== "retiredPolicyAndProcedures" && reportType !== "policyAndProceduresWorkflow" && reportType !== "policyAndProceduresUpcomingForReview" && reportType !== "policyAndProceduresTracker" && reportType !== "appointmentHistorySummary" && (
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
                                        {reportType === "careProviderCareerMilestoneSummary" ? (
                                            <MenuItem value={'Next Week'} disabled={isLoading}>Next Week</MenuItem>
                                        ) : (
                                            <MenuItem value={'Last Week'} disabled={isLoading}>Last Week</MenuItem>
                                        )}
                                        <MenuItem value={'Current Month'} disabled={isLoading}>Current Month</MenuItem>
                                        {reportType === "careProviderCareerMilestoneSummary" ? (
                                            <MenuItem value={'Next Month'} disabled={isLoading}>Next Month</MenuItem>
                                        ) : (
                                            <MenuItem value={'Last Month'} disabled={isLoading}>Last Month</MenuItem>
                                        )}
                                        <MenuItem value={'Current Qtr'} disabled={isLoading}>Current Quarter</MenuItem>
                                        {reportType === "careProviderCareerMilestoneSummary" ? (
                                            <MenuItem value={'Next Qtr'} disabled={isLoading}>Next Quarter</MenuItem>
                                        ) : (
                                            <MenuItem value={'Last Qtr'} disabled={isLoading}>Last Quarter</MenuItem>
                                        )}
                                        <MenuItem value={'Current Year'} disabled={isLoading}>Current Year</MenuItem>
                                        {reportType === "careProviderCareerMilestoneSummary" ? (
                                            <MenuItem value={'Next Year'} disabled={isLoading}>Next Year</MenuItem>
                                        ) : (
                                            <MenuItem value={'Last Year'} disabled={isLoading}>Last Year</MenuItem>
                                        )}
                                        <MenuItem value={'Custom'} disabled={isLoading}>Custom</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
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
                        {(reportType !== "medicalDirectivesTracker" && reportType !== "policyAndProceduresTracker") && (
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
                        )
                        }
                        {
                            selectedDepartments?.filter(Boolean).length > 0 && (
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
                            )
                        }
                        {
                            reportType !== "currentMedicalDirectives" && reportType !== "currentPolicyAndProcedures" && (reportType === "workflow" || reportType === "retiredMedicalDirectives" || reportType === "upcomingForReview" || reportType === "retiredPolicyAndProcedures" || reportType === "policyAndProceduresWorkflow" || reportType === "policyAndProceduresUpcomingForReview") && (
                                <>
                                    <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                        <InputLabel id="demo-multiple-name-label2" className={style.headingtextStyle}>Groups</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label2"
                                            id="demo-multiple-name2"
                                            multiple
                                            value={selectedGroups}
                                            onChange={handleChangeGroups}
                                            MenuProps={MenuProps}
                                            disabled={isLoading}
                                            className={style.textAlignLeft}
                                            renderValue={(selected) => {
                                                if (selected?.length === 1) {
                                                    const group = groups?.find(grp => grp?.id === selected[0]);
                                                    console.log("")
                                                    return group?.name || 'All';
                                                } else if (selected.length > 1) {
                                                    return `${selected.length} Selected`;
                                                } else {
                                                    return '';
                                                }
                                            }}
                                        >
                                            {groups?.length >= 2 && (
                                                <MenuItem value={defaultOption} disabled={isLoading}>All</MenuItem>
                                            )}
                                            {groups?.map((data) => (
                                                <MenuItem
                                                    key={data?.id}
                                                    value={data?.id}
                                                    disabled={isLoading}
                                                >
                                                    {data?.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {selectedGroups?.filter(Boolean).length > 0 && (
                                        <div className={`${style.grid2Gap} ${style.marginLeft5}`}>
                                            {selectedGroups.map((id) => {
                                                const group = groups?.find(grp => grp?.id === id);
                                                return (
                                                    <div key={id} className={`${style.spaceBetween} ${style.marginRight5} ${style.filterBackground}`}>
                                                        <div className={`${style.filtertextStyle}`}>{group?.name}</div>
                                                        <Tooltip title="Remove Filter" arrow>
                                                            <CancelOutlinedIcon
                                                                sx={{
                                                                    fontSize: 15,
                                                                    color: "#06617A",
                                                                    marginLeft: "5px",
                                                                }}
                                                                className={style.cursorPointer}
                                                                onClick={() => {
                                                                    const updatedGroups = selectedGroups?.filter(grpId => grpId !== id);
                                                                    setSelectedGroups(updatedGroups);

                                                                    const updatedGroupsToSend = groups
                                                                        ?.filter(data => updatedGroups?.includes(data?.id))
                                                                        ?.map(data => data);

                                                                    setSelectedGroupsToSend(updatedGroupsToSend);
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                    <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                        <InputLabel id="demo-multiple-name-label2" className={style.headingtextStyle}>Author / Owner</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label2"
                                            id="demo-multiple-name2"
                                            multiple
                                            value={selectedAuthors}
                                            onChange={handleChangeAuthors}
                                            MenuProps={MenuProps}
                                            disabled={isLoading}
                                            className={style.textAlignLeft}
                                            renderValue={(selected) => {
                                                if (selected?.length === 1) {
                                                    const author = authors?.find(auth => auth?.id === selected[0]);
                                                    console.log("")
                                                    return author?.name?.firstName ? `${author?.name?.firstName} ${author?.name?.lastName}` : 'All';
                                                } else if (selected.length > 1) {
                                                    return `${selected.length} Selected`;
                                                } else {
                                                    return '';
                                                }
                                            }}
                                        >
                                            {authors?.length >= 2 && (
                                                <MenuItem value={defaultOption} disabled={isLoading}>All</MenuItem>
                                            )}
                                            {authors?.map((data) => (
                                                <MenuItem
                                                    key={data?.id}
                                                    value={data?.id}
                                                    disabled={isLoading}
                                                >
                                                    {`${data?.name?.firstName} ${data?.name?.lastName}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {selectedAuthors?.filter(Boolean).length > 0 && (
                                        <div className={`${style.grid2Gap} ${style.marginLeft5}`}>
                                            {selectedAuthors?.map((id) => {
                                                const author = authors?.find(auth => auth?.id === id);
                                                return (
                                                    <div key={id} className={`${style.spaceBetween} ${style.marginRight5} ${style.filterBackground}`}>
                                                        <div className={`${style.filtertextStyle}`}>{`${author?.name?.firstName} ${author?.name?.lastName}`}</div>
                                                        <Tooltip title="Remove Filter" arrow>
                                                            <CancelOutlinedIcon
                                                                sx={{
                                                                    fontSize: 15,
                                                                    color: "#06617A",
                                                                    marginLeft: "5px",
                                                                }}
                                                                className={style.cursorPointer}
                                                                onClick={() => {
                                                                    const updatedAuthors = selectedAuthors?.filter(authId => authId !== id);
                                                                    setSelectedAuthors(updatedAuthors);

                                                                    const updatedAuthorsToSend = authors
                                                                        ?.filter(data => updatedAuthors?.includes(data?.id))
                                                                        ?.map(data => data);

                                                                    setSelectedAuthorsToSend(updatedAuthorsToSend);
                                                                }}
                                                            />
                                                        </Tooltip>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
                            )
                        }
                        {/* <div>
                            <InputLabel id="demo-multiple-name-label2" className={style.headingtextStyle}>Departments</InputLabel>
                            <CommonMultiSelectField
                                value={selectedCombinations}
                                onChange={handleChangeDept}
                                className={style.fullWidth}
                                widthValue='250px'
                                variant="standard"
                                // firstOptionLabel={'All'}
                                // firstOptionValue={''}
                                valueList={transformedOptions?.map(option => option?.value)}
                                labelList={transformedOptions?.map(option => option?.label)}
                                disabledList={transformedOptions?.map(() => false)}
                                renderValue={(selected) =>
                                    selected
                                        ?.map(val => {
                                            const option = transformedOptions?.find(o => o.value === val);
                                            if (option?.type === 'department') {
                                                return option.label;
                                            } else if (option?.type === 'serviceArea') {
                                                const serviceAreaId = val.split('|')[1];
                                                const department = departments?.find(dept =>
                                                    dept.serviceAreas?.some(sa => sa.id === serviceAreaId)
                                                );
                                                const serviceArea = department?.serviceAreas?.find(sa => sa.id === serviceAreaId);
                                                return serviceArea?.name || '';
                                            }
                                            return '';
                                        })
                                        .join(', ')
                                }
                                required={true}
                                label={'Department / Division'}
                            />
                        </div> */}
                        {/* <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
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
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isLoading}
                                    >
                                        {data?.departmentName?.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}
                        {reportType !== 'workflow' && reportType !== "currentMedicalDirectives" && reportType !== "retiredMedicalDirectives" && reportType !== "upcomingForReview" && reportType !== "medicalDirectivesTracker" && reportType !== "currentPolicyAndProcedures" && reportType !== "retiredPolicyAndProcedures" && reportType !== 'policyAndProceduresWorkflow' && reportType !== "policyAndProceduresUpcomingForReview" && reportType !== "policyAndProceduresTracker" && (
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
                                        // <MenuItem
                                        //     key={data?.dept?.id}
                                        //     value={data?.dept?.id}
                                        // >
                                        //     {`${data?.site?.siteName?.siteName} - ${data?.dept?.departmentName?.name}`}
                                        // </MenuItem>
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
                        )
                        }
                        {
                            selectedStaffType?.filter(Boolean).length > 0 && (
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
                            )
                        }
                        {reportType !== 'workflow' && reportType !== "currentMedicalDirectives" && reportType !== "retiredMedicalDirectives" && reportType !== "upcomingForReview" && reportType !== "medicalDirectivesTracker" && reportType !== "locumTermExpirationSummary" && reportType !== "renewedLocumStaff" && reportType !== "currentPolicyAndProcedures" && reportType !== "retiredPolicyAndProcedures" && reportType !== 'policyAndProceduresWorkflow' && reportType !== "policyAndProceduresUpcomingForReview" && reportType !== "policyAndProceduresTracker" && (
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
                                        // <MenuItem
                                        //     key={data?.dept?.id}
                                        //     value={data?.dept?.id}
                                        // >
                                        //     {`${data?.site?.siteName?.siteName} - ${data?.dept?.departmentName?.name}`}
                                        // </MenuItem>
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
                        )
                        }
                        {
                            selectedPrivilegeCategory?.filter(Boolean).length > 0 && (
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
                                                        //     onClick={() => {
                                                        //     const updatedPrivilegeCategory = selectedPrivilegeCategory.filter(depId => depId !== id);
                                                        //     setSelectedPrivilegeCategory(updatedPrivilegeCategory);

                                                        //     const updatedPrivilegeCategoryToSend = privilegeCategory
                                                        //         ?.filter(data => updatedPrivilegeCategory.includes(data?.id))
                                                        //         ?.map(data => data);

                                                        //     setSelectedPrivilegeCategoryToSend(updatedPrivilegeCategoryToSend);
                                                        // }}
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
                            )
                        }
                        {
                            (reportType === "upcomingForReview" || reportType === "documentsExpirationSummaryForStaff" || reportType === "policyAndProceduresUpcomingForReview") && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-simple-select-standard-label3">Review In</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label3"
                                        id="demo-simple-select-standard3"
                                        value={noOfDays}
                                        onChange={(e) => { setNoOfDays(e.target.value) }}
                                        MenuProps={MenuProps}
                                        disabled={isLoading}
                                        className={style.textAlignLeft}
                                    >
                                        <MenuItem value={'30'} disabled={isLoading}>30 Days</MenuItem>
                                        <MenuItem value={'60'} disabled={isLoading}>60 Days</MenuItem>
                                        <MenuItem value={'90'} disabled={isLoading}>90 Days</MenuItem>
                                        <MenuItem value={'120'} disabled={isLoading}>120 Days</MenuItem>
                                    </Select>
                                </FormControl>
                            )
                        }

                        {
                            (reportType === "staffbyTypes" || reportType === "locumStaffbyTypes") && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-simple-select-standard-label3">Application Sent Status</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label3"
                                        id="demo-simple-select-standard3"
                                        value={selectedApplicationSentStatus}
                                        onChange={(e) => { setSelectedApplicationSentStatus(e.target.value) }}
                                        MenuProps={MenuProps}
                                        disabled={isLoading}
                                        className={style.textAlignLeft}
                                        renderValue={(selected) => {
                                            if (selected === 'ALL') return 'All';     // Show "All" for empty
                                            if (selected === 'SENT') return 'Sent';
                                            if (selected === 'RE_SENT') return 'Reminder Sent';
                                            if (selected === 'NOT_SENT') return 'Not Sent';
                                            return selected;
                                        }}
                                    >
                                        <MenuItem value={'ALL'} disabled={isLoading}>All</MenuItem>
                                        <MenuItem value={'SENT'} disabled={isLoading}>Sent</MenuItem>
                                        <MenuItem value={'RE_SENT'} disabled={isLoading}>Reminder Sent</MenuItem>
                                        <MenuItem value={'NOT_SENT'} disabled={isLoading}>Not Sent</MenuItem>
                                    </Select>
                                </FormControl>
                            )
                        }
                        {
                            (reportType === "workflow") && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-simple-select-standard-label3" className={style.headingtextStyle}>Workflow Level</InputLabel>
                                    {/* <InputLabel id="demo-multiple-name-label4" className={style.headingtextStyle}>Application Type</InputLabel> */}
                                    <Select
                                        labelId="demo-simple-select-standard-label3"
                                        id="demo-simple-select-standard3"
                                        // labelId="demo-multiple-name-label4"
                                        // id="demo-multiple-name4"
                                        value={workflowLevel}
                                        onChange={(e) => { setWorkflowLevel(e.target.value) }}
                                        MenuProps={MenuProps}
                                        disabled={isLoading}
                                        className={style.textAlignLeft}
                                    >
                                        <MenuItem value={'All'} disabled={isLoading}>All</MenuItem>
                                        <MenuItem value={'1'} disabled={isLoading}>Acknowledgements</MenuItem>
                                        <MenuItem value={'2'} disabled={isLoading}>MAC Approval</MenuItem>
                                        <MenuItem value={'3'} disabled={isLoading}>Leadership Sign Off</MenuItem>
                                    </Select>
                                </FormControl>
                            )
                        }
                        {
                            (reportType === "policyAndProceduresWorkflow") && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-simple-select-standard-label3" className={style.headingtextStyle}>Workflow Level</InputLabel>
                                    {/* <InputLabel id="demo-multiple-name-label4" className={style.headingtextStyle}>Application Type</InputLabel> */}
                                    <Select
                                        labelId="demo-simple-select-standard-label3"
                                        id="demo-simple-select-standard3"
                                        // labelId="demo-multiple-name-label4"
                                        // id="demo-multiple-name4"
                                        value={workflowLevel}
                                        onChange={(e) => { setWorkflowLevel(e.target.value) }}
                                        MenuProps={MenuProps}
                                        disabled={isLoading}
                                        className={style.textAlignLeft}
                                    >
                                        <MenuItem value={'All'} disabled={isLoading}>All</MenuItem>
                                        <MenuItem value={'1'} disabled={isLoading}>Acknowledgements</MenuItem>
                                        <MenuItem value={'2'} disabled={isLoading}>Leadership Sign Off</MenuItem>
                                    </Select>
                                </FormControl>
                            )
                        }
                        {
                            (reportType === "medicalDirectivesTracker" || reportType === "policyAndProceduresTracker") && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-simple-select-standard-label3" className={style.headingtextStyle}>{reportType === "medicalDirectivesTracker" ? `Medical Directive Tracker` : `Policy And Procedure Tracker`}</InputLabel>
                                    {/* <InputLabel id="demo-multiple-name-label4" className={style.headingtextStyle}>Application Type</InputLabel> */}
                                    <Select
                                        labelId="demo-simple-select-standard-label3"
                                        id="demo-simple-select-standard3"
                                        // labelId="demo-multiple-name-label4"
                                        // id="demo-multiple-name4"
                                        value={trackerTabName}
                                        onChange={(e) => { setTrackerTabName(e.target.value) }}
                                        MenuProps={MenuProps}
                                        disabled={isLoading}
                                        className={style.textAlignLeft}
                                    >
                                        {reportType === "medicalDirectivesTracker" && (
                                            <MenuItem value={'medical_directive_tab'} disabled={isLoading}>By Medical Directive</MenuItem>
                                        )}
                                        {reportType === "policyAndProceduresTracker" && (
                                            <MenuItem value={'policy_and_procedure_tab'} disabled={isLoading}>By Policy And Procedure</MenuItem>
                                        )}
                                        <MenuItem value={'applicant_tab'} disabled={isLoading}>By Applicant</MenuItem>
                                        <MenuItem value={'department_tab'} disabled={isLoading}>By Department</MenuItem>
                                    </Select>
                                </FormControl>
                            )
                        }
                        {
                            (reportType === "currentNotesSummary") && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-simple-select-standard-label3" className={style.headingtextStyle}>Application Type</InputLabel>
                                    {/* <InputLabel id="demo-multiple-name-label4" className={style.headingtextStyle}>Application Type</InputLabel> */}
                                    <Select
                                        labelId="demo-simple-select-standard-label3"
                                        id="demo-simple-select-standard3"
                                        // labelId="demo-multiple-name-label4"
                                        // id="demo-multiple-name4"
                                        value={selectedApplicationType}
                                        onChange={(e) => { setSelectedApplicationType(e.target.value) }}
                                        MenuProps={MenuProps}
                                        disabled={isLoading}
                                        className={style.textAlignLeft}
                                    >
                                        <MenuItem value={defaultOption} disabled={isLoading}>All</MenuItem>
                                        <MenuItem value={'NEW'} disabled={isLoading}>New Applicants</MenuItem>
                                        <MenuItem value={'REAPPOINTMENT'} disabled={isLoading}>Staff Reappointments</MenuItem>
                                        <MenuItem value={'LOCUM_RENEWAL'} disabled={isLoading}>Locum Applications</MenuItem>
                                    </Select>
                                </FormControl>
                            )
                        }
                        {
                            reportType === "declinedOrNotRenewedStaffSummary" && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-simple-select-standard-label3">Locum Application Status</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label3"
                                        id="demo-simple-select-standard3"
                                        value={selectedReappointmentStatus}
                                        onChange={(e) => { setSelectedReappointmentStatus(e.target.value) }}
                                        MenuProps={MenuProps}
                                        disabled={isLoading}
                                        className={style.textAlignLeft}
                                    >
                                        <MenuItem value={''} disabled={isLoading}>All</MenuItem>
                                        <MenuItem value={'NOT_RENEWED'} disabled={isLoading}>Not Renewed</MenuItem>
                                        <MenuItem value={'DECLINED'} disabled={isLoading}>Declined</MenuItem>
                                    </Select>
                                </FormControl>
                            )
                        }
                        {
                            (reportType === "expiredDocumentsSummaryForStaff" || reportType === "documentsExpirationSummaryForStaff" || reportType === "appointmentHistorySummary" || reportType === "inactiveStaffSummary"
                                || reportType === "newStaffAppointmentsSummary" || reportType === "inactiveStaffSummaryByMonth" || reportType === "staffUploadedDocumentsSummary") && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-simple-select-standard-label3">Staff</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label3"
                                        id="demo-simple-select-standard3"
                                        value={selectedPosition}
                                        onChange={(e) => { setSelectedPosition(e.target.value) }}
                                        MenuProps={MenuProps}
                                        disabled={isMyReport || isScheduledReport || isLoading}
                                    >
                                        <MenuItem value={''} >All</MenuItem>
                                        <MenuItem value={'PERMANENT'} disabled={isMyReport || isScheduledReport || isLoading}>Permanent</MenuItem>
                                        <MenuItem value={'LOCUM'} disabled={isMyReport || isScheduledReport || isLoading}>Locum</MenuItem>
                                    </Select>
                                </FormControl>
                            )
                        }
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
                        {
                            (reportType === "contractDocumentsOnFile" || reportType === "currentRemitToAddressForActiveContracts") && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-multiple-name-label5">Contracted Service Provider</InputLabel>
                                    <Select
                                        labelId="demo-multiple-name-label5"
                                        id="demo-multiple-name5"
                                        multiple
                                        value={selectedContractedServiceProvider}
                                        onChange={handleChangeContractedServiceProviders}
                                        MenuProps={MenuProps}
                                        disabled={isMyReport || isScheduledReport || isLoading}
                                        className={style.textAlignLeft}
                                    >
                                        {contractedServiceProviders?.length >= 2 && (
                                            <MenuItem value={defaultOption} disabled={isMyReport || isScheduledReport || isLoading}>All Contracted Service Providers</MenuItem>
                                        )}
                                        {contractedServiceProviders?.map((data, index) => (
                                            <MenuItem
                                                key={index}
                                                value={data?.id}
                                                disabled={isMyReport || isScheduledReport || isLoading}
                                            >
                                                {`${data?.name?.firstName} ${data?.name?.lastName}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )
                        }
                        {
                            reportType === "paymentProcessingStatusTracker" && (
                                <>
                                    <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                        <InputLabel id="demo-multiple-name-label5">Contracted Service Provider</InputLabel>
                                        <Select
                                            labelId="demo-multiple-name-label5"
                                            id="demo-multiple-name5"
                                            value={selectedContractedServiceProvider}
                                            onChange={handleChangeContractedServiceProviders}
                                            MenuProps={MenuProps}
                                            disabled={isMyReport || isScheduledReport || isLoading}
                                            className={style.textAlignLeft}
                                        >
                                            {contractedServiceProviders?.length >= 2 && (
                                                <MenuItem value={defaultOption} disabled={isMyReport || isScheduledReport || isLoading}>All Contracted Service Providers</MenuItem>
                                            )}
                                            {contractedServiceProviders?.map((data, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={data?.id}
                                                    disabled={isMyReport || isScheduledReport || isLoading}
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
                                                disabled={isMyReport || isScheduledReport || isLoading}
                                                className={style.textAlignLeft}
                                            >
                                                {timesheetIntervals?.map((data) => (
                                                    <MenuItem
                                                        key={data?.startDate}
                                                        value={`${data?.startDate}%23${data?.endDate}`}
                                                        disabled={isMyReport || isScheduledReport || isLoading}
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
                                                disabled={isMyReport || isScheduledReport || isLoading}
                                                className={style.textAlignLeft}
                                            >
                                                {timesheetIntervals?.map((data) => (
                                                    <MenuItem
                                                        key={data?.startDate}
                                                        value={`${data?.startDate}%23${data?.endDate}`}
                                                        disabled={isMyReport || isScheduledReport || isLoading}
                                                    >
                                                        {`Timesheets for ${format(new Date(data?.startDate), 'MMMM yyyy')}`}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                </>
                            )
                        }
                        {
                            (reportType === "contractDocumentsOnFile" || reportType === "multiProviderContractsList" ||
                                reportType === "contractsWithABusinessEntity" || reportType === 'nonCompliant') && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-simple-select-standard-label3">Contract Status</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label3"
                                        id="demo-simple-select-standard3"
                                        value={contractStatus}
                                        onChange={(e) => { setContractStatus(e.target.value) }}
                                        MenuProps={MenuProps}
                                        disabled={isMyReport || isScheduledReport || isLoading}
                                        className={style.textAlignLeft}
                                    >
                                        <MenuItem value={'ACTIVE'} disabled={isMyReport || isScheduledReport || isLoading}>Active</MenuItem>
                                        <MenuItem value={'DRAFT'} disabled={isMyReport || isScheduledReport || isLoading}>Draft</MenuItem>
                                        <MenuItem value={'EXPIRED'} disabled={isMyReport || isScheduledReport || isLoading}>Expired</MenuItem>
                                        <MenuItem value={'TERMINATED'} disabled={isMyReport || isScheduledReport || isLoading}>Terminated</MenuItem>
                                        <MenuItem value={'ACTIVATION_READY'} disabled={isMyReport || isScheduledReport || isLoading}>Ready To Activate</MenuItem>
                                    </Select>
                                </FormControl>
                            )
                        }
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
                        {
                            reportType === 'nonCompliant' && (
                                <FormControl variant="standard" sx={{ m: 1, width: '250px', marginTop: '20px' }}>
                                    <InputLabel id="demo-simple-select-standard-label4">Proof of Documentation</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label4"
                                        id="demo-simple-select-standard4"
                                        value={podType}
                                        onChange={(e) => { setPodType(e.target.value) }}
                                        label="Proof of Documentation"
                                        MenuProps={MenuProps}
                                        disabled={isMyReport || isScheduledReport || isLoading}
                                        className={style.textAlignLeft}
                                    >
                                        {podTypes?.map((data, index) => (
                                            <MenuItem value={data} key={index} disabled={isMyReport || isScheduledReport || isLoading}>{data}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )
                        }
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
                                disabled={isMyReport || isScheduledReport || isLoading}
                                className={style.textAlignLeft}
                            >
                                <MenuItem value={'Current Week'} disabled={isMyReport || isScheduledReport || isLoading}>Current Week</MenuItem>
                                <MenuItem value={'Last Week'} disabled={isMyReport || isScheduledReport || isLoading}>Last Week</MenuItem>
                                <MenuItem value={'Current Month'} disabled={isMyReport || isScheduledReport || isLoading}>Current Month</MenuItem>
                                <MenuItem value={'Last Month'} disabled={isMyReport || isScheduledReport || isLoading}>Last Month</MenuItem>
                                <MenuItem value={'Current Qtr'} disabled={isMyReport || isScheduledReport || isLoading}>Current Quarter</MenuItem>
                                <MenuItem value={'Last Qtr'} disabled={isMyReport || isScheduledReport || isLoading}>Last Quarter</MenuItem>
                                <MenuItem value={'Current Year'} disabled={isMyReport || isScheduledReport || isLoading}>Current Year</MenuItem>
                                <MenuItem value={'Last Year'} disabled={isMyReport || isScheduledReport || isLoading}>Last Year</MenuItem>
                                <MenuItem value={'Custom'} disabled={isMyReport || isScheduledReport || isLoading}>Custom</MenuItem>
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
                                disabled={isMyReport || isScheduledReport || isLoading}
                                className={style.textAlignLeft}
                            >
                                {sites?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isScheduledReport || isLoading}>All Sites</MenuItem>
                                )}
                                {sites?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isScheduledReport || isLoading}
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
                                disabled={isMyReport || isScheduledReport || isLoading}
                                className={style.textAlignLeft}
                            >
                                {departments?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isScheduledReport || isLoading}>All Departments</MenuItem>
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
                                        disabled={isMyReport || isScheduledReport || isLoading}
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
                                disabled={isMyReport || isScheduledReport || isLoading}
                                className={style.textAlignLeft}
                            >
                                {contracts?.length >= 2 && (
                                    <MenuItem value={defaultOption} disabled={isMyReport || isScheduledReport || isLoading}>All Contracts</MenuItem>
                                )}
                                {contracts?.map((data) => (
                                    <MenuItem
                                        key={data?.id}
                                        value={data?.id}
                                        disabled={isMyReport || isScheduledReport || isLoading}
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
                                    disabled={isMyReport || isScheduledReport || isLoading}
                                    className={style.textAlignLeft}
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
                                    className={style.textAlignLeft}
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
                                className={style.textAlignLeft}
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
            </div >

            {
                showSaveReport && (
                    <SaveReport getSaveReportDialog={getSaveReportDialog} dataToUseInReport={dataToUseInReport} reportType={reportType} />
                )
            }
        </div >
    )
}

export default SampleReportLeftCard;
