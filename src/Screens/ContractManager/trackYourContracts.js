import React, { Fragment, useState, useEffect, cloneElement } from 'react';
import Navbar from './../../Components/Navbar';
import SideBar from '../../Components/Sidebar';
import CommonSelectField from '../../Components/CommonFields/CommonSelectField';
import { GET } from '../dataSaver';
import { useParams } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import { format } from 'date-fns';
import Select from '@mui/material/Select';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';

import 'react-data-grid/lib/styles.css';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import DownloadIcon from '@mui/icons-material/Download';
import style from './index.module.scss';
import TrackTable from '../../Components/TrackTable';

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
    const [currentUserDetails, setCurrentUserDetails] = useState();
    const [userId, setUserId] = useState(userDetail?.id);
    const [selectedContracts, setSelectedContracts] = useState([]);
    const [activityTrackServices, setActivityTrackServices] = useState([]);
    const [timesheetTrackValues, setTimesheetTrackValues] = useState([]);
    const [timesheetIntervals, setTimesheetIntervals] = useState([]);
    const [timesheetIntervalsStartDate, setTimesheetIntervalsStartDate] = useState('');
    const [timesheetIntervalsEndDate, setTimesheetIntervalsEndDate] = useState('');
    const [showTimesheetInterval, setShowTimesheetInterval] = useState(false);
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


    const getColumns = (data, index) => {
        let tempCol = [
            { field: 'service', headerName: '', width: 280 },
            { field: 'hourlyRate', headerName: 'Pro-Rata Hourly Rate', width: 140 },
            { field: 'cyExpectedHours', headerName: 'Expected (Hours)', width: 140 },
            { field: 'cyExpectedAmount', headerName: 'Expected (Amount)', width: 140 },
            { field: 'cymExpectedHours', headerName: 'Expected (Hours)', width: 140 },
            { field: 'cymExpectedAmount', headerName: 'Expected (Amount)', width: 140 },
        ];

        // contractTrackCompensationValues?.map((data, index) => {
        data?.timesheetActivitiesWithActualValuesList?.map((actualValue, actualIndex) => {
            tempCol.push({ field: `cy${index + 1}m${actualIndex + 1}ActualHours`, headerName: `Actual (Hours)`, width: 140 })
            tempCol.push({ field: `cy${index + 1}m${actualIndex + 1}ActualAmount`, headerName: `Actual (Amount)`, width: 140 })
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
                hourlyRate: `${expectedValue?.hourlyRate}`,
                cyExpectedHours: expectedValue?.expectedHoursInYear,
                cyExpectedAmount: expectedValue?.expectedAmountInYear,
                cymExpectedHours: expectedValue?.expectedHoursInMonth,
                cymExpectedAmount: expectedValue?.expectedAmountInMonth
            })
        })
        data?.timesheetActivitiesWithActualValuesList?.map((timesheetData, timesheetIndex) => {
            timesheetData?.activityWithActualValuesList?.map((actualValue, actualIndex) => {
                let tempIndex = tempRow.findIndex(obj => obj['service'] === `${actualValue?.activityType} - ${actualValue?.performingActivity}`)
                tempRow[tempIndex][`cy${index + 1}m${timesheetIndex + 1}ActualHours`] = actualValue?.actualHours
                tempRow[tempIndex][`cy${index + 1}m${timesheetIndex + 1}ActualAmount`] = `$ ${actualValue?.actualAmount?.toLocaleString()}`
            })
        })
        // });

        console.log(tempRow)

        return tempRow;
    }

    const getColumnGroupingModel = (data, index) => {
        if (contractTrackCompensationValues?.length !== 0) {
            console.log(contractTrackCompensationValues?.[0]?.contractYearInterval?.startDate)
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
                    groupId: `CY ${format(new Date(contractTrackCompensationValues?.[0]?.contractYearInterval?.startDate), 'yyyy')}`,
                    description: '',
                    children: [{ field: 'cyExpectedHours' }, { field: 'cyExpectedAmount' }],
                },
                {
                    groupId: `CY Monthly (${format(new Date(contractTrackCompensationValues?.[0]?.contractYearInterval?.startDate), 'yyyy')})`,
                    description: '',
                    children: [{ field: 'cymExpectedHours' }, { field: 'cymExpectedAmount' }],
                },
            ];
            // contractTrackCompensationValues?.map((data, index) => {
            data?.timesheetActivitiesWithActualValuesList?.length !== 0 &&
                data?.timesheetActivitiesWithActualValuesList?.map((actualValue, actualIndex) => {
                    columnGroupingModel?.push({
                        groupId: `CY M${actualIndex + 1} (${months[actualValue?.month]} ${actualValue?.year})`,
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
        if (trackType === 'timesheetAndInvoiceApprovalsStatusTracker') {
            getTimesheetIntervals()
        }
    }, [trackType])

    useEffect(() => {
        getTimesheetTrackValues()
    }, [timesheetIntervalsStartDate, timesheetIntervalsEndDate])

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
        if (timesheetIntervalsStartDate !== '' && timesheetIntervalsEndDate !== '') {
            const { data: data } = await GET(`timesheet-management-service/timesheet/track/workflow?startDate=${timesheetIntervalsStartDate}&endDate=${timesheetIntervalsEndDate}`);
            setTimesheetTrackValues(data);
        }
    }

    const getTimesheetIntervals = async () => {
        const { data: data } = await GET(`timesheet-management-service/timesheet/timesheetIntervals`);
        setTimesheetIntervals(data);
        if (data?.length !== 0) {
            setTimesheetIntervalsStartDate(data?.[0]?.startDate)
            setTimesheetIntervalsEndDate(data?.[0]?.endDate)
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
                    service?.push({ type: 'parentChildService', name: data, values: filteredServiceValues?.[data]?.map(data => `${(data?.activityType.length > 25 && activityData?.contract?.compensationPolicy !== 'ACTIVITY_BASED') ? data?.activityType.slice(0, 25) + '...' : data?.activityType} (${data?.timeBlock})`) })
                    completedUnits?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.complated?.units) })
                    completedHours?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.complated?.hours) })
                    toBeProposedUnits?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.inprogress?.units) })
                    toBeProposedHours?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.inprogress?.hours) })
                    if (activityData?.contract?.compensationPolicy !== 'ACTIVITY_BASED') {
                        expectedUnits?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.contractYearExpected?.units) })
                        // expectedHours?.push({ type: 'text', values: filteredServiceValues?.[data]?.map(data => data?.contractYearExpected?.hours) })
                        balanceUnits?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.balance?.units), color: filteredServiceValues?.[data]?.map(data => data?.balanceUnitsStatus === 'SUFFICIENT' ? style.greenBigNumber : data?.balanceUnitsStatus === 'DEFICIT' ? style.yellowBigNumber : style.redBigNumber) })
                        balanceHours?.push({ type: 'number', values: filteredServiceValues?.[data]?.map(data => data?.balance?.hours), color: filteredServiceValues?.[data]?.map(data => data?.balanceUnitsStatus === 'SUFFICIENT' ? style.greenBigNumber : data?.balanceUnitsStatus === 'DEFICIT' ? style.yellowBigNumber : style.redBigNumber) })
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

    let timesheetServiceProvider = [];
    let timesheetName = [];
    let timesheetCompensationPolicy = [];
    let submissionStatusAndDate = [];
    let reviewAndApprovalStatusAndDate = [];
    let reviewAndApprovalApprovalDays = [];
    let paymentProcessingStatusAndDate = [];
    let paymentProcessingApprovalDays = [];
    let remainingTerm = [];

    const getTimesheetTableValue = () => {
        timesheetServiceProvider = [];
        timesheetName = [];
        timesheetCompensationPolicy = [];
        submissionStatusAndDate = [];
        reviewAndApprovalStatusAndDate = [];
        reviewAndApprovalApprovalDays = [];
        paymentProcessingStatusAndDate = [];
        paymentProcessingApprovalDays = [];
        remainingTerm = [];
        timesheetTrackValues?.map(data => {
            timesheetServiceProvider.push({ type: 'text', values: data?.timesheetsWithLogs !== null ? data?.timesheetsWithLogs?.map(timesheetData => `${data?.user?.name?.firstName} ${data?.user?.name?.lastName}, ${data?.user?.name?.suffix?.suffix}`) : [''] });
            timesheetName.push({ type: 'text', values: data?.timesheetsWithLogs !== null ? data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.timesheetLabel?.label) : [''] })
            submissionStatusAndDate.push({ type: 'text', values: data?.timesheetsWithLogs !== null ? data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.submissionStausLog !== null ? format(new Date(timesheetData?.submissionStausLog?.date), 'MMM dd, yyyy') : []) : [''] })
            reviewAndApprovalStatusAndDate.push({ type: 'text', values: data?.timesheetsWithLogs !== null ? data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.reviewApprovalStausLog !== null ? format(new Date(timesheetData?.reviewApprovalStausLog?.dueDate), 'MMM dd, yyyy') : []) : [''] })
            reviewAndApprovalApprovalDays.push({ type: 'text', values: data?.timesheetsWithLogs !== null ? data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.reviewApprovalStausLog !== null ? timesheetData?.reviewApprovalStausLog?.daysToApprove : []) : [''] })
            paymentProcessingStatusAndDate.push({ type: 'text', values: data?.timesheetsWithLogs !== null ? data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.paymentProcessingStausLog !== null ? format(new Date(timesheetData?.paymentProcessingStausLog?.date), 'MMM dd, yyyy') : []) : [''] })
            paymentProcessingApprovalDays.push({ type: 'text', values: data?.timesheetsWithLogs !== null ? data?.timesheetsWithLogs?.map(timesheetData => timesheetData?.paymentProcessingStausLog !== null ? timesheetData?.paymentProcessingStausLog?.daysToApprove : []) : [''] })
            timesheetCompensationPolicy.push({ type: 'text', values: data?.timesheetsWithLogs !== null ? data?.timesheetsWithLogs?.map(timesheetData => compensationPolicy[data?.contract?.compensationPolicy]) : [''] });
            remainingTerm.push({ type: 'text', values: data?.timesheetsWithLogs !== null ? data?.timesheetsWithLogs?.map(timesheetData => data?.remainingTerm) : [''] })
        })
        return [
            // timesheetServiceProvider,
            // timesheetName,
            // timesheetCompensationPolicy,
            // submissionStatusAndDate,
            // reviewAndApprovalStatusAndDate,
            // reviewAndApprovalApprovalDays,
            // paymentProcessingStatusAndDate,
            // paymentProcessingApprovalDays,
            // remainingTerm
        ]
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
                                    firstOptionLabel={"Select a service provider"}
                                    firstOptionValue={""}
                                    valueList={contractedServiceProviders?.map(data => data?.id)}
                                    labelList={contractedServiceProviders?.map(data => `${data?.name?.firstName} ${data?.name?.lastName}`)}
                                    disabledList={contractedServiceProviders?.map(data => false)}
                                />
                            </div>
                        </SideBar>
                    </div>
                    <div className={` ${style.padding20} ${style.whiteBackground}`}>
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
                                    {selectedContracts?.length !== 0 && contractTrackCompensationValues?.map((data, index) => (
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
                                    ))}
                                </div>
                                <div>

                                </div>
                            </>
                        ) : trackType === 'timesheetAndInvoiceApprovalsStatusTracker' ? (
                            <>
                                <div className={style.spaceBetween}>
                                    <div className={style.trackServiceProviderName}>{`TIMESHEET SUBMITTED PROCESSING STATUS BY SERVICE PROVIDER`}</div>
                                    <PrintOutlinedIcon className={`${style.headerPrintIcon} ${style.cursorPointer}`} style={{ color: "#7165E3" }} />
                                </div>
                                {timesheetIntervals?.length !== 0 && (
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
                                )}
                                {timesheetTrackValues?.length !== 0 && (
                                    <TrackTable
                                        tableHead={['SERVICE PROVIDER', 'TIMESHEET NAME', 'COMPENSATION POLICY', 'SUBMISSION', 'REVIEW & APPROVAL', 'PAYMENT PROCESSING', 'REMAINING TERM']}
                                        tableHeadBottom={['', '', '', 'STATUS & DATE', 'STATUS & DATE', 'APPROVAL DAYS', 'STATUS & DATE', 'APPROVAL DAYS', '', '']}
                                        tableData={getTimesheetTableValue()}
                                        dataGrid={style.timesheetTableDataGrid}
                                        tableHeadGrid={style.timesheetTableHeaderMiddleGrid}
                                        tableHeadBottomGrid={style.timesheetTableHeaderBottomGrid}
                                        header={false}
                                    />
                                )}
                            </>
                        ) : (
                            <>
                                <div className={style.spaceBetween}>
                                    <div className={style.trackServiceProviderName}>{`STATUS OF ACTIVITIES/ SERVICES BY SERVICE PROVIDER FOR ${format(new Date(), 'MMMM yyyy')}`}</div>
                                    <PrintOutlinedIcon className={`${style.headerPrintIcon} ${style.cursorPointer}`} style={{ color: "#7165E3" }} />
                                </div>
                                {selectedContractedServiceProvider !== '' && (
                                    <div className={`${style.trackPeriodCard} ${style.marginTop20} ${style.spaceBetween} ${style.padding20}`}>
                                        <div className={style.trackContractUserAndPeriod}>{`${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.firstName} ${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.lastName}, ${contractedServiceProviders?.filter(data => data?.id === selectedContractedServiceProvider)?.map(data => data)?.[0]?.name?.suffix?.suffix} - ${format(new Date(), 'MMMM yyyy')}`}</div>
                                        <div className={style.trackContractOrAgreementCount}>{activityTrackServices?.length} Contracts/ Service Agreements</div>
                                    </div>
                                )}
                                {activityTrackServices?.map((data, index) => (
                                    <TrackTable
                                        heading={`${data?.activityStatsByContract?.[index]?.contract?.contractName?.contractName} - ${data?.activityStatsByContract?.[index]?.contract?.contractId?.id}`}
                                        columnHeading={[
                                            `Compensation Policy: ${compensationPolicy[data?.activityStatsByContract?.[index]?.contract?.compensationPolicy]}`,
                                            `Contract Period: ${format(new Date(data?.activityStatsByContract?.[index]?.contract?.contractTerm?.startDate), 'MMM d, yyyy')} - ${format(new Date(data?.activityStatsByContract?.[index]?.contract?.contractTerm?.endDate), 'MMM d, yyyy')}`,
                                            'San Mateo Medical Center'
                                        ]}
                                        tableHead={data?.activityStatsByContract?.[index]?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? ['CONTRACTED ACTIVITY / SERVICES', 'COMPLETED', 'TO BE PROCESSED', ''] : ['CONTRACTED ACTIVITY / SERVICES', 'EXPECTED', 'COMPLETED', 'TO BE PROCESSED', 'BALANCE', '']}
                                        // tableHead={['CONTRACTED ACTIVITY / SERVICES', 'COMPLETED', 'TO BE PROCESSED', 'BALANCE', '']}
                                        tableHeadTop={['', `Contract Year: ${format(new Date(data?.activityStatsByContract?.[index]?.activityStatsMeta?.contractYearInterval?.startDate), 'MMM d, yyyy')} - ${format(new Date(data?.activityStatsByContract?.[index]?.activityStatsMeta?.contractYearInterval?.endDate), 'MMM d, yyyy')}`]}
                                        tableHeadBottom={data?.activityStatsByContract?.[index]?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? ['', 'UNITS', 'HOURS', 'UNITS', 'HOURS', ''] : ['', 'UNITS', 'UNITS', 'HOURS', 'UNITS', 'HOURS', 'UNITS', 'HOURS', '']}
                                        // tableHeadBottom={['', 'UNITS', 'HOURS', 'UNITS', 'HOURS', 'UNITS', 'HOURS', '']}
                                        tableData={getTrackTableValue(data)}
                                        headerGrid={style.trackTableHeaderGrid}
                                        dataGrid={data?.activityStatsByContract?.[index]?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? style.trackTableDataGridForActivityBased : style.trackTableDataGrid}
                                        tableHeadGrid={data?.activityStatsByContract?.[index]?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? style.trackTableHeaderMiddleGridForActivityBased : style.trackTableHeaderMiddleGrid}
                                        tableHeadTopGrid={data?.activityStatsByContract?.[index]?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? style.trackTableHeaderTopGridForActivityBased : style.trackTableHeaderTopGrid}
                                        tableHeadBottomGrid={data?.activityStatsByContract?.[index]?.contract?.compensationPolicy === 'ACTIVITY_BASED' ? style.trackTableHeaderBottomGridForActivityBased : style.trackTableHeaderBottomGrid}
                                        header={true}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default TrackYourContracts;