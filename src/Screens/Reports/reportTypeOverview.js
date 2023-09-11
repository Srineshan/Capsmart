import React, { Fragment, useState, useEffect, useRef, useCallback, createRef } from 'react';
import SampleReportLeftCard from './sampleReportLeftCard';
import Navbar from '../../Components/Navbar';
import { GET } from './../dataSaver';
import ReportPerformanceAndOptions from './reportPerformanceAndOptions';
import ReportHeader from './reportHeader';
import ReportFooter from './reportFooter';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";
import { format } from 'date-fns';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { toPDF } from '../../Components/ConvertToPdf';
import ProgressBar from "@ramonak/react-progress-bar";
import Pie from './d3-chart/pieGraph';
import Watermark from 'react-awesome-watermark';
import styled from 'styled-components';
import SideBar from '../../Components/Sidebar';
import StackedBarChartBaseLayout2 from './d3-chart/BarChart/stackedBarChartBaseLayout2';
import StackedBarChartBaseLayout3 from './d3-chart/BarChart/stackedBarChartBaseLayout3';
import ApexPieChart from './chart-data/pie-chart';
import ApexGroupedBarChart from './chart-data/groupedBarChart';
import ApexStackedBarChart from './chart-data/stackedBarChart';
import ApexLineChart from './chart-data/lineChart';
import ApexBarChart from './chart-data/barChart';

import style from './index.module.scss';
import ApexBoxChart from './chart-data/boxChart';
import ReportsTable from '../../Components/ReportsTable';
import ReportNoDataBox from '../../Components/ReusableSmallComponents/reportNoDataBox';
import { formatInTimeZone } from 'date-fns-tz';

const ReportTypeOverview = () => {
    const { reportType } = useParams();
    const isMyReport = window.location.pathname.includes("/myReport");
    const myReportId = sessionStorage.getItem('myReportId')
    const handle = useFullScreenHandle();
    const componentRef = useRef(null);
    const PDFRef = createRef();
    const onBeforeGetContentResolve = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [isNoData, setIsNoData] = useState(false);
    const [contractRenewalReport, setContractRenewalReport] = useState([]);
    const [oneTimeContract, setOneTimeContract] = useState([]);
    const [nonCompliantContract, setNonCompliantContract] = useState([]);
    const [selectedPodTypeFromTile, setSelectedPodTypeFromTile] = useState('');
    const [nonCompliantContractTile, setNonCompliantContractTile] = useState([]);
    const [individualContract, setIndividualContract] = useState([]);
    const [multipleContract, setMultipleContract] = useState([]);
    const [user, setUsers] = useState([]);
    const [dataToUseInReport, setDataToUseInReport] = useState({});
    const [pieData, setPieData] = useState([]);
    const [lineData, setLineData] = useState([]);
    const [stackedKeys, setStackedKeys] = useState([]);
    const [reportLog, setReportLog] = useState([]);
    const [activitiesOrServicesValues, setActivitiesOrServicesValues] = useState();
    const [addOnServicesValues, setAddOnServicesValues] = useState();
    const [addOnAcceptedReportLog, setAddOnAcceptedReportLog] = useState([]);
    const [addOnRejectedReportLog, setAddOnRejectedReportLog] = useState([]);
    const [paymentsReportLog, setPaymentsReportLog] = useState();
    const [compensationCostAnalysis, setCompensationCostAnalysis] = useState();
    const [series, setSeries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [barChartSeries, setBarChartSeries] = useState([]);
    const [barChartCategories, setBarChartCategories] = useState([]);
    const [stackedSeries, setStackedSeries] = useState([]);
    const [stackedCategories, setStackedCategories] = useState([]);
    const [isDownloadClicked, setIsDownloadClicked] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [rejectedTimesheetCountBreakUp, setRejectedTimesheetCountBreakUp] = useState();
    const [totalTimesheetRejectedCount, setTotalTimesheetRejectedCount] = useState(0);
    const [totalSubmittedTimesheets, setTotalSubmittedTimesheets] = useState(0);
    const [notPaidTimesheetsData, setNotPaidTimesheetsData] = useState();
    const [timesheetProcessingSummaryData, setTimesheetProcessingSummaryData] = useState();
    const [submittedTimesheetsPaymentStatusData, setSubmittedTimesheetsPaymentStatusData] = useState();
    const [isNonCompliantReportTileClicked, setIsNonCompliantReportTileClicked] = useState(false);
    const [apexStackedBarChartDisplay, setApexStackedBarChartDisplay] = useState(
        <ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} />
    )
    let months = { '1': 'Jan', '2': 'Feb', '3': 'March', '4': 'April', '5': 'May', '6': 'June', '7': 'July', '8': 'Aug', '9': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' };
    const podTypes = ['Medical Staff Membership & Privileges',
        'Primary Speciality Board Certification',
        'Secondary Specialty Board Certification',
        'Liability Insurance Certificate',
        'Workers Compensation Insurance Certificate',
        'Tail Insurance Coverage Certificate',
        'Medical license Certificate',
        'Drug Enforcement Administration (DEA) License',
        'Controlled Substance DEA Registration Certificate'];

    const getProgressValue = {
        reSubmissionInprogress: 'Re-Submission In progress',
        reSubmittedReviewInprogress: 'Re-Submitted Review In progress',
        reviewCompleted: 'Review Completed/ Approval In Progress',
        approvalCompleted: 'Approval Completed/ Payment In Progress',
        unpaid: 'Not Paid',
        paid: 'Payment Made'
    }

    useEffect(() => {
        setActivitiesOrServices();
    }, [activitiesOrServicesValues]);

    useEffect(() => {
        setAddOnServices();
    }, [addOnServicesValues]);

    useEffect(() => {
        // if (reportType === 'upcomingContractRenewals') {
        //     getContractRenewalReport();
        // }
        // if (reportType === 'oneTimeContract') {
        //     getOneTimeContract();
        // }
        // if (reportType === 'nonCompliant') {
        //     getNonCompliantContractReportTile();
        // }
        // if (reportType === 'activitiesOrServices') {
        //     getAcvityAndServices();
        // }
        // if (reportType === 'addOnActivities') {
        //     getAddOnServices();
        // }
        // if (reportType === 'timesheetProcessingSummary') {
        //     getTimesheetProcessingSummary('withoutParameter');
        // }
        // if (reportType === 'listingOfTimesheetsNotPaid') {
        //     getListingOfTimesheetNotPaid('withoutParameter');
        // }
        // if (reportType === 'submittedTimesheetsPaymentStatus') {
        //     getSubmittedTimesheetsPaymentStatus('withoutParameter');
        // }
        // if (reportType === 'paymentsProcessingSummary') {
        //     getPayments();
        // }
        // if (reportType === 'compensationCostAnalysis') {
        //     getCompensationCostAnalysis();
        // }
        getUsersData();
        console.log('initial one');
    }, [])

    useEffect(() => {
        getUpdatedValuesWithParams();
    }, [selectedPodTypeFromTile, dataToUseInReport?.from, dataToUseInReport?.to, dataToUseInReport?.selectedContracts, dataToUseInReport?.selectedContractedServiceProvider, dataToUseInReport?.selectedSites, dataToUseInReport?.selectedDepartments])

    useEffect(() => {
        setApexStackedBarChartDisplay(<ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} />);
    }, [stackedCategories, stackedSeries])

    const getUpdatedValuesWithParams = () => {
        if (reportType === 'upcomingContractRenewals') {
            getContractRenewalReportWithParameters();
        }
        if (reportType === 'oneTimeContract') {
            getOneTimeContractWithParameters();
        }
        if (reportType === 'nonCompliant') {
            getNonCompliantContractReportTile();
        }
        if (reportType === 'activitiesOrServices') {
            getAcvityAndServicesWithParameter();
        }
        if (reportType === 'addOnActivities') {
            getAddOnServicesWithParameter();
        }
        if (reportType === 'nonCompliant' && isNonCompliantReportTileClicked) {
            setSelectedPodTypeFromTile(dataToUseInReport?.podType)
            getNonCompliantContractReport();
        }
        if (reportType === 'paymentsProcessingSummary') {
            getPayments();
        }
        if (reportType === 'compensationCostAnalysis') {
            getCompensationCostAnalysis();
        }
        if (reportType === 'timesheetProcessingSummary') {
            getTimesheetProcessingSummary('withParameter');
        }
        if (reportType === 'listingOfTimesheetsNotPaid') {
            getListingOfTimesheetNotPaid('withParameter');
        }
        if (reportType === 'submittedTimesheetsPaymentStatus') {
            getSubmittedTimesheetsPaymentStatus('withParameter');
        }
    }

    const getIsRefresh = (value) => {
        if (value) {
            setIsLoading(true);
            setIsUpdated(false);
            if (reportType === 'upcomingContractRenewals') {
                getContractRenewalReportWithParameters();
            }
            if (reportType === 'oneTimeContract') {
                getOneTimeContractWithParameters();
            }
            if (reportType === 'nonCompliant') {
                getNonCompliantContractReportTile();
            }
            if (reportType === 'activitiesOrServices') {
                getAcvityAndServicesWithParameter();
            }
            if (reportType === 'addOnActivities') {
                getAddOnServicesWithParameter();
            }
            if (reportType === 'nonCompliant' && isNonCompliantReportTileClicked) {
                setSelectedPodTypeFromTile(dataToUseInReport?.podType)
                getNonCompliantContractReport();
            }
            if (reportType === 'paymentsProcessingSummary') {
                getPayments();
            }
            if (reportType === 'compensationCostAnalysis') {
                getCompensationCostAnalysis();
            }
            if (reportType === 'timesheetProcessingSummary') {
                getTimesheetProcessingSummary('withParameter');
            }
            if (reportType === 'listingOfTimesheetsNotPaid') {
                getListingOfTimesheetNotPaid('withParameter');
            }
            if (reportType === 'submittedTimesheetsPaymentStatus') {
                getSubmittedTimesheetsPaymentStatus('withParameter');
            }
        }
    }

    useEffect(() => {
        setIndividualContract(contractRenewalReport?.filter(data => data?.contractType === "INDIVIDUAL")?.map(data => data));
        setMultipleContract(contractRenewalReport?.filter(data => data?.contractType === "MULTIPLE")?.map(data => data));
    }, [contractRenewalReport]);

    useEffect(() => {
        setIndividualContract(oneTimeContract?.filter(data => data?.contractType === "INDIVIDUAL")?.map(data => data));
        setMultipleContract(oneTimeContract?.filter(data => data?.contractType === "MULTIPLE")?.map(data => data));
    }, [oneTimeContract]);

    useEffect(() => {
        if (reportType === 'nonCompliant' && isNonCompliantReportTileClicked) {
            getNonCompliantContractReport();
        }
    }, [isNonCompliantReportTileClicked]);

    useEffect(() => {
        setIsNoData((paymentsReportLog?.paymentContracts?.length === 0 && paymentsReportLog?.rejected?.length === 0 && paymentsReportLog?.paymentPastDue?.length === 0 && paymentsReportLog?.paymentNotDone?.length === 0 && paymentsReportLog?.paymentDelayed?.length === 0 && paymentsReportLog?.paidOnTime?.length === 0) ? true : false);
    }, [paymentsReportLog])

    useEffect(() => {
        setTimesheetProcessingSummary();
    }, [timesheetProcessingSummaryData])

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: "Report",
        // onBeforeGetContent: handleOnBeforeGetContent,
        // onBeforePrint: handleBeforePrint,
        // onAfterPrint: handleAfterPrint,
        removeAfterPrint: true
    });

    const availableTimesheetStatus = {
        REJECTED_BY_APPROVER: 'Rejected By Approver',
        PAYMENT: 'Payment',
        SUBMITTED: 'Submitted',
        REVIEWED: 'Reviewed',
        REJECTED_BY_REVIEWER: 'Rejected By Reviewer',
        DISPUTED_BY_REVIEWER: 'Disputed In Reviewer',
        APPROVED: 'Approved',
        DISPUTED_BY_APPROVER: 'Disputed In Approver',
        REJECTED_BY_ACCOUNTPAYABLE: 'Rejected By AccountPayable',
        RESUBMITTED: 'Resubmitted',
        COMPLETED: 'Completed',
        DISPUTED_IN_REVIEW: 'Disputed In review',
        DISPUTED_IN_APPROVE: 'Disputed In Approve',
        DISPUTE_RESPONDED: 'Dispute Responded',
        IN_REVIEW: 'In Review',
        IN_APPROVE: 'In Approve',
        PAYMENT_APPROVED: 'Payment Approved'
    }

    const reportTitleList = {
        upcomingContractRenewals: 'Upcoming Contract Renewals',
        oneTimeContract: "List of One Time Contracts that will Terminate on Expiration",
        scheduledActivity: "Scheduled Activity/ Services - Forcasted To Actual",
        scheduledActivityByContract: "Scheduled Activity/ Services - Forcasted To Actual By Contract",
        complianceStatus: "Proof Of Documentation Status By Contractor",
        nonCompliant: 'List of Contracts that are non compliant with proof of documentation requirement',
        paymentsProcessingSummary: 'Payments Processing Summary',
        compensationCostAnalysis: 'Compensation Cost Analysis',
        timesheetProcessingSummary: 'Timesheet Processing Summary',
        listingOfTimesheetsNotPaid: 'Listing Of Timesheets Not Paid',
        submittedTimesheetsPaymentStatus: 'Submitted Timesheets Payment Status',
        addOnActivities: 'Add On Activities/ Services Requests Status Summary',
        activitiesOrServices: 'Activities/ Services Log Status Summary'
    }

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    }

    const getIsDownloadClicked = (value) => {
        setIsDownloadClicked(value);
        console.log('entered')
        if (value) {
            toPDF(".Report");
        }
    }

    const getAcvityAndServices = async () => {
        if (!isMyReport) {
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/activityServiceReport?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
            setActivitiesOrServicesValues(chartDataValues);
        } else {
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/activityServiceReport?id=${myReportId}`);
            setActivitiesOrServicesValues(chartDataValues);
        }
    }

    const setActivitiesOrServices = () => {
        setReportLog(activitiesOrServicesValues?.activities);
        if (activitiesOrServicesValues) {
            let temp = [];
            activitiesOrServicesValues?.activityServiceReports?.map((pie, index) => {
                temp[index] = { key: pie.activityStatus, value: pie.count }
            })
            setPieData(temp);
            let lineTemp = [];
            activitiesOrServicesValues?.completedActivitiesByDate?.map((line, index) => {
                lineTemp[index] = { date: format(new Date(line.statedate), 'MM-dd'), value: line.count };
            })
            lineTemp.sort((a, b) => new Date(a.date) - new Date(b.date));
            setLineData(lineTemp);
            if (activitiesOrServicesValues?.activityStatusByCategorys?.length !== 0) {
                setSeries([{
                    'data': activitiesOrServicesValues?.activityStatusByCategorys?.map(data => data?.done),
                    'name': 'Done'
                },
                {
                    'data': activitiesOrServicesValues?.activityStatusByCategorys?.map(data => data?.todo),
                    'name': 'To Do'
                },
                {
                    'data': activitiesOrServicesValues?.activityStatusByCategorys?.map(data => data?.notdone),
                    'name': 'Not Done'
                },
                ])
                setCategories(activitiesOrServicesValues?.activityStatusByCategorys?.map(data => data?.activityType));
            } else {
                setSeries([]);
                setCategories([]);
            }


            let stackedTemp = [];
            let keysForChart = [];
            activitiesOrServicesValues?.completedActivitiesBycategoryAndMonth?.map((stack, index) => {
                let values = stack.types;
                let keysInObject = Object.keys(stack.types);
                keysInObject?.map(data => {
                    if (!keysForChart?.includes(data)) {
                        keysForChart.push(data);
                    }
                })
                setStackedKeys(keysForChart);
                values['name'] = months[stack?.month];
                values['type'] = 1;
                stackedTemp.push(values);
            })
            let tempStackedSeries = [];
            keysForChart?.map((data, index) => {
                tempStackedSeries.push({
                    'data': stackedTemp?.map(stackedData => stackedData?.[data] ? stackedData?.[data] : 0),
                    'name': data
                })
            })
            setStackedSeries(tempStackedSeries);
            setStackedCategories(stackedTemp?.map(stackedData => stackedData?.name));
        }
        setIsLoading(false);
        showActivitiesOrServicesReport();
    }

    const getAddOnServices = async () => {
        if (!isMyReport) {
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/addOnActivityServiceReport?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
            setAddOnServicesValues(chartDataValues);
        } else {
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/addOnActivityServiceReport?id=${myReportId}`);
            setAddOnServicesValues(chartDataValues);
        }
    }

    const setAddOnServices = () => {
        setAddOnAcceptedReportLog(addOnServicesValues?.approvedActivities);
        setAddOnRejectedReportLog(addOnServicesValues?.rejectedActivities);
        if (addOnServicesValues) {
            let temp = [];
            addOnServicesValues?.addOnActivityServiceReports?.map((pie, index) => {
                temp[index] = { key: pie.addOnActivityRequestStatus, value: pie.count }
            })
            setPieData(temp);
            if (addOnServicesValues?.addOnActivityStatusByCategorys?.length !== 0) {
                setSeries([{
                    'data': addOnServicesValues?.addOnActivityStatusByCategorys?.map(data => data?.approved),
                    'name': 'Approved'
                },
                {
                    'data': addOnServicesValues?.addOnActivityStatusByCategorys?.map(data => data?.inprogress),
                    'name': 'In Progress'
                },
                {
                    'data': addOnServicesValues?.addOnActivityStatusByCategorys?.map(data => data?.onhold),
                    'name': 'On Hold'
                },
                {
                    'data': addOnServicesValues?.addOnActivityStatusByCategorys?.map(data => data?.rejected),
                    'name': 'Rejected'
                }])
                setCategories(addOnServicesValues?.addOnActivityStatusByCategorys?.map(data => data?.activityType));
            } else {
                setSeries([]);
                setCategories([]);
            }

            let stackedTemp = [];
            let keysForChart = [];
            addOnServicesValues?.approvedAddOnActivitiesByCategoryAndMonth?.map((stack, index) => {
                let values = stack.types;
                keysForChart = Object.keys(stack.types);
                setStackedKeys(keysForChart);
                values['name'] = months[stack?.month];
                values['type'] = 1;
                stackedTemp.push(values);
            })
            let tempStackedSeries = [];
            keysForChart?.map((data, index) => {
                tempStackedSeries.push({
                    'data': stackedTemp?.map(stackedData => stackedData?.[data]),
                    'name': data
                })
                setStackedSeries(tempStackedSeries);
            })
            // setStackedData(stackedTemp);
            setStackedCategories(stackedTemp?.map(stackedData => stackedData?.name));
        }
        setIsLoading(false);
    }

    const getAddOnServicesWithParameter = async () => {
        if (!isMyReport) {
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/addOnActivityServiceReport?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
            setAddOnServicesValues(chartDataValues);
        } else {
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/addOnActivityServiceReport?id=${myReportId}`);
            setAddOnServicesValues(chartDataValues);
        }
    }

    const getAcvityAndServicesWithParameter = async () => {
        if (!isMyReport) {
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/activityServiceReport?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts || []}&users=${dataToUseInReport?.selectedContractedServiceProvider || []}&sites=${dataToUseInReport?.selectedSites || []}&departments=${dataToUseInReport?.selectedDepartments || []}`);
            setActivitiesOrServicesValues(chartDataValues);
        } else {
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/activityServiceReport?id=${myReportId}`);
            setActivitiesOrServicesValues(chartDataValues);
        }
    }

    const getCompensationCostAnalysis = async () => {
        const { data: chartData } = await GET(`timesheet-management-service/timesheet/compensationCostAnalysis?contractId=${dataToUseInReport?.selectedContracts}`);
        setCompensationCostAnalysis(chartData);
        setIsLoading(false);
    }

    const getPayments = async () => {
        let chartData;
        if (!isMyReport) {
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/paymentProcessingSummary?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}`);
            chartData = chartDataValues;
        } else {
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/paymentProcessingSummary?id=${myReportId}`);
            chartData = chartDataValues;
        }
        setPaymentsReportLog(chartData);
        if ((chartData?.paymentStats?.avgPayment !== 0 ||
            chartData?.paymentStats?.count !== 0 ||
            chartData?.paymentStats?.maxPayment !== 0 ||
            chartData?.paymentStats?.medianPayment !== 0 ||
            chartData?.paymentStats?.minPayment !== 0) && chartData !== undefined) {
            let temp = [];
            console.log(chartData)
            Object?.keys(chartData?.timesheetProcessingStatus)?.map((data, index) => {
                temp[index] = { key: data, value: Object?.values(chartData?.timesheetProcessingStatus)?.[index] }
            })
            setPieData(temp);
        } else {
            setPieData([]);
        }
        if (chartData?.paymentContracts?.length !== 0 && chartData !== undefined) {
            setBarChartSeries([{
                'data': chartData?.paymentContracts?.map(data => data?.payment),
                'name': 'Dollars Paid'
            }])
            setBarChartCategories(chartData?.paymentContracts?.map(data => data?.contractId));
        } else {
            setBarChartSeries([]);
            setBarChartCategories([]);
        }
        setIsLoading(false);
    }

    const getTimesheetProcessingSummary = async (filter) => {
        if (filter === 'withoutParameter') {
            let chartData;
            if (!isMyReport) {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/timesheetProcessingSummary?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
                chartData = chartDataValues;
            } else {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/timesheetProcessingSummary?id=${myReportId}`);
                chartData = chartDataValues;
            }
            setTimesheetProcessingSummaryData(chartData);
        } else {
            let chartData;
            if (!isMyReport) {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/timesheetProcessingSummary?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
                chartData = chartDataValues;
            } else {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/timesheetProcessingSummary?id=${myReportId}`);
                chartData = chartDataValues;
            }
            setTimesheetProcessingSummaryData(chartData);
        }
        setIsLoading(false);
    }

    const setTimesheetProcessingSummary = () => {
        let temp = [];
        if (timesheetProcessingSummaryData) {
            Object?.keys(timesheetProcessingSummaryData?.paymentStatus)?.map((data, index) => {
                temp[index] = { key: data, value: Object?.values(timesheetProcessingSummaryData?.paymentStatus)?.[index] }
            })
            setPieData(temp);
            let tempStackedSeries = [];
            Object.keys(timesheetProcessingSummaryData?.statusSummary?.payment)?.map((data, index) => {
                tempStackedSeries.push({
                    'data': Object.keys(timesheetProcessingSummaryData?.statusSummary)?.map(stackedData => Object?.values(timesheetProcessingSummaryData?.statusSummary[stackedData])?.[index]),
                    'name': data
                })
                setStackedSeries(tempStackedSeries);
            })
            setStackedCategories(Object.keys(timesheetProcessingSummaryData?.statusSummary));
            setTotalTimesheetRejectedCount(timesheetProcessingSummaryData?.rejectedTimesheetCount);
            setTotalSubmittedTimesheets(timesheetProcessingSummaryData?.totalSubmittedTimesheets);
            setRejectedTimesheetCountBreakUp(timesheetProcessingSummaryData?.rejectedTimesheetCountBreakUp);
        }
        setIsLoading(false);
    }

    const getListingOfTimesheetNotPaid = async (filter) => {
        if (filter === 'withoutParameter') {
            let chartData;
            if (!isMyReport) {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/notPaidTimesheets?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
                chartData = chartDataValues;
            } else {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/notPaidTimesheets?id=${myReportId}`);
                chartData = chartDataValues;
            }
            if (chartData) {
                setNotPaidTimesheetsData(chartData);
            }
        } else {
            let chartData;
            if (!isMyReport) {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/notPaidTimesheets?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
                chartData = chartDataValues;
            } else {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/notPaidTimesheets?id=${myReportId}`);
                chartData = chartDataValues;
            }
            if (chartData) {
                setNotPaidTimesheetsData(chartData);
            }
        }
        setIsLoading(false);
    }

    const getSubmittedTimesheetsPaymentStatus = async (filter) => {
        if (filter === 'withoutParameter') {
            let chartData;
            if (!isMyReport) {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/submittedTimesheetsPaymentStatus?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
                chartData = chartDataValues;
            } else {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/submittedTimesheetsPaymentStatus?id=${myReportId}`);
                chartData = chartDataValues;
            }
            if (chartData) {
                setSubmittedTimesheetsPaymentStatusData(chartData);
            }
        } else {
            let chartData;
            if (!isMyReport) {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/submittedTimesheetsPaymentStatus?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
                chartData = chartDataValues;
            } else {
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/submittedTimesheetsPaymentStatus?id=${myReportId}`);
                chartData = chartDataValues;
            }
            if (chartData) {
                setSubmittedTimesheetsPaymentStatusData(chartData);
            }
        }
        setIsLoading(false);
    }

    const getUsersData = async () => {
        const { data: user } = await GET('user-management-service/user');
        if (user) {
            setUsers(user);
        }
    }

    const getDataToUseInReport = (value) => {
        setDataToUseInReport(value);
    }

    const getContractRenewalReport = async () => {
        const { data: contractRenewalReport } = await GET('contract-managment-service/reports/contractRenewalReport');
        if (contractRenewalReport) {
            setContractRenewalReport(contractRenewalReport);
        }
    }

    const getContractRenewalReportWithParameters = async () => {
        const { data: contractRenewalReport } = await GET(`contract-managment-service/reports/contractRenewalReport?sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}&renewalDays=${dataToUseInReport?.renewalreportingTimePeriod}&contractPolicyType=${dataToUseInReport?.contractContinuationPolicy}`);
        if (contractRenewalReport) {
            setContractRenewalReport(contractRenewalReport);
        }
        setIsLoading(false);
    }

    const getOneTimeContract = async () => {
        const { data: oneTimeContract } = await GET(`contract-managment-service/reports/oneTimeContractReport`);
        if (oneTimeContract) {
            setOneTimeContract(oneTimeContract);
        }
        setIsLoading(false);
    }

    const getOneTimeContractWithParameters = async () => {
        const { data: oneTimeContract } = await GET(`contract-managment-service/reports/oneTimeContractReport?renewalDays=${dataToUseInReport?.renewalreportingTimePeriod}`);
        if (oneTimeContract) {
            setOneTimeContract(oneTimeContract);
        }
        setIsLoading(false);
    }

    const getNonCompliantContractReportTile = async () => {
        const { data: nonCompliantContract } = await GET(`contract-managment-service/reports/documentProofReport?contractNames=${dataToUseInReport?.selectedContracts}&contractStatus=${dataToUseInReport?.contractStatus}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
        if (nonCompliantContract) {
            setNonCompliantContractTile(nonCompliantContract);
        }
        setIsLoading(false);
    }

    const getNonCompliantContractReport = async () => {
        const { data: nonCompliantContract } = await GET(`contract-managment-service/reports/nonCompliantContractReport?podType=${encodeURIComponent(selectedPodTypeFromTile)}&contractStatus=${dataToUseInReport?.contractStatus}&contractNames=${dataToUseInReport?.selectedContracts}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
        if (nonCompliantContract) {
            setNonCompliantContract(nonCompliantContract);
        }
        setIsLoading(false);
    }

    let activityPerformed = [];
    let startDateTime = [];
    let endDateTime = [];
    let contractProvider = [];
    let reasonNotDone = [];

    const getActivitiesServicesValues = (value) => {
        activityPerformed = [];
        startDateTime = [];
        endDateTime = [];
        contractProvider = [];
        reasonNotDone = [];
        reportLog?.filter(data => data?.activityStatus === value)?.map(data => {
            activityPerformed.push(data?.activityPerformed?.activity);
            startDateTime.push(`${format(new Date(data?.activityTimeFrame?.stateDate), 'MM-dd-yyyy')}, ${data?.activityTimeFrame?.startTime}`)
            endDateTime.push(`${format(new Date(data?.activityTimeFrame?.endDate), 'MM-dd-yyyy')}, ${data?.activityTimeFrame?.endTme}`)
            user?.filter(user => user?.id === data?.user?.id)?.map(data => {
                contractProvider.push(data?.name?.firstName)
            });
            reasonNotDone.push(data?.activityNotes?.notes);
        })

        return value === "DONE" ? [
            activityPerformed,
            startDateTime,
            endDateTime,
            contractProvider,
            ''
        ] : value === "TODO" ? [
            activityPerformed,
            startDateTime,
            contractProvider,
            ''
        ] : [
            activityPerformed,
            startDateTime,
            contractProvider,
            '',
            reasonNotDone
        ];
    }

    let addonActivityServices = [];
    let requestDateTime = [];
    let rejectedDateTime = [];
    let requestingProvider = [];
    let requestReviewer = [];
    let site = [];

    const getAddOnActivitiesServicesValues = (value) => {
        addonActivityServices = [];
        requestDateTime = [];
        rejectedDateTime = [];
        requestingProvider = [];
        requestReviewer = [];
        site = [];

        if (value === "Rejected") {
            addOnRejectedReportLog !== [] && addOnRejectedReportLog?.map(data => {
                addonActivityServices.push(data?.activity?.activity?.activity);
                requestDateTime.push(`${formatInTimeZone(new Date(data?.activity?.createdDate), 'America/New_York', 'MM-dd-yyyy, HH:mm')}`)
                rejectedDateTime.push(`${data?.logs?.filter(filterData => filterData?.workFlowAction === "REJECTED") !== [] ? formatInTimeZone(new Date(data?.logs?.filter(filterData => filterData?.workFlowAction === "REJECTED")?.[0]?.createdDate), 'America/New_York', 'MM-dd-yyyy, HH:mm') : '-'}`)
                requestingProvider.push(data?.activity?.user?.name)
                requestReviewer.push(data?.logs?.filter(filterData => filterData?.workFlowAction === "REJECTED") !== [] ? data?.logs?.filter(filterData => filterData?.workFlowAction === "REJECTED")?.[0]?.workFlowUser?.name?.name : '-');
                site.push(data?.activity?.site?.name)
            })
        }
        if (value === "Approved") {
            addOnAcceptedReportLog !== [] && addOnAcceptedReportLog?.map(data => {
                addonActivityServices.push(data?.activity?.activity?.activity);
                requestDateTime.push(`${formatInTimeZone(new Date(data?.activity?.createdDate), 'America/New_York', 'MM-dd-yyyy, HH:mm')}`)
                rejectedDateTime.push(`${data?.logs?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.length !== 0 ? formatInTimeZone(new Date(data?.logs?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.[0]?.createdDate), 'America/New_York', 'MM-dd-yyyy, HH:mm') : '-'}`)
                requestingProvider.push(data?.activity?.user?.name)
                requestReviewer.push(data?.logs?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.length !== 0 ? data?.logs?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.[0]?.workFlowUser?.name?.name : '-');
                site.push(data?.activity?.site?.name)
            })
        }

        return [
            addonActivityServices,
            requestDateTime,
            rejectedDateTime,
            requestingProvider,
            requestReviewer,
            site
        ];
    }

    let timesheet = [];
    let period = [];
    let approvalDate = [];
    let actionBy = [];
    let serviceProvider = [];

    const getTimesheetProcessingSummaryValues = (value) => {
        timesheet = [];
        period = [];
        approvalDate = [];
        actionBy = [];
        serviceProvider = [];

        if (value === "Not Paid") {
            timesheetProcessingSummaryData?.notPaidTimesheets?.map(data => {
                timesheet.push(data?.timesheet?.timesheetName);
                period.push(`${format(new Date(data?.timesheet?.timesheetPeriod?.startDate) || new Date(), 'MMM dd')} - ${format(new Date(data?.timesheet?.timesheetPeriod?.endDate) || new Date(), 'MMM dd yyyy')}`)
                approvalDate.push(`${format(new Date(data?.activityLoggerList?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.[0]?.createdDate) || new Date(), 'MM-dd-yyyy, HH:mm')}`)
                actionBy.push(data?.activityLoggerList?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.[0]?.workFlowUser?.name?.name)
                serviceProvider.push(data?.timesheet?.user?.name);
            })
        }
        if (value === "Rejected") {
            timesheetProcessingSummaryData?.rejectedTimesheets?.map(data => {
                timesheet.push(data?.timesheet?.timesheetName);
                period.push(`${format(new Date(data?.timesheet?.timesheetPeriod?.startDate) || new Date(), 'MMM dd')} - ${format(new Date(data?.timesheet?.timesheetPeriod?.endDate) || new Date(), 'MMM dd yyyy')}`)
                approvalDate.push(`${format(new Date(data?.activityLoggerList?.filter(filterData => filterData?.workFlowAction === "REJECTED")?.[0]?.createdDate) || new Date(), 'MM-dd-yyyy, HH:mm')}`)
                actionBy.push(data?.activityLoggerList?.filter(filterData => filterData?.workFlowAction === "REJECTED")?.[0]?.workFlowUser?.name?.name)
                serviceProvider.push(data?.timesheet?.user?.name);
            })
        }

        return [
            timesheet,
            period,
            approvalDate,
            actionBy,
            serviceProvider
        ];
    }

    let departmentAndSite = [];
    let currentStatus = [];
    let invoiceAmount = [];

    const getNotPaidTimesheetsValues = () => {
        timesheet = [];
        period = [];
        departmentAndSite = [];
        currentStatus = [];
        invoiceAmount = [];
        serviceProvider = [];

        notPaidTimesheetsData?.unPaidTimesheetsByContract?.map(data => {
            data?.timesheets?.map(timesheetData => {
                timesheet.push(timesheetData?.timesheetName);
                period.push(`${format(new Date(timesheetData?.timesheetPeriod?.startDate) || new Date(), 'MMM dd')} - ${format(new Date(timesheetData?.timesheetPeriod?.endDate) || new Date(), 'MMM dd yyyy')}`)
                departmentAndSite.push(`${Object.values(Object.values(timesheetData?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(timesheetData?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}`)
                currentStatus.push(availableTimesheetStatus[timesheetData?.timesheetStatus?.status]);
                invoiceAmount.push(`$${timesheetData?.policyBasedPayment}`);
                serviceProvider.push(timesheetData?.user?.name);
            })
        })

        return [
            timesheet,
            period,
            serviceProvider,
            departmentAndSite,
            currentStatus,
            invoiceAmount
        ];
    }

    let contractor = [];
    let billableHours = [];
    let nonBillableHours = [];
    let submissionDate = [];
    let statusDate = [];
    let paymentStatus = [];
    let paymentAmount = [];
    let paymentDate = [];

    const getSubmittedTimesheetsPaymentStatusValues = () => {
        timesheet = [];
        period = [];
        contractor = [];
        departmentAndSite = [];
        billableHours = [];
        nonBillableHours = [];
        submissionDate = [];
        currentStatus = [];
        statusDate = [];
        paymentStatus = [];
        paymentAmount = [];
        paymentDate = [];

        submittedTimesheetsPaymentStatusData?.timesheetPayment?.map(data => {
            timesheet.push(data?.timesheet?.timesheetName);
            period.push(`${format(new Date(data?.timesheet?.timesheetPeriod?.startDate || new Date()), 'MMM dd')
                } - ${format(new Date(data?.timesheet?.timesheetPeriod?.endDate || new Date()), 'MMM dd yyyy')
                }`);
            contractor.push(data?.timesheet?.user?.name)
            departmentAndSite.push(`${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}`);
            billableHours.push(data?.timesheet?.billableHours);
            nonBillableHours.push(data?.timesheet?.nonBillableHours);
            submissionDate.push(format(new Date(data?.timesheet?.timesheetPeriod?.submissionDate || new Date()), 'd MMM yyyy'));
            currentStatus.push(availableTimesheetStatus[data?.timesheet?.timesheetStatus?.status]);
            statusDate.push(format(new Date(data?.timesheet?.lastModifiedDate || new Date()), 'd MMM yyyy'));
            paymentStatus.push(data?.payment !== null ? 'Paid' : '-');
            paymentAmount.push(data?.payment !== null ? data?.payment?.actualPayment?.payment : '-');
            paymentDate.push(data?.payment !== null ? format(new Date(data?.payment?.paymentDate?.date || new Date()), 'd MMM yyyy') : '-')
        })

        return [
            timesheet,
            period,
            contractor,
            departmentAndSite,
            billableHours,
            nonBillableHours,
            submissionDate,
            currentStatus,
            statusDate,
            paymentStatus,
            paymentAmount,
            paymentDate
        ];
    }

    let timeSheet = [];
    let deptAndSite = [];
    let paidAmount = [];

    const getPaymentsValues = (value) => {
        timeSheet = [];
        period = [];
        serviceProvider = [];
        deptAndSite = [];
        paidAmount = [];
        invoiceAmount = [];
        if (value === 'paidOnTime') {
            paymentsReportLog?.paidOnTime?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                period.push(data?.payment ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')} ` : '-')
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push(`${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}`)
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment} ` : '-');
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment} ` : '-');
            })
        }
        if (value === 'timesheetNotPaid') {
            paymentsReportLog?.paymentNotDone?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')} ` : '-')
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push(`${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}`)
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment} ` : '-');
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment} ` : '-');
            })
        }
        if (value === 'rejectedTimesheetPayments') {
            paymentsReportLog?.rejected?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')} ` : '-')
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push(`${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}`)
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment} ` : '-');
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment} ` : '-');
            })
        }
        if (value === 'delayedTimesheetPayments') {
            paymentsReportLog?.paymentDelayed?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push(`${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}`)
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')} ` : '-')
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment} ` : '-');
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment} ` : '-');
            })
        }
        if (value === 'paymentPastDue') {
            paymentsReportLog?.paymentPastDue?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')} ` : '-')
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push(`${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}`)
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment} ` : '-');
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment} ` : '-');
            })
        }

        return [
            timeSheet,
            period,
            serviceProvider,
            deptAndSite,
            paidAmount,
            invoiceAmount
        ];
    }
    let oneColValue = []
    const getCompensationCostAnalysisValues = () => {
        let leftHeadings = ['Obligated Expected', 'Obligated (Actual)', 'Add-ON', 'Obligated Variance', 'Contract Year Balance', 'Contract Year Projected Balance', 'Contract Period Balance', 'Contract Period Projected Balance', 'Additional Services', 'Reduced Services', 'Actual', 'Invoice By Contractor', 'Fixed (Budgeted)'];
        let allColValues = [];
        allColValues.push(leftHeadings)
        oneColValue = []
        compensationCostAnalysis?.map(data => {
            oneColValue = [data?.obligatedExpected.toFixed(2), data?.obligatedActivitiesCosts.toFixed(2), data?.addOnActivitiesCost.toFixed(2), data?.obligatedVariance.toFixed(2), data?.contractYearBalance.toFixed(2), data?.contractYearProjectedBalance.toFixed(2), data?.contractPeriodBalance.toFixed(2), data?.contractPeriodProjectedBalance.toFixed(2), data?.additionalServicesCost.toFixed(2), data?.reducedServicesCost.toFixed(2), data?.totalActivitiesCost.toFixed(2), data?.policyBasedPayment.toFixed(2), data?.maxPaymentPerTimesheetSubmission.toFixed(2)]
            allColValues.push(oneColValue)
        })
        return allColValues;
    }

    let contractManagementContractName = [];
    let contractManagementContractId = [];
    let contractManagementExpirationDate = [];
    let contractManagementContractingEntity = [];
    let contractManagementPointOfContact = [];
    let contractManagementPointOfContactNumber = [];
    let contractManagementEmail = [];
    let contractManagementServiceProvider = [];

    const getContractManagementUpcomingValues = (value) => {
        contractManagementContractName = [];
        contractManagementContractId = [];
        contractManagementExpirationDate = [];
        contractManagementContractingEntity = [];
        contractManagementPointOfContact = [];
        contractManagementPointOfContactNumber = [];
        contractManagementEmail = [];
        contractManagementServiceProvider = [];

        let mapValue = value === "INDIVIDUAL" ? individualContract : multipleContract;

        mapValue?.map(data => {
            contractManagementContractName.push(data?.contractName?.contractName);
            contractManagementContractId.push(data?.contractDetail?.contractId?.id)
            contractManagementExpirationDate.push(format(new Date(data?.contractDetail?.contractTerm?.endDate), 'MM-dd-yyyy'))
            contractManagementContractingEntity.push(data?.contractorBusinessEntity !== null ? data?.contractorBusinessEntity?.businessEntity?.name : '-');
            contractManagementPointOfContact.push(`${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} ${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)} `);
            contractManagementPointOfContactNumber.push(user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.communication?.mobileNumber));
            contractManagementEmail.push(user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.email?.officialEmail));
        })

        return [
            contractManagementContractName,
            contractManagementContractId,
            contractManagementExpirationDate,
            contractManagementContractingEntity,
            contractManagementPointOfContact,
            contractManagementPointOfContactNumber,
            contractManagementEmail
        ];
    }

    let contractCompliaceContractName = [];
    let contractCompliaceContractId = [];
    let contractCompliaceContractManager = [];
    let contractCompliaceExpirationDate = [];
    let contractCompliaceContractingEntity = [];
    let contractCompliacePointOfContact = [];
    let contractCompliacePointOfContactNumber = [];
    let contractCompliaceEmail = [];


    const getContractComplianceValues = (value) => {
        contractCompliaceContractName = [];
        contractCompliaceContractId = [];
        contractCompliaceContractManager = [];
        contractCompliaceExpirationDate = [];
        contractCompliaceContractingEntity = [];
        contractCompliacePointOfContact = [];
        contractCompliacePointOfContactNumber = [];
        contractCompliaceEmail = [];

        let mapValue = value === "documentNotUploadedContracts" ? nonCompliantContract?.documentNotUploadedContracts :
            value === "expiredContracts" ? nonCompliantContract?.expiredContracts :
                value === "renewalContracts" ? nonCompliantContract?.renewalContracts :
                    nonCompliantContract?.notExpiredContracts;

        mapValue?.map(data => {
            contractCompliaceContractName.push(data?.contractName?.contractName);
            contractCompliaceContractId.push(data?.contractDetail?.contractId?.id)
            contractCompliaceContractManager.push(`${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} ${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)} `)
            contractCompliaceExpirationDate.push(format(new Date(data?.contractDetail?.contractTerm?.effectiveDate), 'MM-dd-yyyy'))
            contractCompliaceContractingEntity.push(data?.contractorBusinessEntity !== null ? data?.contractorBusinessEntity?.businessEntity?.name : '-');
            contractCompliacePointOfContact.push(`${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.firstName)} ${user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.name?.lastName)} `);
            contractCompliacePointOfContactNumber.push(user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.communication?.mobileNumber));
            contractCompliaceEmail.push(user?.filter(userData => userData?.id === data?.contractDetail?.contractManager?.userID)?.map(data => data?.email?.officialEmail));
        })

        return [
            contractCompliaceContractName,
            contractCompliaceContractId,
            contractCompliaceContractManager,
            contractCompliaceExpirationDate,
            contractCompliaceContractingEntity,
            contractCompliacePointOfContact,
            contractCompliacePointOfContactNumber,
            contractCompliaceEmail
        ];
    }

    const getHeaderValues = () => {
        let headerValues = [];
        headerValues.push('');
        compensationCostAnalysis?.map(data => headerValues.push(`${months[data?.month]}, ${data?.year}`));
        return headerValues;
    }

    const showActivitiesOrServicesReport = () => {
        return (
            <>
                <div className={style.grid2}>
                    <div>
                        <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Activity / Services Status</div>
                        <ApexPieChart pieData={pieData} />
                    </div>

                    <div>
                        <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>By Category Of Service Performed</div>
                        <div className={style.marginTop20}>
                            <ApexGroupedBarChart series={series} categories={categories} />
                        </div>
                    </div>
                </div>
                <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div>
                <div className={style.marginTop40}>
                    <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20} `}>Trend For Activities / Services Completed</div>
                    <div className={style.reportWidthToFitFullScreen}>
                        <ApexLineChart lineData={lineData} />
                    </div>
                </div>
                <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div>
                <div className={style.marginTop40}>
                    <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20} `}>Percentage Of Activities / Services Completed By Category Type</div>
                    <div className={style.reportWidthToFitFullScreen}>
                        {/* <ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} /> */}
                        {apexStackedBarChartDisplay}
                    </div>
                </div>
                <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                {reportLog?.filter(data => data?.activityStatus === "DONE")?.length !== 0 && (
                    <>
                        <ReportsTable
                            tableType={'Completed Activity / Service Log'}
                            tableHeader={['Activity/ Services', 'Scheduled Date/ Time', 'Completion Date/ Time', 'Contracted Provider', 'Site']}
                            tableValue={reportLog?.filter(data => data?.activityStatus === "DONE")}
                            activitiesServicesValues={getActivitiesServicesValues('DONE')}
                            styleName={style.grid5}
                        />
                        <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                    </>
                )}
                {reportLog?.filter(data => data?.activityStatus === "TODO")?.length !== 0 && (
                    <>
                        <ReportsTable
                            tableType={'To Do Activity/ Services'}
                            tableHeader={['Activity/ Services', 'Scheduled Date/ Time', 'Contracted Provider', 'Site']}
                            tableValue={reportLog?.filter(data => data?.activityStatus === "TODO")}
                            activitiesServicesValues={getActivitiesServicesValues('TODO')}
                            styleName={style.grid5}
                        />
                        <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                    </>
                )}
                {reportLog?.filter(data => data?.activityStatus === "NOTDONE")?.length !== 0 && (
                    <>
                        <ReportsTable
                            tableType={'Not Done Activity / Service Log'}
                            tableHeader={['Activity/ Services', 'Scheduled Date/ Time', 'Contracted Provider', 'Site', 'Reason Not Done']}
                            tableValue={reportLog?.filter(data => data?.activityStatus === "NOTDONE")}
                            activitiesServicesValues={getActivitiesServicesValues('NOTDONE')}
                            styleName={style.grid5}
                        />
                    </>
                )}
            </>
        )
    }

    return (
        <Fragment>
            <Navbar />
            <div className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid} ${style.margin20WithoutTop} ${style.marginTop10} `}>
                <div>
                    <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                        <SampleReportLeftCard getDataToUseInReport={getDataToUseInReport} />
                    </SideBar>
                </div>
                <div>
                    <ReportPerformanceAndOptions handle={handle} getIsRefresh={getIsRefresh} handlePrint={handlePrint} isUpdated={isLoading} dataToUseInReport={dataToUseInReport} refToUse={PDFRef} getIsDownloadClicked={getIsDownloadClicked} isNoData={isNoData} />
                    <FullScreen handle={handle}>
                        <div className={`Report`} ref={PDFRef}>
                            <div className={`${style.reportBackgroundCard} ${style.marginTop20} `} ref={componentRef}>
                                <table style={{ width: '100%' }}>
                                    <thead>
                                        <ReportHeader />
                                    </thead>
                                    <tbody>
                                        <div className={style.justifyCenter}>
                                            <div className={style.marginTop20}>
                                                {reportType === "paymentsProcessingSummary" && (
                                                    <div className={`${style.entityNameBolderStyle} ${style.textAlignCenter} ${style.marginTop5} `}>
                                                        {dataToUseInReport?.selectedContractsToSend?.map(data => data?.contractName?.contractName).join(', ')}
                                                    </div>
                                                )}
                                                <div className={`${style.entityNameBolderStyle} ${style.textAlignCenter} ${style.marginTop5} `}>
                                                    {reportTitleList[reportType]}
                                                </div>
                                                {dataToUseInReport?.reportingTimePeriod !== "" && (
                                                    <div className={`${style.reportRunByTextStyle} ${style.textAlignCenter} ${style.marginTop5} `}>Reporting Period used for this report : {dataToUseInReport?.reportingTimePeriod} ({dataToUseInReport?.fromToDisplay} to {dataToUseInReport?.toToDisplay}) </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                                        <div className={style.marginTop20}>
                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Reporting Parameters Applied</div>
                                            {(reportType === "upcomingContractRenewals" || reportType === "oneTimeContract") ? (
                                                <div className={`${style.grid2} ${style.marginTop20} `}>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Renewal Time Frame </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{`Renewal within Next ${dataToUseInReport?.renewalreportingTimePeriod} days`}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Sites </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedSitesToSend?.map(data => data?.siteName?.siteName).join(', ') || 'All Sites'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Departments</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                                    </div>
                                                    {reportType === "upcomingContractRenewals" && (
                                                        <div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Contract Continuation Policy</div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.contractContinuationPolicy === 'AUTORENEWAL' ? "Auto Renewal"
                                                                : dataToUseInReport?.contractContinuationPolicy === "WRITTENCONTRACTEXTENSIONFORFIXEDTERM" ? "Written Contract Extension For Fixed Term"
                                                                    : dataToUseInReport?.contractContinuationPolicy === "NEWCONTRACTONEXPIRATION" ? "New Contract On Expiration"
                                                                        : dataToUseInReport?.contractContinuationPolicy === "ONETIMECONTRACTTERMINATEONEXPIRATION" ? "One Time Contract - Terminate On Expiration" : 'All'}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (reportType === "activitiesOrServices" || reportType === "addOnActivities" || reportType === "timesheetProcessingSummary" || reportType === "listingOfTimesheetsNotPaid" || reportType === "submittedTimesheetsPaymentStatus") ? (
                                                <div className={`${style.grid2} ${style.marginTop20} `}>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Sites </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedSitesToSend?.map(data => data?.siteName?.siteName).join(', ') || 'All Sites'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Departments</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Contract </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedContractsToSend?.map(data => data?.contractName?.contractName).join(', ') || 'All Contracts'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Contracted Service Provider </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{`${dataToUseInReport?.selectedContractedServiceProviderToSend?.name?.firstName} ${dataToUseInReport?.selectedContractedServiceProviderToSend?.name?.lastName}`}</div>
                                                    </div>
                                                </div>
                                            ) : (reportType === "paymentsProcessingSummary") ? (
                                                <div className={`${style.grid2} ${style.marginTop20} `}>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Departments</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                                    </div>
                                                </div>
                                            ) : (reportType === "compensationCostAnalysis") ? (
                                                <div className={`${style.marginTop20} `}>
                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Contract </div>
                                                    <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedContractsToSend?.map(data => data?.contractName?.contractName).join(', ') || 'All Contracts'}</div>
                                                </div>
                                            ) : (reportType === "nonCompliant") ? (
                                                <div className={`${style.grid2} ${style.marginTop20} `}>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Sites </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedSitesToSend?.map(data => data?.siteName?.siteName).join(', ') || 'All Sites'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Departments</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Contracts </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedContractsToSend?.map(data => data?.contractName?.contractName).join(', ') || 'All Contracts'}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Contract Status</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.contractStatus === 'ACTIVE' ? 'Active'
                                                            : dataToUseInReport?.contractStatus === 'DRAFT' ? 'Draft'
                                                                : dataToUseInReport?.contractStatus === 'EXPIRED' ? 'Expired'
                                                                    : dataToUseInReport?.contractStatus === 'TERMINATED' ? 'Terminated' : ''}</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Proof Of Documentation </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.podType || 'Select One'}</div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`${style.grid2} ${style.marginTop20} `}>
                                                    {/* <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Service Site </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Site 1, Site 2, Site 3</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Department/ Service Area </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>All Departments</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Contracted Service Provider</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Doctor 1, Doctor 2, Doctor 3</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Contracted Service/ Activity Category</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Medical/ Surgical Care Services</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Type of Service/ Activity Performed</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Medical/ Surgical Care Services</div>
                                                    </div>
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Completion Status</div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Medical/ Surgical Care Services</div>
                                                    </div> */}
                                                </div>
                                            )}
                                            <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div>
                                            {reportType === "activitiesOrServices" ? (
                                                <>
                                                    {(activitiesOrServicesValues?.activities?.length !== 0 ||
                                                        activitiesOrServicesValues?.activityServiceReports?.length !== 0 ||
                                                        activitiesOrServicesValues?.activityStatusByCategorys?.length !== 0 ||
                                                        activitiesOrServicesValues?.completedActivitiesByDate?.length !== 0 ||
                                                        activitiesOrServicesValues?.completedActivitiesBycategoryAndMonth?.length !== 0) ? (
                                                        // <>
                                                        //     <div className={style.grid2}>
                                                        //         <div>
                                                        //             <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Activity / Services Status</div>
                                                        //             <ApexPieChart pieData={pieData} />
                                                        //         </div>

                                                        //         <div>
                                                        //             <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>By Category Of Service Performed</div>
                                                        //             <div className={style.marginTop20}>
                                                        //                 <ApexGroupedBarChart series={series} categories={categories} />
                                                        //             </div>
                                                        //         </div>
                                                        //     </div>
                                                        //     <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div>
                                                        //     <div className={style.marginTop40}>
                                                        //         <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20} `}>Trend For Activities / Services Completed</div>
                                                        //         <div className={style.reportWidthToFitFullScreen}>
                                                        //             <ApexLineChart lineData={lineData} />
                                                        //         </div>
                                                        //     </div>
                                                        //     <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div>
                                                        //     <div className={style.marginTop40}>
                                                        //         <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20} `}>Percentage Of Activities / Services Completed By Category Type</div>
                                                        //         <div className={style.reportWidthToFitFullScreen}>
                                                        //             {/* <ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} /> */}
                                                        //             {apexStackedBarChartDisplay}
                                                        //         </div>
                                                        //     </div>
                                                        //     <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                                                        //     {reportLog?.filter(data => data?.activityStatus === "DONE")?.length !== 0 && (
                                                        //         <>
                                                        //             <ReportsTable
                                                        //                 tableType={'Completed Activity / Service Log'}
                                                        //                 tableHeader={['Activity/ Services', 'Scheduled Date/ Time', 'Completion Date/ Time', 'Contracted Provider', 'Site']}
                                                        //                 tableValue={reportLog?.filter(data => data?.activityStatus === "DONE")}
                                                        //                 activitiesServicesValues={getActivitiesServicesValues('DONE')}
                                                        //                 styleName={style.grid5}
                                                        //             />
                                                        //             <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                                                        //         </>
                                                        //     )}
                                                        //     {reportLog?.filter(data => data?.activityStatus === "TODO")?.length !== 0 && (
                                                        //         <>
                                                        //             <ReportsTable
                                                        //                 tableType={'To Do Activity/ Services'}
                                                        //                 tableHeader={['Activity/ Services', 'Scheduled Date/ Time', 'Contracted Provider', 'Site']}
                                                        //                 tableValue={reportLog?.filter(data => data?.activityStatus === "TODO")}
                                                        //                 activitiesServicesValues={getActivitiesServicesValues('TODO')}
                                                        //                 styleName={style.grid5}
                                                        //             />
                                                        //             <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                                                        //         </>
                                                        //     )}
                                                        //     {reportLog?.filter(data => data?.activityStatus === "NOTDONE")?.length !== 0 && (
                                                        //         <>
                                                        //             <ReportsTable
                                                        //                 tableType={'Not Done Activity / Service Log'}
                                                        //                 tableHeader={['Activity/ Services', 'Scheduled Date/ Time', 'Contracted Provider', 'Site', 'Reason Not Done']}
                                                        //                 tableValue={reportLog?.filter(data => data?.activityStatus === "NOTDONE")}
                                                        //                 activitiesServicesValues={getActivitiesServicesValues('NOTDONE')}
                                                        //                 styleName={style.grid5}
                                                        //             />
                                                        //         </>
                                                        //     )}
                                                        // </>
                                                        <>{showActivitiesOrServicesReport()}</>
                                                    ) : (
                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                    )}
                                                </>
                                            ) : reportType === "addOnActivities" ? (
                                                <>
                                                    {(addOnServicesValues?.addOnActivityServiceReports?.length !== 0 ||
                                                        addOnServicesValues?.addOnActivityStatusByCategorys?.length !== 0 ||
                                                        addOnServicesValues?.approvedActivities?.length !== 0 ||
                                                        addOnServicesValues?.approvedAddOnActivitiesByCategoryAndMonth?.length !== 0 ||
                                                        addOnServicesValues?.approvedAddOnActivityByDate?.length !== 0 ||
                                                        addOnServicesValues?.rejectedActivities?.length !== 0) ? (
                                                        <>
                                                            <div className={style.grid2}>
                                                                <div>
                                                                    <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Activity / Services Status</div>
                                                                    <ApexPieChart pieData={pieData} />
                                                                </div>
                                                                <div>
                                                                    <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>By Add On Activity/ Service Type</div>
                                                                    <div className={style.marginTop20}>
                                                                        <ApexGroupedBarChart series={series} categories={categories} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div>
                                                            <div className={style.marginTop40}>
                                                                <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20} `}>Percentage Of Add On Activities / Services Requests Approved</div>
                                                                <div className={style.addOnReportWidthToFitFullScreen}>
                                                                    {apexStackedBarChartDisplay}
                                                                </div>
                                                            </div>
                                                            <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                                                            {addOnRejectedReportLog?.length !== 0 && (
                                                                <>
                                                                    <ReportsTable
                                                                        tableType={'List Of Request Rejected For Add On Activity / Services'}
                                                                        tableHeader={['Add on Activity/ Services', 'Request Date/ Time', 'Rejected Date/ Time', 'Requesting Provider', 'Request Reviewer', 'Site']}
                                                                        tableValue={addOnRejectedReportLog}
                                                                        activitiesServicesValues={getAddOnActivitiesServicesValues('Rejected')}
                                                                        styleName={style.grid6}
                                                                    />
                                                                    <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                                                                </>
                                                            )}
                                                            {addOnAcceptedReportLog?.length !== 0 && (
                                                                <>
                                                                    <ReportsTable
                                                                        tableType={'List Of Approved Add On Activity / Services Requests'}
                                                                        tableHeader={['Add on Activity/ Services', 'Request Date/ Time', 'Approved Date/ Time', 'Requesting Provider', 'Request Reviewer', 'Site']}
                                                                        tableValue={addOnAcceptedReportLog}
                                                                        activitiesServicesValues={getAddOnActivitiesServicesValues('Approved')}
                                                                        styleName={style.grid6}
                                                                    />
                                                                    <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                                                                </>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                    )}
                                                </>
                                            ) : reportType === "paymentsProcessingSummary" ? (
                                                (paymentsReportLog?.paymentContracts?.length === 0 && paymentsReportLog?.rejected?.length === 0 && paymentsReportLog?.paymentPastDue?.length === 0 && paymentsReportLog?.paymentNotDone?.length === 0 && paymentsReportLog?.paymentDelayed?.length === 0 && paymentsReportLog?.paidOnTime?.length === 0) ? (
                                                    <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                ) : (
                                                    <>
                                                        <div className={style.grid2}>
                                                            <div>
                                                                <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Timesheets Processing Status</div>
                                                                <ApexPieChart pieData={pieData} />
                                                            </div>
                                                            <div>
                                                                <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Payments Made Summary Statistics</div>
                                                                <div className={`${style.summaryGrid} ${style.marginTop40} `}>
                                                                    <div>
                                                                        <div className={`${style.summaryTextStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Minimum Payment</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Maximum Payment</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Average Payment Per Timesheet</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Median Payment ( 50TH Percentile )</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className={`${style.summaryTextStyle} ${style.marginTop20} `}>$ {paymentsReportLog?.paymentStats?.minPayment}</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.marginTop20} `}>$ {paymentsReportLog?.paymentStats?.maxPayment}</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.marginTop20} `}>$ {paymentsReportLog?.paymentStats?.avgPayment}</div>
                                                                        <div className={`${style.summaryTextStyle} ${style.marginTop20} `}>$ {paymentsReportLog?.paymentStats?.medianPayment}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div>
                                                        <div>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Payment For Services Performed By Contract</div>
                                                            <div className={style.marginTop20}>
                                                                <ApexBarChart series={barChartSeries} categories={barChartCategories} reportingPeriod={`${format(new Date(dataToUseInReport?.from || new Date()), 'MMM d')} to ${format(new Date(dataToUseInReport?.to || new Date()), 'MMM d')} `} yAxisTitle="Dollars Paid" />
                                                            </div>
                                                        </div>
                                                        <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div>
                                                        {/* <div className={style.marginTop40}>
                                                        <div className={`${ style.entityNameBolderStyle } ${ style.textAlignLeft } ${ style.marginTop20 } ${ style.marginBottom20 } `}>Percentage Of Activities / Services Completed By Category Type</div>
                                                        <div className={style.reportWidthToFitFullScreen}>
                                                            <ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} />
                                                        </div>
                                                    </div> */}
                                                        {/* <div className={`${ style.mildBorderStyle } ${ style.marginTop20 } `}></div> */}
                                                        {paymentsReportLog?.paymentPastDue?.length !== 0 && (
                                                            <>
                                                                <ReportsTable
                                                                    tableType={'Timesheets With Payment Past Due'}
                                                                    tableHeader={['Timesheet', 'Period', 'Service Provider', 'Department & Site', 'Paid Amount', 'Billed Amount']}
                                                                    tableValue={paymentsReportLog?.paymentPastDue}
                                                                    activitiesServicesValues={getPaymentsValues('paymentPastDue')}
                                                                    styleName={style.grid6}
                                                                />
                                                            </>
                                                        )}
                                                        {paymentsReportLog?.paymentDelayed?.length !== 0 && (
                                                            <>
                                                                <ReportsTable
                                                                    tableType={'Timesheets With Delayed Payments'}
                                                                    tableHeader={['Timesheet', 'Period', 'Service Provider', 'Department & Site', 'Paid Amount', 'Billed Amount']}
                                                                    tableValue={paymentsReportLog?.paymentDelayed}
                                                                    activitiesServicesValues={getPaymentsValues('delayedTimesheetPayments')}
                                                                    styleName={style.grid6}
                                                                />
                                                            </>
                                                        )}
                                                        {paymentsReportLog?.rejected?.length !== 0 && (
                                                            <>
                                                                <ReportsTable
                                                                    tableType={'Timesheets With Rejected Payments'}
                                                                    tableHeader={['Timesheet', 'Period', 'Service Provider', 'Department & Site', 'Paid Amount', 'Billed Amount']}
                                                                    tableValue={paymentsReportLog?.rejected}
                                                                    activitiesServicesValues={getPaymentsValues('rejectedTimesheetPayments')}
                                                                    styleName={style.grid6}
                                                                />
                                                            </>
                                                        )}
                                                        {paymentsReportLog?.paymentNotDone?.length !== 0 && (
                                                            <>
                                                                <ReportsTable
                                                                    tableType={'Timesheets Without Payment'}
                                                                    tableHeader={['Timesheet', 'Period', 'Service Provider', 'Department & Site', 'Paid Amount', 'Billed Amount']}
                                                                    tableValue={paymentsReportLog?.paymentNotDone}
                                                                    activitiesServicesValues={getPaymentsValues('timesheetNotPaid')}
                                                                    styleName={style.grid6}
                                                                />
                                                            </>
                                                        )}
                                                        {paymentsReportLog?.paidOnTime?.length !== 0 && (
                                                            <>
                                                                <ReportsTable
                                                                    tableType={'Timesheets With Payment On Time'}
                                                                    tableHeader={['Timesheet', 'Period', 'Service Provider', 'Department & Site', 'Paid Amount', 'Billed Amount']}
                                                                    tableValue={paymentsReportLog?.paidOnTime}
                                                                    activitiesServicesValues={getPaymentsValues('paidOnTime')}
                                                                    styleName={style.grid6}
                                                                />
                                                            </>
                                                        )}
                                                    </>
                                                )
                                            ) : reportType === "compensationCostAnalysis" ? (
                                                <>
                                                    {compensationCostAnalysis?.length !== 0 ? (
                                                        <>
                                                            <ReportsTable
                                                                tableType={'Compensation Cost Analysis'}
                                                                tableHeader={getHeaderValues()}
                                                                tableValue={['Obligated Expected', 'Obligated (Actual)', 'Add-ON', 'Obligated Variance', 'Contract Year Balance', 'Contract Year Projected Balance', 'Contract Period Balance', 'Contract Period Projected Balance', 'Additional Services', 'Reduced Services', 'Actual', 'Invoice By Contractor', 'Fixed (Budgeted)']}
                                                                activitiesServicesValues={getCompensationCostAnalysisValues()}
                                                                styleName={style.gridAuto}
                                                            />
                                                        </>
                                                    ) : (
                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                    )}
                                                </>
                                            ) : reportType === "timesheetProcessingSummary" ? (
                                                <>
                                                    {totalSubmittedTimesheets !== 0 ? (
                                                        <div>
                                                            <div className={style.timeSheetProcessingSummaryCalendarGrid}>
                                                                <div>
                                                                    <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Submitted Timesheets</div>
                                                                    <div className={style.calendarBoxBorderStyle}></div>
                                                                    <div className={style.calendarBoxTopStyle}></div>
                                                                    <div className={`${style.calendarBoxBottomStyle} ${style.alignCenter} ${style.justifyCenter} `}>
                                                                        <div>
                                                                            <div className={style.calendarDateStyle}>{totalSubmittedTimesheets}</div>
                                                                            <div className={style.calendarMonthYearStyle}>June 2023</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Timesheet Processing Status Summary</div>
                                                                    <div>
                                                                        {/* <ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} /> */}
                                                                        {apexStackedBarChartDisplay}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div>
                                                            <div className={style.grid2}>
                                                                <div>
                                                                    <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Payment Status</div>
                                                                    <ApexPieChart pieData={pieData} />
                                                                </div>
                                                                <div>
                                                                    <div className={style.spaceBetween}>
                                                                        <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Timesheets Rejected</div>
                                                                        <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>{totalTimesheetRejectedCount}</div>
                                                                    </div>
                                                                    <div className={style.marginTop20}>
                                                                        {Object?.keys(rejectedTimesheetCountBreakUp || {})?.map((data, index) => (
                                                                            <div className={`${style.progressbarStyle} `} key={index}>
                                                                                <div className={style.spaceBetween}>
                                                                                    <p className={style.statisticsProgress}>{getProgressValue[data]}</p>
                                                                                    <p className={style.progressCountStyle}>{Object?.values(rejectedTimesheetCountBreakUp)?.[index]}</p>
                                                                                </div>
                                                                                <ProgressBar completed={Object?.values(rejectedTimesheetCountBreakUp)?.[index] !== 0 ? (Object?.values(rejectedTimesheetCountBreakUp)?.[index] / totalTimesheetRejectedCount) * 100 : 0} isLabelVisible={false} height='5px' bgColor='#4791FF' baseBgColor="#EBEBEB" className={style.progressMargin} />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div>
                                                            {timesheetProcessingSummaryData?.notPaidTimesheets?.length !== 0 && (
                                                                <>
                                                                    <ReportsTable
                                                                        tableType={'Timesheet Approved But Not Paid'}
                                                                        tableHeader={['Timesheet', 'Period', 'Approval Date', 'Approved by', 'Service Provider']}
                                                                        tableValue={timesheetProcessingSummaryData?.notPaidTimesheets}
                                                                        activitiesServicesValues={getTimesheetProcessingSummaryValues('Not Paid')}
                                                                        styleName={style.grid5}
                                                                    />
                                                                </>
                                                            )}
                                                            {timesheetProcessingSummaryData?.rejectedTimesheets?.length !== 0 && (
                                                                <>
                                                                    <ReportsTable
                                                                        tableType={'Timesheets With Payment On Time'}
                                                                        tableHeader={['Timesheet', 'Period', 'Approval Date', 'Rejected by', 'Service Provider']}
                                                                        tableValue={timesheetProcessingSummaryData?.rejectedTimesheets}
                                                                        activitiesServicesValues={getTimesheetProcessingSummaryValues('Rejected')}
                                                                        styleName={style.grid5}
                                                                    />
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                    )}
                                                </>
                                            ) : reportType === "listingOfTimesheetsNotPaid" ? (
                                                <>
                                                    {(notPaidTimesheetsData?.unpaidTimesheetsCount !== 0 ||
                                                        notPaidTimesheetsData?.usersCount !== 0 ||
                                                        notPaidTimesheetsData?.contractCount !== 0 ||
                                                        notPaidTimesheetsData?.unpaidAmount !== 0 ||
                                                        notPaidTimesheetsData?.unPaidTimesheetsByContract?.length !== 0) ? (
                                                        <div className={style.marginTop20}>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Summary Statistic</div>
                                                            <div className={`${style.grid4} ${style.marginTop20} `}>
                                                                <div>
                                                                    <div className={`${style.timesheetsNotPaidCountContainer} ${style.alignCenter} ${style.justifyCenter} `}>{notPaidTimesheetsData?.unpaidTimesheetsCount}</div>
                                                                    <div className={`${style.timesheetsNotPaidTitleContainer} ${style.alignCenter} ${style.justifyCenter} `}>Timesheets Not Paid</div>
                                                                </div>
                                                                <div>
                                                                    <div className={`${style.timesheetsNotPaidCountContainer} ${style.alignCenter} ${style.justifyCenter} `}>{notPaidTimesheetsData?.usersCount}</div>
                                                                    <div className={`${style.timesheetsNotPaidTitleContainer} ${style.alignCenter} ${style.justifyCenter} `}>Service Providers Impacted</div>
                                                                </div>
                                                                <div>
                                                                    <div className={`${style.timesheetsNotPaidCountContainer} ${style.alignCenter} ${style.justifyCenter} `}>{notPaidTimesheetsData?.contractCount}</div>
                                                                    <div className={`${style.timesheetsNotPaidTitleContainer} ${style.alignCenter} ${style.justifyCenter} `}>Contracts Affected</div>
                                                                </div>
                                                                <div>
                                                                    <div className={`${style.timesheetsNotPaidCountContainer} ${style.alignCenter} ${style.justifyCenter} `}>${notPaidTimesheetsData?.unpaidAmount >= 1000 ? `${(notPaidTimesheetsData?.unpaidAmount / 1000).toFixed(2)}K` : notPaidTimesheetsData?.unpaidAmount}</div>
                                                                    <div className={`${style.timesheetsNotPaidTitleContainer} ${style.alignCenter} ${style.justifyCenter} `}>Dollars Not Paid</div>
                                                                </div>
                                                            </div>
                                                            <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div>
                                                            {notPaidTimesheetsData?.unPaidTimesheetsByContract?.length !== 0 && (
                                                                <>
                                                                    {notPaidTimesheetsData?.unPaidTimesheetsByContract?.map(data => (
                                                                        <ReportsTable
                                                                            tableType={data?.contractName}
                                                                            tableHeader={['Timesheet', 'Period', 'Service Provider', 'Department & Site', 'Current Status', 'Invoice Amount']}
                                                                            tableValue={notPaidTimesheetsData?.unPaidTimesheetsByContract}
                                                                            activitiesServicesValues={getNotPaidTimesheetsValues()}
                                                                            styleName={style.grid6}
                                                                        />
                                                                    ))}
                                                                </>
                                                            )}

                                                        </div>
                                                    ) : (
                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                    )}
                                                </>
                                            ) : reportType === "submittedTimesheetsPaymentStatus" ? (
                                                <div className={style.marginTop20}>
                                                    {submittedTimesheetsPaymentStatusData?.timesheetPayment?.length !== 0 ? (
                                                        <>
                                                            <ReportsTable
                                                                tableType={''}
                                                                tableHeader={['Timesheet Name', 'Period', 'Contractor', 'Site/ Dept', 'Billable Hours', 'Non Billable Hours', 'Submission Date', 'Current Status', 'Status Date', 'Payment Status', 'Payment Amount', 'Payment Date']}
                                                                tableValue={submittedTimesheetsPaymentStatusData?.timesheetPayment}
                                                                activitiesServicesValues={getSubmittedTimesheetsPaymentStatusValues()}
                                                                styleName={style.grid12}
                                                            />
                                                        </>
                                                    ) : (
                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                    )}

                                                </div>
                                            )
                                                // : (reportType === "scheduledActivity" || reportType === "scheduledActivityByContract") ? (
                                                //     <>
                                                //         <div className={style.grid2}>
                                                //             <div>
                                                //                 <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20} `}>Hours Completed Summary</div>
                                                //                 <div className={style.marginTop20}>
                                                //                     <StackedBarChartBaseLayout2 />
                                                //                 </div>
                                                //             </div>
                                                //             <div>
                                                //                 <div className={`${style.entityNameBolderStyle} ${style.textAlignCenter} ${style.marginTop20} ${style.marginBottom20} `}>Dollars Paid Summary</div>
                                                //                 <Pie data={pieSampleData} width={200} height={200} innerRadius={0} outerRadius={100} />
                                                //             </div>
                                                //         </div>
                                                //         <div className={`${style.headerBorderStyle} `}></div>
                                                //         <div className={style.contractNameCardStyle}>Contract Name 1 - Individual Contractor Contract</div>
                                                //         <div className={`${style.grid2} ${style.marginTop40} `}>
                                                //             <div>
                                                //                 <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20} `}>Hours Completed Summary</div>
                                                //                 <div className={style.marginTop20}>
                                                //                     <StackedBarChartBaseLayout2 />
                                                //                 </div>
                                                //             </div>
                                                //             <div>
                                                //                 <div className={`${style.entityNameBolderStyle} ${style.textAlignCenter} ${style.marginTop20} ${style.marginBottom20} `}>Dollars Paid Summary</div>
                                                //                 <Pie data={pieSampleData} width={200} height={200} innerRadius={0} outerRadius={100} />
                                                //             </div>
                                                //         </div>
                                                //         <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                                                //         <div className={style.marginTop40}>
                                                //             <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Scheduled Activity/ Services Completion Status</div>
                                                //             <div className={`${style.grid6} ${style.marginTop20} `}>
                                                //                 <div></div>
                                                //                 <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Total To do</div>
                                                //                 <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Completed</div>
                                                //                 <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Not Verified</div>
                                                //                 <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Not Completed</div>
                                                //                 <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Yet to Complete</div>
                                                //             </div>
                                                //             <div className={`${style.grid6} ${style.marginTop20} `}>
                                                //                 <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5} `}>Medical Services</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>12 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>1</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>7 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2 ($ xxx)</div>
                                                //             </div>
                                                //             <div className={`${style.grid6} ${style.marginTop20} `}>
                                                //                 <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5} `}>Administrative Services</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>12 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>1</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>7 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2 ($ xxx)</div>
                                                //             </div>
                                                //             <div className={`${style.grid6} ${style.marginTop20} `}>
                                                //                 <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5} `}>Supplemental Services</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>12 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>1</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>7 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2 ($ xxx)</div>
                                                //             </div>
                                                //         </div>
                                                //         <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                                                //         <div className={style.contractNameCardStyle}>Contract Name 2 - Multiple Contractor Contract - 5 Service Providers</div>
                                                //         <div className={`${style.grid2} ${style.marginTop20} `}>
                                                //             <div>
                                                //                 <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} ${style.marginBottom20} `}>Hours Completed Summary</div>
                                                //                 <div className={style.marginTop20}>
                                                //                     <StackedBarChartBaseLayout2 />
                                                //                 </div>
                                                //             </div>
                                                //             <div>
                                                //                 <div className={`${style.entityNameBolderStyle} ${style.textAlignCenter} ${style.marginTop20} ${style.marginBottom20} `}>Dollars Paid Summary</div>
                                                //                 <Pie data={pieSampleData} width={200} height={200} innerRadius={0} outerRadius={100} />
                                                //             </div>
                                                //         </div>
                                                //         <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                                                //         <div className={style.marginTop40}>
                                                //             <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Scheduled Activity/ Services Completion Status</div>
                                                //             <div className={`${style.grid6} ${style.marginTop20} `}>
                                                //                 <div></div>
                                                //                 <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Total To do</div>
                                                //                 <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Completed</div>
                                                //                 <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Not Verified</div>
                                                //                 <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Not Completed</div>
                                                //                 <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Yet to Complete</div>
                                                //             </div>
                                                //             <div className={`${style.grid6} ${style.marginTop20} `}>
                                                //                 <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5} `}>Medical Services</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>12 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>1</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>7 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2 ($ xxx)</div>
                                                //             </div>
                                                //             <div className={`${style.grid6} ${style.marginTop20} `}>
                                                //                 <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5} `}>Administrative Services</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>12 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>1</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>7 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2 ($ xxx)</div>
                                                //             </div>
                                                //             <div className={`${style.grid6} ${style.marginTop20} `}>
                                                //                 <div className={`${style.reportTypeValueBoldTextStyle} ${style.marginTop5} `}>Supplemental Services</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>12 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>1</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>7 ($ xxx)</div>
                                                //                 <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>2 ($ xxx)</div>
                                                //             </div>
                                                //         </div>
                                                //     </>
                                                // ) 
                                                : (reportType === "upcomingContractRenewals" || reportType === "oneTimeContract") ? (
                                                    <>
                                                        {individualContract?.length !== 0 && (
                                                            <ReportsTable
                                                                tableType={'Individual Service Provider Contract Renewal'}
                                                                tableHeader={['Contract Name', 'Contract ID', 'Contract Expiration Date', 'Contracting Entity', 'Point of Contact', 'Point of Contact Number', 'Email Address']}
                                                                tableValue={individualContract}
                                                                activitiesServicesValues={getContractManagementUpcomingValues('INDIVIDUAL')}
                                                                styleName={style.individualServiceReportGrid}
                                                            />
                                                        )}
                                                        {multipleContract?.length !== 0 && (
                                                            <ReportsTable
                                                                tableType={'Multiple Service Provider Contract Renewal'}
                                                                tableHeader={['Contract Name', 'Contract ID', 'Contract Expiration Date', 'Contracting Entity', 'Point of Contact', 'Point of Contact Number', 'Email Address', 'Service Providers']}
                                                                tableValue={multipleContract}
                                                                activitiesServicesValues={getContractManagementUpcomingValues('MULTIPLE')}
                                                                styleName={style.individualServiceReportGrid}
                                                            />
                                                        )}
                                                    </>
                                                ) : reportType === "complianceStatus" ? (
                                                    <>
                                                        <div className={style.marginTop40}>
                                                            <StackedBarChartBaseLayout3 />
                                                        </div>
                                                        <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div>
                                                        <div className={style.marginTop40}>
                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Non Compliant Providers With Required Documents</div>
                                                            <div className={`${style.grid7} ${style.marginTop20} `}>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Service Provider Name</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Title</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Department</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Site</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Non Compliant PODs</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Non Compliant days</div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Open Tasks</div>
                                                            </div>
                                                            <div className={`${style.grid7} ${style.marginTop20} `}>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>John Doe</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Chief Medical Officer</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>--</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Good Samaritan Hospital</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>3</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>20</div>
                                                                <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>2</div>
                                                            </div>
                                                        </div>
                                                        <div className={style.marginTop40}>
                                                            <div>
                                                                <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Providers With Required Documents Needing Compliance Within Next 30 Days</div>
                                                                <div className={`${style.grid7} ${style.marginTop20} `}>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Service Provider Name</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Title</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Department</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Site</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Non Compliant PODs</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Non Compliant days</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Open Tasks</div>
                                                                </div>
                                                                <div className={`${style.grid7} ${style.marginTop20} `}>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>John Doe</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Chief Medical Officer</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>--</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Good Samaritan Hospital</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>3</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>20</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>2</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className={style.marginTop40}>
                                                            <div>
                                                                <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Providers In Compliance With Required Documents</div>
                                                                <div className={`${style.grid7} ${style.marginTop20} `}>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Service Provider Name</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Title</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Department</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Site</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Non Compliant PODs</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Non Compliant days</div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Open Tasks</div>
                                                                </div>
                                                                <div className={`${style.grid7} ${style.marginTop20} `}>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>John Doe</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Chief Medical Officer</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>--</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Good Samaritan Hospital</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>3</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>20</div>
                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>2</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : reportType === "nonCompliant" ? (
                                                    <>
                                                        {isNonCompliantReportTileClicked ? (
                                                            <>
                                                                {nonCompliantContract?.documentNotUploadedContracts?.length !== 0 && (
                                                                    <ReportsTable
                                                                        tableType={`Contracts With No ${selectedPodTypeFromTile} Proof Of Documentation`}
                                                                        tableHeader={['Contract Name', 'Contract ID', 'Contract Manager', 'Contract Effective Date', 'Contracting Entity', 'Point of Contact', 'Phone Number', 'Email Address']}
                                                                        tableValue={nonCompliantContract?.documentNotUploadedContracts}
                                                                        activitiesServicesValues={getContractComplianceValues('documentNotUploadedContracts')}
                                                                        styleName={style.individualServiceReportGrid}
                                                                    />
                                                                )}
                                                                {nonCompliantContract?.expiredContracts?.length !== 0 && (
                                                                    <ReportsTable
                                                                        tableType={`Contracts With Expired ${selectedPodTypeFromTile} `}
                                                                        tableHeader={['Contract Name', 'Contract ID', 'Contract Manager', 'Contract Effective Date', 'Contracting Entity', 'Point of Contact', 'Phone Number', 'Email Address']}
                                                                        tableValue={nonCompliantContract?.expiredContracts}
                                                                        activitiesServicesValues={getContractComplianceValues('expiredContracts')}
                                                                        styleName={style.individualServiceReportGrid}
                                                                    />
                                                                )}
                                                                {nonCompliantContract?.renewalContracts?.length !== 0 && (
                                                                    <ReportsTable
                                                                        tableType={`Contracts With Renewals in next 30 days ${selectedPodTypeFromTile} `}
                                                                        tableHeader={['Contract Name', 'Contract ID', 'Contract Manager', 'Contract Effective Date', 'Contracting Entity', 'Point of Contact', 'Phone Number', 'Email Address']}
                                                                        tableValue={nonCompliantContract?.renewalContracts}
                                                                        activitiesServicesValues={getContractComplianceValues('renewalContracts')}
                                                                        styleName={style.individualServiceReportGrid}
                                                                    />
                                                                )}
                                                                {nonCompliantContract?.notExpiredContracts?.length !== 0 && (
                                                                    <ReportsTable
                                                                        tableType={`Contracts With Not Expired ${selectedPodTypeFromTile} `}
                                                                        tableHeader={['Contract Name', 'Contract ID', 'Contract Manager', 'Contract Effective Date', 'Contracting Entity', 'Point of Contact', 'Phone Number', 'Email Address']}
                                                                        tableValue={nonCompliantContract?.notExpiredContracts}
                                                                        activitiesServicesValues={getContractComplianceValues('notExpiredContracts')}
                                                                        styleName={style.individualServiceReportGrid}
                                                                    />
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className={`${style.complianceGrid2} ${style.marginTop20} `}>
                                                                {podTypes?.map((data, index) => (
                                                                    <div className={`${style.complianceCardStyle} ${style.cursorPointer} `} key={index} onClick={() => { setIsNonCompliantReportTileClicked(true); setSelectedPodTypeFromTile(data) }}>
                                                                        <div className={style.complianceLeftCardStyle}>
                                                                            <div className={style.complianPercentageStyle}>
                                                                                {`${nonCompliantContractTile?.podTypePercentage?.[data] || 0}% `}
                                                                            </div>
                                                                        </div>
                                                                        <div className={style.complianceRightCardStyle}>
                                                                            <div className={style.fullWidth}>
                                                                                <div className={style.complianceHeadingStyle}>{data}</div>
                                                                                <div className={`${style.complianceListGrid} ${style.marginTop20} `}>
                                                                                    <div className={style.redDotStyle}></div>
                                                                                    <div className={`${style.reportRunByTextStyle} `}>Expired</div>
                                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} `}>{nonCompliantContractTile?.podTypeTileCountMap?.[data]?.expiredDocumentCount}</div>
                                                                                </div>
                                                                                <div className={`${style.complianceListGrid} ${style.marginTop10} `}>
                                                                                    <div className={style.yellowDotStyle}></div>
                                                                                    <div className={`${style.reportRunByTextStyle} `}>Renewals in next 30 days</div>
                                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} `}>{nonCompliantContractTile?.podTypeTileCountMap?.[data]?.renewalIn30DaysDocumentCount}</div>
                                                                                </div>
                                                                                <div className={`${style.complianceListGrid} ${style.marginTop10} `}>
                                                                                    <div className={style.greenDotStyle}></div>
                                                                                    <div className={`${style.reportRunByTextStyle} `}>Not expired</div>
                                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} `}>{nonCompliantContractTile?.podTypeTileCountMap?.[data]?.notExpiredDocumentCount}</div>
                                                                                </div>
                                                                                <div className={`${style.complianceListGrid} ${style.marginTop10} `}>
                                                                                    <div className={style.blueDotStyle}></div>
                                                                                    <div className={`${style.reportRunByTextStyle} `}>Document copy not on file</div>
                                                                                    <div className={`${style.reportTypeValueBoldTextStyle} ${style.textAlignLeft} `}>{nonCompliantContractTile?.podTypeTileCountMap?.[data]?.documentFileNotFoundCount}</div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                    </>
                                                )}
                                        </div>
                                    </tbody>
                                    <tfoot>
                                        <ReportFooter />
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </FullScreen>
                </div>
            </div>
        </Fragment>
    )
}

export default ReportTypeOverview;
