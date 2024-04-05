import React, { Fragment, useState, useEffect, useRef } from 'react';
import Navbar from './../../Components/Navbar';
import SideBar from '../../Components/Sidebar';
import { useReactToPrint } from 'react-to-print';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import { GET } from '../dataSaver';
import { useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { differenceInCalendarDays, format } from 'date-fns';
import Select from '@mui/material/Select';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import 'react-data-grid/lib/styles.css';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SquareIcon from '@mui/icons-material/Square';
import DownloadIcon from '@mui/icons-material/Download';
import style from './index.module.scss';
import TrackTable from '../../Components/TrackTable';
import NoDataBox from '../../Components/ReusableSmallComponents/noDataBox';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

const TrackYourContracts = () => {
    const { trackType } = useParams();
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedContractedServiceProvider, setSelectedContractedServiceProvider] = useState('');
    const [contractedServiceProviders, setContractedServiceProviders] = useState([]);
    const [contracts, setContracts] = useState([]);
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const userDetail = jwt(userDetails);
    const entityName = sessionStorage.getItem('title');
    const [currentUserDetails, setCurrentUserDetails] = useState();
    const [userId, setUserId] = useState(userDetail?.id);
    const [selectedContracts, setSelectedContracts] = useState([]);
    const [selectedTimesheetInterval, setSelectedTimesheetInterval] = useState([]);
    const defaultOption = ''
    const [activityTrackServices, setActivityTrackServices] = useState([]);
    const [timesheetTrackValues, setTimesheetTrackValues] = useState([]);
    const [paymentTrackValues, setPaymentTrackValues] = useState();
    const [timesheetIntervals, setTimesheetIntervals] = useState([]);
    const [timesheetIntervalsStartDate, setTimesheetIntervalsStartDate] = useState('');
    const [timesheetIntervalsEndDate, setTimesheetIntervalsEndDate] = useState('');
    const [selectedPaymentTab, setSelectedPaymentTab] = useState('Payment Processed');
    const [initialValueSet, setInitialValueSet] = useState(false);
    const [contractTrackCompensationValues, setContractTrackCompensationValues] = useState([]);
    let months = { 1: 'Jan', 2: 'Feb', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' };
    // const columns = [
    //     { key: 'id', name: 'ID' },
    //     { key: 'title', name: 'Title' }
    // ];

    // const rows = [
    //     { id: 0, title: 'Example' },
    //     { id: 1, title: 'Demo' }
    // ];

    console.log(trackType)
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const dollarFormatter = (cell) => {
        return (
            <span>{cell === undefined ? '' : cell !== '-' ? `$ ${cell}` : cell}</span>
        );
    };


    const getColumns = (data, index) => {
        let tempCol = [
            { field: 'service', headerName: '', width: 280 },
            {
                field: 'hourlyRate', headerName: 'Pro-Rata Hourly Rate', width: 140,
                renderCell: (params) => {
                    return dollarFormatter(params.value?.toLocaleString());
                }
            },
            { field: 'cyExpectedHours', headerName: 'Hours', width: 140 },
            {
                field: 'cyExpectedAmount', headerName: '$$', width: 140,
                renderCell: (params) => {
                    return dollarFormatter(params.value?.toLocaleString());
                }
            },
            { field: 'cymExpectedHours', headerName: 'Hours', width: 140 },
            {
                field: 'cymExpectedAmount', headerName: '$$', width: 140,
                renderCell: (params) => {
                    return dollarFormatter(params.value?.toLocaleString());
                }
            },
        ];

        // contractTrackCompensationValues?.map((data, index) => {
        data?.timesheetActivitiesWithActualValuesList?.map((actualValue, actualIndex) => {
            tempCol.push({ field: `cy${index + 1}m${actualIndex + 1}ActualHours`, headerName: `Hours`, width: 140 })
            tempCol.push({
                field: `cy${index + 1}m${actualIndex + 1}ActualAmount`, headerName: `$$`, width: 140,
                renderCell: (params) => {
                    return dollarFormatter(params.value?.toLocaleString());
                }
            })
        })
        // })

        return tempCol;
    }

    const getRows = (data, index) => {
        let tempRow = [];

        // contractTrackCompensationValues?.map((data, index) => {
        console.log(data)
        data?.activityWithExpectedValuesList?.map((expectedValue, expectedIndex) => {
            tempRow.push({
                id: `${index}${expectedIndex}`,
                service: `${expectedValue?.activityType} - ${expectedValue?.performingActivity}`,
                hourlyRate: expectedValue?.hourlyRate,
                cyExpectedHours: expectedValue?.activityType === "Add-On Service" ? '-' : expectedValue?.expectedHoursInYear,
                cyExpectedAmount: expectedValue?.activityType === "Add-On Service" ? '-' : expectedValue?.expectedAmountInYear,
                cymExpectedHours: expectedValue?.activityType === "Add-On Service" ? '-' : expectedValue?.expectedHoursInMonth,
                cymExpectedAmount: expectedValue?.activityType === "Add-On Service" ? '-' : expectedValue?.expectedAmountInMonth
            })
        })
        tempRow.push({
            id: `${index}${data?.activityWithExpectedValuesList?.length}`,
            service: 'Total',
        })
        data?.timesheetActivitiesWithActualValuesList?.map((timesheetData, timesheetIndex) => {
            timesheetData?.activityWithActualValuesList?.map((actualValue, actualIndex) => {
                let tempIndex = tempRow.findIndex(obj => obj['service'] === `${actualValue?.activityType} - ${actualValue?.performingActivity}`)
                tempRow[tempIndex][`cy${index + 1}m${timesheetIndex + 1}ActualHours`] = actualValue?.actualHours !== -1 ? actualValue?.actualHours : '-'
                tempRow[tempIndex][`cy${index + 1}m${timesheetIndex + 1}ActualAmount`] = actualValue?.actualAmount !== -1 ? actualValue?.actualAmount : '-'
            })
        })
        data?.timesheetActivitiesWithActualValuesList?.map((timesheetData, timesheetIndex) => {
            tempRow[tempRow?.length - 1][`cy${index + 1}m${timesheetIndex + 1}ActualAmount`] = timesheetData?.policyBasedPayment
        })
        // });

        console.log(tempRow)

        return tempRow;
    }

    const getColumnGroupingModel = (data, index) => {
        if (contractTrackCompensationValues?.length !== 0) {
            let columnGroupingModel = [
                {
                    groupId: `Service Name`,
                    headerName: '',
                    headerClassName: style.groupBorderTop,
                    description: '',
                    children: [{ field: 'service' }],
                },
                {
                    groupId: `Hourly Rate`,
                    headerName: '',
                    description: '',
                    children: [{ field: 'hourlyRate' }],
                },
                {
                    groupId: `Expected ${contractTrackCompensationValues?.[0]?.contractYearInterval !== null ? format(new Date(contractTrackCompensationValues?.[0]?.contractYearInterval?.startDate), 'yyyy') : '-'}`,
                    description: '',
                    children: [{ field: 'cyExpectedHours' }, { field: 'cyExpectedAmount' }],
                },
                {
                    groupId: `Expected Monthly (${contractTrackCompensationValues?.[0]?.contractYearInterval !== null ? format(new Date(contractTrackCompensationValues?.[0]?.contractYearInterval?.startDate), 'yyyy') : '-'})`,
                    description: '',
                    children: [{ field: 'cymExpectedHours' }, { field: 'cymExpectedAmount' }],
                },
            ];
            // contractTrackCompensationValues?.map((data, index) => {
            data?.timesheetActivitiesWithActualValuesList?.length !== 0 &&
                data?.timesheetActivitiesWithActualValuesList?.map((actualValue, actualIndex) => {
                    columnGroupingModel?.push({
                        groupId: `Actual M${actualIndex + 1} (${months[actualValue?.month]} ${actualValue?.year})`,
                        description: '',
                        children: [{ field: `cy${index + 1}m${actualIndex + 1}ActualHours` }, { field: `cy${index + 1}m${actualIndex + 1}ActualAmount` }],
                    })
                })
            // })
            return columnGroupingModel;
        }
    }

    const customToolbar = () => {
        return (
            <GridToolbarContainer>
                <GridToolbarExport />
            </GridToolbarContainer>
        );
    }

    const compensationPolicy = {
        ACTIVITY_BASED: 'Activity Based',
        SHIFT_OR_PER_DAY_BASED: 'Shift Or Per Day Based',
        FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITH_OFFSET: 'Fixed Amount For Timesheet Period With Offset',
        FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET: 'Fixed Amount For Timesheet Period Without Offset',
    }

    useEffect(() => {
        setUserId(userDetail?.id);
        setUserDetails();
        // getActivityLogger();
        getContractAndUserList();
    }, [])

    const getContractAndUserList = async () => {
        const { data: contractAndUserList } = await GET(`contract-managment-service/reports/filter/usersAndContracts?reportCategory=TIMESHEET`);
        console.log(contractAndUserList)
        // setContracts(contractAndUserList?.contracts);
        setContractedServiceProviders(contractAndUserList?.users);
    }

    // useEffect(() => {
    //     setContracts(currentUserDetails?.contracts);
    // }, [currentUserDetails])

    useEffect(() => {
        let tempContracts = contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)[0];
        setContracts(tempContracts?.contractDetails);
        if (tempContracts?.contractDetails?.length === 1) {
            setSelectedContracts([tempContracts?.contractDetails?.[0]?.id])
        }
        if (trackType === 'activityStatusTracker') {
            getContractTrackValues()
        }
        if (trackType === 'timesheetAndInvoiceApprovalsStatusTracker' || trackType === "paymentProcessingStatusTracker") {
            setSelectedTimesheetInterval(selectedContractedServiceProvider !== '' && trackType !== "paymentProcessingStatusTracker" ? [defaultOption] : [`${timesheetIntervals?.[0]?.startDate}%23${timesheetIntervals?.[0]?.endDate}`])
        }
    }, [selectedContractedServiceProvider])

    console.log(selectedContractedServiceProvider, contracts, selectedContracts)

    useEffect(() => {
        if (selectedContracts?.length !== 0) {
            getContractTrackCompensation();
        }
    }, [selectedContracts])

    useEffect(() => {
        setSelectedContractedServiceProvider('')
        setSelectedContracts([])
        if (trackType === 'timesheetAndInvoiceApprovalsStatusTracker' || trackType === "paymentProcessingStatusTracker") {
            getTimesheetIntervals()
        }
    }, [trackType])

    useEffect(() => {
        if (initialValueSet) {
            if (trackType === 'timesheetAndInvoiceApprovalsStatusTracker') {
                getTimesheetTrackValues()
            }
            if (trackType === "paymentProcessingStatusTracker") {
                getPaymentTrackValues()
            }
        }
    }, [selectedTimesheetInterval, initialValueSet])

    useEffect(() => {
        setInitialValueSet(false);
        if (selectedTimesheetInterval?.length === 0) {
            if (timesheetIntervals?.length !== 1) {
                setSelectedTimesheetInterval([defaultOption]);
            }
        } else if (selectedTimesheetInterval?.length >= 2 && selectedTimesheetInterval.includes(defaultOption)) {
            setSelectedTimesheetInterval(selectedTimesheetInterval.filter(value => value !== defaultOption))
        }
        const timer = setTimeout(() => {
            setInitialValueSet(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, [defaultOption, selectedTimesheetInterval])


    const getIsExpanded = (value) => {
        setIsExpanded(value);
    }

    // const getActivityLogger = async () => {
    //     const { data: user } = await GET(`user-management-service/user?userType=CONTRACTED_SERVICE_PROVIDER_USER`);
    //     setContractedServiceProviders(user);
    // }

    const getContractTrackValues = async () => {
        const { data: data } = await GET(`timesheet-management-service/activity/track/services?userIds=${[selectedContractedServiceProvider]}`);
        setActivityTrackServices(data);
    }

    const getContractTrackCompensation = async () => {
        const { data: data } = await GET(`timesheet-management-service/timesheet/track/compensation?contractId=${selectedContracts}`);
        setContractTrackCompensationValues(data);
    }

    const getTimesheetTrackValues = async () => {
        if (selectedTimesheetInterval !== '') {
            const { data: data } = await GET(`timesheet-management-service/timesheet/track/workflow?interval=${selectedTimesheetInterval}&userIds=${[selectedContractedServiceProvider]}`);
            setTimesheetTrackValues(data);
        }
    }

    const getPaymentTrackValues = async () => {
        if (selectedTimesheetInterval !== '') {
            const { data: data } = await GET(`timesheet-management-service/timesheet/track/usersByPeriod?interval=${selectedTimesheetInterval}&userIds=${[selectedContractedServiceProvider]}`);
            setPaymentTrackValues(data);
        }
    }

    const getTimesheetIntervals = async () => {
        const { data: data } = await GET(`timesheet-management-service/timesheet/timesheetIntervals`);
        setTimesheetIntervals(data);
        if (data?.length !== 0) {
            setTimesheetIntervalsStartDate(data?.[0]?.startDate)
            setTimesheetIntervalsEndDate(data?.[0]?.endDate)
            setSelectedTimesheetInterval(selectedContractedServiceProvider !== '' && trackType !== "paymentProcessingStatusTracker" ? [defaultOption] : [`${data?.[0]?.startDate}%23${data?.[0]?.endDate}`])
        }
    }

    const setUserDetails = async () => {
        const { data: user } = await GET(`user-management-service/user/${userId}`);
        setCurrentUserDetails(user);
    }

    const handleChangeContracts = (event) => {
        const {
            target: { value },
        } = event;
        setSelectedContracts(
            typeof value === 'string' ? value.split(',') : value
        );
    };

    const handleChangeTimesheetInterval = (event) => {
        const {
            target: { value },
        } = event;
        console.log(event, value)

        if (value?.length >= 2 && value[value?.length - 1] === defaultOption && trackType !== "paymentProcessingStatusTracker") {
            setSelectedTimesheetInterval([defaultOption]);
        } else {
            setSelectedTimesheetInterval(
                typeof value === 'string' ? value.split(',') : value
            );
        }
    };
    console.log(selectedTimesheetInterval)

    let service = [];
    let expectedUnits = [];
    let expectedHours = [];
    let completedUnits = [];
    let completedHours = [];
    let toBeProposedUnits = [];
    let toBeProposedHours = [];
    let balanceUnits = [];
    let balanceHours = [];
    let nteValues = [];
    const getTrackTableValue = (serviceValues) => {
        console.log(serviceValues);

        service = [];
        expectedUnits = [];
        expectedHours = [];
        completedUnits = [];
        completedHours = [];
        toBeProposedUnits = [];
        toBeProposedHours = [];
        balanceUnits = [];
        balanceHours = [];
        nteValues = [];
        serviceValues?.activityStatsByContract?.map((activityData, index) => {
            let typesToFilter = ['array']
            let filteredServiceValues = Object.fromEntries(
                Object.entries(activityData?.activityStatsMeta).filter(([key, value]) => {
                    const valueType = Array.isArray(value) ? 'array' : typeof value;
                    return typesToFilter.includes(valueType);
                })
            )
            console.log(filteredServiceValues)
            Object.keys(filteredServiceValues)?.map(data => {
                if (filteredServiceValues?.[data]?.length !== 0) {
                    service?.push({ type: 'parentChildService', name: data, values: filteredServiceValues?.[data]?.map(data => `${(`${data?.activityType} - ${data?.performingActivity}`.length > 35 && activityData?.contract?.compensationPolicy !== 'ACTIVITY_BASED') ? `${data?.activityType} - ${data?.performingActivity}`.slice(0, 32) + '...' : (`${data?.activityType} - ${data?.performingActivity}`.length > 50) ? `${data?.activityType} - ${data?.performingActivity}`.slice(0, 47) + '...' : `${data?.activityType} - ${data?.performingActivity}`} (${data?.timeBlock})`) })
                    completedUnits?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.complated?.units) })
                    completedHours?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.complated?.hours) })
                    toBeProposedUnits?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.inprogress?.units) })
                    toBeProposedHours?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.inprogress?.hours) })
                    if (activityData?.contract?.compensationPolicy !== 'ACTIVITY_BASED') {
                        expectedUnits?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.contractYearExpected?.units) })
                        // expectedHours?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.contractYearExpected?.hours) })
                        balanceUnits?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.balanceUnitsStatus === 'NIL' ? '-' : data?.balance?.units), color: filteredServiceValues?.[data]?.map(data => data?.balanceUnitsStatus === 'SUFFICIENT' ? style.greenBigNumber : data?.balanceUnitsStatus === 'DEFICIT' ? style.yellowBigNumber : data?.balanceUnitsStatus === 'NIL' ? style.redBigNumber : style.redBigNumber) })
                        balanceHours?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.balanceUnitsStatus === 'NIL' ? '-' : data?.balance?.hours), color: filteredServiceValues?.[data]?.map(data => data?.balanceUnitsStatus === 'SUFFICIENT' ? style.greenBigNumber : data?.balanceUnitsStatus === 'DEFICIT' ? style.yellowBigNumber : data?.balanceUnitsStatus === 'NIL' ? style.redBigNumber : style.redBigNumber) })
                    }
                }
            })

        })
        nteValues?.push({ type: 'nteAmount', values: serviceValues?.activityStatsByContract?.[0]?.activityStatsMeta?.contractBalancePaymentSummary })


        return serviceValues?.activityStatsByContract?.[0]?.contract?.compensationPolicy !== 'ACTIVITY_BASED' ?
            [
                service,
                expectedUnits,
                // expectedHours,
                completedUnits,
                completedHours,
                toBeProposedUnits,
                toBeProposedHours,
                balanceUnits,
                balanceHours,
                nteValues
            ] : [
                service,
                completedUnits,
                completedHours,
                toBeProposedUnits,
                toBeProposedHours,
                nteValues
            ]

    }

    let timesheetTrackerTableValues = [];
    let timesheetName = [];
    let timesheetContractName = [];
    let submissionStatusAndDate = [];
    let reviewAndApprovalStatusAndDate = [];
    let reviewAndApprovalApprovalDays = [];
    let paymentProcessingStatusAndDate = [];
    let paymentProcessingApprovalDays = [];
    let remainingTerm = [];

    const getTimesheetTableValue = () => {
        timesheetTrackerTableValues = [];
        timesheetName = [];
        timesheetContractName = [];
        submissionStatusAndDate = [];
        reviewAndApprovalStatusAndDate = [];
        reviewAndApprovalApprovalDays = [];
        paymentProcessingStatusAndDate = [];
        paymentProcessingApprovalDays = [];
        remainingTerm = [];
        timesheetTrackValues?.map(data => {
            timesheetTrackerTableValues.push({
                timesheetName: data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.timesheetLabel?.label),
                submissionStatusAndDate: data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.submissionStausLog !== null ? {
                    value: format(new Date(timesheetData?.submissionStausLog?.status === "PENDING" ? timesheetData?.submissionStausLog?.dueDate : timesheetData?.submissionStausLog?.date), 'MMM dd, yyyy'),
                    status: timesheetData?.submissionStausLog?.status === "PENDING" ? `Pending Approval by ${format(new Date(timesheetData?.submissionStausLog?.dueDate), 'MMM dd, yyyy')}`
                        : timesheetData?.submissionStausLog?.status === "PAST_DUE " ? `Past Due by ${differenceInCalendarDays(new Date(timesheetData?.submissionStausLog?.dueDate), new Date())} days` : '',
                    icon: <SquareIcon className={` ${style.cursorPointer}`} sx={{ color: timesheetData?.submissionStausLog?.status === "PENDING" ? "#FEC106" : timesheetData?.submissionStausLog?.status === "PAST_DUE " ? "#F94848" : "#14B15A", fontSize: 14 }} />
                } : []),
                reviewAndApprovalStatusAndDate: data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.reviewApprovalStausLog !== null ? {
                    value: format(new Date(timesheetData?.reviewApprovalStausLog?.status === "PENDING" ? timesheetData?.reviewApprovalStausLog?.dueDate : timesheetData?.reviewApprovalStausLog?.date), 'MMM dd, yyyy'),
                    status: timesheetData?.reviewApprovalStausLog?.status === "PENDING" ? `Pending Approval by ${format(new Date(timesheetData?.reviewApprovalStausLog?.dueDate), 'MMM dd, yyyy')}`
                        : timesheetData?.reviewApprovalStausLog?.status === "PAST_DUE " ? `Past Due by ${differenceInCalendarDays(new Date(timesheetData?.reviewApprovalStausLog?.dueDate), new Date())} days` : '',
                    icon: <SquareIcon className={` ${style.cursorPointer}`} sx={{ color: timesheetData?.reviewApprovalStausLog?.status === "PENDING" ? "#FEC106" : timesheetData?.reviewApprovalStausLog?.status === "PAST_DUE " ? "#F94848" : "#14B15A", fontSize: 14 }} />
                } : []),
                reviewAndApprovalApprovalDays: data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.reviewApprovalStausLog !== null ? timesheetData?.reviewApprovalStausLog?.daysToApprove : []),
                paymentProcessingStatusAndDate: data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.paymentProcessingStausLog !== null ? {
                    value: format(new Date(timesheetData?.paymentProcessingStausLog?.status === "PENDING" ? timesheetData?.paymentProcessingStausLog?.dueDate : timesheetData?.submissionStausLog?.date), 'MMM dd, yyyy'),
                    status: timesheetData?.paymentProcessingStausLog?.status === "PENDING" ? `Pending Approval by ${format(new Date(timesheetData?.paymentProcessingStausLog?.dueDate), 'MMM dd, yyyy')}`
                        : timesheetData?.paymentProcessingStausLog?.status === "PAST_DUE " ? `Past Due by ${differenceInCalendarDays(new Date(timesheetData?.paymentProcessingStausLog?.dueDate), new Date())} days` : '',
                    icon: <SquareIcon className={` ${style.cursorPointer}`} sx={{ color: timesheetData?.paymentProcessingStausLog?.status === "PENDING" ? "#FEC106" : timesheetData?.paymentProcessingStausLog?.status === "PAST_DUE " ? "#F94848" : "#14B15A", fontSize: 14 }} />
                } : []),
                paymentProcessingApprovalDays: data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.paymentProcessingStausLog !== null ? timesheetData?.paymentProcessingStausLog?.daysToApprove : ['']),
                timesheetContractName: data?.timesheetsWithLogs?.map(timesheetData => data?.contract?.contractName?.contractName),
                remainingTerm: data?.timesheetsWithLogs !== null ? data?.timesheetsWithLogs?.map(timesheetData => data?.remainingTerm) : ['']
            });
        })
        return timesheetTrackerTableValues
    }

    let interval = [];
    let approvalDate = [];
    let approvalBy = [];
    let paymentApprovalDate = [];
    let paymentApprovalBy = [];
    let payment = [];
    let paymentTrackerTableValues = [];
    const getPaymentTableValue = () => {
        interval = [];
        approvalDate = [];
        approvalBy = [];
        paymentApprovalDate = [];
        paymentApprovalBy = [];
        payment = [];
        timesheetName = [];
        timesheetContractName = [];
        paymentTrackerTableValues = [];
        console.log(paymentTrackValues)
        if (selectedPaymentTab === "Approval Pending") {
            paymentTrackerTableValues.push({
                interval: paymentTrackValues?.approvalPending?.map(data => data?.interval !== null ? `${format(new Date(data?.interval?.startDate), 'MMM dd, yyyy')} - ${format(new Date(data?.interval?.endDate), 'MMM dd, yyyy')}` : '-'),
                timesheetName: paymentTrackValues?.approvalPending?.map(data => data?.timesheetLabel !== null ? data?.timesheetLabel?.label : '-'),
                timesheetContractName: paymentTrackValues?.approvalPending?.map(data => data?.contractName?.contractName),
                approvalBy: paymentTrackValues?.approvalPending?.map(data => data?.approvedBy !== null ? data?.approvedBy?.name?.name : '-'),
                approvalDate: paymentTrackValues?.approvalPending?.map(data => data?.approvedDate !== null ? format(new Date(data?.approvedDate), 'MMM dd, yyyy') : '-'),
                order: ['timesheetContractName', 'timesheetName', 'interval', 'approvalDate', 'approvalBy']
            })
        } else if (selectedPaymentTab === "Payment Processed") {
            paymentTrackerTableValues.push({
                interval: paymentTrackValues?.paymentProcessed?.map(data => data?.interval !== null ? `${format(new Date(data?.interval?.startDate), 'MMM dd, yyyy')} - ${format(new Date(data?.interval?.endDate), 'MMM dd, yyyy')}` : '-'),
                timesheetName: paymentTrackValues?.paymentProcessed?.map(data => data?.timesheetLabel !== null ? data?.timesheetLabel?.label : '-'),
                timesheetContractName: paymentTrackValues?.paymentProcessed?.map(data => data?.contractName?.contractName),
                approvalBy: paymentTrackValues?.paymentProcessed?.map(data => data?.approvedBy !== null ? data?.approvedBy?.name?.name : '-'),
                approvalDate: paymentTrackValues?.paymentProcessed?.map(data => data?.approvedDate !== null ? format(new Date(data?.approvedDate), 'MMM dd, yyyy') : '-'),
                paymentApprovalBy: paymentTrackValues?.paymentProcessed?.map(data => data?.paymentApprovedBy !== null ? data?.paymentApprovedBy?.name?.name : '-'),
                paymentApprovalDate: paymentTrackValues?.paymentProcessed?.map(data => data?.paymentApprovedDate !== null ? format(new Date(data?.paymentApprovedDate), 'MMM dd, yyyy') : '-'),
                payment: paymentTrackValues?.paymentProcessed?.map(data => `$ ${data?.payment.toFixed(2)}`),
                order: ['timesheetContractName', 'timesheetName', 'interval', 'approvalDate', 'approvalBy', 'paymentApprovalDate', 'paymentApprovalBy', 'payment']
            })
        } else if (selectedPaymentTab === "Submission Pending") {
            paymentTrackerTableValues.push({
                interval: paymentTrackValues?.submissionPending?.map(data => data?.interval !== null ? `${format(new Date(data?.interval?.startDate), 'MMM dd, yyyy')} - ${format(new Date(data?.interval?.endDate), 'MMM dd, yyyy')}` : '-'),
                timesheetName: paymentTrackValues?.submissionPending?.map(data => data?.timesheetLabel !== null ? data?.timesheetLabel?.label : '-'),
                timesheetContractName: paymentTrackValues?.submissionPending?.map(data => data?.contractName?.contractName),

                order: ['timesheetContractName', 'timesheetName', 'interval']
            })
        } else if (selectedPaymentTab === "Payment Pending") {
            paymentTrackerTableValues.push({
                interval: paymentTrackValues?.paymentPending?.map(data => data?.interval !== null ? `${format(new Date(data?.interval?.startDate), 'MMM dd, yyyy')} - ${format(new Date(data?.interval?.endDate), 'MMM dd, yyyy')}` : '-'),
                timesheetName: paymentTrackValues?.paymentPending?.map(data => data?.timesheetLabel !== null ? data?.timesheetLabel?.label : '-'),
                timesheetContractName: paymentTrackValues?.paymentPending?.map(data => data?.contractName?.contractName),
                approvalBy: paymentTrackValues?.paymentPending?.map(data => data?.approvedBy !== null ? data?.approvedBy?.name?.name : '-'),
                approvalDate: paymentTrackValues?.paymentPending?.map(data => data?.approvedDate !== null ? format(new Date(data?.approvedDate), 'MMM dd, yyyy') : '-'),
                order: ['timesheetContractName', 'timesheetName', 'interval', 'approvalDate', 'approvalBy']
            })
        }
        console.log(paymentTrackerTableValues)
        return paymentTrackerTableValues;
        // return selectedPaymentTab === "Payment Processed" ? [paymentTrackerTableValues?.[0]?.timesheetContractName, paymentTrackerTableValues?.[0]?.timesheetName, paymentTrackerTableValues?.[0]?.interval, paymentTrackerTableValues?.[0]?.approvalDate, paymentTrackerTableValues?.[0]?.approvalBy, paymentTrackerTableValues?.[0]?.paymentApprovalDate, paymentTrackerTableValues?.[0]?.paymentApprovalBy, paymentTrackerTableValues?.[0]?.payment] :
        //     selectedPaymentTab === "Payment Pending" ? [paymentTrackerTableValues?.[0]?.timesheetContractName, paymentTrackerTableValues?.[0]?.timesheetName, paymentTrackerTableValues?.[0]?.interval, paymentTrackerTableValues?.[0]?.approvalDate, paymentTrackerTableValues?.[0]?.approvalBy] :
        //         selectedPaymentTab === "Approval Pending" ? [paymentTrackerTableValues?.[0]?.timesheetContractName, paymentTrackerTableValues?.[0]?.timesheetName, paymentTrackerTableValues?.[0]?.interval, paymentTrackerTableValues?.[0]?.approvalDate, paymentTrackerTableValues?.[0]?.approvalBy] :
        //             selectedPaymentTab === "Submission Pending" ? [paymentTrackerTableValues?.[0]?.timesheetContractName, paymentTrackerTableValues?.[0]?.timesheetName, paymentTrackerTableValues?.[0]?.interval] : [];
    }

    return (
        <Fragment>
            <Navbar />
            <div className={style.margin20}>
                <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
                    <div>
                        <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                            <div className={`${style.bigCardStyle} ${style.bigCalendarLeftCardWidth} ${style.padding20}`}>
                                <CommonSelectField
                                    value={selectedContractedServiceProvider || ""}
                                    onChange={(e) => setSelectedContractedServiceProvider(e.target.value)}
                                    firstOptionLabel={trackType === 'timesheetAndInvoiceApprovalsStatusTracker' ? "All Service Providers" : "Select Service Provider"}
                                    firstOptionValue={""}
                                    valueList={contractedServiceProviders?.map(data => data?.id)}
                                    labelList={contractedServiceProviders?.map(data => `${data?.name?.firstName} ${data?.name?.lastName}`)}
                                    disabledList={contractedServiceProviders?.map(data => false)}
                                />
                            </div>
                        </SideBar>
                    </div>
                    <div className={` ${style.padding20} ${style.whiteBackground}`} ref={componentRef}>
                        {trackType === 'compensationTracker' ? (
                            <>
                                <div className={style.displayInRow}>
                                    <div className={style.trackServiceProviderName}>{selectedContractedServiceProvider !== '' ? `${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.firstName} ${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.lastName}, ${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.suffix?.suffix}` : '-'}</div>
                                    <div className={`${style.trackTableContractCountHeading} ${style.marginLeft20}`}>Contracts</div>
                                    <div className={`${style.trackTableContractCount} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginLeft20}`}>{selectedContracts?.length}</div>
                                </div>
                                <div>
                                    <div className={`${style.displayInRow} ${style.verticalAlignCenter}`}>
                                        <div className={style.trackTableContractLabel}>Services Compensation Tracking & Monitoring For</div>
                                        <FormControl sx={{ m: 1, width: '50%' }}>
                                            <Select
                                                labelId="demo-multiple-name-label5"
                                                id="demo-multiple-name5"
                                                multiple
                                                value={selectedContracts}
                                                onChange={handleChangeContracts}
                                                SelectDisplayProps={{ style: { paddingTop: 5, paddingBottom: 5, fontSize: 15 } }}
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
                                        {/* <PrintOutlinedIcon sx={{ color: '#857AEF' }} />
                                    <DownloadIcon sx={{ color: '#857AEF' }} /> */}
                                    </div>
                                </div>
                                <div className={`${style.trackTableBackgroudcard} ${style.marginTop20}`}>
                                    {selectedContracts?.length !== 0 ? contractTrackCompensationValues?.map((data, index) => (
                                        <div key={index}>
                                            <DataGrid
                                                rows={getRows(data, index)}
                                                columns={getColumns(data, index)}
                                                hideFooterPagination={true}
                                                sx={{
                                                    "& .MuiDataGrid-withBorderColor": {
                                                        borderColor: '#646D82'
                                                    },
                                                    "& .MuiDataGrid-toolbarContainer": {
                                                        borderBottom: "1px solid #646D82"
                                                    }
                                                }}
                                                experimentalFeatures={{ columnGrouping: true }}
                                                className={`${style.whiteBackground} ${style.muiDataGridWithBorderColor}`}
                                                columnGroupingModel={getColumnGroupingModel(data, index)}
                                                slots={{
                                                    toolbar: customToolbar,
                                                }}
                                                showCellVerticalBorder={true}
                                                showColumnVerticalBorder={true}
                                                rowHeight={35}
                                                columnHeaderHeight={35}
                                            />
                                        </div>
                                    )) : (
                                        <div className={style.verticalAlignCenter}>
                                            <NoDataBox
                                                heading={'Based on the parameters selected, there were NO RECORDS found.'}
                                                subHeading={'Try again by changing the service provider on the left or the Contract on the top.'}
                                                onClickText={''}
                                                onClickFunction={() => { }}
                                            />
                                        </div>
                                    )}

                                </div>
                                <div>

                                </div>
                            </>
                        ) : trackType === 'timesheetAndInvoiceApprovalsStatusTracker' ? (
                            <>
                                <div className={style.spaceBetween}>
                                    <div className={style.trackServiceProviderName}>{`TIMESHEET SUBMITTED PROCESSING STATUS BY SERVICE PROVIDER`}</div>
                                    <PrintOutlinedIcon className={`${style.headerPrintIcon} ${style.cursorPointer}`} style={{ color: "#7165E3" }} onClick={handlePrint} />
                                </div>
                                {/* {timesheetIntervals?.length !== 0 && (
                                    <>
                                        <div className={`${style.trackPeriodCard} ${style.marginTop20} ${style.spaceBetween} ${style.padding20} ${style.cursorPointer}`} onClick={() => setShowTimesheetInterval(!showTimesheetInterval)}>
                                            <div className={style.trackContractUserAndPeriod}>{`Timesheets for ${format(new Date(timesheetIntervalsStartDate || timesheetIntervals?.[0]?.startDate), 'MMMM yyyy')}`}</div>
                                            {!showTimesheetInterval ? (
                                                <div className={style.arrowDown}></div>
                                            ) : (
                                                <div className={style.arrowUp}></div>
                                            )}
                                        </div>
                                        {showTimesheetInterval && (
                                            <div className={style.intervalPeriodBorder}>
                                                {timesheetIntervals?.map((data, index) => (
                                                    <div className={`${style.trackPeriodOptionsCard} ${style.verticalAlignCenter} ${style.cursorPointer}`} onClick={() => { setTimesheetIntervalsStartDate(data?.startDate); setTimesheetIntervalsEndDate(data?.endDate); setShowTimesheetInterval(false) }} key={index}>
                                                        <div className={style.timesheetIntervalListText}>{`Timesheets for ${format(new Date(data?.startDate), 'MMMM yyyy')}`}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </>
                                )} */}
                                {selectedContractedServiceProvider !== '' ? (
                                    <FormControl sx={{ width: isExpanded ? 'calc(80vw - 80px)' : 'calc(100vw - 160px)', marginTop: '20px' }}>
                                        <Select
                                            labelId="demo-multiple-name-label2"
                                            id="demo-multiple-name2"
                                            multiple
                                            value={selectedTimesheetInterval}
                                            onChange={handleChangeTimesheetInterval}
                                            className={style.timesheetIntervalSelectStyle}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    backgroundColor: "#F1EFFC",
                                                    font: ' normal normal bold 15px/18px Montserrat',
                                                    color: '#52575D',
                                                    textAlign: 'left'
                                                }
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: '#F1EFFC',
                                                        '& .MuiMenuItem-root': {
                                                            padding: 2,
                                                        },
                                                    },
                                                },
                                            }}
                                        // disabled={isMyReport || isLoading}
                                        >
                                            <MenuItem value={defaultOption}>All Timesheets</MenuItem>
                                            {timesheetIntervals?.map((data) => (
                                                <MenuItem
                                                    key={data?.startDate}
                                                    value={`${data?.startDate}%23${data?.endDate}`}
                                                >
                                                    {`Timesheets for ${format(new Date(data?.startDate), 'MMMM yyyy')}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <FormControl sx={{ width: isExpanded ? 'calc(80vw - 80px)' : 'calc(100vw - 160px)', marginTop: '20px' }}>
                                        <Select
                                            labelId="demo-multiple-name-label2"
                                            id="demo-multiple-name2"
                                            value={selectedTimesheetInterval}
                                            onChange={(e) => setSelectedTimesheetInterval([e.target.value])}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: '#F1EFFC',
                                                        '& .MuiMenuItem-root': {
                                                            padding: 2,
                                                        },
                                                    },
                                                },
                                            }}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    backgroundColor: "#F1EFFC",
                                                    font: ' normal normal bold 15px/18px Montserrat',
                                                    color: '#52575D',
                                                    textAlign: 'left'
                                                }
                                            }}
                                        // disabled={isMyReport || isLoading}
                                        >
                                            {timesheetIntervals?.map((data) => (
                                                <MenuItem
                                                    key={data?.startDate}
                                                    value={`${data?.startDate}%23${data?.endDate}`}
                                                >
                                                    {`Timesheets for ${format(new Date(data?.startDate), 'MMMM yyyy')}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                {timesheetTrackValues?.length !== 0 ? (
                                    <TrackTable
                                        tableHead={['TIMESHEET', 'CONTRACT', 'SUBMISSION', 'REVIEW & APPROVAL', 'PAYMENT PROCESSING', 'REMAINING TERM']}
                                        tableHeadBottom={['', '', 'STATUS & DATE', 'STATUS & DATE', 'APPROVAL DAYS', 'STATUS & DATE', 'APPROVAL DAYS', '', '']}
                                        tableData={getTimesheetTableValue()}
                                        dataGrid={style.timesheetTableDataGrid}
                                        tableHeadGrid={style.timesheetTableHeaderMiddleGrid}
                                        tableHeadBottomGrid={style.timesheetTableHeaderBottomGrid}
                                        header={false}
                                        directionRow={true}
                                        directionRowCommonText={false}
                                    />
                                ) : (
                                    <div className={style.verticalAlignCenter}>
                                        <NoDataBox
                                            heading={'Based on the parameters selected, there were NO RECORDS found.'}
                                            subHeading={'Try again by changing the service provider on the left or the Timesheet Interval on the top.'}
                                            onClickText={''}
                                            onClickFunction={() => { }}
                                        />
                                    </div>
                                )}
                            </>
                        ) : trackType === 'paymentProcessingStatusTracker' ? (
                            <div>
                                <div className={style.spaceBetween}>
                                    <div className={style.trackServiceProviderName}>{`PAYMENT PROCESSING STATUS BY SERVICE PROVIDER`}</div>
                                    <PrintOutlinedIcon className={`${style.headerPrintIcon} ${style.cursorPointer}`} style={{ color: "#7165E3" }} onClick={handlePrint} />
                                </div>
                                {selectedContractedServiceProvider !== '' ? (
                                    <FormControl sx={{ width: isExpanded ? 'calc(80vw - 80px)' : 'calc(100vw - 160px)', marginTop: '20px' }}>
                                        <Select
                                            labelId="demo-multiple-name-label2"
                                            id="demo-multiple-name2"
                                            multiple
                                            value={selectedTimesheetInterval}
                                            onChange={handleChangeTimesheetInterval}
                                            className={style.timesheetIntervalSelectStyle}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    backgroundColor: "#F1EFFC",
                                                    font: ' normal normal bold 15px/18px Montserrat',
                                                    color: '#52575D',
                                                    textAlign: 'left'
                                                }
                                            }}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: '#F1EFFC',
                                                        '& .MuiMenuItem-root': {
                                                            padding: 2,
                                                        },
                                                    },
                                                },
                                            }}
                                        // disabled={isMyReport || isLoading}
                                        >
                                            {timesheetIntervals?.map((data) => (
                                                <MenuItem
                                                    key={data?.startDate}
                                                    value={`${data?.startDate}%23${data?.endDate}`}
                                                >
                                                    {`Timesheets for ${format(new Date(data?.startDate), 'MMMM yyyy')}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <FormControl sx={{ width: isExpanded ? 'calc(80vw - 80px)' : 'calc(100vw - 160px)', marginTop: '20px' }}>
                                        <Select
                                            labelId="demo-multiple-name-label2"
                                            id="demo-multiple-name2"
                                            value={selectedTimesheetInterval}
                                            onChange={(e) => setSelectedTimesheetInterval([e.target.value])}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: '#F1EFFC',
                                                        '& .MuiMenuItem-root': {
                                                            padding: 2,
                                                        },
                                                    },
                                                },
                                            }}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    backgroundColor: "#F1EFFC",
                                                    font: ' normal normal bold 15px/18px Montserrat',
                                                    color: '#52575D',
                                                    textAlign: 'left'
                                                }
                                            }}
                                        // disabled={isMyReport || isLoading}
                                        >
                                            {timesheetIntervals?.map((data) => (
                                                <MenuItem
                                                    key={data?.startDate}
                                                    value={`${data?.startDate}%23${data?.endDate}`}
                                                >
                                                    {`Timesheets for ${format(new Date(data?.startDate), 'MMMM yyyy')}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                                <div className={`${style.paymentTabGrid} ${style.marginTop20}`}>
                                    <div className={`${style.paymentTabStyle} ${selectedPaymentTab === 'Payment Processed' ? style.selectedPaymentTabStyle : ''} ${style.verticalAlignCenter} ${style.alignCenter}`} onClick={() => setSelectedPaymentTab('Payment Processed')}>Payment Processed</div>
                                    <div className={`${style.paymentTabStyle} ${selectedPaymentTab === 'Payment Pending' ? style.selectedPaymentTabStyle : ''} ${style.verticalAlignCenter} ${style.alignCenter}`} onClick={() => setSelectedPaymentTab('Payment Pending')}>Payment Pending</div>
                                    <div className={`${style.paymentTabStyle} ${selectedPaymentTab === 'Approval Pending' ? style.selectedPaymentTabStyle : ''} ${style.verticalAlignCenter} ${style.alignCenter}`} onClick={() => setSelectedPaymentTab('Approval Pending')}>Approval Pending </div>
                                    <div className={`${style.paymentTabStyle} ${selectedPaymentTab === 'Submission Pending' ? style.selectedPaymentTabStyle : ''} ${style.verticalAlignCenter} ${style.alignCenter}`} onClick={() => setSelectedPaymentTab('Submission Pending')}>Submission Pending</div>
                                </div>
                                {paymentTrackValues !== undefined && (selectedPaymentTab === "Approval Pending" ? paymentTrackValues?.approvalPending?.length !== 0 : selectedPaymentTab === "Submission Pending" ? paymentTrackValues?.submissionPending?.length !== 0 :
                                    selectedPaymentTab === "Payment Pending" ? paymentTrackValues?.paymentPending?.length !== 0 : paymentTrackValues?.paymentProcessed?.length !== 0) ? (
                                    <TrackTable
                                        tableHead={selectedPaymentTab === "Approval Pending" ? ['CONTRACT NAME', 'TIMESHEET LABEL', 'INTERVAL', 'APPROVAL DATE', 'APPROVED BY'] :
                                            selectedPaymentTab === "Submission Pending" ? ['CONTRACT NAME', 'TIMESHEET LABEL', 'INTERVAL'] :
                                                selectedPaymentTab === "Payment Processed" ? ['CONTRACT NAME', 'TIMESHEET LABEL', 'INTERVAL', 'APPROVAL DATE', 'APPROVED BY', 'PAYMENT APPROVED DATE', 'PAYMENT APPROVED BY', 'PAYMENT'] :
                                                    ['CONTRACT NAME', 'TIMESHEET LABEL', 'INTERVAL', 'APPROVAL DATE', 'APPROVED BY']}
                                        tableHeadBottom={[]}
                                        tableData={getPaymentTableValue()}
                                        dataGrid={selectedPaymentTab === "Approval Pending" ? style.approvalPendingTableDataGrid : selectedPaymentTab === "Submission Pending" ? style.submissionPendingTableDataGrid
                                            : selectedPaymentTab === "Payment Processed" ? style.paymentProcessedTableDataGrid : style.paymentPendingTableDataGrid}
                                        tableHeadGrid={selectedPaymentTab === "Approval Pending" ? style.approvalPendingTableDataGrid : selectedPaymentTab === "Submission Pending" ? style.submissionPendingTableDataGrid
                                            : selectedPaymentTab === "Payment Processed" ? style.paymentProcessedTableDataGrid : style.paymentPendingTableDataGrid}
                                        tableHeadBottomGrid={''}
                                        header={false}
                                        directionRow={true}
                                        directionRowCommonText={true}
                                    />
                                ) : (
                                    <div className={style.verticalAlignCenter}>
                                        <NoDataBox
                                            heading={'Based on the parameters selected, there were NO RECORDS found.'}
                                            subHeading={'Try again by changing the service provider on the left or the Timesheet Interval on the top.'}
                                            onClickText={''}
                                            onClickFunction={() => { }}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className={style.spaceBetween}>
                                    <div className={style.trackServiceProviderName}>{`STATUS OF ACTIVITIES/ SERVICES BY SERVICE PROVIDER FOR ${format(new Date(), 'MMMM yyyy')}`}</div>
                                    <PrintOutlinedIcon className={`${style.headerPrintIcon} ${style.cursorPointer}`} style={{ color: "#7165E3" }} onClick={handlePrint} />
                                </div>
                                {selectedContractedServiceProvider !== '' && (
                                    <div className={`${style.trackPeriodCard} ${style.marginTop20} ${style.spaceBetween} ${style.padding20}`}>
                                        <div className={style.trackContractUserAndPeriod}>{`${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.firstName} ${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.lastName}, ${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.suffix?.suffix} - ${format(new Date(), 'MMMM yyyy')}`}</div>
                                        <div className={style.trackContractOrAgreementCount}>{activityTrackServices?.length} Contracts/ Service Agreements</div>
                                    </div>
                                )}
                                {activityTrackServices?.length !== 0 ? activityTrackServices?.map((data, index) => data?.activityStatsByContract?.map((innerData, innerIndex) => (
                                    <TrackTable
                                        heading={`${innerData?.contract?.contractName?.contractName} - ${innerData?.contract?.contractId?.id}`}
                                        columnHeading={[
                                            `Compensation Policy: ${compensationPolicy[innerData?.contract?.compensationPolicy]}`,
                                            `Contract Period:  ${format(new Date(`${innerData?.contract?.contractTerm?.startDate}T00:00`), 'MMM d, yyyy')} - ${format(new Date(`${innerData?.contract?.contractTerm?.endDate}T00:00`), 'MMM d, yyyy')}`,
                                            entityName
                                        ]}
                                        tableHead={innerData?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? ['CONTRACTED ACTIVITY / SERVICES', 'COMPLETED', 'TO BE PROCESSED', ''] : ['CONTRACTED ACTIVITY / SERVICES', 'EXPECTED', 'COMPLETED', 'TO BE PROCESSED', 'BALANCE', '']}
                                        // tableHead={['CONTRACTED ACTIVITY / SERVICES', 'COMPLETED', 'TO BE PROCESSED', 'BALANCE', '']}
                                        tableHeadTop={['', innerData?.activityStatsMeta?.contractYearInterval !== null ? `Contract Year:  ${format(new Date(`${innerData?.activityStatsMeta?.contractYearInterval?.startDate}T00:00`), 'MMM d, yyyy')} - ${format(new Date(`${innerData?.activityStatsMeta?.contractYearInterval?.endDate}T00:00`), 'MMM d, yyyy')}` : '-']}
                                        tableHeadBottom={innerData?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? ['', 'UNITS', 'HOURS', 'UNITS', 'HOURS', ''] : ['', 'UNITS', 'UNITS', 'HOURS', 'UNITS', 'HOURS', 'UNITS', 'HOURS', '']}
                                        // tableHeadBottom={['', 'UNITS', 'HOURS', 'UNITS', 'HOURS', 'UNITS', 'HOURS', '']}
                                        tableData={getTrackTableValue(data)}
                                        headerGrid={style.trackTableHeaderGrid}
                                        dataGrid={innerData?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? style.trackTableDataGridForActivityBased : style.trackTableDataGrid}
                                        tableHeadGrid={innerData?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? style.trackTableHeaderMiddleGridForActivityBased : style.trackTableHeaderMiddleGrid}
                                        tableHeadTopGrid={innerData?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? style.trackTableHeaderTopGridForActivityBased : style.trackTableHeaderTopGrid}
                                        tableHeadBottomGrid={innerData?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? style.trackTableHeaderBottomGridForActivityBased : style.trackTableHeaderBottomGrid}
                                        header={true}
                                        directionRow={false}
                                    />
                                ))) : (
                                    <div className={style.verticalAlignCenter}>
                                        <NoDataBox
                                            heading={'Based on the selection, there were NO RECORDS found.'}
                                            subHeading={'Try again by changing the service provider on the left.'}
                                            onClickText={''}
                                            onClickFunction={() => { }}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Fragment >
    )
}

export default TrackYourContracts;