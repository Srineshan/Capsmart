import React, { Fragment, useState, useEffect, useRef, useCallback, createRef } from 'react';
import { useLocation } from "react-router-dom";
import SampleReportLeftCard from './sampleReportLeftCard';
import Navbar from '../../Components/Navbar';
import { GET } from './../dataSaver';
import ReportPerformanceAndOptions from './reportPerformanceAndOptions';
import ReportHeader from './reportHeader';
import ReportFooter from './reportFooter';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";
import { addYears, format } from 'date-fns';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { toPDF } from '../../Components/ConvertToPdf';
import LoadingScreen from '../../Components/LoadingScreen';
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
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import Loader from './../../images/loaderCommon.gif';
import style from './index.module.scss';
import ApexBoxChart from './chart-data/boxChart';
import ReportsTable from '../../Components/ReportsTable';
import ReportsApplicantTable from '../../Components/ReportApplicantData';
import ReportsApplicantTableNotes from '../../Components/ReportApplicantNotes';
import ReportNoDataBox from '../../Components/ReusableSmallComponents/reportNoDataBox';
import { formatInTimeZone } from 'date-fns-tz';
import { dataLoadingGIF, siteTimeZone } from '../../utils/formatting';
import { formatFirstNameLastName } from "../../utils/formatting";
import TrackTable from '../../Components/TrackTable';
import TableTwo from "../../Components/TableDesignTwo"
import ReportsStaffTable from '../../Components/ReportStaffbyType';
import ReportsApplicantWithAllDataTable from '../../Components/ReportApplicantWithAllData';
import { currentUser } from '../../utils/auth';
import GaugeChart from './chart-data/gaugeChart';
import FunnelChart from './chart-data/funnelChart';
import DonutChart from './chart-data/donutChart';

const ReportTypeOverview = () => {
    const location = useLocation();
    const tableData = location.state?.tableData || [];
    const currentUserDetails = currentUser();
    console.log("tables:", tableData);
    const { reportType, scheduleId } = useParams();
    const isMyReport = window.location.pathname.includes("/myReport");
    const isScheduledReport = window.location.pathname.includes("/scheduledReport");
    const myReportId = sessionStorage.getItem('myReportId')
    const myReportContent = (sessionStorage.getItem('myReportContent') && sessionStorage.getItem('myReportContent') !== 'undefined') ? JSON.parse(sessionStorage.getItem('myReportContent')) : {};
    const entityName = sessionStorage.getItem('title');
    const handle = useFullScreenHandle();
    const componentRef = useRef(null);
    const PDFRef = createRef();
    const onBeforeGetContentResolve = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullScreenLoading, setIsFullScreenLoading] = useState(false);
    const [isWaiting, setIsWaiting] = useState(false);
    const [isNoData, setIsNoData] = useState(false);
    const [contractRenewalReport, setContractRenewalReport] = useState([]);
    const [staffReappointments, setOneTimeContract] = useState([]);
    const [contractDocumentsOnFileValues, setContractDocumentsOnFileValues] = useState([]);
    const [multiProviderContractValues, setMultiProviderContractValues] = useState([]);
    const [contractsWithBusinessEntityValues, setContractsWithBusinessEntityValues] = useState([]);
    const [currentRemitToAddressValues, setCurrentRemitToAddressValues] = useState([]);
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
    const [staffReappointmentTrackerData, setStaffReappointmentTrackerData] = useState();
    const [locumStaffRenewalTrackerData, setLocumStaffRenewalTrackerData] = useState();
    const [staffValues, setStaffValues] = useState([]);
    const [locumStaffValues, setLocumStaffValues] = useState([]);
    const [isNonCompliantReportTileClicked, setIsNonCompliantReportTileClicked] = useState(false);
    const [activityTrackServices, setActivityTrackServices] = useState([]);
    const [paymentTrackValues, setPaymentTrackValues] = useState();
    const [submittedApplicationValues, setSubmittedApplicationValues] = useState();
    const [locumRenewalOrExtensionApplicationValues, setLocumRenewalOrExtensionApplicationValues] = useState();
    const [declinedOrNotRenewedStaffSummaryValues, setDeclinedOrNotRenewedStaffSummaryValues] = useState();
    const [ohipBillingNumbersByCareProviderValues, setOhipBillingNumbersByCareProviderValues] = useState();
    const [reappointmentNotStartedValues, setReappointmentNotStartedValues] = useState();
    const [careProviderCareerMilestoneValues, setCareProviderCareerMilestoneValues] = useState();
    const [privilegedStaffSummaryValues, setPrivilegedStaffSummaryValues] = useState();
    const [staffReappointmentStatusSummaryValues, setStaffReappointmentStatusSummaryValues] = useState();
    const [staffApplicationNotesSummaryValues, setStaffApplicationNotesSummaryValues] = useState();
    const [selectedPaymentTab, setSelectedPaymentTab] = useState('Payment Processed');
    const [currentMedicalDirectives, setCurrentMedicalDirectives] = useState();
    const [retiredMedicalDirectives, setRetiredMedicalDirectives] = useState();
    const [currentPolicyAndProcedures, setCurrentPolicyAndProcedures] = useState();
    const [retiredPolicyAndProcedures, setRetiredPolicyAndProcedures] = useState();
    const [medicalDirectivesWorkflow, setMedicalDirectivesWorkflow] = useState();
    const [medicalDirectivesTracker, setMedicalDirectivesTracker] = useState();
    const [upcomingForReview, setUpcomingForReview] = useState();
    const [policyAndProceduresAttestationOutstanding, setPolicyAndProceduresAttestationOutstanding] = useState();
    const [policyAndProceduresWorkflow, setPolicyAndProceduresWorkflow] = useState();
    const [policyAndProceduresTracker, setPolicyAndProceduresTracker] = useState();
    const [policyAndProceduresUpcomingForReview, setPolicyAndProceduresUpcomingForReview] = useState();
    const [attestationOutstanding, setAttestationOutstanding] = useState();
    const [tableDataStatus, setTableDataStatus] = useState([]);
    const [expiredDocumentsSummaryForStaff, setExpiredDocumentsSummaryForStaff] = useState([]);
    const [staffDocumentsExpiration, setStaffDocumentsExpiration] = useState([]);
    const [inactiveStaffSummary, setInactiveStaffSummary] = useState([]);
    const [newStaffAppointmentsSummary, setNewStaffAppointmentsSummary] = useState([]);
    const [appointmentHistorySummary, setAppointmentHistorySummary] = useState([]);
    const [inactiveStaffSummaryByMonth, setInactiveStaffSummaryByMonth] = useState([]);
    const [staffUploadedDocumentsSummary, setStaffUploadedDocumentsSummary] = useState([]);
    const [locumTermExpirationSummary, setLocumTermExpirationSummary] = useState([]);
    const [applicationType, setApplicationType] = useState(() =>
        sessionStorage.getItem('applicationCreationType') || 'NEW'
    );
    const [scheduledTime, setScheduledTime] = useState();
    const [siteId, setSiteId] = useState(() =>
        sessionStorage.getItem('selectedSite') || ''
    );
    const [apexStackedBarChartDisplay, setApexStackedBarChartDisplay] = useState(
        <ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} />
    )
    const canadaData = sessionStorage.getItem('canadaData') !== 'undefined' ? JSON.parse(sessionStorage.getItem('canadaData')) : {};
    const dateFormat = canadaData?.dateFormat || 'MMM dd, yyyy';
    let cookie = new Cookie();
    let userDetails = cookie.get('user');
    const userDetail = jwt(userDetails);
    let workModeType = sessionStorage.getItem('workModeType')
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

    const applicationStatus = {
        CREATED: 'Application Created',
        SUBMITTED: 'Application Submitted',
        APPROVED: 'Application Approved',
        REJECTED: 'Application Rejected',
        COMPLETED: 'Application Completed',
        REVIEW_INPROGRESS: 'Review In-Progress',
        DECLINED: 'Application Denied'
    }

    const applicationSubStatus = {
        STARTED: 'Application In-Progress',
        NOT_STARTED: 'Application not yet started',
    }

    const getContractStatusValue = {
        ACTIVE: 'Active',
        DRAFT: 'Draft',
        EXPIRED: 'Expired',
        TERMINATED: 'Terminated',
        ACTIVATION_READY: 'Ready To Activate',
    }

    const compensationPolicy = {
        ACTIVITY_BASED: 'Activity Based',
        SHIFT_OR_PER_DAY_BASED: 'Shift Or Per Day Based',
        FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITH_OFFSET: 'Fixed Amount For Timesheet Period With Offset',
        FIXED_AMOUNT_FOR_TIMESHEET_PERIOD_WITHOUT_OFFSET: 'Fixed Amount For Timesheet Period Without Offset',
    }

    const availableApplicationTypes = {
        NEW: 'New Applicants',
        REAPPOINTMENT: 'Staff Reappointments',
        LOCUM_RENEWAL: 'Locum Renewals'
    }

    const availableCategories = {
        servicesOrActivities: 'SERVICES_ACTIVITIES',
        contractManagement: 'CONTRACT_MANAGEMENT',
        contractCompliance: 'CONTRACT_COMPLIANCE',
        contractPerformance: 'CONTRACT_PERFORMANCE',
        payments: 'PAYMENT',
        timesheets: 'TIMESHEET',
        reviewsApprovals: 'REVIEWS_APPROVALS',
        systemAdministrative: 'SYSTEM_ADMINISTRATIVE',
        allStaffMembers: 'ALL_STAFF',
        savedReportsArchive: '',
        staffReappointments: 'STAFF_REAPPOINTMENT',
        newApplicants: 'NEW_APPLICANT',
        allApplications: 'ALL_APPLICATION',
        locumStaff: 'LOCUM_STAFF',
        permanentStaff: 'PERMANENT_STAFF',
        locumExtensionOrRenewal: 'LOCUM_EXTENSION_OR_RENEWAL',
        submittedApplicationsReviewSummary: 'STAFF_REAPPOINTMENT',
        ohipBillingNumbersByCareProvider: 'ALL_STAFF',
        reappointmentApplicationNotStarted: 'STAFF_REAPPOINTMENT',
        privilegedStaffSummary: 'ALL_STAFF',
        currentNotesSummary: 'ALL_STAFF',
        staffReappointmentStatusSummary: 'STAFF_REAPPOINTMENT',
        locumRenewalOrExtensionApplicationsSummary: 'LOCUM_EXTENSION_OR_RENEWAL',
        careProviderCareerMilestoneSummary: 'PERMANENT_STAFF',
        declinedOrNotRenewedStaffSummary: 'LOCUM_EXTENSION_OR_RENEWAL',
        currentMedicalDirectives: 'MEDICAL_DIRECTIVE',
        retiredMedicalDirectives: 'MEDICAL_DIRECTIVE',
        workflow: 'MEDICAL_DIRECTIVE',
        attestationOutstanding: 'MEDICAL_DIRECTIVE',
        medicalDirectivesTracker: 'MEDICAL_DIRECTIVE',
        upcomingForReview: 'MEDICAL_DIRECTIVE',
        currentPolicyAndProcedures: 'POLICY_AND_PROCEDURES',
        retiredPolicyAndProcedures: 'POLICY_AND_PROCEDURES',
        policyAndProceduresWorkflow: 'POLICY_AND_PROCEDURES',
        policyAndProceduresAttestationOutstanding: 'POLICY_AND_PROCEDURES',
        policyAndProceduresTracker: 'POLICY_AND_PROCEDURES',
        policyAndProceduresUpcomingForReview: 'POLICY_AND_PROCEDURES',
    }

    // console.log("dashboard",tableData.map(item => item.id))
    console.log("dashboard", tableData)

    useEffect(() => {
        setActivitiesOrServices();
    }, [activitiesOrServicesValues]);

    useEffect(() => {
        setAddOnServices();
    }, [addOnServicesValues]);

    useEffect(() => {
        // if (reportType === 'staffReappointmentsNotes') {
        //     getContractRenewalReport();
        // }
        // if (reportType === 'staffReappointments') {
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
        // if (reportType === 'staffReappointmentTracker') {
        //     getSubmittedTimesheetsPaymentStatus('withoutParameter');
        // }
        // if (reportType === 'paymentsProcessingSummary') {
        //     getPayments();
        // }
        // if (reportType === 'compensationCostAnalysis') {
        //     getCompensationCostAnalysis();
        // }
        getUsersData();
    }, [])

    // useEffect(() => {
    //     if (myReportIdFromUrl)
    //         getMyReportRecords()
    // }, [myReportIdFromUrl])

    console.log("dataToUseInReport", dataToUseInReport)

    useEffect(() => {
        if (dataToUseInReport?.initialValueSet && ((dataToUseInReport?.selectedDepartments?.length !== 1 ? !dataToUseInReport?.selectedDepartments?.includes('') : true) && (dataToUseInReport?.selectedStaffType?.length !== 1 ? !dataToUseInReport?.selectedStaffType?.includes('') : true) && (dataToUseInReport?.selectedPrivilegeCategory?.length !== 1 ? !dataToUseInReport?.selectedPrivilegeCategory?.includes('') : true))) {
            const controller = new AbortController(); // Create an AbortController instance
            const signal = controller.signal;
            getUpdatedValuesWithParams(signal);
            return () => controller.abort();
        }
        if (isScheduledReport) {
            const controller = new AbortController(); // Create an AbortController instance
            const signal = controller.signal;
            getUpdatedValuesWithParams(signal);
            return () => controller.abort();
        }
        console.log(dataToUseInReport, 'dataToUseInReport', (dataToUseInReport?.initialValueSet && ((dataToUseInReport?.selectedDepartments?.length !== 1 ? !dataToUseInReport?.selectedDepartments.includes('') : true) && (dataToUseInReport?.selectedStaffType?.length !== 1 ? !dataToUseInReport?.selectedStaffType.includes('') : true) && (dataToUseInReport?.selectedPrivilegeCategory?.length !== 1 ? !dataToUseInReport?.selectedPrivilegeCategory.includes('') : true))))
    }, [dataToUseInReport?.from, dataToUseInReport?.to, dataToUseInReport?.selectedPrivilegeCategory, dataToUseInReport?.selectedStaffType, dataToUseInReport?.selectedSites, dataToUseInReport?.selectedDepartments, dataToUseInReport?.selectedGroups, dataToUseInReport?.selectedAuthors, dataToUseInReport?.renewalreportingTimePeriod, dataToUseInReport?.selectedPosition, dataToUseInReport?.selectedApplicationType, dataToUseInReport?.initialValueSet, dataToUseInReport?.selectedTimesheetInterval, dataToUseInReport?.selectedReappointmentStatus, dataToUseInReport?.selectedApplicationSentStatus, dataToUseInReport?.selectedWorkflowLevel, dataToUseInReport?.noOfDays, dataToUseInReport?.tab, dataToUseInReport?.search]);

    useEffect(() => {
        setApexStackedBarChartDisplay(<ApexStackedBarChart stackedSeries={stackedSeries} stackedCategories={stackedCategories} />);
    }, [stackedCategories, stackedSeries])

    // const getMyReportRecords = async () => {
    //     const { data: myReport } = await GET(`application-management-service/report/myReport?userId=${currentUserDetails?.id}&category=${availableCategories[reportType]}`);
    //     sessionStorage.setItem('reportFilter', JSON.stringify(myReport?.filter(data => data?.id === myReportIdFromUrl)?.[0]?.report?.filters));
    //     sessionStorage.setItem('myReportContent', JSON.stringify(myReport?.filter(data => data?.id === myReportIdFromUrl)?.[0]?.report));
    //     sessionStorage.setItem('myReportId', myReportIdFromUrl);
    //     console.log(myReportIdFromUrl, myReport?.filter(data => data?.id === myReportIdFromUrl)?.[0])
    // }

    const getUpdatedValuesWithParams = (signal) => {
        switch (reportType) {
            case 'submittedApplicationsReviewSummary':
                getSubmittedApplications(signal);
                break;
            case 'ohipBillingNumbersByCareProvider':
                getOHIPBillingNumbersByCareProvider(signal);
                break;
            case 'reappointmentApplicationNotStarted':
                getReappointmentApplicationNotYetStarted(signal);
                break;
            case 'careProviderCareerMilestoneSummary':
                getCareProviderCareerMilestone(signal);
                break;
            case 'privilegedStaffSummary':
                getPrivilegedStaffSummary(signal);
                break;
            case 'staffReappointmentStatusSummary':
                getStaffReappointmentStatusSummary(signal);
                break;
            case 'currentNotesSummary':
                getCurrentApplicationNotesSummary(signal);
                break;
            case 'locumRenewalOrExtensionApplicationsSummary':
                getLocumRenewalOrExtensionApplication(signal);
                break;
            case 'declinedOrNotRenewedStaffSummary':
                getDeclinedOrNotRenewedStaffSummary(signal);
                break;
            case 'staffReappointmentsNotes':
                getContractRenewalReportWithParameters();
                break;
            case 'staffReappointments':
                getOneTimeContractWithParameters();
                break;
            case 'locumStaffRenewalNotes':
                break;
            case 'locumStaffRenewal':
                setIsLoading(false);
                break;
            case 'staffReappointmentTracker':
                getStaffReappointmentStatusTracker();
                break;
            case 'locumStaffRenewalStatusTracker':
                getLocumStaffRenewalStatusTracker();
                break;
            case 'staffbyTypes':
                getStaffByTypes();
                break;
            case 'locumStaffbyTypes':
                getLocumStaffByTypes();
                break;
            case 'currentMedicalDirectives':
                getCurrentMedicalDirective();
                break;
            case 'retiredMedicalDirectives':
                getRetiredMedicalDirective();
                break;
            case 'workflow':
                getMedicalDirectivesWorkflow();
                break;
            case 'attestationOutstanding':
                getAttestationOutstanding();
                break;
            case 'medicalDirectivesTracker':
                getMedicalDirectivesTracker();
                break;
            case 'upcomingForReview':
                getUpcomingForReview();
                break;
            case 'expiredDocumentsSummaryForStaff':
                getExpiredDocumentsSummaryForStaff(signal)
                break;
            case 'documentsExpirationSummaryForStaff':
                getDocumentsExpirationSummaryForStaff(signal)
                break;
            case 'inactiveStaffSummary':
                getInactiveStaffSummary(signal)
                break;
            case 'newStaffAppointmentsSummary':
                getNewStaffAppointmentsSummary(signal)
                break;
            case 'appointmentHistorySummary':
                getAppointmentHistorySummary(signal)
                break;
            case 'inactiveStaffSummaryByMonth':
                getInactiveStaffSummaryByMonth(signal)
                break;
            case 'staffUploadedDocumentsSummary':
                getStaffUploadedDocumentsSummary(signal)
                break;
            case 'locumTermExpirationSummary':
                getLocumTermExpirationSummary(signal)
                break;
            case 'currentPolicyAndProcedures':
                getCurrentPolicyAndProcedure();
                break;
            case 'retiredPolicyAndProcedures':
                getRetiredPolicyAndProcedure();
                break;
            case 'policyAndProceduresWorkflow':
                getPolicyAndProceduresWorkflow();
                break;
            case 'policyAndProceduresAttestationOutstanding':
                getPolicyAndProceduresAttestationOutstanding();
                break;
            case 'policyAndProceduresTracker':
                getPolicyAndProceduresTracker();
                break;
            case 'policyAndProceduresUpcomingForReview':
                getPolicyAndProceduresUpcomingForReview();
                break;
            default:
                // Optional: handle unknown reportType
                break;
        }
    }

    useEffect(() => {
        setIndividualContract(contractRenewalReport?.filter(data => data?.contractType === "INDIVIDUAL")?.map(data => data));
        setMultipleContract(contractRenewalReport?.filter(data => data?.contractType === "MULTIPLE")?.map(data => data));
    }, [contractRenewalReport]);

    useEffect(() => {
        setIndividualContract(staffReappointments?.filter(data => data?.contractType === "INDIVIDUAL")?.map(data => data));
        setMultipleContract(staffReappointments?.filter(data => data?.contractType === "MULTIPLE")?.map(data => data));
    }, [staffReappointments]);

    // useEffect(() => {
    //     if (reportType === 'nonCompliant' && isNonCompliantReportTileClicked) {
    //         getNonCompliantContractReport();
    //     }
    // }, [isNonCompliantReportTileClicked]);

    useEffect(() => {
        setIsNoData((paymentsReportLog?.paymentContracts?.length === 0 && paymentsReportLog?.rejected?.length === 0 && paymentsReportLog?.paymentPastDue?.length === 0 && paymentsReportLog?.paymentNotDone?.length === 0 && paymentsReportLog?.paymentDelayed?.length === 0 && paymentsReportLog?.paidOnTime?.length === 0) ? true : false);
    }, [paymentsReportLog])

    useEffect(() => {
        setTimesheetProcessingSummary();
    }, [timesheetProcessingSummaryData])

    const reactToPrintContent = useCallback(() => {
        return componentRef.current;
    }, [componentRef.current]);

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
        // staffReappointmentsNotes: 'Upcoming Contract Renewals',
        staffReappointmentsNotes: 'List Of Notes On Current Staff Reappointment Applications',
        locumStaffRenewalNotes: 'List Of Notes On Current Locum Staff Renewal Applications',
        // staffReappointments: "List of One Time Contracts that will Terminate on Expiration",
        staffReappointments: "Staff Reappointments to Process",
        locumStaffRenewal: "Locum Staff Extensions Renewals To Review",
        // staffReappointmentTracker: 'Submitted Timesheets Payment Status',
        staffReappointmentTracker: 'Staff Reappointment Status Tracker',
        locumStaffRenewalStatusTracker: 'Locum Staff Renewal Status Tracker',
        staffbyTypes: 'Staff Reappointments Application Status',
        scheduledActivity: "Scheduled Activity/ Services - Forcasted To Actual",
        scheduledActivityByContract: "Scheduled Activity/ Services - Forcasted To Actual By Contract",
        complianceStatus: "Proof Of Documentation Status By Contractor",
        nonCompliant: 'Proof Of Documentation Compliance For Contract Based Requirments',
        paymentsProcessingSummary: 'Payments Processing Summary',
        compensationCostAnalysis: 'Compensation Cost Analysis',
        timesheetProcessingSummary: 'Timesheet Processing Summary',
        listingOfTimesheetsNotPaid: 'Listing Of Timesheets Not Paid',
        addOnActivities: 'Add On Activities/ Services Requests Status Summary',
        activitiesOrServices: 'Activities/ Services Log Status Summary',
        contractDocumentsOnFile: 'Contract Documents On File',
        multiProviderContractsList: 'Multi Provider Contracts List',
        contractsWithABusinessEntity: 'Contracts With A Business Entity',
        currentRemitToAddressForActiveContracts: 'Current Remit To Address For Active Contracts',
        paymentProcessingStatusTracker: 'Payment Processing Status By Service Provider',
        submittedApplicationsReviewSummary: 'Submitted Applications Review Summary',
        ohipBillingNumbersByCareProvider: 'OHIP Billing Numbers By Care Provider',
        reappointmentApplicationNotStarted: 'Reappointment Application Not Yet Started Summary',
        privilegedStaffSummary: 'Privileged Staff Summary',
        staffReappointmentStatusSummary: 'Staff Reappointment Status Summary',
        currentNotesSummary: 'Current Notes Summary',
        locumRenewalOrExtensionApplicationsSummary: 'Locum Renewal / Extension Applications Summary',
        careProviderCareerMilestoneSummary: 'Care Providers Career Milestone Summary',
        declinedOrNotRenewedStaffSummary: 'Declined Or Not Renewed Staff Summary',
        locumStaffbyTypes: ' Locum Staff Renewal / Extension Application Status',
        expiredDocumentsSummaryForStaff: 'Expired Staff Documents',
        documentsExpirationSummaryForStaff: 'Expiring Staff Documents',
        inactiveStaffSummary: 'Inactive Staff',
        newStaffAppointmentsSummary: 'New Staff Appointments',
        appointmentHistorySummary: 'Appointment History',
        inactiveStaffSummaryByMonth: 'Inactive Staff Summary By Month',
        staffUploadedDocumentsSummary: 'Staff Uploaded Documents',
        locumTermExpirationSummary: 'Locum Term Expiration',
        currentMedicalDirectives: 'Current Medical Directives',
        retiredMedicalDirectives: 'Retired Medical Directives',
        workflow: 'Medical Directives Workflow',
        attestationOutstanding: 'Medical Directives Attestation Outstanding',
        medicalDirectivesTracker: 'Medical Directives Tracker',
        upcomingForReview: 'Upcoming For Review',
        currentPolicyAndProcedures: 'Current Policy And Procedures',
        retiredPolicyAndProcedures: 'Retired Policy And Procedures',
        policyAndProceduresWorkflow: 'Policy and Procedures By Workflow Level',
        policyAndProceduresAttestationOutstanding: 'Policy and Procedures Attestation Outstanding By Staff Assigned To Attest',
        policyAndProceduresTracker: 'Policy and Procedures Tracker',
        policyAndProceduresUpcomingForReview: 'Policy and Procedures Upcoming For Review',
    }

    const handlePrint = useReactToPrint({
        content: reactToPrintContent,
        documentTitle: `${reportTitleList[reportType]}_${userDetail?.userName}_${format(new Date(), 'MM_dd_yy')}`,
        // onBeforeGetContent: handleOnBeforeGetContent,
        // onBeforePrint: handleBeforePrint,
        // onAfterPrint: handleAfterPrint,
        removeAfterPrint: true
    });

    // const handlePrint = useReactToPrint({
    //     content: reactToPrintContent,
    //     documentTitle: `${reportTitleList[reportType]}_${userDetail?.userName}_${format(new Date(), 'MM_dd_yy')}`,
    //     removeAfterPrint: true,
    //     pageStyle: `
    //       @page {
    //         margin-top: 20px;
    //       }
    //       @media print {
    //         .reportBackgroundCard {
    //           break-inside: avoid;
    //         }
    //         body, html {
    //           padding-top: 0;
    //           margin-top: 0;
    //         }
    //       }
    //     `
    //   });

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    }

    const getIsDownloadClicked = (value) => {
        setIsDownloadClicked(value);
        if (value) {
            toPDF(".Report", `${reportTitleList[reportType]}_${userDetail?.userName}_${format(new Date(), 'MM_dd_yy')}`);
        }
    }

    // const getAcvityAndServices = async () => {
    //     if (!isMyReport) {
    //         const { data: chartDataValues } = await GET(`timesheet-management-service/report/activityServiceReport?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
    //         setActivitiesOrServicesValues(chartDataValues);
    //     } else {
    //         const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/activityServiceReport?id=${myReportId}`);
    //         setActivitiesOrServicesValues(chartDataValues);
    //     }
    // }

    const setActivitiesOrServices = () => {
        setReportLog(activitiesOrServicesValues?.activities);
        if (activitiesOrServicesValues) {
            let temp = [];
            // activitiesOrServicesValues?.activityServiceReports?.map((pie, index) => {
            //     temp[index] = { key: pie.activityStatus, value: pie.count }
            // })
            Object?.keys(activitiesOrServicesValues?.activityServiceReports)?.map((data, index) => {
                temp[index] = { key: data, value: Object?.values(activitiesOrServicesValues?.activityServiceReports)?.[index] }
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
        // setIsLoading(false);
        showActivitiesOrServicesReport();
    }

    // const getAddOnServices = async () => {
    //     if (!isMyReport) {
    //         const { data: chartDataValues } = await GET(`timesheet-management-service/report/addOnActivityServiceReport?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
    //         setAddOnServicesValues(chartDataValues);
    //     } else {
    //         const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/addOnActivityServiceReport?id=${myReportId}`);
    //         setAddOnServicesValues(chartDataValues);
    //     }
    // }

    useEffect(() => {
        if (reportType === "careProvidersSummary") {
            setIsLoading(false)
        }
    }, [reportType])


    const setAddOnServices = () => {
        setAddOnAcceptedReportLog(addOnServicesValues?.approvedActivities);
        setAddOnRejectedReportLog(addOnServicesValues?.rejectedActivities);
        if (addOnServicesValues) {
            let temp = [];
            // addOnServicesValues?.addOnActivityServiceReports?.map((pie, index) => {
            //     temp[index] = { key: pie.addOnActivityRequestStatus, value: pie.count }
            // })
            if (addOnServicesValues?.addOnActivityServiceReports !== null) {
                Object?.keys(addOnServicesValues?.addOnActivityServiceReports)?.map((data, index) => {
                    temp[index] = { key: data, value: Object?.values(addOnServicesValues?.addOnActivityServiceReports)?.[index] }
                })
                setPieData(temp);
            }
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
                    'data': addOnServicesValues?.addOnActivityStatusByCategorys?.map(data => data?.rejected),
                    'name': 'Rejected'
                },
                {
                    'data': addOnServicesValues?.addOnActivityStatusByCategorys?.map(data => data?.onhold),
                    'name': 'On Hold'
                }])
                setCategories(addOnServicesValues?.addOnActivityStatusByCategorys?.map(data => data?.activity));
            } else {
                setSeries([]);
                setCategories([]);
            }

            let stackedTemp = [];
            let keysForChart = [];
            addOnServicesValues?.approvedAddOnActivitiesByCategoryAndMonth?.map((stack, index) => {
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
                    'data': stackedTemp?.map(stackedData => stackedData?.[data]),
                    'name': data
                })
                setStackedSeries(tempStackedSeries);
            })
            // setStackedData(stackedTemp);
            setStackedCategories(stackedTemp?.map(stackedData => stackedData?.name));
        }
        // setIsLoading(false);
    }

    const getAddOnServicesWithParameter = async () => {
        if (!isMyReport) {
            if (dataToUseInReport?.from !== undefined && dataToUseInReport?.to !== undefined && dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.selectedContractedServiceProvider !== undefined && dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined) {
                setIsLoading(true)
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/addOnActivityServiceReport?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
                setAddOnServicesValues(chartDataValues);
            }
        } else {
            setIsLoading(true)
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/addOnActivityServiceReport?id=${myReportId}`);
            setAddOnServicesValues(chartDataValues);
        }
        setIsLoading(false)
    }

    const getAcvityAndServicesWithParameter = async () => {
        if (!isMyReport) {
            if (dataToUseInReport?.from !== undefined && dataToUseInReport?.to !== undefined && dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.selectedContractedServiceProvider !== undefined && dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined) {
                setIsLoading(true)
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/activityServiceReport?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts || []}&users=${dataToUseInReport?.selectedContractedServiceProvider || []}&sites=${dataToUseInReport?.selectedSites || []}&departments=${dataToUseInReport?.selectedDepartments || []}`);
                setActivitiesOrServicesValues(chartDataValues);
            }
        } else {
            setIsLoading(true)
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/activityServiceReport?id=${myReportId}`);
            setActivitiesOrServicesValues(chartDataValues);
        }
        setIsLoading(false)
    }

    const getCompensationCostAnalysis = async () => {
        setIsLoading(true)
        const { data: chartData } = await GET(`timesheet-management-service/timesheet/compensationCostAnalysis?contractId=${dataToUseInReport?.selectedContracts}`);
        setCompensationCostAnalysis(chartData);
        setIsLoading(false);
    }

    const getPayments = async () => {
        let chartData;
        if (!isMyReport && !isScheduledReport) {
            if (dataToUseInReport?.from !== undefined && dataToUseInReport?.to !== undefined && dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.selectedContractedServiceProvider !== undefined && dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined) {
                setIsLoading(true)
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/paymentProcessingSummary?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts || []}&users=${dataToUseInReport?.selectedContractedServiceProvider || []}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
                chartData = chartDataValues;
            }
        } else if (isMyReport && !isScheduledReport) {
            setIsLoading(true)
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/paymentProcessingSummary?id=${myReportId}`);
            chartData = chartDataValues;
        } else {
            setIsLoading(true)
            const { data: chartDataValues } = await GET(`timesheet-management-service/report/scheduledReport/${scheduleId}`);
            chartData = chartDataValues;
            setScheduledTime(chartDataValues?.[0]?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(chartDataValues?.[0]?.filter));
        }
        setIsLoading(false)
        setPaymentsReportLog(chartData);
        if ((chartData?.paymentStats?.avgPayment !== 0 ||
            chartData?.paymentStats?.count !== 0 ||
            chartData?.paymentStats?.maxPayment !== 0 ||
            chartData?.paymentStats?.medianPayment !== 0 ||
            chartData?.paymentStats?.minPayment !== 0) && chartData !== undefined) {
            let temp = [];
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
    }

    const getTimesheetProcessingSummary = async (filter) => {
        if (filter === 'withoutParameter') {
            let chartData;
            if (!isMyReport) {
                if (dataToUseInReport?.from !== undefined && dataToUseInReport?.to !== undefined && dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.selectedContractedServiceProvider !== undefined && dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined) {
                    setIsLoading(true)
                    const { data: chartDataValues } = await GET(`timesheet-management-service/report/timesheetProcessingSummary?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
                    chartData = chartDataValues;
                }
            } else {
                setIsLoading(true)
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/timesheetProcessingSummary?id=${myReportId}`);
                chartData = chartDataValues;
            }
            setTimesheetProcessingSummaryData(chartData);
        } else {
            let chartData;
            if (!isMyReport) {
                if (dataToUseInReport?.from !== undefined && dataToUseInReport?.to !== undefined && dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.selectedContractedServiceProvider !== undefined && dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined) {
                    setIsLoading(true)
                    const { data: chartDataValues } = await GET(`timesheet-management-service/report/timesheetProcessingSummary?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
                    chartData = chartDataValues;
                }
            } else {
                setIsLoading(true)
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
                    'name': data,
                    'color': data === 'completed' ? '#1DD174' : data === 'pending' ? '#F46044' : '#FFD950'
                })
                setStackedSeries(tempStackedSeries);
            })
            setStackedCategories(Object.keys(timesheetProcessingSummaryData?.statusSummary));
            setTotalTimesheetRejectedCount(timesheetProcessingSummaryData?.rejectedTimesheetCount);
            setTotalSubmittedTimesheets(timesheetProcessingSummaryData?.totalSubmittedTimesheets);
            setRejectedTimesheetCountBreakUp(timesheetProcessingSummaryData?.rejectedTimesheetCountBreakUp);
        }
        // setIsLoading(false);
    }

    const getListingOfTimesheetNotPaid = async (filter) => {
        if (filter === 'withoutParameter') {
            let chartData;
            if (!isMyReport) {
                if (dataToUseInReport?.from !== undefined && dataToUseInReport?.to !== undefined && dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.selectedContractedServiceProvider !== undefined && dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined) {
                    setIsLoading(true)
                    const { data: chartDataValues } = await GET(`timesheet-management-service/report/notPaidTimesheets?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
                    chartData = chartDataValues;
                }
            } else {
                setIsLoading(true)
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/notPaidTimesheets?id=${myReportId}`);
                chartData = chartDataValues;
            }
            if (chartData) {
                setNotPaidTimesheetsData(chartData);
            }
        } else {
            let chartData;
            if (!isMyReport) {
                if (dataToUseInReport?.from !== undefined && dataToUseInReport?.to !== undefined && dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.selectedContractedServiceProvider !== undefined && dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined) {
                    setIsLoading(true)
                    const { data: chartDataValues } = await GET(`timesheet-management-service/report/notPaidTimesheets?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
                    chartData = chartDataValues;
                }
            } else {
                setIsLoading(true)
                const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/notPaidTimesheets?id=${myReportId}`);
                chartData = chartDataValues;
            }
            if (chartData) {
                setNotPaidTimesheetsData(chartData);
            }
        }
        setIsLoading(false);
    }

    // const getSubmittedTimesheetsPaymentStatus = async (filter) => {
    //     if (filter === 'withoutParameter') {
    //         let chartData;
    //         if (!isMyReport) {
    //             if (dataToUseInReport?.from !== undefined && dataToUseInReport?.to !== undefined && dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.selectedContractedServiceProvider !== undefined && dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined) {
    //                 setIsLoading(true)
    //                 const { data: chartDataValues } = await GET(`timesheet-management-service/report/staffReappointmentTracker?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
    //                 chartData = chartDataValues;
    //             }
    //         } else {
    //             setIsLoading(true)
    //             const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/staffReappointmentTracker?id=${myReportId}`);
    //             chartData = chartDataValues;
    //         }
    //         if (chartData) {
    //             setSubmittedTimesheetsPaymentStatusData(chartData);
    //         }
    //     } else {
    //         let chartData;
    //         if (!isMyReport) {
    //             if (dataToUseInReport?.from !== undefined && dataToUseInReport?.to !== undefined && dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.selectedContractedServiceProvider !== undefined && dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined) {
    //                 setIsLoading(true)
    //                 const { data: chartDataValues } = await GET(`timesheet-management-service/report/staffReappointmentTracker?startDate=${dataToUseInReport?.from}&endDate=${dataToUseInReport?.to}&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
    //                 chartData = chartDataValues;
    //             }
    //         } else {
    //             setIsLoading(true)
    //             const { data: chartDataValues } = await GET(`timesheet-management-service/report/myReport/staffReappointmentTracker?id=${myReportId}`);
    //             chartData = chartDataValues;
    //         }
    //         if (chartData) {
    //             setSubmittedTimesheetsPaymentStatusData(chartData);
    //         }
    //     }
    //     setIsLoading(false);
    // }

    const getLocumStaffRenewalStatusTracker = async () => {
        try {
            setIsLoading(true);

            const isValidArray = (val) => Array.isArray(val) && val.length > 0 && val.some(item => item && item.trim() !== "");
            const departmentParam = isValidArray(dataToUseInReport?.selectedDepartments)
                ? `&departmentId=${dataToUseInReport?.selectedDepartments}`
                : "";

            const applicantParam = isValidArray(dataToUseInReport?.selectedStaffType)
                ? `&applicantTypeId=${dataToUseInReport?.selectedStaffType}`
                : "";

            const privilegeParam = isValidArray(dataToUseInReport?.selectedPrivilegeCategory)
                ? `&privilegingCategoryId=${dataToUseInReport?.selectedPrivilegeCategory}`
                : "";
            const response = await GET(
                `application-management-service/staff/reappointmentStatusDetails?positionType=LOCUM&limit=9999${applicantParam}${departmentParam}${privilegeParam}`
            );
            setLocumStaffRenewalTrackerData(response?.data?.applications || []);
            console.log("Locumtracker", response?.data?.applications);

        } catch (error) {
            console.error("Error fetching Locum Renewal status:", error);
            setLocumStaffRenewalTrackerData([]);
        } finally {
            setIsLoading(false);
        }
    }

    const getUsersData = async () => {
        const { data: user } = await GET('user-management-service/user');
        if (user) {
            setUsers(user);
        }
    }

    const getContractTrackValues = async () => {
        if (!isMyReport) {
            if (dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.selectedContractedServiceProvider !== undefined && dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined) {
                setIsLoading(true)
                const { data: data } = await GET(`timesheet-management-service/report/trackServices?sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}&contracts=${dataToUseInReport?.selectedContracts}&users=${dataToUseInReport?.selectedContractedServiceProvider}`);
                if (data) {
                    setActivityTrackServices(data);
                }
            }
        } else {
            setIsLoading(true)
            const { data: data } = await GET(`timesheet-management-service/report/myReport/trackServices?id=${myReportId}`);
            if (data) {
                setActivityTrackServices(data);
            }
        }
        setIsLoading(false)
        if (isWaiting) {
            console.log('waiting calling again')
            setIsWaiting(false);
            getContractTrackValues();
        }
    }

    const getPaymentTrackValues = async () => {
        if (!isMyReport) {
            if (dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.selectedContractedServiceProvider !== undefined && dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined && dataToUseInReport?.selectedTimesheetInterval !== undefined) {
                setIsLoading(true)
                if (dataToUseInReport?.selectedTimesheetInterval !== '') {
                    const { data: data } = await GET(`timesheet-management-service/report/trackPayments?interval=${dataToUseInReport?.selectedTimesheetInterval}&userIds=${[dataToUseInReport?.selectedContractedServiceProvider]}`);
                    setPaymentTrackValues(data);
                }
            }
        } else {
            setIsLoading(true)
            const { data: data } = await GET(`timesheet-management-service/report/myReport/trackPayments?id=${myReportId}`);
            setPaymentTrackValues(data);
        }
        setIsLoading(false)
    }

    const getSubmittedApplications = async (signal) => {
        // if (!isMyReport) {
        const queryParams = new URLSearchParams({
        });

        if (dataToUseInReport?.selectedStaffType) {
            queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
        }

        if (dataToUseInReport?.selectedPrivilegeCategory) {
            queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
        }

        if (dataToUseInReport?.selectedDepartments) {
            queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
        }

        // if (dataToUseInReport?.selectedApplicationType) {
        //     queryParams.append('applicationcreationType', dataToUseInReport?.selectedApplicationType);
        // }

        if (dataToUseInReport?.from) {
            queryParams.append('startDate', dataToUseInReport?.from);
        }

        if (dataToUseInReport?.to) {
            queryParams.append('endDate', dataToUseInReport?.to);
        }
        setIsLoading(true)
        const { data: data } = await GET(`application-management-service/report/submittedApplications?${queryParams.toString()}&positionType=PERMANENT&applicationCurrentLevel=${workModeType}`, { signal });
        setSubmittedApplicationValues(data);
        // } else {
        //     setIsLoading(true)
        //     const { data: data } = await GET(`application-management-service/report/myReport/submittedApplications?id=${myReportId}`);
        //     setSubmittedApplicationValues(data);
        // }
        setIsLoading(false)
    }

    const getOHIPBillingNumbersByCareProvider = async (signal) => {
        // if (!isMyReport) {
        const queryParams = new URLSearchParams({
        });

        if (dataToUseInReport?.selectedStaffType) {
            queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
        }

        if (dataToUseInReport?.selectedPrivilegeCategory) {
            queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
        }

        if (dataToUseInReport?.selectedDepartments) {
            queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
        }


        // if (dataToUseInReport?.from) {
        //     queryParams.append('startDate', dataToUseInReport?.from);
        // }

        // if (dataToUseInReport?.to) {
        //     queryParams.append('endDate', dataToUseInReport?.to);
        // }
        setIsLoading(true)
        const { data: data } = await GET(`application-management-service/report/ohipBillingNumberByCareProvider?${queryParams.toString()}`, { signal });
        setOhipBillingNumbersByCareProviderValues(data);
        // } else {
        //     setIsLoading(true)
        //     const { data: data } = await GET(`application-management-service/report/myReport/ohipBillingNumberByCareProvider?id=${myReportId}`);
        //     setOhipBillingNumbersByCareProviderValues(data);
        // }
        setIsLoading(false)
    }

    const getReappointmentApplicationNotYetStarted = async (signal) => {
        let chartData = []
        // if (!isMyReport) {
        const queryParams = new URLSearchParams({
        });

        if (dataToUseInReport?.selectedStaffType) {
            queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
        }

        if (dataToUseInReport?.selectedPrivilegeCategory) {
            queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
        }

        if (dataToUseInReport?.selectedDepartments) {
            queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
        }


        // if (dataToUseInReport?.from) {
        //     queryParams.append('startDate', dataToUseInReport?.from);
        // }

        // if (dataToUseInReport?.to) {
        //     queryParams.append('endDate', dataToUseInReport?.to);
        // }
        setIsLoading(true)
        const { data: data } = await GET(`application-management-service/report/staff/reappointmentNotStarted?${queryParams.toString()}`, { signal });
        setReappointmentNotStartedValues(data);
        chartData = data?.staffByApplicantType
        // } else {
        //     setIsLoading(true)
        //     const { data: data } = await GET(`application-management-service/report/staff/myReport/reappointmentNotStarted?id=${myReportId}`);
        //     setReappointmentNotStartedValues(data);
        //     chartData = data?.staffByApplicantType
        // }
        if (chartData?.paymentContracts?.length !== 0 && chartData !== undefined) {
            setBarChartSeries([{
                'data': chartData?.map(data => data?.fullPrivileges + data?.temporaryPrivileges),
                'name': 'Application Not Started'
            }])
            setBarChartCategories(chartData?.map(data => data?.applicantType));
        }
        setIsLoading(false)
    }

    const getCareProviderCareerMilestone = async (signal) => {
        let chartData = []
        // if (!isMyReport) {
        const queryParams = new URLSearchParams({
        });

        if (dataToUseInReport?.selectedStaffType) {
            queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
        }

        if (dataToUseInReport?.selectedPrivilegeCategory) {
            queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
        }

        if (dataToUseInReport?.selectedDepartments) {
            queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
        }

        if (dataToUseInReport?.from) {
            queryParams.append('startDate', dataToUseInReport?.from);
        }

        if (dataToUseInReport?.to) {
            queryParams.append('endDate', dataToUseInReport?.to);
        }
        setIsLoading(true)
        const { data: data } = await GET(`application-management-service/report/careProvidersMileStoneReport?${queryParams.toString()}`, { signal });
        setCareProviderCareerMilestoneValues(data);
        chartData = data?.staffCountByMilestone
        // } else {
        //     setIsLoading(true)
        //     const { data: data } = await GET(`application-management-service/report/myReport/careProvidersMileStoneReport?id=${myReportId}`);
        //     setCareProviderCareerMilestoneValues(data);
        //     chartData = data?.staffCountByMilestone
        // }
        if (chartData?.paymentContracts?.length !== 0 && chartData !== undefined) {
            setBarChartSeries([{
                'data': chartData?.map(data => data?.staffCount),
                'name': 'Doctors'
            }])
            setBarChartCategories(chartData?.map(data => data?.years));
        }
        setIsLoading(false)
    }

    const getPrivilegedStaffSummary = async (signal) => {
        // if (!isMyReport) {
        const queryParams = new URLSearchParams({
        });

        if (dataToUseInReport?.selectedStaffType) {
            queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
        }

        if (dataToUseInReport?.selectedPrivilegeCategory) {
            queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
        }

        if (dataToUseInReport?.selectedDepartments) {
            queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
        }


        // if (dataToUseInReport?.from) {
        //     queryParams.append('startDate', dataToUseInReport?.from);
        // }

        // if (dataToUseInReport?.to) {
        //     queryParams.append('endDate', dataToUseInReport?.to);
        // }
        setIsLoading(true)
        const { data: data } = await GET(`application-management-service/report/privilegedStaffs?${queryParams.toString()}`, { signal });
        setPrivilegedStaffSummaryValues(data);
        // } else {
        //     setIsLoading(true)
        //     const { data: data } = await GET(`application-management-service/report/myReport/privilegedStaffs?id=${myReportId}`);
        //     setPrivilegedStaffSummaryValues(data);
        // }
        setIsLoading(false)
    }

    const getStaffReappointmentStatusSummary = async (signal) => {
        // if (!isMyReport) {
        const queryParams = new URLSearchParams({
        });

        if (dataToUseInReport?.selectedStaffType) {
            queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
        }

        if (dataToUseInReport?.selectedPrivilegeCategory) {
            queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
        }

        if (dataToUseInReport?.selectedDepartments) {
            queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
        }


        // if (dataToUseInReport?.from) {
        //     queryParams.append('startDate', dataToUseInReport?.from);
        // }

        // if (dataToUseInReport?.to) {
        //     queryParams.append('endDate', dataToUseInReport?.to);
        // }
        setIsLoading(true)
        const { data: data } = await GET(`application-management-service/report/staffReappointmentStatusDetails?${queryParams.toString()}`, { signal });
        setStaffReappointmentStatusSummaryValues(data);
        // } else {
        //     setIsLoading(true)
        //     const { data: data } = await GET(`application-management-service/report/myReport/staffReappointmentStatusDetails?id=${myReportId}`);
        //     setStaffReappointmentStatusSummaryValues(data);
        // }
        setIsLoading(false)
    }


    const getStaffReappointmentStatusTracker = async () => {
        try {
            setIsLoading(true);

            const isValidArray = (val) => Array.isArray(val) && val.length > 0 && val.some(item => item && item.trim() !== "");
            const departmentParam = isValidArray(dataToUseInReport?.selectedDepartments)
                ? `&departmentId=${dataToUseInReport?.selectedDepartments}`
                : "";

            const applicantParam = isValidArray(dataToUseInReport?.selectedStaffType)
                ? `&applicantTypeId=${dataToUseInReport?.selectedStaffType}`
                : "";

            const privilegeParam = isValidArray(dataToUseInReport?.selectedPrivilegeCategory)
                ? `&privilegingCategoryId=${dataToUseInReport?.selectedPrivilegeCategory}`
                : "";
            const response = await GET(
                `application-management-service/staff/reappointmentStatusDetails?positionType=PERMANENT&limit=9999${applicantParam}${departmentParam}${privilegeParam}`
            );
            setStaffReappointmentTrackerData(response?.data?.applications || []);
            console.log("tracker", response?.data?.applications);

        } catch (error) {
            console.error("Error fetching staff reappointment status:", error);
            setStaffReappointmentTrackerData([]);
        } finally {
            setIsLoading(false);
        }
    }

    console.log("staff", dataToUseInReport?.selectedStaffType, dataToUseInReport?.selectedDepartments, dataToUseInReport?.selectedPrivilegeCategory, dataToUseInReport?.selectedPosition);



    // useEffect(() => {
    //     getStaffReappointmentStatusTracker();
    // }, [dataToUseInReport?.selectedStaffType,dataToUseInReport?.selectedDepartments,dataToUseInReport?.selectedPrivilegeCategory])

    const getCurrentApplicationNotesSummary = async (signal) => {
        // if (!isMyReport) {
        const queryParams = new URLSearchParams({
        });

        if (dataToUseInReport?.selectedStaffType) {
            queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
        }

        if (dataToUseInReport?.selectedPrivilegeCategory) {
            queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
        }

        if (dataToUseInReport?.selectedDepartments) {
            queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
        }

        if (dataToUseInReport?.selectedApplicationType) {
            queryParams.append('applicationcreationType', dataToUseInReport?.selectedApplicationType);
        }

        // if (dataToUseInReport?.from) {
        //     queryParams.append('startDate', dataToUseInReport?.from);
        // }

        // if (dataToUseInReport?.to) {
        //     queryParams.append('endDate', dataToUseInReport?.to);
        // }
        setIsLoading(true)
        const { data: data } = await GET(`application-management-service/report/staffCurrentApplicationNotesSummary?${queryParams.toString()}`, { signal });
        setStaffApplicationNotesSummaryValues(data);
        // } else {
        //     setIsLoading(true)
        //     const { data: data } = await GET(`application-management-service/report/myReport/staffCurrentApplicationNotesSummary?id=${myReportId}`);
        //     setStaffApplicationNotesSummaryValues(data);
        // }
        setIsLoading(false)
    }

    const getCurrentMedicalDirective = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('siteDepartmentSpecialties', dataToUseInReport?.selectedDepartments?.map(
                    (deptId) => `${siteId}#${deptId}`
                ));
            }
            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }
            const { data: data } = await GET(`medical-directive-service/report/currentMedicalDirectives?${queryParams.toString()}`, { signal });
            setCurrentMedicalDirectives(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`medical-directive-service/report/myReport/currentMedicalDirectives?id=${myReportId}`, { signal });
            setCurrentMedicalDirectives(data);
        } else {
            const { data: data } = await GET(`medical-directive-service/report/scheduledReports/${scheduleId}`, { signal });
            setUpcomingForReview(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getRetiredMedicalDirective = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('siteDepartmentSpecialties', dataToUseInReport?.selectedDepartments?.map(
                    (deptId) => `${siteId}#${deptId}`
                ));
            }
            if (dataToUseInReport?.selectedAuthors) {
                queryParams.append('authorIds', dataToUseInReport?.selectedAuthors);
            }
            if (dataToUseInReport?.selectedGroups) {
                queryParams.append('groupIds', dataToUseInReport?.selectedGroups);
            }
            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }
            const { data: data } = await GET(`medical-directive-service/report/retiredMedicalDirectives?${queryParams.toString()}`, { signal });
            setRetiredMedicalDirectives(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`medical-directive-service/report/myReport/retiredMedicalDirectives?id=${myReportId}`, { signal });
            setRetiredMedicalDirectives(data);
        } else {
            const { data: data } = await GET(`medical-directive-service/report/scheduledReports/${scheduleId}`, { signal });
            setUpcomingForReview(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getCurrentPolicyAndProcedure = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('siteDepartmentSpecialties', dataToUseInReport?.selectedDepartments?.map(
                    (deptId) => `${siteId}#${deptId}`
                ));
            }
            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }
            const { data: data } = await GET(`policy-and-procedure-management-service/report/currentPolicyAndProcedures?${queryParams.toString()}`, { signal });
            setCurrentPolicyAndProcedures(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/myReport/currentPolicyAndProcedures?id=${myReportId}`, { signal });
            setCurrentPolicyAndProcedures(data);
        } else {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setCurrentPolicyAndProcedures(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getRetiredPolicyAndProcedure = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('siteDepartmentSpecialties', dataToUseInReport?.selectedDepartments?.map(
                    (deptId) => `${siteId}#${deptId}`
                ));
            }
            if (dataToUseInReport?.selectedAuthors) {
                queryParams.append('authorIds', dataToUseInReport?.selectedAuthors);
            }
            if (dataToUseInReport?.selectedGroups) {
                queryParams.append('groupIds', dataToUseInReport?.selectedGroups);
            }
            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }
            const { data: data } = await GET(`policy-and-procedure-management-service/report/retiredPolicyAndProcedures?${queryParams.toString()}`, { signal });
            setRetiredPolicyAndProcedures(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/myReport/retiredPolicyAndProcedures?id=${myReportId}`, { signal });
            setRetiredPolicyAndProcedures(data);
        } else {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setRetiredPolicyAndProcedures(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getMedicalDirectivesWorkflow = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('siteDepartmentSpecialties', dataToUseInReport?.selectedDepartments?.map(
                    (deptId) => `${siteId}#${deptId}`
                ));
            }
            if (dataToUseInReport?.selectedAuthors) {
                queryParams.append('authorIds', dataToUseInReport?.selectedAuthors);
            }
            if (dataToUseInReport?.selectedGroups) {
                queryParams.append('groupIds', dataToUseInReport?.selectedGroups);
            }
            if (dataToUseInReport?.selectedWorkflowLevel) {
                queryParams.append('currentLevel', dataToUseInReport?.selectedWorkflowLevel !== "All" ? dataToUseInReport?.selectedWorkflowLevel : '');
            }
            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }
            const { data: data } = await GET(`medical-directive-service/report/workflow?${queryParams.toString()}`, { signal });
            setMedicalDirectivesWorkflow(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`medical-directive-service/report/myReport/workflow?id=${myReportId}`, { signal });
            setMedicalDirectivesWorkflow(data);
        } else {
            const { data: data } = await GET(`medical-directive-service/report/scheduledReports/${scheduleId}`, { signal });
            setUpcomingForReview(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getUpcomingForReview = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('siteDepartmentSpecialties', dataToUseInReport?.selectedDepartments?.map(
                    (deptId) => `${siteId}#${deptId}`
                ));
            }
            if (dataToUseInReport?.selectedAuthors) {
                queryParams.append('authorIds', dataToUseInReport?.selectedAuthors);
            }
            if (dataToUseInReport?.selectedGroups) {
                queryParams.append('groupIds', dataToUseInReport?.selectedGroups);
            }
            if (dataToUseInReport?.noOfDays) {
                queryParams.append('noOfDays', dataToUseInReport?.noOfDays);
            }
            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }
            const { data: data } = await GET(`medical-directive-service/report/upcomingForReview?${queryParams.toString()}`, { signal });
            setUpcomingForReview(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`medical-directive-service/report/myReport/upcomingForReview?id=${myReportId}`, { signal });
            setUpcomingForReview(data);
        } else {
            const { data: data } = await GET(`medical-directive-service/report/scheduledReports/${scheduleId}`, { signal });
            setUpcomingForReview(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getExpiredDocumentsSummaryForStaff = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });

            if (dataToUseInReport?.selectedStaffType) {
                queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
            }

            if (dataToUseInReport?.selectedPrivilegeCategory) {
                queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
            }

            if (dataToUseInReport?.from) {
                queryParams.append('startDate', dataToUseInReport?.from);
            }

            if (dataToUseInReport?.to) {
                queryParams.append('endDate', dataToUseInReport?.to);
            }

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
            }

            if (dataToUseInReport?.selectedPosition) {
                queryParams.append('positionType', dataToUseInReport?.selectedPosition);
            }

            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }

            const { data: data } = await GET(`application-management-service/report/staffExpiredDocuments?${queryParams.toString()}`, { signal });
            setExpiredDocumentsSummaryForStaff(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`application-management-service/report/myReport/staffExpiredDocuments?id=${myReportId}`, { signal });
            setExpiredDocumentsSummaryForStaff(data);
        } else {
            const { data: data } = await GET(`application-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setExpiredDocumentsSummaryForStaff(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getDocumentsExpirationSummaryForStaff = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });

            if (dataToUseInReport?.selectedPosition) {
                queryParams.append('positionType', dataToUseInReport?.selectedPosition);
            }

            if (dataToUseInReport?.noOfDays) {
                queryParams.append('noOfDays', dataToUseInReport?.noOfDays);
            }

            if (dataToUseInReport?.selectedStaffType) {
                queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
            }

            if (dataToUseInReport?.selectedPrivilegeCategory) {
                queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
            }

            if (dataToUseInReport?.from) {
                queryParams.append('startDate', dataToUseInReport?.from);
            }

            if (dataToUseInReport?.to) {
                queryParams.append('endDate', dataToUseInReport?.to);
            }

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
            }

            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }

            const { data: data } = await GET(`application-management-service/report/staffDocumentsExpiration?${queryParams.toString()}`, { signal });
            setStaffDocumentsExpiration(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`application-management-service/report/myReport/staffDocumentsExpiration?id=${myReportId}`, { signal });
            setStaffDocumentsExpiration(data);
        } else {
            const { data: data } = await GET(`application-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setStaffDocumentsExpiration(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getInactiveStaffSummary = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });

            if (dataToUseInReport?.selectedPosition) {
                queryParams.append('positionType', dataToUseInReport?.selectedPosition);
            }

            if (dataToUseInReport?.selectedStaffType) {
                queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
            }

            if (dataToUseInReport?.selectedPrivilegeCategory) {
                queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
            }

            if (dataToUseInReport?.from) {
                queryParams.append('startDate', dataToUseInReport?.from);
            }

            if (dataToUseInReport?.to) {
                queryParams.append('endDate', dataToUseInReport?.to);
            }

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
            }

            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }

            const { data: data } = await GET(`application-management-service/report/inactiveStaffs?${queryParams.toString()}`, { signal });
            setInactiveStaffSummary(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`application-management-service/report/myReport/inactiveStaffs?id=${myReportId}`, { signal });
            setInactiveStaffSummary(data);
        } else {
            const { data: data } = await GET(`application-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setInactiveStaffSummary(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getNewStaffAppointmentsSummary = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });
            if (dataToUseInReport?.selectedStaffType) {
                queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
            }

            if (dataToUseInReport?.from) {
                queryParams.append('startDate', dataToUseInReport?.from);
            }

            if (dataToUseInReport?.selectedPrivilegeCategory) {
                queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
            }

            if (dataToUseInReport?.to) {
                queryParams.append('endDate', dataToUseInReport?.to);
            }

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
            }
            if (dataToUseInReport?.selectedPosition) {
                queryParams.append('positionType', dataToUseInReport?.selectedPosition);
            }

            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }

            const { data: data } = await GET(`application-management-service/report/newStaffAppointments?${queryParams.toString()}`, { signal });
            setNewStaffAppointmentsSummary(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`application-management-service/report/myReport/newStaffAppointments?id=${myReportId}`, { signal });
            setNewStaffAppointmentsSummary(data);
        } else {
            const { data: data } = await GET(`application-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setNewStaffAppointmentsSummary(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getAppointmentHistorySummary = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });
            if (dataToUseInReport?.selectedStaffType) {
                queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
            }

            if (dataToUseInReport?.selectedPrivilegeCategory) {
                queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
            }

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
            }
            if (dataToUseInReport?.selectedPosition) {
                queryParams.append('positionType', dataToUseInReport?.selectedPosition);
            }

            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }

            const { data: data } = await GET(`application-management-service/report/appointmentHistory?${queryParams.toString()}`, { signal });
            setAppointmentHistorySummary(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`application-management-service/report/myReport/appointmentHistory?id=${myReportId}`, { signal });
            setAppointmentHistorySummary(data);
        } else {
            const { data: data } = await GET(`application-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setAppointmentHistorySummary(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getInactiveStaffSummaryByMonth = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });
            if (dataToUseInReport?.from) {
                queryParams.append('startDate', dataToUseInReport?.from);
            }

            if (dataToUseInReport?.to) {
                queryParams.append('endDate', dataToUseInReport?.to);
            }

            if (dataToUseInReport?.selectedStaffType) {
                queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
            }

            if (dataToUseInReport?.selectedPrivilegeCategory) {
                queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
            }

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
            }

            if (dataToUseInReport?.selectedPosition) {
                queryParams.append('positionType', dataToUseInReport?.selectedPosition);
            }

            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }

            const { data: data } = await GET(`application-management-service/report/inactiveStaffsByMonth?${queryParams.toString()}`, { signal });
            setInactiveStaffSummaryByMonth(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`application-management-service/report/myReport/inactiveStaffsByMonth?id=${myReportId}`, { signal });
            setInactiveStaffSummaryByMonth(data);
        } else {
            const { data: data } = await GET(`application-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setInactiveStaffSummaryByMonth(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getStaffUploadedDocumentsSummary = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });
            if (dataToUseInReport?.from) {
                queryParams.append('startDate', dataToUseInReport?.from);
            }

            if (dataToUseInReport?.to) {
                queryParams.append('endDate', dataToUseInReport?.to);
            }

            if (dataToUseInReport?.selectedStaffType) {
                queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
            }

            if (dataToUseInReport?.selectedPrivilegeCategory) {
                queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
            }

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
            }

            if (dataToUseInReport?.selectedPosition) {
                queryParams.append('positionType', dataToUseInReport?.selectedPosition);
            }

            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }

            const { data: data } = await GET(`application-management-service/report/staffUploadedDocuments?${queryParams.toString()}`, { signal });
            setStaffUploadedDocumentsSummary(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`application-management-service/report/myReport/staffUploadedDocuments?id=${myReportId}`, { signal });
            setStaffUploadedDocumentsSummary(data);
        } else {
            const { data: data } = await GET(`application-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setStaffUploadedDocumentsSummary(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getLocumTermExpirationSummary = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });
            if (dataToUseInReport?.from) {
                queryParams.append('startDate', dataToUseInReport?.from);
            }

            if (dataToUseInReport?.to) {
                queryParams.append('endDate', dataToUseInReport?.to);
            }

            if (dataToUseInReport?.selectedStaffType) {
                queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
            }

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
            }

            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }

            const { data: data } = await GET(`application-management-service/report/locumTermExpiration?${queryParams.toString()}`, { signal });
            setLocumTermExpirationSummary(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`application-management-service/report/myReport/locumTermExpiration?id=${myReportId}`, { signal });
            setLocumTermExpirationSummary(data);
        } else {
            const { data: data } = await GET(`application-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setLocumTermExpirationSummary(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getMedicalDirectivesTracker = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const { data: data } = await GET(`medical-directive-service/report/tracker?tab=${dataToUseInReport?.tab}&searchText=${dataToUseInReport?.search}`, { signal });
            setMedicalDirectivesTracker(dataToUseInReport?.tab === "medical_directive_tab" ?
                data?.medicalDirectivesWithAttestationLogsList :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.users :
                    data?.attestationCountBySite?.[0]?.attestationCountByDepartment);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`medical-directive-service/report/myReport/tracker?id=${myReportId}`, { signal });
            setMedicalDirectivesTracker(dataToUseInReport?.tab === "medical_directive_tab" ?
                data?.medicalDirectivesWithAttestationLogsList :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.users :
                    data?.attestationCountBySite?.[0]?.attestationCountByDepartment);
        } else {
            const { data: data } = await GET(`medical-directive-service/report/scheduledReports/${scheduleId}`, { signal });
            setMedicalDirectivesTracker(dataToUseInReport?.tab === "medical_directive_tab" ?
                data?.reportJson?.medicalDirectivesWithAttestationLogsList :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.reportJson?.users :
                    data?.reportJson?.attestationCountBySite?.[0]?.attestationCountByDepartment);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
            console.log(data, 'reportFilter')
        }
        setIsLoading(false)
    }

    const getAttestationOutstanding = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const { data: data } = await GET(`medical-directive-service/report/attestationOutstanding?siteIds?=${siteId}&searchText=${dataToUseInReport?.search}`, { signal });
            setAttestationOutstanding(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`medical-directive-service/report/myReport/attestationOutstanding?id=${myReportId}`, { signal });
            setAttestationOutstanding(data);
        } else {
            const { data: data } = await GET(`medical-directive-service/report/scheduledReports/${scheduleId}`, { signal });
            setAttestationOutstanding(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getPolicyAndProceduresWorkflow = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('siteDepartmentSpecialties', dataToUseInReport?.selectedDepartments?.map(
                    (deptId) => `${siteId}#${deptId}`
                ));
            }
            if (dataToUseInReport?.selectedAuthors) {
                queryParams.append('authorIds', dataToUseInReport?.selectedAuthors);
            }
            if (dataToUseInReport?.selectedGroups) {
                queryParams.append('groupIds', dataToUseInReport?.selectedGroups);
            }
            if (dataToUseInReport?.selectedWorkflowLevel) {
                queryParams.append('currentLevel', dataToUseInReport?.selectedWorkflowLevel !== "All" ? dataToUseInReport?.selectedWorkflowLevel : '');
            }
            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }
            const { data: data } = await GET(`policy-and-procedure-management-service/report/workflow?${queryParams.toString()}`, { signal });
            setPolicyAndProceduresWorkflow(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/myReport/workflow?id=${myReportId}`, { signal });
            setPolicyAndProceduresWorkflow(data);
        } else {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setPolicyAndProceduresWorkflow(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getPolicyAndProceduresUpcomingForReview = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const queryParams = new URLSearchParams({
            });

            if (dataToUseInReport?.selectedDepartments) {
                queryParams.append('siteDepartmentSpecialties', dataToUseInReport?.selectedDepartments?.map(
                    (deptId) => `${siteId}#${deptId}`
                ));
            }
            if (dataToUseInReport?.selectedAuthors) {
                queryParams.append('authorIds', dataToUseInReport?.selectedAuthors);
            }
            if (dataToUseInReport?.selectedGroups) {
                queryParams.append('groupIds', dataToUseInReport?.selectedGroups);
            }
            if (dataToUseInReport?.noOfDays) {
                queryParams.append('noOfDays', dataToUseInReport?.noOfDays);
            }
            if (dataToUseInReport?.search) {
                queryParams.append('searchText', dataToUseInReport?.search);
            }
            const { data: data } = await GET(`policy-and-procedure-management-service/report/upcomingForReview?${queryParams.toString()}`, { signal });
            setPolicyAndProceduresUpcomingForReview(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/myReport/upcomingForReview?id=${myReportId}`, { signal });
            setPolicyAndProceduresUpcomingForReview(data);
        } else {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setPolicyAndProceduresUpcomingForReview(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getPolicyAndProceduresTracker = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/tracker?tab=${dataToUseInReport?.tab}&searchText=${dataToUseInReport?.search}`, { signal });
            setPolicyAndProceduresTracker(dataToUseInReport?.tab === "policy_and_procedure_tab" ?
                data?.policyAndProceduresWithAttestationLogsList :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.users :
                    data?.attestationCountBySite?.[0]?.attestationCountByDepartment);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/myReport/tracker?id=${myReportId}`, { signal });
            setPolicyAndProceduresTracker(data);
        } else {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setPolicyAndProceduresTracker(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getPolicyAndProceduresAttestationOutstanding = async (signal) => {
        setIsLoading(true)
        if (!isMyReport && !isScheduledReport) {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/attestationOutstanding?siteIds?=${siteId}&searchText=${dataToUseInReport?.search}`, { signal });
            setPolicyAndProceduresAttestationOutstanding(data);
        } else if (!isScheduledReport && isMyReport) {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/myReport/attestationOutstanding?id=${myReportId}`, { signal });
            setPolicyAndProceduresAttestationOutstanding(data);
        } else {
            const { data: data } = await GET(`policy-and-procedure-management-service/report/scheduledReports/${scheduleId}`, { signal });
            setPolicyAndProceduresAttestationOutstanding(data?.reportJson);
            setScheduledTime(data?.createdDate);
            sessionStorage.setItem("reportFilter", JSON.stringify(data?.filter));
        }
        setIsLoading(false)
    }

    const getStaffByTypes = async () => {
        try {
            setIsLoading(true);

            const isValidArray = (val) =>
                Array.isArray(val) && val.length > 0 && val.some(item => item && item.trim() !== "");

            const departmentParam = isValidArray(dataToUseInReport?.selectedDepartments)
                ? `&departmentSpecialties=${dataToUseInReport?.selectedDepartments}`
                : "";

            const applicantParam = isValidArray(dataToUseInReport?.selectedStaffType)
                ? `&applicantTypeId=${dataToUseInReport?.selectedStaffType}`
                : "";

            const privilegeParam = isValidArray(dataToUseInReport?.selectedPrivilegeCategory)
                ? `&privilegingCategoryId=${dataToUseInReport?.selectedPrivilegeCategory}`
                : "";

            // For string type (not array)
            const applicationStatusParam = dataToUseInReport?.selectedApplicationSentStatus === "All"
                ? "&applicationStatus=CREATED"
                : `&reappointmentStatus=${dataToUseInReport.selectedApplicationSentStatus}`

            const response = await GET(
                `application-management-service/staff?status=ACTIVE&positionType=PERMANENT&sendForReappointment=false&limit=9999&offset=0&isPaginationRequired=false&sortBy=DESCENDING&sortByField=REAPPOINTMENT_STATUS${applicantParam}${privilegeParam}${departmentParam}${applicationStatusParam}`
            );

            setStaffValues(response?.data?.staffs || []);
        } catch (error) {
            console.error("Error fetching staff by types:", error);
            setStaffValues([]);
        } finally {
            setIsLoading(false);
        }
    };


    const getLocumStaffByTypes = async () => {
        try {
            setIsLoading(true);

            const isValidArray = (val) =>
                Array.isArray(val) && val.length > 0 && val.some(item => item && item.trim() !== "");

            const departmentParam = isValidArray(dataToUseInReport?.selectedDepartments)
                ? `&departmentSpecialties=${dataToUseInReport?.selectedDepartments}`
                : "";

            const applicantParam = isValidArray(dataToUseInReport?.selectedStaffType)
                ? `&applicantTypeId=${dataToUseInReport?.selectedStaffType}`
                : "";

            const privilegeParam = isValidArray(dataToUseInReport?.selectedPrivilegeCategory)
                ? `&privilegingCategoryId=${dataToUseInReport?.selectedPrivilegeCategory}`
                : "";

            // applicationSentStatus is a string, not array
            const applicationStatusParam = dataToUseInReport?.selectedApplicationSentStatus === "All"
                ? "&applicationStatus=CREATED"
                : `&reappointmentStatus=${dataToUseInReport.selectedApplicationSentStatus}`

            const response = await GET(
                `application-management-service/staff?status=ACTIVE&positionType=LOCUM&sendForReappointment=false&limit=9999&offset=0&isPaginationRequired=false&sortBy=DESCENDING&sortByField=REAPPOINTMENT_STATUS${applicantParam}${privilegeParam}${departmentParam}${applicationStatusParam}`
            );

            setLocumStaffValues(response?.data?.staffs || []);
        } catch (error) {
            console.error("Error fetching locum staff by types:", error);
            setLocumStaffValues([]);
        } finally {
            setIsLoading(false);
        }
    };


    const getLocumRenewalOrExtensionApplication = async (signal) => {
        // if (!isMyReport) {
        const queryParams = new URLSearchParams({
        });

        if (dataToUseInReport?.selectedStaffType) {
            queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
        }

        if (dataToUseInReport?.selectedPrivilegeCategory) {
            queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
        }

        if (dataToUseInReport?.selectedDepartments) {
            queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
        }

        // if (dataToUseInReport?.from) {
        //     queryParams.append('startDate', dataToUseInReport?.from);
        // }

        // if (dataToUseInReport?.to) {
        //     queryParams.append('endDate', dataToUseInReport?.to);
        // }
        setIsLoading(true)
        const { data: data } = await GET(`application-management-service/report/locumRenewalOrExtensionApplications?${queryParams.toString()}&applicationCurrentLevel=${workModeType}`, { signal });
        setLocumRenewalOrExtensionApplicationValues(data);
        // } else {
        //     setIsLoading(true)
        //     const { data: data } = await GET(`application-management-service/report/myReport/locumRenewalOrExtensionApplications?id=${myReportId}`);
        //     setLocumRenewalOrExtensionApplicationValues(data);
        // }
        setIsLoading(false)
    }

    const getDeclinedOrNotRenewedStaffSummary = async (signal) => {
        // if (!isMyReport) {
        const queryParams = new URLSearchParams({
        });

        if (dataToUseInReport?.selectedStaffType) {
            queryParams.append('applicantTypeId', dataToUseInReport?.selectedStaffType);
        }

        if (dataToUseInReport?.selectedPrivilegeCategory) {
            queryParams.append('privilegingCategoryId', dataToUseInReport?.selectedPrivilegeCategory);
        }

        if (dataToUseInReport?.selectedDepartments) {
            queryParams.append('departmentSpecialties', dataToUseInReport?.selectedDepartments);
        }

        if (dataToUseInReport?.selectedReappointmentStatus) {
            queryParams.append('staffReappointmentStatus', dataToUseInReport?.selectedReappointmentStatus);
        }

        // if (dataToUseInReport?.from) {
        //     queryParams.append('startDate', dataToUseInReport?.from);
        // }

        // if (dataToUseInReport?.to) {
        //     queryParams.append('endDate', dataToUseInReport?.to);
        // }
        setIsLoading(true)
        const { data: data } = await GET(`application-management-service/report/declinedOrNotRenewedStaffs?${queryParams.toString()}`, { signal });
        setDeclinedOrNotRenewedStaffSummaryValues(data);
        // } else {
        //     setIsLoading(true)
        //     const { data: data } = await GET(`application-management-service/report/myReport/declinedOrNotRenewedStaffs?id=${myReportId}`);
        //     setDeclinedOrNotRenewedStaffSummaryValues(data);
        // }
        setIsLoading(false)
    }

    console.log(activityTrackServices, isLoading, isWaiting)

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
        if (dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined && dataToUseInReport?.renewalreportingTimePeriod !== undefined && dataToUseInReport?.contractContinuationPolicy !== undefined) {
            if (!isMyReport) {
                setIsLoading(true)
                const { data: contractRenewalReport } = await GET(`contract-managment-service/reports/contractRenewalReport?sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}&contracts=${dataToUseInReport?.selectedContracts}&renewalDays=${dataToUseInReport?.renewalreportingTimePeriod}&contractPolicyType=${dataToUseInReport?.contractContinuationPolicy !== 'ALL' ? dataToUseInReport?.contractContinuationPolicy : ''}`);
                if (contractRenewalReport) {
                    setContractRenewalReport(contractRenewalReport);
                }
            } else {
                setIsLoading(true)
                const { data: contractRenewalReport } = await GET(`contract-managment-service/reports/myReport/contractRenewalReport?id=${myReportId}`);
                setContractRenewalReport(contractRenewalReport);
            }
        }
        setIsLoading(false);
    }

    const getOneTimeContract = async () => {
        const { data: staffReappointments } = await GET(`contract-managment-service/reports/staffReappointmentsReport`);
        if (staffReappointments) {
            setOneTimeContract(staffReappointments);
        }
        setIsLoading(false);
    }

    const getOneTimeContractWithParameters = async () => {
        if (dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined) {
            if (!isMyReport) {
                setIsLoading(true)
                const { data: staffReappointments } = await GET(`contract-managment-service/reports/staffReappointmentsReport?sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}&contracts=${dataToUseInReport?.selectedContracts}`);
                if (staffReappointments) {
                    setOneTimeContract(staffReappointments);
                }
            } else {
                setIsLoading(true)
                const { data: staffReappointments } = await GET(`contract-managment-service/reports/myReport/staffReappointmentsReport?id=${myReportId}`);
                setOneTimeContract(staffReappointments);
            }
        }
        setIsLoading(false);
    }

    const getNonCompliantContractReport = async () => {
        if (dataToUseInReport?.selectedSites !== undefined && dataToUseInReport?.selectedDepartments !== undefined && dataToUseInReport?.selectedContracts !== undefined && dataToUseInReport?.contractStatus !== undefined) {
            setIsLoading(true)
            const { data: nonCompliantContract } = await GET(`contract-managment-service/reports/nonCompliantContractReport?podType=${encodeURIComponent(selectedPodTypeFromTile)}&contractStatus=${dataToUseInReport?.contractStatus}&contractNames=${dataToUseInReport?.selectedContracts}&sites=${dataToUseInReport?.selectedSites}&departments=${dataToUseInReport?.selectedDepartments}`);
            if (nonCompliantContract) {
                setNonCompliantContract(nonCompliantContract);
            }
            setIsLoading(false);
        }
    }

    const headerValuesStatus = [
        "No.",
        "Staff",
        "Staff Type",
        "Department / Specialty",
        "Current Application Status",
        "Last Updated",
        "Last Updated By",
    ];
    const colSortValues = [false, false, false, false, false, false, false, false];

    const getTableValues = () => {
        const No = [];
        const staff = [];
        const staffType = [];
        const department = [];
        const title = [];
        const status = [];
        const lastUpdated = [];
        const lastUpdatedBy = [];

        tableData?.map((data, index) => {
            No.push(index + 1 + ".")
            staff.push(
                `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );

            // ohipNo.push(`${data?.displayId}` || "123");
            staffType.push(`${data?.basicDetailReferences?.applicantType?.serviceProviderType}`);
            // department.push(`${data?.basicDetailReferences?.department?.name}`);
            department.push(
                `${data?.basicDetails?.departmentSpecialty?.department || "-"}${data?.basicDetails?.departmentSpecialty?.specialty ? ` / ${data.basicDetails.departmentSpecialty.specialty}` : ""}`
            );
            title.push(data?.basicDetails?.applicant?.category)
            if (Array.isArray(data?.completedWorkflows) && data?.completedWorkflows?.length > 0) {
                let lastApproval = data?.completedWorkflows
                    .filter(item => item.approvalType !== null)
                    .pop();

                if (lastApproval) {
                    const formattedApprovalType = lastApproval.approvalType.toLowerCase().replace(/_/g, " ");
                    status.push(`${lastApproval.role}, ${formattedApprovalType}`)
                } else {
                    status.push("MSO Verification Not Started")
                }
            } else {
                if (data?.status === "DECLINED") {
                    status.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Declined`);
                } else {
                    if (data?.formFillingStatus === "IN_PROGRESS") {
                        status.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application In-Progress`);
                    } else if (data?.formFillingStatus === "PENDING") {
                        status.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Started`);
                    } else {
                        status.push(`MSO Verification Not Started`);
                    }
                }
            }
            lastUpdatedBy.push(
                <>
                    {data?.updatedBy?.name?.firstName}
                </>
            );

            lastUpdated.push(
                <>
                    {format(new Date(data?.lastModifiedDate), dateFormat)}
                </>
            );
        });

        return [
            { type: "text", value: No },
            { type: "text", value: staff },
            { type: "text", value: staffType },
            { type: "text", value: department },
            // { type: "text", value: title },
            { type: "text", value: status },
            {
                type: "text",
                value: lastUpdatedBy
            },
            {
                type: "text",
                value: lastUpdated
            },
        ];
    };

    const headerValuesOHIP = [
        "No.",
        "Staff Name",
        "CPSO License",
        "OHIP Number",
        "Privilege Type",
        "Department",
        "Speciality / Service Area"
    ];
    const colSortValuesOHIP = [false, false, false, false, false, false, false];

    const getOHIPTableValues = () => {
        const No = [];
        const staffName = [];
        const cpsoLicense = [];
        const department = [];
        const ohip = [];
        const specialtyServiceArea = [];
        const privilegeType = [];

        ohipBillingNumbersByCareProviderValues?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );

            ohip.push(data?.applicant?.ohipNumber);
            cpsoLicense.push(data?.applicant?.licenseNumber);
            department.push(
                `${data?.basicDetailReferences?.department?.name || "-"}`
            );
            specialtyServiceArea.push(data?.basicDetailReferences?.specialty?.name ? `${data?.basicDetailReferences?.specialty?.name}` : "")
            privilegeType.push(data?.basicDetailReferences?.credentialingAndPrivilegingCategory?.name)

        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "text", value: cpsoLicense },
            { type: "text", value: ohip },
            { type: "text", value: privilegeType },
            { type: "text", value: department },
            { type: "text", value: specialtyServiceArea },
        ];
    };

    const headerValuesMilestone = [
        "No.",
        "Staff Name",
        "Staff Type",
        "Category",
        "Department",
        "Division",
        "Career Start Date",
        "Milestone Date"
    ];
    const colSortValuesMilestone = [false, false, false, false, false, false, false, false];

    const getMilestoneTableValues = (data, years) => {
        const No = [];
        const staffName = [];
        const staffType = [];
        const department = [];
        const category = [];
        const specialtyServiceArea = [];
        const careerStartDate = [];
        const milestoneDate = [];

        data?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );

            staffType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType);
            category.push(data?.basicDetailReferences?.credentialingAndPrivilegingCategory?.name);
            department.push(
                `${data?.basicDetailReferences?.department?.name || "-"}`
            );
            specialtyServiceArea.push(data?.basicDetailReferences?.specialty?.name ? `${data?.basicDetailReferences?.specialty?.name}` : "")
            careerStartDate.push(data?.initialApprovalDate ? format(new Date(data?.initialApprovalDate), dateFormat) : '-')
            milestoneDate.push(data?.initialApprovalDate ? format(addYears(new Date(data?.initialApprovalDate), years), dateFormat) : '-')
        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "text", value: staffType },
            { type: "text", value: category },
            { type: "text", value: department },
            { type: "text", value: specialtyServiceArea },
            { type: "text", value: careerStartDate },
            { type: "text", value: milestoneDate },
        ];
    };

    const headerValuesNotStarted = [
        "No.",
        "Staff Name",
        "CPSO License",
        "OHIP Number",
        "Total",
        "Full Privileges",
        "Temporary Privileges",
    ];
    const colSortValuesNotStarted = [false, false, false, false, false, false, false];

    const getNotStartedTableValues = (data) => {
        const No = [];
        const staffName = [];
        const cpso = [];
        const ohip = [];
        const total = [];
        const fullPrivileges = [];
        const tempPrivileges = [];

        data?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );

            cpso.push(data?.applicant?.licenseNumber);
            ohip.push(data?.applicant?.ohipNumber);
            total.push(`-`);
            fullPrivileges.push("-")
            tempPrivileges.push('-')
        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "text", value: cpso },
            { type: "text", value: ohip },
            { type: "text", value: total },
            { type: "text", value: fullPrivileges },
            { type: "text", value: tempPrivileges },
        ];
    };

    const headerValuesPrivilegedStaffs = [
        "No.",
        "Staff Name",
        "CPSO License",
        "OHIP Number",
        "Privilege Type",
        "Department",
        "Start Date"
    ];
    const colSortValuesPrivilegedStaffs = [false, false, false, false, false, false, false];

    const getPrivilegedStaffsTableValues = () => {
        const No = [];
        const staffName = [];
        const cpsoLicense = [];
        const department = [];
        const ohip = [];
        const startDate = [];
        const privilegeType = [];

        privilegedStaffSummaryValues?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );

            ohip.push(data?.applicant?.ohipNumber);
            cpsoLicense.push(data?.applicant?.licenseNumber);
            department.push(
                `${data?.basicDetailReferences?.department?.name || "-"} ${data?.basicDetailReferences?.specialty?.name ? ` / ${data?.basicDetailReferences?.specialty?.name}` : ""}`
            );
            startDate.push(data?.initialApprovalDate ? format(new Date(data?.initialApprovalDate), dateFormat) : "")
            privilegeType.push(data?.basicDetailReferences?.credentialingAndPrivilegingCategory?.name)

        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "text", value: cpsoLicense },
            { type: "text", value: ohip },
            { type: "text", value: privilegeType },
            { type: "text", value: department },
            { type: "text", value: startDate },
        ];
    };

    const headerValuesExpiredDocument = [
        "No.",
        "Staff Name",
        "Expired Documents with Dates",
        "Department / Specialty",
        "Staff Type",
        "Email",
    ];
    const colSortValuesExpiredDocument = [false, false, false, false, false, false, false];

    const getExpiredDocumentTableValues = () => {
        const No = [];
        const staffName = [];
        const documentType = [];
        const departmentSpecialty = [];
        const email = [];
        const staffType = [];

        expiredDocumentsSummaryForStaff?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.staff?.applicant?.name?.firstName, data?.staff?.applicant?.name?.lastName)}` || " "
            );

            documentType.push(
                <div className={style.textAlignLeft}>
                    {data?.expiredDocuments?.map(docData => `${docData?.shortName || ''} ${docData?.expiryDate ? `(${format(new Date(docData?.expiryDate), 'MMM dd, yyyy')})` : ''} `)?.map((data, index) => (
                        <div>{`${index + 1}. ${data}`} <br /></div>
                    ))}
                </div >
            );
            departmentSpecialty.push(`${data?.staff?.basicDetailReferences?.department?.name} ${data?.staff?.basicDetailReferences?.specialty?.name ? `- ${data?.staff?.basicDetailReferences?.specialty?.name}` : ''}`);
            email.push(
                `${data?.staff?.applicant?.email?.officialEmail || "-"}`
            );
            staffType.push(data?.staff?.basicDetailReferences?.applicantType?.serviceProviderType)
        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "icon", icon: documentType },
            { type: "text", value: departmentSpecialty },
            { type: "text", value: staffType },
            { type: "text", value: email },
        ];
    };

    const headerValuesDocumentExpiration = [
        "No.",
        "Staff Name",
        "Expiring Documents with Dates",
        "Department / Specialty",
        "Staff Type",
        "Email",
    ];
    const colSortValuesDocumentExpiration = [false, false, false, false, false, false, false];

    const getDocumentExpirationTableValues = () => {
        const No = [];
        const staffName = [];
        const documentType = [];
        const departmentSpecialty = [];
        const email = [];
        const staffType = [];

        staffDocumentsExpiration?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.staff?.applicant?.name?.firstName, data?.staff?.applicant?.name?.lastName)}` || " "
            );
            documentType.push(
                <div className={style.textAlignLeft}>
                    {data?.documentsExpiringSoon?.map(docData => `${docData?.shortName || ''} ${docData?.expiryDate ? `(${format(new Date(docData?.expiryDate), 'MMM dd, yyyy')})` : ''} `)?.map((data, index) => (
                        <div>{`${index + 1}. ${data}`} <br /></div>
                    ))}
                </div >
            );
            departmentSpecialty.push(`${data?.staff?.basicDetailReferences?.department?.name} ${data?.staff?.basicDetailReferences?.specialty?.name ? `- ${data?.staff?.basicDetailReferences?.specialty?.name}` : ''}`);
            email.push(
                `${data?.staff?.applicant?.email?.officialEmail || "-"}`
            );
            staffType.push(data?.staff?.basicDetailReferences?.applicantType?.serviceProviderType)
        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "text", value: documentType },
            { type: "text", value: departmentSpecialty },
            { type: "text", value: staffType },
            { type: "text", value: email },
        ];
    };

    const headerValuesInactiveStaff = [
        "No.",
        "Staff Name",
        "Department / Specialty",
        "Staff ID",
        "Staff Type",
        "Email",
    ];
    const colSortValuesInactiveStaff = [false, false, false, false, false, false, false];

    const getInactiveStaffTableValues = () => {
        const No = [];
        const staffName = [];
        const staffId = [];
        const departmentSpecialty = [];
        const email = [];
        const staffType = [];

        inactiveStaffSummary?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );

            staffId.push(data?.staffId);
            departmentSpecialty.push(`${data?.basicDetailReferences?.department?.name} ${data?.basicDetailReferences?.specialty?.name ? `- ${data?.basicDetailReferences?.specialty?.name}` : ''}`);
            email.push(
                `${data?.applicant?.email?.officialEmail || "-"}`
            );
            staffType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType)
        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "text", value: departmentSpecialty },
            { type: "text", value: staffId },
            { type: "text", value: staffType },
            { type: "text", value: email },
        ];
    };

    const headerValuesLocumTermExpiration = [
        "No.",
        "Staff Name",
        "Department / Specialty",
        "Last Locum Period End Date",
        "Status",
        "Extension End Date",
    ];
    const colSortValuesLocumTermExpiration = [false, false, false, false, false, false, false];

    const getLocumTermExpirationTableValues = (data) => {
        const No = [];
        const staffName = [];
        const endDate = [];
        const departmentSpecialty = [];
        const email = [];
        const status = [];
        const priorEndDate = [];

        data?.map((innerData, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(innerData?.applicant?.name?.firstName, innerData?.applicant?.name?.lastName)}` || " "
            );

            endDate.push(innerData?.tenure?.to ? format(new Date(innerData?.tenure?.to), 'MMM dd, yyyy') : '-');
            priorEndDate.push(innerData?.onGoingApplication?.cyclePeriod?.to ? format(new Date(innerData?.onGoingApplication?.cyclePeriod?.to), 'MMM dd, yyyy') : '-')
            departmentSpecialty.push(`${innerData?.basicDetailReferences?.department?.name} ${innerData?.basicDetailReferences?.specialty?.name ? `- ${innerData?.basicDetailReferences?.specialty?.name}` : ''}`);
            email.push(
                `${innerData?.applicant?.email?.officialEmail || "-"}`
            );
            status.push(`${innerData?.onGoingApplication?.status ? innerData?.onGoingApplication?.status === "CREATED" ? applicationSubStatus[innerData?.onGoingApplication?.subStatus] : applicationStatus[innerData?.onGoingApplication?.status] : 'Application Not Sent'}`)
        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName, tooltipValueText: email },
            { type: "text", value: departmentSpecialty },
            { type: "text", value: endDate },
            { type: "text", value: status },
            { type: "text", value: priorEndDate },
        ];
    };

    const headerValuesNewStaffReappointments = [
        "No.",
        "Staff Name",
        "Department / Specialty",
        "Staff ID",
        "Staff Type",
        "Email",
    ];
    const colSortValuesNewStaffReappointments = [false, false, false, false, false, false, false];

    const getNewStaffReappointmentsTableValues = (data) => {
        const No = [];
        const staffName = [];
        const staffId = [];
        const departmentSpecialty = [];
        const email = [];
        const staffType = [];

        data?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );

            staffId.push(data?.staffId);
            departmentSpecialty.push(`${data?.basicDetailReferences?.department?.name} ${data?.basicDetailReferences?.specialty?.name ? `- ${data?.basicDetailReferences?.specialty?.name}` : ''}`);
            email.push(
                `${data?.applicant?.email?.officialEmail || "-"}`
            );
            staffType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType)
        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "text", value: departmentSpecialty },
            { type: "text", value: staffId },
            { type: "text", value: staffType },
            { type: "text", value: email },
        ];
    };

    const headerValuesInactiveStaffSummaryByMonth = [
        "No.",
        "Staff Name",
        "Department / Specialty",
        "Staff ID",
        "Staff Type",
        "Email",
    ];
    const colSortValuesInactiveStaffSummaryByMonth = [false, false, false, false, false, false, false];

    const getInactiveStaffSummaryByMonthTableValues = (data) => {
        const No = [];
        const staffName = [];
        const staffId = [];
        const departmentSpecialty = [];
        const email = [];
        const staffType = [];

        data?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );

            staffId.push(data?.staffId);
            departmentSpecialty.push(`${data?.basicDetailReferences?.department?.name} ${data?.basicDetailReferences?.specialty?.name ? `- ${data?.basicDetailReferences?.specialty?.name}` : ''}`);
            email.push(
                `${data?.applicant?.email?.officialEmail || "-"}`
            );
            staffType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType)
        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "text", value: departmentSpecialty },
            { type: "text", value: staffId },
            { type: "text", value: staffType },
            { type: "text", value: email },
        ];
    };

    console.log(locumTermExpirationSummary?.map(data => data?.month ? format(new Date(data?.month), 'MMM yyyy') : ''), locumTermExpirationSummary?.map(data => data?.count), 'locumTermExpirationSummary')

    const headerValuesStaffsReappointmentStatusSummary = [
        "No.",
        "Staff Name",
        "Staff Type",
        "Department / Speciality",
        "Current Application Status",
        "Last Updated"
    ];
    const colSortValuesStaffsReappointmentStatusSummary = [false, false, false, false, false, false];

    const getStaffsReappointmentStatusSummaryTableValues = () => {
        const No = [];
        const staffName = [];
        const staffType = [];
        const department = [];
        const currentApplicationStatus = [];
        const lastUpdated = [];

        staffReappointmentStatusSummaryValues?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );
            staffType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType);
            department.push(
                `${data?.basicDetailReferences?.department?.name || "-"} ${data?.basicDetailReferences?.specialty?.name ? ` / ${data?.basicDetailReferences?.specialty?.name}` : ""}`
            );
            if (Array.isArray(data?.completedWorkflows) && data?.completedWorkflows?.length > 0) {
                let lastApproval = data?.completedWorkflows
                    .filter(item => item.approvalType !== null)
                    .pop();

                if (lastApproval) {
                    const formattedApprovalType = lastApproval?.approvalType.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
                    currentApplicationStatus.push(`${lastApproval?.role}, ${formattedApprovalType}`);
                } else {
                    if (data?.status === "DECLINED") {
                        currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Declined`);
                    } else if (data?.formFillingStatus === "COMPLETED" && data?.status === "CREATED") {
                        currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Submitted`);
                    } else if (data?.formFillingStatus === "IN_PROGRESS") {
                        currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application In-Progress`);
                    } else {
                        currentApplicationStatus.push("MSO Verification Not Started");
                    }
                }
            } else {
                if (data?.status === "DECLINED") {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Declined`);
                } else if (data?.formFillingStatus === "COMPLETED" && data?.status === "CREATED") {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Submitted`);
                } else if (data?.formFillingStatus === "IN_PROGRESS") {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application In-Progress`);
                } else {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Started`);
                }
            }
            lastUpdated.push(
                <div>
                    <div>{data?.updatedBy?.name?.firstName}</div>
                    <div>{data?.lastModifiedDate ? format(new Date(data?.lastModifiedDate), dateFormat) : ''}</div>
                </div>
            )

        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "text", value: staffType },
            { type: "text", value: department },
            { type: "text", value: currentApplicationStatus },
            { type: "text", value: lastUpdated },
        ];
    };


    const headerValuesStaffsReappointmentStatusTracker = [
        "No.",
        "Staff Name",
        "Staff Type",
        "Department / Speciality",
        "Current Application Status",
        "Last Updated"
    ];
    const colSortValuesStaffsReappointmentStatusTracker = [false, false, false, false, false, false];

    const getStaffsReappointmentStatusTrackerTableValues = () => {
        const No = [];
        const staffName = [];
        const staffType = [];
        const department = [];
        const currentApplicationStatus = [];
        const lastUpdated = [];

        staffReappointmentTrackerData?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );
            staffType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType);
            department.push(
                `${data?.basicDetailReferences?.department?.name || "-"} ${data?.basicDetailReferences?.specialty?.name ? ` / ${data?.basicDetailReferences?.specialty?.name}` : ""}`
            );
            if (Array.isArray(data?.completedWorkflows) && data?.completedWorkflows?.length > 0) {
                let lastApproval = data?.completedWorkflows
                    .filter(item => item.approvalType !== null)
                    .pop();

                if (lastApproval) {
                    const formattedApprovalType = lastApproval?.approvalType.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
                    currentApplicationStatus.push(`${lastApproval?.role}, ${formattedApprovalType}`);
                } else {
                    if (data?.status === "DECLINED") {
                        currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Declined`);
                    } else if (data?.formFillingStatus === "COMPLETED" && data?.status === "CREATED") {
                        currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Submitted`);
                    } else if (data?.formFillingStatus === "IN_PROGRESS") {
                        currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application In-Progress`);
                    } else {
                        currentApplicationStatus.push("MSO Verification Not Started");
                    }
                }
            } else {
                if (data?.status === "DECLINED") {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Declined`);
                } else if (data?.formFillingStatus === "COMPLETED" && data?.status === "CREATED") {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Submitted`);
                } else if (data?.formFillingStatus === "IN_PROGRESS") {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application In-Progress`);
                } else {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Started`);
                }
            }
            lastUpdated.push(
                <div>
                    <div>{data?.updatedBy?.name?.firstName}</div>
                    <div>{data?.lastModifiedDate ? format(new Date(data?.lastModifiedDate), 'MMM dd, yyyy') : ''}</div>
                </div>
            )

        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "text", value: staffType },
            { type: "text", value: department },
            { type: "text", value: currentApplicationStatus },
            { type: "text", value: lastUpdated },
        ];
    };


    const headerValuesLocumStaffsRenewalStatusTracker = [
        "No.",
        "Staff Name",
        "Staff Type",
        "Department / Speciality",
        "Current Application Status",
        "Last Updated"
    ];
    const colSortValuesLocumStaffsRenewalStatusTracker = [false, false, false, false, false, false];

    const getLocumStaffsRenewalStatusTrackerTableValues = () => {
        const No = [];
        const staffName = [];
        const staffType = [];
        const department = [];
        const currentApplicationStatus = [];
        const lastUpdated = [];

        locumStaffRenewalTrackerData?.map((data, index) => {
            No.push(index + 1 + ".")
            staffName.push(
                `${formatFirstNameLastName(data?.applicant?.name?.firstName, data?.applicant?.name?.lastName)}` || " "
            );
            staffType.push(data?.basicDetailReferences?.applicantType?.serviceProviderType);
            department.push(
                `${data?.basicDetailReferences?.department?.name || "-"} ${data?.basicDetailReferences?.specialty?.name ? ` / ${data?.basicDetailReferences?.specialty?.name}` : ""}`
            );
            if (Array.isArray(data?.completedWorkflows) && data?.completedWorkflows?.length > 0) {
                let lastApproval = data?.completedWorkflows
                    .filter(item => item.approvalType !== null)
                    .pop();

                if (lastApproval) {
                    const formattedApprovalType = lastApproval?.approvalType.replace(/_/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
                    currentApplicationStatus.push(`${lastApproval?.role}, ${formattedApprovalType}`);
                } else {
                    if (data?.status === "DECLINED") {
                        currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Declined`);
                    } else if (data?.formFillingStatus === "COMPLETED" && data?.status === "CREATED") {
                        currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Submitted`);
                    } else if (data?.formFillingStatus === "IN_PROGRESS") {
                        currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application In-Progress`);
                    } else {
                        currentApplicationStatus.push("MSO Verification Not Started");
                    }
                }
            } else {
                if (data?.status === "DECLINED") {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Declined`);
                } else if (data?.formFillingStatus === "COMPLETED" && data?.status === "CREATED") {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Submitted`);
                } else if (data?.formFillingStatus === "IN_PROGRESS") {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application In-Progress`);
                } else {
                    currentApplicationStatus.push(`${applicationType === "LOCUM" ? '' : 'Reappointment'} Application Not Started`);
                }
            }
            lastUpdated.push(
                <div>
                    <div>{data?.updatedBy?.name?.firstName}</div>
                    <div>{data?.lastModifiedDate ? format(new Date(data?.lastModifiedDate), 'MMM dd, yyyy') : ''}</div>
                </div>
            )

        });

        return [
            { type: "text", value: No },
            { type: "text", value: staffName },
            { type: "text", value: staffType },
            { type: "text", value: department },
            { type: "text", value: currentApplicationStatus },
            { type: "text", value: lastUpdated },
        ];
    };


    let activityPerformed = [];
    let startDateTime = [];
    let endDateTime = [];
    let contractProvider = [];
    let reasonNotDone = [];
    let siteName = [];

    const getActivitiesServicesValues = (value) => {
        activityPerformed = [];
        startDateTime = [];
        endDateTime = [];
        contractProvider = [];
        reasonNotDone = [];
        siteName = [];
        reportLog?.filter(data => data?.activityStatus === value)?.map(data => {
            activityPerformed.push(data?.activityPerformed?.activity);
            startDateTime.push(`${format(new Date(data?.activityTimeFrame?.stateDate), dateFormat)}, ${data?.activityTimeFrame?.startTime}`)
            endDateTime.push(`${format(new Date(data?.activityTimeFrame?.endDate), dateFormat)}, ${data?.activityTimeFrame?.endTme}`)
            contractProvider.push(data?.user?.name)
            reasonNotDone.push(data?.activityNotes?.notes);
            siteName.push(data?.site?.name)
        })

        return value === "DONE" ? [
            activityPerformed,
            startDateTime,
            endDateTime,
            contractProvider,
            siteName
        ] : value === "TODO" ? [
            activityPerformed,
            startDateTime,
            contractProvider,
            siteName
        ] : [
            activityPerformed,
            startDateTime,
            contractProvider,
            siteName,
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

        // if (value === "Rejected") {
        //     addOnRejectedReportLog !== [] && addOnRejectedReportLog?.map(data => {
        //         addonActivityServices.push(data?.activity?.activity?.activity);
        //         requestDateTime.push(`${format(new Date(data?.activity?.activityTimeFrame?.startDateTime), 'MM-dd-yyyy, HH:mm')}`)
        //         rejectedDateTime.push(`${data?.logs?.filter(filterData => filterData?.workFlowAction === "REJECTED") !== [] ? formatInTimeZone(new Date(data?.logs?.filter(filterData => filterData?.workFlowAction === "REJECTED")?.[0]?.createdDate), siteTimeZone(), 'MM-dd-yyyy, HH:mm') : '-'}`)
        //         requestingProvider.push(data?.activity?.user?.name)
        //         requestReviewer.push(data?.logs?.filter(filterData => filterData?.workFlowAction === "REJECTED") !== [] ? data?.logs?.filter(filterData => filterData?.workFlowAction === "REJECTED")?.[0]?.workFlowUser?.name?.name : '-');
        //         site.push(data?.activity?.site?.name)
        //     })
        // }
        // if (value === "Approved") {
        //     addOnAcceptedReportLog !== [] && addOnAcceptedReportLog?.map(data => {
        //         addonActivityServices.push(data?.activity?.activity?.activity);
        //         requestDateTime.push(`${format(new Date(data?.activity?.activityTimeFrame?.startDateTime), 'MM-dd-yyyy, HH:mm')}`)
        //         rejectedDateTime.push(`${data?.logs?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.length !== 0 ? formatInTimeZone(new Date(data?.logs?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.[0]?.createdDate), siteTimeZone(), 'MM-dd-yyyy, HH:mm') : '-'}`)
        //         requestingProvider.push(data?.activity?.user?.name)
        //         requestReviewer.push(data?.logs?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.length !== 0 ? data?.logs?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.[0]?.workFlowUser?.name?.name : '-');
        //         site.push(data?.activity?.site?.name)
        //     })
        // }

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
                period.push(`${format(new Date(data?.timesheet?.timesheetPeriod?.startDate) || new Date(), 'MMM dd')} - ${format(new Date(data?.timesheet?.timesheetPeriod?.endDate) || new Date(), dateFormat)}`)
                approvalDate.push(`${format(new Date(data?.activityLoggerList?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.[0]?.createdDate) || new Date(), `${dateFormat}, HH:mm`)}`)
                actionBy.push(data?.activityLoggerList?.filter(filterData => filterData?.workFlowAction === "APPROVED")?.[0]?.workFlowUser?.name?.name)
                serviceProvider.push(data?.timesheet?.user?.name);
            })
        }
        if (value === "Rejected") {
            timesheetProcessingSummaryData?.rejectedTimesheets?.map(data => {
                timesheet.push(data?.timesheet?.timesheetName);
                period.push(`${format(new Date(data?.timesheet?.timesheetPeriod?.startDate) || new Date(), 'MMM dd')} - ${format(new Date(data?.timesheet?.timesheetPeriod?.endDate) || new Date(), dateFormat)}`)
                approvalDate.push(`${format(new Date(data?.activityLoggerList?.filter(filterData => filterData?.workFlowAction === "REJECTED")?.[0]?.createdDate) || new Date(), `${dateFormat}, HH:mm`)}`)
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

    const getNotPaidTimesheetsValues = (data) => {
        timesheet = [];
        period = [];
        departmentAndSite = [];
        currentStatus = [];
        invoiceAmount = [];
        serviceProvider = [];

        data?.timesheets?.map(timesheetData => {
            timesheet.push(timesheetData?.timesheetName);
            period.push(`${format(new Date(timesheetData?.timesheetPeriod?.startDate) || new Date(), 'MMM dd')} - ${format(new Date(timesheetData?.timesheetPeriod?.endDate) || new Date(), dateFormat)}`)
            departmentAndSite.push(timesheetData?.siteDepartmentDetails !== null ? `${Object.values(Object.values(timesheetData?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(timesheetData?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}` : '-')
            currentStatus.push(availableTimesheetStatus[timesheetData?.timesheetStatus?.status]);
            invoiceAmount.push(`$${timesheetData?.policyBasedPayment}`);
            serviceProvider.push(timesheetData?.user?.name);
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

        staffReappointmentTrackerData?.timesheetPayment?.map(data => {
            timesheet.push(data?.timesheet?.timesheetName);
            period.push(`${format(new Date(data?.timesheet?.timesheetPeriod?.startDate || new Date()), 'MMM dd')
                } - ${format(new Date(data?.timesheet?.timesheetPeriod?.endDate || new Date()), 'MMM dd yyyy')
                }`);
            contractor.push(data?.timesheet?.user?.name)
            departmentAndSite.push(data?.timesheet?.siteDepartmentDetails !== null ? `${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}` : '-');
            billableHours.push(data?.timesheet?.billableHours);
            nonBillableHours.push(data?.timesheet?.nonBillableHours);
            submissionDate.push(format(new Date(data?.timesheet?.timesheetPeriod?.submissionDate || new Date()), 'd MMM yyyy'));
            currentStatus.push(availableTimesheetStatus[data?.timesheet?.timesheetStatus?.status]);
            statusDate.push(format(new Date(data?.timesheet?.lastModifiedDate || new Date()), 'd MMM yyyy'));
            paymentStatus.push(data?.payment !== null ? 'Paid' : '-');
            paymentAmount.push(`${data?.payment !== null ? `$${data?.payment?.actualPayment?.payment}` : '-'}`);
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
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')} ` : `${format(new Date(data?.timesheet?.timesheetPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.timesheet?.timesheetPeriod?.endDate), 'MMM d yyyy')} `)
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push(data?.timesheet?.siteDepartmentDetails !== null ? `${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}` : '-')
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment} ` : `$ ${data?.timesheet?.policyBasedPayment} `);
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment} ` : `$ ${data?.timesheet?.paid} `);
            })
        }
        if (value === 'timesheetNotPaid') {
            paymentsReportLog?.paymentNotDone?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')} ` : `${format(new Date(data?.timesheet?.timesheetPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.timesheet?.timesheetPeriod?.endDate), 'MMM d yyyy')} `)
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push(data?.timesheet?.siteDepartmentDetails !== null ? `${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}` : '-')
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment} ` : `$ ${data?.timesheet?.policyBasedPayment} `);
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment} ` : `$ ${data?.timesheet?.paid} `);
            })
        }
        if (value === 'rejectedTimesheetPayments') {
            paymentsReportLog?.rejected?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')} ` : `${format(new Date(data?.timesheet?.timesheetPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.timesheet?.timesheetPeriod?.endDate), 'MMM d yyyy')} `)
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push(data?.timesheet?.siteDepartmentDetails !== null ? `${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}` : '-')
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment} ` : `$ ${data?.timesheet?.policyBasedPayment} `);
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment} ` : `$ ${data?.timesheet?.paid} `);
            })
        }
        if (value === 'delayedTimesheetPayments') {
            paymentsReportLog?.paymentDelayed?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push(data?.timesheet?.siteDepartmentDetails !== null ? `${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}` : '-')
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')} ` : `${format(new Date(data?.timesheet?.timesheetPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.timesheet?.timesheetPeriod?.endDate), 'MMM d yyyy')} `)
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment} ` : `$ ${data?.timesheet?.policyBasedPayment} `);
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment} ` : `$ ${data?.timesheet?.paid} `);
            })
        }
        if (value === 'paymentPastDue') {
            paymentsReportLog?.paymentPastDue?.map(data => {
                timeSheet.push(data?.timesheet?.timesheetName);
                period.push(data?.payment !== null ? `${format(new Date(data?.payment?.paymentPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.payment?.paymentPeriod?.endDate), 'MMM d yyyy')} ` : `${format(new Date(data?.timesheet?.timesheetPeriod?.startDate), 'MMM d')} - ${format(new Date(data?.timesheet?.timesheetPeriod?.endDate), 'MMM d yyyy')} `)
                serviceProvider.push(data?.timesheet?.user?.name);
                deptAndSite.push(data?.timesheet?.siteDepartmentDetails !== null ? `${Object.values(Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.departmentMap)?.[0]?.name}, ${Object.values(data?.timesheet?.siteDepartmentDetails?.siteDepartmentDetailMap)?.[0]?.name}` : '-')
                invoiceAmount.push(data?.payment !== null ? `$ ${data?.payment?.expectedPayment?.payment} ` : `$ ${data?.timesheet?.policyBasedPayment} `);
                paidAmount.push(data?.payment !== null ? `$ ${data?.payment?.actualPayment?.payment} ` : `$ ${data?.timesheet?.paid} `);
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
            contractManagementExpirationDate.push(format(new Date(`${data?.contractDetail?.contractTerm?.endDate}T00:00`), 'MM-dd-yyyy'))
            contractManagementContractingEntity.push(!data?.contractorBusinessEntity?.businessEntity?.notApplicable ? data?.contractorBusinessEntity?.businessEntity?.name : '-');
            contractManagementPointOfContact.push(`${data?.contractorBusinessEntity?.businessEntityUser?.name?.firstName} ${data?.contractorBusinessEntity?.businessEntityUser?.name?.lastName} `);
            contractManagementPointOfContactNumber.push(data?.contractorBusinessEntity?.businessEntityUser?.contactNumber?.number);
            contractManagementEmail.push(data?.contractorBusinessEntity?.businessEntityUser?.email?.officialEmail);
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


    let documentName = [];
    let documentType = [];
    let documentDescription = [];
    let lastUploadedBy = [];
    let lastUpdatedDate = [];
    let fileURL = [];

    const getContractDocumentsOnFileValues = (value) => {
        documentName = [];
        documentType = [];
        documentDescription = [];
        lastUploadedBy = [];
        lastUpdatedDate = [];
        fileURL = [];

        value?.contractDetail?.contractFiles?.map(data => {
            documentName.push(data?.documentName);
            documentType.push(data?.documentType)
            documentDescription.push(data?.documentDescription)
            lastUploadedBy.push(data?.uploadedBy?.name?.name)
            lastUpdatedDate.push(data?.lastModifiedDate !== null ? format(new Date(data?.lastModifiedDate), 'MMM d, yyyy') : '-');
            fileURL.push(data?.fileURL);
        })

        return [
            documentName,
            documentType,
            documentDescription,
            lastUploadedBy,
            lastUpdatedDate
        ];
    }

    let serviceProviderName = [];
    let serviceProviderType = [];
    let cellPhone = [];
    let email = [];
    let city = [];
    let state = [];

    const getMultipleContractsListValues = (value) => {
        serviceProviderName = [];
        serviceProviderType = [];
        cellPhone = [];
        email = [];
        city = [];
        state = [];

        value?.users?.map(data => {
            serviceProviderName.push(data?.roles?.filter(data => data?.roleName === "Aggregator")?.length !== 0 ? `${data?.name?.firstName} ${data?.name?.lastName} - Lead Timesheet Aggregator` : `${data?.name?.firstName} ${data?.name?.lastName}`);
            serviceProviderType.push(data?.serviceProviderType?.contractedServiceProviderType)
            cellPhone.push(data?.communication?.mobileNumber)
            email.push(data?.email?.officialEmail)
            city.push(data?.address?.city);
            state.push(data?.address?.state);
        })

        return [
            serviceProviderName,
            serviceProviderType,
            cellPhone,
            email,
            city,
            state
        ];
    }

    let contractName = [];
    let contractType = [];
    let contractBusinessEntity = [];
    let address = [];
    let pointOfContact = [];

    const getContractsWithBusinessEntityValues = () => {
        contractName = [];
        contractType = [];
        contractBusinessEntity = [];
        address = [];
        pointOfContact = [];
        email = [];
        city = [];
        state = [];

        contractsWithBusinessEntityValues?.map(data => {
            contractName.push(data?.contractName?.contractName);
            contractType.push(data?.contractType)
            contractBusinessEntity.push(data?.contractorBusinessEntity?.businessEntity?.name);
            address.push(data?.contractorBusinessEntity?.mailingAddress?.addressLine)
            pointOfContact.push(`${data?.contractorBusinessEntity?.businessEntityUser?.name?.firstName} ${data?.contractorBusinessEntity?.businessEntityUser?.name?.lastName}`)
            email.push(data?.contractorBusinessEntity?.businessEntityUser?.email?.officialEmail)
            city.push(data?.contractorBusinessEntity?.mailingAddress?.city);
            state.push(data?.contractorBusinessEntity?.mailingAddress?.state);
        })

        return [
            contractName,
            contractType,
            contractBusinessEntity,
            address,
            city,
            state,
            pointOfContact,
            email
        ];
    }

    let zipcode = [];

    const getCurrentRemitToAddressForActiveContractsValues = () => {
        contractName = [];
        contractType = [];
        address = [];
        city = [];
        state = [];
        zipcode = [];
        lastUpdatedDate = [];

        currentRemitToAddressValues?.map(data => {
            contractName.push(data?.contractName?.contractName);
            contractType.push(data?.contractType)
            address.push(data?.contractorBusinessEntity?.remitAddress !== null ? data?.contractorBusinessEntity?.remitAddress?.addressLine : data?.contractorBusinessEntity?.mailingAddress?.addressLine)
            city.push(data?.contractorBusinessEntity?.remitAddress !== null ? data?.contractorBusinessEntity?.remitAddress?.city : data?.contractorBusinessEntity?.mailingAddress?.city);
            state.push(data?.contractorBusinessEntity?.remitAddress !== null ? data?.contractorBusinessEntity?.remitAddress?.state : data?.contractorBusinessEntity?.mailingAddress?.state);
            zipcode.push(data?.contractorBusinessEntity?.remitAddress !== null ? data?.contractorBusinessEntity?.remitAddress?.zipcode : data?.contractorBusinessEntity?.mailingAddress?.zipcode);
            lastUpdatedDate.push(data?.contractorBusinessEntity?.mailingAddress?.updatedOn !== undefined ? format(new Date(data?.contractorBusinessEntity?.remitAddress !== null ? data?.contractorBusinessEntity?.remitAddress?.updatedOn : data?.contractorBusinessEntity?.mailingAddress?.updatedOn), 'MMM dd, yyyy') : '-')
        })

        return [
            contractName,
            contractType,
            address,
            city,
            state,
            zipcode,
            lastUpdatedDate
        ];
    }

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
    const getTrackTableValue = (serviceValues, activityData) => {

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
        // serviceValues?.activityStatsByContract?.map((activityData, index) => {
        // if (activityData?.activityStatsMeta !== null) {
        let typesToFilter = ['array']
        let filteredServiceValues = activityData?.activityStatsMeta !== null ? Object.fromEntries(
            Object.entries(activityData?.activityStatsMeta).filter(([key, value]) => {
                const valueType = Array.isArray(value) ? 'array' : typeof value;
                return typesToFilter.includes(valueType);
            })
        ) : {}
        console.log(filteredServiceValues)
        Object.keys(filteredServiceValues)?.map(data => {
            if (filteredServiceValues?.[data]?.length !== 0) {
                service?.push({ type: 'parentChildService', name: data, values: filteredServiceValues?.[data]?.map(data => `${(`${data?.activityType} - ${data?.performingActivity}`.length > 51 && activityData?.contract?.compensationPolicy !== 'ACTIVITY_BASED') ? `${data?.activityType} - ${data?.performingActivity}`.slice(0, 48) + '...' : (`${data?.activityType} - ${data?.performingActivity}`.length > 70) ? `${data?.activityType} - ${data?.performingActivity}`.slice(0, 65) + '...' : `${data?.activityType} - ${data?.performingActivity}`} (${data?.timeBlock})`) })
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
        // }

        // })
        nteValues?.push({ type: 'nteAmount', values: activityData?.activityStatsMeta?.contractBalancePaymentSummary })


        return activityData?.contract?.compensationPolicy !== 'ACTIVITY_BASED' ?
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

    let title = [];
    let mdId = [];
    let deptSpecialty = [];
    let assignedTo = [];
    let acknowledged = [];
    let lastRevision = [];
    let publishedDate = [];
    let attestedCount = [];
    let notAttestedCount = [];
    let staffCount = [];
    let mdCount = [];
    let divisionList = [];

    const getMedicalDirectivesWorkflowValues = () => {
        title = [];
        mdId = [];
        deptSpecialty = [];
        assignedTo = [];
        acknowledged = [];

        medicalDirectivesWorkflow?.map(data => {
            const totalCompletedCount = (data?.groups || [])?.reduce(
                (sum, group) => sum + (group?.completedCount || 0),
                0
            );

            const totalPendingCount = (data?.groups || [])?.reduce(
                (sum, group) => sum + (group?.pendingCount || 0),
                0
            );
            title.push(data?.medicalDirective?.title);
            mdId.push(data?.medicalDirective?.mdID)
            deptSpecialty.push(data?.medicalDirective?.sites?.[0]?.departments?.length > 0
                ? data?.medicalDirective?.sites?.[0]?.departments
                    ?.map(dept =>
                        dept?.serviceAreas?.length > 0
                            ? dept.serviceAreas.map(sa => `${dept.name} - ${sa.name}`).join(", ")
                            : dept?.name
                    )
                    .join(", ")
                : "-")
            assignedTo.push(data?.groups?.map(group => group?.group?.name)?.join(', '))
            acknowledged.push(`${totalCompletedCount}/${totalPendingCount}`);
        })

        return [
            title,
            mdId,
            deptSpecialty,
            assignedTo,
            acknowledged
        ];
    }

    const getPolicyAndProceduresWorkflowValues = () => {
        title = [];
        mdId = [];
        deptSpecialty = [];
        assignedTo = [];
        acknowledged = [];

        policyAndProceduresWorkflow?.map(data => {
            const totalCompletedCount = (data?.groups || [])?.reduce(
                (sum, group) => sum + (group?.completedCount || 0),
                0
            );

            const totalPendingCount = (data?.groups || [])?.reduce(
                (sum, group) => sum + (group?.pendingCount || 0),
                0
            );
            title.push(data?.policyAndProcedure?.title);
            mdId.push(data?.policyAndProcedure?.pnpID)
            deptSpecialty.push(data?.policyAndProcedure?.sites?.[0]?.departments?.length > 0
                ? data?.policyAndProcedure?.sites?.[0]?.departments
                    ?.map(dept =>
                        dept?.serviceAreas?.length > 0
                            ? dept.serviceAreas.map(sa => `${dept.name} - ${sa.name}`).join(", ")
                            : dept?.name
                    )
                    .join(", ")
                : "-")
            assignedTo.push(data?.groups?.map(group => group?.group?.name)?.join(', '))
            acknowledged.push(`${totalCompletedCount}/${totalPendingCount}`);
        })

        return [
            title,
            mdId,
            deptSpecialty,
            assignedTo,
            acknowledged
        ];
    }

    const getMedicalDirectivesUpcomingForReview = () => {
        title = [];
        mdId = [];
        deptSpecialty = [];
        lastRevision = [];
        publishedDate = [];

        upcomingForReview?.map(data => {
            title.push(data?.title);
            mdId.push(data?.mdID)
            deptSpecialty.push(data?.sites?.[0]?.departments?.length > 0
                ? data?.sites?.[0]?.departments
                    ?.map(dept =>
                        dept?.serviceAreas?.length > 0
                            ? dept.serviceAreas.map(sa => `${dept.name} - ${sa.name}`).join(", ")
                            : dept?.name
                    )
                    .join(", ")
                : "-")
            lastRevision.push(data?.lastRevisionDate ? format(new Date(data?.lastRevisionDate), 'MMM dd, yyyy') : '-');
            publishedDate.push(data?.publishedDate ? format(new Date(data?.publishedDate), 'MMM dd, yyyy') : '-');
        })

        return [
            title,
            mdId,
            deptSpecialty,
            lastRevision,
            publishedDate
        ];
    }

    const getMedicalDirectivesTrackerValues = () => {
        title = [];
        mdId = [];
        deptSpecialty = [];
        attestedCount = [];
        notAttestedCount = [];
        staffCount = [];
        mdCount = [];
        divisionList = [];

        medicalDirectivesTracker?.map(data => {
            title.push(dataToUseInReport?.tab === "medical_directive_tab" ?
                data?.medicalDirectives?.title :
                dataToUseInReport?.tab === "applicant_tab" ?
                    `${data?.user?.name?.firstName} ${data?.user?.name?.lastName}` :
                    data?.department?.name
            );
            mdId.push(dataToUseInReport?.tab === "medical_directive_tab" ?
                data?.medicalDirectives?.mdID :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.user?.email?.officialEmail :
                    '-')
            if (dataToUseInReport?.tab === "department_tab") {
                divisionList.push(data?.department?.serviceAreas?.map(service => service?.name)?.join(', '))
                staffCount.push(data?.staffCount)
                mdCount.push(data?.medicalDirectiveCount)
            }
            deptSpecialty.push(dataToUseInReport?.tab === "medical_directive_tab" ?
                data?.medicalDirectives?.sites?.[0]?.departments?.length > 0
                    ? data?.medicalDirectives?.sites?.[0]?.departments
                        ?.map(dept =>
                            dept?.serviceAreas?.length > 0
                                ? dept.serviceAreas.map(sa => `${dept.name} - ${sa.name}`).join(", ")
                                : dept?.name
                        )
                        .join(", ")
                    : "-" :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.user?.sites?.sites?.[0]?.departmentList?.departments?.length > 0
                        ? data?.user?.sites?.sites?.[0]?.departmentList?.departments
                            ?.map(dept =>
                                dept?.serviceAreas?.length > 0
                                    ? dept.serviceAreas.map(sa => `${dept?.departmentName?.name} - ${sa.name}`).join(", ")
                                    : dept?.departmentName?.name
                            )
                            .join(", ")
                        : "-" :
                    "-")
            attestedCount.push(dataToUseInReport?.tab === "medical_directive_tab" ?
                data?.attestedCount :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.medicalDirectiveAttestation?.attestedCount :
                    data?.attestedCount
            );
            notAttestedCount.push(dataToUseInReport?.tab === "medical_directive_tab" ?
                data?.notAttestedCount :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.medicalDirectiveAttestation?.notAttestedCount :
                    data?.notAttestedCount
            );
        })

        return dataToUseInReport?.tab === "department_tab" ? [
            title,
            divisionList,
            staffCount,
            mdCount,
            attestedCount,
            notAttestedCount
        ] : [
            title,
            mdId,
            deptSpecialty,
            attestedCount,
            notAttestedCount
        ];
    }

    const getPolicyAndProceduresTrackerValues = () => {
        title = [];
        mdId = [];
        deptSpecialty = [];
        attestedCount = [];
        notAttestedCount = [];
        staffCount = [];
        mdCount = [];
        divisionList = [];

        policyAndProceduresTracker?.map(data => {
            title.push(dataToUseInReport?.tab === "policy_and_procedure_tab" ?
                data?.policyAndProcedure?.title :
                dataToUseInReport?.tab === "applicant_tab" ?
                    `${data?.user?.name?.firstName} ${data?.user?.name?.lastName}` :
                    data?.department?.name
            );
            mdId.push(dataToUseInReport?.tab === "policy_and_procedure_tab" ?
                data?.policyAndProcedure?.pnpID :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.user?.email?.officialEmail :
                    '-')
            if (dataToUseInReport?.tab === "department_tab") {
                divisionList.push(data?.department?.serviceAreas?.map(service => service?.name)?.join(', '))
                staffCount.push(data?.staffCount)
                mdCount.push(data?.policyAndProcedureCount)
            }
            deptSpecialty.push(dataToUseInReport?.tab === "policy_and_procedure_tab" ?
                data?.policyAndProcedure?.sites?.[0]?.departments?.length > 0
                    ? data?.policyAndProcedure?.sites?.[0]?.departments
                        ?.map(dept =>
                            dept?.serviceAreas?.length > 0
                                ? dept.serviceAreas.map(sa => `${dept.name} - ${sa.name}`).join(", ")
                                : dept?.name
                        )
                        .join(", ")
                    : "-" :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.user?.sites?.sites?.[0]?.departmentList?.departments?.length > 0
                        ? data?.user?.sites?.sites?.[0]?.departmentList?.departments
                            ?.map(dept =>
                                dept?.serviceAreas?.length > 0
                                    ? dept.serviceAreas.map(sa => `${dept?.departmentName?.name} - ${sa.name}`).join(", ")
                                    : dept?.departmentName?.name
                            )
                            .join(", ")
                        : "-" :
                    "-")
            attestedCount.push(dataToUseInReport?.tab === "policy_and_procedure_tab" ?
                data?.attestedCount :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.policyAndProcedureAttestation?.attestedCount :
                    data?.attestedCount
            );
            notAttestedCount.push(dataToUseInReport?.tab === "policy_and_procedure_tab" ?
                data?.notAttestedCount :
                dataToUseInReport?.tab === "applicant_tab" ?
                    data?.policyAndProcedureAttestation?.notAttestedCount :
                    data?.notAttestedCount
            );
        })

        return dataToUseInReport?.tab === "department_tab" ? [
            title,
            divisionList,
            staffCount,
            mdCount,
            attestedCount,
            notAttestedCount
        ] : [
            title,
            mdId,
            deptSpecialty,
            attestedCount,
            notAttestedCount
        ];
    }

    let interval = [];
    let approvalBy = [];
    let paymentApprovalDate = [];
    let paymentApprovalBy = [];
    let payment = [];
    let paymentTrackerTableValues = [];
    let timesheetName = [];
    let timesheetContractName = [];
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
        if (selectedPaymentTab === "Approval Pending") {
            paymentTrackerTableValues.push({
                interval: paymentTrackValues?.approvalPending?.map(data => data?.interval !== null ? `${format(new Date(data?.interval?.startDate), 'MMM dd, yyyy')} - ${format(new Date(data?.interval?.endDate), 'MMM dd, yyyy')}` : '-'),
                timesheetName: paymentTrackValues?.approvalPending?.map(data => data?.timesheetLabel !== null ? data?.timesheetLabel?.label : 'Timesheet Not Entered'),
                timesheetContractName: paymentTrackValues?.approvalPending?.map(data => data?.contractName?.contractName),
                approvalBy: paymentTrackValues?.approvalPending?.map(data => data?.approvedBy !== null ? data?.approvedBy?.name?.name : '-'),
                approvalDate: paymentTrackValues?.approvalPending?.map(data => data?.approvedDate !== null ? format(new Date(data?.approvedDate), 'MMM dd, yyyy') : '-'),
                order: ['timesheetContractName', 'timesheetName', 'interval', 'approvalDate', 'approvalBy']
            })
        } else if (selectedPaymentTab === "Payment Processed") {
            paymentTrackerTableValues.push({
                interval: paymentTrackValues?.paymentProcessed?.map(data => data?.interval !== null ? `${format(new Date(data?.interval?.startDate), 'MMM dd, yyyy')} - ${format(new Date(data?.interval?.endDate), 'MMM dd, yyyy')}` : '-'),
                timesheetName: paymentTrackValues?.paymentProcessed?.map(data => data?.timesheetLabel !== null ? data?.timesheetLabel?.label : 'Timesheet Not Entered'),
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
                timesheetName: paymentTrackValues?.submissionPending?.map(data => data?.timesheetLabel !== null ? data?.timesheetLabel?.label : 'Timesheet Not Entered'),
                timesheetContractName: paymentTrackValues?.submissionPending?.map(data => data?.contractName?.contractName),

                order: ['timesheetContractName', 'timesheetName', 'interval']
            })
        } else if (selectedPaymentTab === "Payment Pending") {
            paymentTrackerTableValues.push({
                interval: paymentTrackValues?.paymentPending?.map(data => data?.interval !== null ? `${format(new Date(data?.interval?.startDate), 'MMM dd, yyyy')} - ${format(new Date(data?.interval?.endDate), 'MMM dd, yyyy')}` : '-'),
                timesheetName: paymentTrackValues?.paymentPending?.map(data => data?.timesheetLabel !== null ? data?.timesheetLabel?.label : 'Timesheet Not Entered'),
                timesheetContractName: paymentTrackValues?.paymentPending?.map(data => data?.contractName?.contractName),
                approvalBy: paymentTrackValues?.paymentPending?.map(data => data?.approvedBy !== null ? data?.approvedBy?.name?.name : '-'),
                approvalDate: paymentTrackValues?.paymentPending?.map(data => data?.approvedDate !== null ? format(new Date(data?.approvedDate), 'MMM dd, yyyy') : '-'),
                order: ['timesheetContractName', 'timesheetName', 'interval', 'approvalDate', 'approvalBy']
            })
        }
        return paymentTrackerTableValues;
    }

    const getHeaderValues = () => {
        let headerValues = [];
        headerValues.push('');
        compensationCostAnalysis?.map(data => headerValues.push(`${months[data?.month]}, ${data?.year}`));
        return headerValues;
    }

    console.log(pieData, pieData[1]?.value, dataToUseInReport)

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
                        <ApexLineChart lineData={lineData} lineCategory={'Completed Activity'} />
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

    let attestationCategory = [];
    let totalCount = [];
    let attestedAll = [];
    let notAttested = [];
    let partiallyAttested = [];
    let action = [];
    let expandedList = [];
    let deptNames = [];
    let deptTotalCount = [];
    let deptAttestedAll = [];
    let deptNotAttested = [];
    let deptPartiallyAttested = [];

    const getValues = () => {
        attestationCategory = [];
        totalCount = [];
        attestedAll = [];
        notAttested = [];
        partiallyAttested = [];
        action = [];

        attestationOutstanding?.forEach((group) => {
            deptNames = [];
            deptTotalCount = [];
            deptAttestedAll = [];
            deptNotAttested = [];
            deptPartiallyAttested = [];

            group?.departments?.forEach((dept) => {
                deptNames.push(`${dept?.name} ${dept?.stats?.totalPendingAttestationCount ? `(${dept?.stats?.totalPendingAttestationCount})` : ''}` || '-');
                deptTotalCount.push(dept?.stats?.totalCount || '-');
                deptAttestedAll.push(dept?.stats?.attestedCount || '-');
                deptNotAttested.push(dept?.stats?.notAttestedCount || '-');
                deptPartiallyAttested.push(dept?.stats?.partiallyAttestedCount || '-');
            });

            expandedList.push([
                { type: "text", value: deptNames },
                { type: "text", value: deptTotalCount, isAlignCenter: true },
                { type: "text", value: deptAttestedAll, isAlignCenter: true },
                { type: "text", value: deptNotAttested, isAlignCenter: true },
                { type: "text", value: deptPartiallyAttested, isAlignCenter: true },
            ]);
        });
        console.log(expandedList, 'expandedList')
        attestationOutstanding?.map((data, index) => {
            attestationCategory.push(`${data?.groupName} ${data?.stats?.totalPendingAttestationCount ? `(${data?.stats?.totalPendingAttestationCount})` : ''}` || '-')
            totalCount.push(data?.stats?.totalCount || '-')
            attestedAll.push(data?.stats?.attestedCount || '-')
            notAttested.push(data?.stats?.notAttestedCount || '-')
            partiallyAttested.push(data?.stats?.partiallyAttestedCount || '-')
        })

        return [
            { "type": "text", "value": attestationCategory },
            { "type": "text", "value": totalCount, isAlignCenter: true },
            { "type": "text", "value": attestedAll, isAlignCenter: true },
            { "type": "text", "value": notAttested, isAlignCenter: true },
            { "type": "text", "value": partiallyAttested, isAlignCenter: true },
            { "type": "expand", "value": action },
        ]
    }

    const getPolicyAndProceduresValues = () => {
        attestationCategory = [];
        totalCount = [];
        attestedAll = [];
        notAttested = [];
        partiallyAttested = [];
        action = [];

        policyAndProceduresAttestationOutstanding?.forEach((group) => {
            deptNames = [];
            deptTotalCount = [];
            deptAttestedAll = [];
            deptNotAttested = [];
            deptPartiallyAttested = [];

            group?.departments?.forEach((dept) => {
                deptNames.push(`${dept?.name} ${dept?.stats?.totalPendingAttestationCount ? `(${dept?.stats?.totalPendingAttestationCount})` : ''}` || '-');
                deptTotalCount.push(dept?.stats?.totalCount || '-');
                deptAttestedAll.push(dept?.stats?.attestedCount || '-');
                deptNotAttested.push(dept?.stats?.notAttestedCount || '-');
                deptPartiallyAttested.push(dept?.stats?.partiallyAttestedCount || '-');
            });

            expandedList.push([
                { type: "text", value: deptNames },
                { type: "text", value: deptTotalCount, isAlignCenter: true },
                { type: "text", value: deptAttestedAll, isAlignCenter: true },
                { type: "text", value: deptNotAttested, isAlignCenter: true },
                { type: "text", value: deptPartiallyAttested, isAlignCenter: true },
            ]);
        });
        console.log(expandedList, 'expandedList')
        policyAndProceduresAttestationOutstanding?.map((data, index) => {
            attestationCategory.push(`${data?.groupName} ${data?.stats?.totalPendingAttestationCount ? `(${data?.stats?.totalPendingAttestationCount})` : ''}` || '-')
            totalCount.push(data?.stats?.totalCount || '-')
            attestedAll.push(data?.stats?.attestedCount || '-')
            notAttested.push(data?.stats?.notAttestedCount || '-')
            partiallyAttested.push(data?.stats?.partiallyAttestedCount || '-')
        })

        return [
            { "type": "text", "value": attestationCategory },
            { "type": "text", "value": totalCount, isAlignCenter: true },
            { "type": "text", "value": attestedAll, isAlignCenter: true },
            { "type": "text", "value": notAttested, isAlignCenter: true },
            { "type": "text", "value": partiallyAttested, isAlignCenter: true },
            { "type": "expand", "value": action },
        ]
    }

    // if (isLoading) {
    //     return <LoadingScreen text={['Sit Back And Relax', 'Loading Your Report']} />
    // }

    return (
        <div>
            {isFullScreenLoading && (
                <div
                    className={`${style.verticalAlignCenter} ${style.justifyCenter} ${style.loadingOverlay}`}
                >
                    <img src={dataLoadingGIF} alt="" className={style.fileLoadingStyle} />
                </div>
            )}
            <Fragment>
                <Navbar />
                <div className={`${isScheduledReport ? '' : isExpanded ? style.bigCardGrid : style.smallCardGrid} ${style.margin20WithoutTop} `}>
                    {!isScheduledReport && (
                        <div>
                            <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                                <SampleReportLeftCard getDataToUseInReport={getDataToUseInReport} isLoading={isLoading} />
                            </SideBar>
                        </div>
                    )}
                    <div>
                        <ReportPerformanceAndOptions handle={handle} handlePrint={handlePrint} dataToUseInReport={dataToUseInReport} refToUse={PDFRef} getIsDownloadClicked={getIsDownloadClicked} isNoData={isNoData} setIsFullScreenLoading={setIsFullScreenLoading} />
                        <FullScreen handle={handle} className={handle.active ? style.scroll : ''}>
                            <div className={`Report`} ref={PDFRef}>
                                <div className={`${style.reportBackgroundCard} ${style.marginTop20} ${style.printContainer} ${style.tableRow} ${style.reportSection} `} ref={componentRef}>
                                    <table style={{ width: '100%' }}>
                                        <thead>
                                            <ReportHeader />

                                        </thead>
                                        <tbody>
                                            <div className={style.justifyCenter}>
                                                <div className={style.marginTop20}>
                                                    <div className={`${style.entityNameBolderStyle} ${style.textAlignCenter} ${style.marginTop5} `}>
                                                        {isMyReport ? myReportContent?.title : reportTitleList[reportType]}
                                                    </div>
                                                    {(dataToUseInReport?.reportingTimePeriod !== "" && reportType !== "staffReappointmentTracker" && reportType !== "privilegedStaffSummary" && reportType !== "locumStaffbyTypes" && reportType !== "staffbyTypes" && reportType !== "currentNotesSummary" && reportType !== "locumStaffRenewalStatusTracker" && reportType !== "staffReappointmentStatusSummary" && reportType !== "ohipBillingNumbersByCareProvider" && reportType !== "currentMedicalDirectives" && reportType !== "retiredMedicalDirectives" && reportType !== "workflow" && reportType !== "attestationOutstanding" && reportType !== "medicalDirectivesTracker" && reportType !== "upcomingForReview" && reportType !== "reappointmentApplicationNotStarted" && reportType !== "locumRenewalOrExtensionApplicationsSummary" && reportType !== "declinedOrNotRenewedStaffSummary"
                                                        && reportType !== "appointmentHistorySummary" && reportType !== "inactiveStaffSummary" && reportType !== "currentPolicyAndProcedures" && reportType !== "retiredPolicyAndProcedures" && reportType !== "policyAndProceduresWorkflow" && reportType !== "policyAndProceduresAttestationOutstanding" && reportType !== "policyAndProceduresTracker" && reportType !== "policyAndProceduresUpcomingForReview"
                                                    ) && (
                                                            <div className={`${style.reportRunByTextStyle} ${style.textAlignCenter} ${style.marginTop5} `}>Reporting Period used for this report : {dataToUseInReport?.reportingTimePeriod} ({dataToUseInReport?.fromToDisplay} to {dataToUseInReport?.toToDisplay}) </div>
                                                        )}
                                                    {/* {(reportType === "paymentProcessingStatusTracker") && (
                                                    <div>
                                                        <div className={`${style.reportRunByTextStyle} ${style.textAlignCenter} ${style.marginTop5} `}>Timesheet Interval used for this report : {dataToUseInReport?.selectedTimesheetInterval?.map(data => data.split("%23")?.map(innerData => `${format(new Date(innerData), 'MMM dd yyyy')}`)).join(', ') || 'All Timesheet Intervals'} </div>
                                                    </div>
                                                )} */}
                                                    {/* {reportType === "staffReappointmentsNotes" && (
                                                    <div className={`${style.reportRunByTextStyle} ${style.textAlignCenter} ${style.marginTop5} `}>Within Next {dataToUseInReport?.renewalreportingTimePeriod} Days </div>
                                                )} */}
                                                    {/* {(reportType === "staffReappointmentsNotes" ||reportType === "staffReappointments") && (
                                                    <div className={`${style.reportRunByTextStyle} ${style.textAlignCenter} ${style.marginTop5} `}>Reporting Period : 30 Days </div>
                                                )} */}
                                                </div>
                                            </div>
                                            {/* <div className={`${style.mildBorderStyle} ${style.marginTop20} `}></div> */}
                                            <div className={`${style.marginTop20}`}>
                                                <div className={`${style.marginTop20} ${style.reportTypeParamsBackground}`}>
                                                    <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5} `}>Reporting Parameters Applied</div>
                                                    {((reportType === "currentMedicalDirectives" || reportType === "retiredMedicalDirectives" || reportType === "workflow" || reportType === "medicalDirectivesTracker" || reportType === "upcomingForReview" || reportType === "currentPolicyAndProcedures" || reportType === "retiredPolicyAndProcedures" || reportType === "policyAndProceduresWorkflow" || reportType === "policyAndProceduresTracker" || reportType === "policyAndProceduresUpcomingForReview") && reportType !== "attestationOutstanding" && reportType !== "policyAndProceduresAttestationOutstanding") && (
                                                        <div className={`${style.grid4} ${style.marginTop20} `}>
                                                            {reportType !== "medicalDirectivesTracker" && (
                                                                <div>
                                                                    <div className={`${style.reportRunByParamStyle} ${style.marginTop5}`}>
                                                                        {(dataToUseInReport?.selectedDepartmentsToSend?.length === 1 &&
                                                                            dataToUseInReport?.selectedDepartmentsToSend[0]?.departmentName?.name)
                                                                            ? 'Department'
                                                                            : 'Departments'}
                                                                    </div>
                                                                    <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                                                </div>
                                                            )}
                                                            {(reportType !== "currentMedicalDirectives" && reportType !== "medicalDirectivesTracker" && reportType !== "currentPolicyAndProcedures") && (
                                                                <div>
                                                                    <div className={`${style.reportRunByParamStyle} ${style.marginTop5}`}>
                                                                        {(dataToUseInReport?.selectedGroupsToSend?.length === 1 &&
                                                                            dataToUseInReport?.selectedGroupsToSend[0]?.name)
                                                                            ? 'Group'
                                                                            : 'Groups'}
                                                                    </div>
                                                                    <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedGroupsToSend?.map(data => data?.name).join(', ') || 'All Groups'}</div>
                                                                </div>
                                                            )}
                                                            {(reportType !== "currentMedicalDirectives" && reportType !== "medicalDirectivesTracker" && reportType !== "currentPolicyAndProcedures") && (
                                                                <div>
                                                                    <div className={`${style.reportRunByParamStyle} ${style.marginTop5}`}>
                                                                        {(dataToUseInReport?.selectedAuthorsToSend?.length === 1 &&
                                                                            dataToUseInReport?.selectedAuthorsToSend[0]?.name)
                                                                            ? 'Author'
                                                                            : 'Authors'}
                                                                    </div>
                                                                    <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedAuthorsToSend?.map(data => `${data?.name?.firstName} ${data?.name?.lastName}`).join(', ') || '-'}</div>
                                                                </div>
                                                            )}
                                                            {reportType === "upcomingForReview" && reportType === "policyAndProceduresUpcomingForReview" && (
                                                                <div>
                                                                    <div className={`${style.reportRunByParamStyle} ${style.marginTop5}`}>
                                                                        Review In
                                                                    </div>
                                                                    <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{(dataToUseInReport?.noOfDays !== undefined &&
                                                                        dataToUseInReport?.noOfDays)
                                                                        ? `${dataToUseInReport?.noOfDays} Days`
                                                                        : '-'}</div>
                                                                </div>
                                                            )}
                                                            {reportType === "medicalDirectivesTracker" && (
                                                                <div>
                                                                    <div className={`${style.reportRunByParamStyle} ${style.marginTop5}`}>
                                                                        Track By
                                                                    </div>
                                                                    <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.tab === "medical_directive_tab" ? "Medical Directive" : dataToUseInReport?.tab === "applicant_tab" ? "Applicant" : 'Department'}</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {(reportType === "staffReappointmentsNotes" || reportType === "staffReappointments" || reportType === "locumRenewalOrExtensionApplicationsSummary" || reportType === "privilegedStaffSummary" ||
                                                        reportType === "submittedApplicationsReviewSummary" || reportType === "staffReappointmentTracker" || reportType === "ohipBillingNumbersByCareProvider" || reportType === "careProviderCareerMilestoneSummary" ||
                                                        reportType === "declinedOrNotRenewedStaffSummary" || reportType === "reappointmentApplicationNotStarted" || reportType === "currentNotesSummary" || reportType === "staffReappointmentStatusSummary" || reportType === "staffbyTypes" || reportType === "locumStaffRenewalStatusTracker" || reportType === "locumStaffbyTypes" || reportType === "privilegedStaffSummary" || reportType === "careProvidersSummary"
                                                        || reportType === "expiredDocumentsSummaryForStaff" || reportType === "documentsExpirationSummaryForStaff" || reportType === "appointmentHistorySummary" || reportType === "inactiveStaffSummary"
                                                        || reportType === "newStaffAppointmentsSummary" || reportType === "inactiveStaffSummaryByMonth" || reportType === "staffUploadedDocumentsSummary" || reportType === "locumTermExpirationSummary") ? (
                                                        <div className={`${style.grid4} ${style.marginTop20} `}>
                                                            {/* {reportType === "staffReappointmentsNotes" && (
                                                        <div>
                                                            <div className={`${style.reportRunByParamStyle} ${style.marginTop5} `}>{reportType === "staffReappointmentsNotes" ? 'Renewal' : 'Expiration'} Time Frame </div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{`${reportType === "staffReappointmentsNotes" ? 'Renewal' : 'Expiration'} Within Next ${dataToUseInReport?.renewalreportingTimePeriod} days`}</div>
                                                        </div>
                                                    )} */}
                                                            {/* <div>
                                                        <div className={`${style.reportRunByParamStyle} ${style.marginTop5} `}>Sites </div>
                                                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedSitesToSend?.map(data => data?.siteName?.siteName).join(', ') || 'All Sites'}</div>
                                                    </div> */}
                                                            <div>
                                                                <div className={`${style.reportRunByParamStyle} ${style.marginTop5}`}>
                                                                    {(dataToUseInReport?.selectedDepartmentsToSend?.length === 1 &&
                                                                        dataToUseInReport?.selectedDepartmentsToSend[0]?.departmentName?.name)
                                                                        ? 'Department'
                                                                        : 'Departments'}
                                                                </div>
                                                                <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                                            </div>
                                                            {/* <div>
                                                            <div className={`${style.reportRunByParamStyle} ${style.marginTop5} `}>DIVISION / SPECIALITY </div>
                                                            <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedContractsToSend?.map(data => data?.contractName?.contractName).join(', ') || 'All'}</div>
                                                        </div> */}
                                                            <div>
                                                                <div className={`${style.reportRunByParamStyle} ${style.marginTop5} `}>STAFF TYPE </div>
                                                                <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedStaffTypeToSend?.map(data => data?.applicantType).join(', ') || 'All Staff Type'}</div>
                                                            </div>
                                                            {(reportType !== "locumTermExpirationSummary") && (
                                                                <div>
                                                                    <div className={`${style.reportRunByParamStyle} ${style.marginTop5} `}>PRIVILEGE CATEGORY </div>
                                                                    <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedPrivilegeCategoryToSend?.map(data => data?.category).join(', ') || 'All Categories'}</div>
                                                                </div>
                                                            )}
                                                            {(reportType === "expiredDocumentsSummaryForStaff" || reportType === "documentsExpirationSummaryForStaff" || reportType === "appointmentHistorySummary" || reportType === "inactiveStaffSummary"
                                                                || reportType === "newStaffAppointmentsSummary" || reportType === "inactiveStaffSummaryByMonth" || reportType === "staffUploadedDocumentsSummary") && (
                                                                    <div>
                                                                        <div className={`${style.reportRunByParamStyle} ${style.marginTop5} `}>STAFF </div>
                                                                        <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedPosition || 'All Staffs'}</div>
                                                                    </div>
                                                                )}
                                                            {reportType === "documentsExpirationSummaryForStaff" && (
                                                                <div>
                                                                    <div className={`${style.reportRunByParamStyle} ${style.marginTop5} `}>No Of Days </div>
                                                                    <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.noOfDays || '-'} Days</div>
                                                                </div>
                                                            )}

                                                            {reportType === "currentNotesSummary" && (
                                                                <div>
                                                                    <div className={`${style.reportRunByParamStyle} ${style.marginTop5} `}>APPLICATION TYPE</div>
                                                                    <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{availableApplicationTypes[dataToUseInReport?.selectedApplicationType] || 'All Application Type'}</div>
                                                                </div>
                                                            )}

                                                            {(reportType === "staffbyTypes" || reportType === "LocumStaffbyTypes") && (
                                                                <div>
                                                                    <div className={`${style.reportRunByParamStyle} ${style.marginTop5} `}>Application Sent Status</div>
                                                                    <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedApplicationSentStatus || 'All'}</div>
                                                                </div>
                                                            )}
                                                            {reportType === "declinedOrNotRenewedStaffSummary" && (
                                                                <div>
                                                                    <div className={`${style.reportRunByParamStyle} ${style.marginTop5} `}>Locum Application Status</div>
                                                                    <div className={`${style.reportTypeValueParamTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedReappointmentStatus || 'All Applications'}</div>
                                                                </div>
                                                            )}
                                                            {/* {(reportType === "contractDocumentsOnFile" || reportType === "multiProviderContractsList" ||
                                                            reportType === "contractsWithABusinessEntity") && (
                                                                <div>
                                                                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Contract Status</div>
                                                                    <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{getContractStatusValue[dataToUseInReport?.contractStatus]}</div>
                                                                </div>
                                                            )}
                                                        {(reportType === "contractDocumentsOnFile" || reportType === "currentRemitToAddressForActiveContracts" || reportType === "paymentProcessingStatusTracker") && (
                                                            <div>
                                                                <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Contracted Service Provider </div>
                                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedContractedServiceProviderToSend?.map(data => `${data?.name?.firstName} ${data?.name?.lastName}`).join(', ') || 'All Contracted Service Providers'}</div>
                                                            </div>
                                                        )} */}
                                                            {/* {reportType === "staffReappointmentsNotes" && (
                                                        <div>
                                                            <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Contract Continuation Policy</div>
                                                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.contractContinuationPolicy === 'AUTORENEWAL' ? "Auto Renewal"
                                                                : dataToUseInReport?.contractContinuationPolicy === "WRITTENCONTRACTEXTENSIONFORFIXEDTERM" ? "Written Contract Extension For Fixed Term"
                                                                    : dataToUseInReport?.contractContinuationPolicy === "NEWCONTRACTONEXPIRATION" ? "New Contract On Expiration"
                                                                        : dataToUseInReport?.contractContinuationPolicy === "ONETIMECONTRACTTERMINATEONEXPIRATION" ? "One Time Contract - Terminate On Expiration" : 'All Contract Continuation Policy'}</div>
                                                        </div>
                                                    )} */}
                                                        </div>
                                                    ) : (reportType === "activitiesOrServices" || reportType === "addOnActivities" || reportType === "timesheetProcessingSummary" || reportType === "listingOfTimesheetsNotPaid" || reportType === "paymentsProcessingSummary") ? (
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
                                                                <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedContractedServiceProviderToSend?.map(data => `${data?.name?.firstName} ${data?.name?.lastName}`).join(', ') || 'All Contracted Service Providers'}</div>
                                                            </div>
                                                        </div>
                                                    )
                                                        //  : (reportType === "paymentsProcessingSummary") ? (
                                                        //     <div className={`${style.grid2} ${style.marginTop20} `}>
                                                        //         <div>
                                                        //             <div className={`${style.reportRunByTextStyle} ${style.marginTop5} `}>Departments</div>
                                                        //             <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5} `}>{dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'}</div>
                                                        //         </div>
                                                        //     </div>
                                                        // )
                                                        : (reportType === "compensationCostAnalysis") ? (
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
                                                </div>
                                                {/* <div className={`${style.headerBorderStyle} ${style.marginTop40} `}></div> */}
                                                <div className={`${style.marginTop40} `}></div>
                                                {isLoading ? (
                                                    <div>
                                                        <img src={Loader} alt="Loading" width={250} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        {
                                                            // isLoading ? <LoadingScreen text={['Sit Back And Relax', 'Loading Your Report']} /> : 
                                                            reportType === "activitiesOrServices" ? (
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
                                                                                            {/* <div className={style.calendarMonthYearStyle}>June 2023</div> */}
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
                                                                                    {(pieData[0]?.value !== 0 || pieData[1]?.value !== 0) && (
                                                                                        <ApexPieChart pieData={pieData} />
                                                                                    )}
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
                                                                                        tableType={'Timesheets Rejected'}
                                                                                        tableHeader={['Timesheet', 'Period', 'Rejected Date', 'Rejected by', 'Service Provider']}
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
                                                                                            tableValue={data?.timesheets}
                                                                                            activitiesServicesValues={getNotPaidTimesheetsValues(data)}
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
                                                            ) : reportType === "staffReappointmentTracker" ? (
                                                                <div className={style.marginTop20}>
                                                                    {staffReappointmentTrackerData?.length !== 0 ? (
                                                                        <>
                                                                            {/* <ReportsTable
                                                                            tableType={''}
                                                                            tableHeader={['Timesheet Name', 'Period', 'Contractor', 'Site/ Dept', 'Billable Hours', 'Non Billable Hours', 'Submission Date', 'Current Status', 'Status Date', 'Payment Status', 'Payment Amount', 'Payment Date']}
                                                                            tableValue={staffReappointmentTrackerData?.timesheetPayment}
                                                                            activitiesServicesValues={getSubmittedTimesheetsPaymentStatusValues()}
                                                                            styleName={style.grid12}
                                                                        /> */}
                                                                            <TableTwo
                                                                                tableHeaderValues={headerValuesStaffsReappointmentStatusTracker}
                                                                                tableDataValues={getStaffsReappointmentStatusTrackerTableValues()}
                                                                                tableData={staffReappointmentTrackerData}
                                                                                gridStyle={style.statusTrackerGrid}
                                                                                tableSortValues={colSortValuesStaffsReappointmentStatusTracker}
                                                                                heading={"There are no record to display"}
                                                                                className={`${style.tableRow} ${style.reportSection}`}
                                                                                hidePagination={true}
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                    )}

                                                                </div>
                                                            ) : reportType === "locumStaffRenewalStatusTracker" ? (
                                                                <div className={style.marginTop20}>
                                                                    {locumStaffRenewalTrackerData?.length !== 0 ? (
                                                                        <>
                                                                            {/* <ReportsTable
                                                                            tableType={''}
                                                                            tableHeader={['Timesheet Name', 'Period', 'Contractor', 'Site/ Dept', 'Billable Hours', 'Non Billable Hours', 'Submission Date', 'Current Status', 'Status Date', 'Payment Status', 'Payment Amount', 'Payment Date']}
                                                                            tableValue={staffReappointmentTrackerData?.timesheetPayment}
                                                                            activitiesServicesValues={getSubmittedTimesheetsPaymentStatusValues()}
                                                                            styleName={style.grid12}
                                                                        /> */}
                                                                            <TableTwo
                                                                                tableHeaderValues={headerValuesLocumStaffsRenewalStatusTracker}
                                                                                tableDataValues={getLocumStaffsRenewalStatusTrackerTableValues()}
                                                                                tableData={locumStaffRenewalTrackerData}
                                                                                gridStyle={style.statusTrackerGrid}
                                                                                tableSortValues={colSortValuesLocumStaffsRenewalStatusTracker}
                                                                                heading={"There are no record to display"}
                                                                                className={`${style.tableRow} ${style.reportSection}`}
                                                                                hidePagination={true}
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                    )}

                                                                </div>
                                                            ) : reportType === "careProvidersSummary" ? (
                                                                <div className={style.marginTop20}>
                                                                    <ReportNoDataBox
                                                                        heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'}
                                                                    />
                                                                </div>
                                                            ) : reportType === "ohipBillingNumbersByCareProvider" ? (
                                                                <div className={style.marginTop20}>
                                                                    {ohipBillingNumbersByCareProviderValues?.length !== 0 ? (
                                                                        <>
                                                                            <TableTwo
                                                                                tableHeaderValues={headerValuesOHIP}
                                                                                tableDataValues={getOHIPTableValues()}
                                                                                tableData={ohipBillingNumbersByCareProviderValues}
                                                                                gridStyle={style.ohipGrid}
                                                                                tableSortValues={colSortValuesOHIP}
                                                                                heading={"There are no record to display"}
                                                                                className={`${style.tableRow} ${style.reportSection}`}
                                                                                hidePagination={true}
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                    )}

                                                                </div>
                                                            ) : reportType === "careProviderCareerMilestoneSummary" ? (
                                                                <>
                                                                    {careProviderCareerMilestoneValues?.staffListByMilestone?.length !== 0 ? (
                                                                        <div>
                                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Career Milestone Achieved</div>
                                                                            <div className={style.marginTop20}>
                                                                                <ApexBarChart series={barChartSeries} categories={barChartCategories} reportingPeriod={`${format(new Date(dataToUseInReport?.from || new Date()), 'MMM d')} to ${format(new Date(dataToUseInReport?.to || new Date()), 'MMM d')} `} yAxisTitle="Doctors" xAxisTitle="Years" />
                                                                            </div>
                                                                        </div>
                                                                    ) : (<ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                    )}
                                                                    {careProviderCareerMilestoneValues?.staffListByMilestone?.map((data, index) => (
                                                                        <>
                                                                            <div className={`${style.tableTitleTextStyle} ${style.marginTop20}`}>{`${data?.years} Year Career Longevity Milestone (${data?.staffs?.length})`}</div>
                                                                            <div>
                                                                                {data?.staffs?.length !== 0 ? (
                                                                                    <>
                                                                                        <TableTwo
                                                                                            tableHeaderValues={headerValuesMilestone}
                                                                                            tableDataValues={getMilestoneTableValues(data?.staffs, data?.years)}
                                                                                            tableData={data?.staffs}
                                                                                            gridStyle={style.milestoneGrid}
                                                                                            tableSortValues={colSortValuesMilestone}
                                                                                            heading={"There are no record to display"}
                                                                                            className={`${style.tableRow} ${style.reportSection}`}
                                                                                            hidePagination={true}
                                                                                        />
                                                                                    </>
                                                                                ) : (
                                                                                    <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                )}

                                                                            </div>
                                                                        </>
                                                                    ))}
                                                                </>
                                                            ) : reportType === "reappointmentApplicationNotStarted" ? (
                                                                <>
                                                                    <div>
                                                                        {/* <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>Career Milestone Achieved</div> */}
                                                                        <div className={style.marginTop20}>
                                                                            <ApexBarChart series={barChartSeries} categories={barChartCategories} reportingPeriod={`${format(new Date(dataToUseInReport?.from || new Date()), 'MMM d')} to ${format(new Date(dataToUseInReport?.to || new Date()), 'MMM d')} `} yAxisTitle="Applications Not Started" xAxisTitle="" />
                                                                        </div>
                                                                    </div>
                                                                    {reappointmentNotStartedValues?.staffByDepartmentList?.map((data, index) => (
                                                                        <>
                                                                            <div className={`${style.tableTitleTextStyle} ${style.marginTop20}`}>{`${data?.department} (${data?.staffs?.length})`}</div>
                                                                            <div>
                                                                                {data?.staffs?.length !== 0 ? (
                                                                                    <>
                                                                                        <TableTwo
                                                                                            tableHeaderValues={headerValuesNotStarted}
                                                                                            tableDataValues={getNotStartedTableValues(data?.staffs)}
                                                                                            tableData={data?.staffs}
                                                                                            gridStyle={style.notStartedGrid}
                                                                                            tableSortValues={colSortValuesNotStarted}
                                                                                            heading={"There are no record to display"}
                                                                                            className={`${style.tableRow} ${style.reportSection}`}
                                                                                            hidePagination={true}
                                                                                        />
                                                                                    </>
                                                                                ) : (
                                                                                    <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                )}

                                                                            </div>
                                                                        </>
                                                                    ))}
                                                                </>
                                                            ) : reportType === "privilegedStaffSummary" ? (
                                                                <div className={style.marginTop20}>
                                                                    {privilegedStaffSummaryValues?.length !== 0 ? (
                                                                        <>
                                                                            <TableTwo
                                                                                tableHeaderValues={headerValuesPrivilegedStaffs}
                                                                                tableDataValues={getPrivilegedStaffsTableValues()}
                                                                                tableData={privilegedStaffSummaryValues}
                                                                                gridStyle={style.ohipGrid}
                                                                                tableSortValues={colSortValuesPrivilegedStaffs}
                                                                                heading={"There are no record to display"}
                                                                                className={`${style.tableRow} ${style.reportSection}`}
                                                                                hidePagination={true}
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                    )}

                                                                </div>
                                                            ) : reportType === "staffReappointmentStatusSummary" ? (
                                                                <div className={style.marginTop20}>
                                                                    {staffReappointmentStatusSummaryValues?.length !== 0 ? (
                                                                        <>
                                                                            <TableTwo
                                                                                tableHeaderValues={headerValuesStaffsReappointmentStatusSummary}
                                                                                tableDataValues={getStaffsReappointmentStatusSummaryTableValues()}
                                                                                tableData={staffReappointmentStatusSummaryValues}
                                                                                gridStyle={style.statusTrackerGrid}
                                                                                tableSortValues={colSortValuesStaffsReappointmentStatusSummary}
                                                                                heading={"There are no record to display"}
                                                                                className={`${style.tableRow} ${style.reportSection}`}
                                                                                hidePagination={true}
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                    )}

                                                                </div>
                                                            ) : reportType === "submittedApplicationsReviewSummary" ? (
                                                                <div className={style.marginTop20}>
                                                                    {submittedApplicationValues?.length !== 0 ? (
                                                                        <>
                                                                            <ReportsApplicantWithAllDataTable
                                                                                tableData={submittedApplicationValues}
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                    )}

                                                                </div>
                                                            ) : reportType === "locumRenewalOrExtensionApplicationsSummary" ? (
                                                                <div className={style.marginTop20}>
                                                                    {locumRenewalOrExtensionApplicationValues?.length !== 0 ? (
                                                                        <>
                                                                            <ReportsApplicantWithAllDataTable
                                                                                tableData={locumRenewalOrExtensionApplicationValues}
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                    )}

                                                                </div>
                                                            ) : reportType === "declinedOrNotRenewedStaffSummary" ? (
                                                                <div className={style.marginTop20}>
                                                                    {declinedOrNotRenewedStaffSummaryValues?.length !== 0 ? (
                                                                        <>
                                                                            <ReportsApplicantWithAllDataTable
                                                                                tableData={declinedOrNotRenewedStaffSummaryValues}
                                                                                declinedReport={true}
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                    )}

                                                                </div>
                                                            ) : (reportType === "currentNotesSummary") ? (
                                                                (staffApplicationNotesSummaryValues?.length !== 0 || staffApplicationNotesSummaryValues?.length !== 0) ? (
                                                                    <>
                                                                        {staffApplicationNotesSummaryValues?.length !== 0 && (
                                                                            <ReportsApplicantTableNotes
                                                                                tableData={staffApplicationNotesSummaryValues}
                                                                            />
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <ReportNoDataBox heading={'You do not have any One Time Contracts that will terminate on expiration'}
                                                                        subHeading={''} />
                                                                ))
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
                                                                :
                                                                // (reportType === "staffReappointmentsNotes") ? (
                                                                //     (individualContract?.length !== 0 || multipleContract?.length !== 0) ? (
                                                                //         <>
                                                                //             {individualContract?.length !== 0 && (
                                                                //                 <ReportsTable
                                                                //                     tableType={`Individual Service Provider Contract Renewals Within ${dataToUseInReport?.renewalreportingTimePeriod} Days`}
                                                                //                     tableHeader={['Contract Name', 'Contract ID', 'Contract Expiration Date', 'Contracting Entity', 'Point of Contact', 'Point of Contact Number', 'Email Address']}
                                                                //                     tableValue={individualContract}
                                                                //                     activitiesServicesValues={getContractManagementUpcomingValues('INDIVIDUAL')}
                                                                //                     styleName={style.individualServiceReportGrid}
                                                                //                 />
                                                                //             )}
                                                                //             {multipleContract?.length !== 0 && (
                                                                //                 <ReportsTable
                                                                //                     tableType={`Multiple Service Provider Contract Renewals Within ${dataToUseInReport?.renewalreportingTimePeriod} Days`}
                                                                //                     tableHeader={['Contract Name', 'Contract ID', 'Contract Expiration Date', 'Contracting Entity', 'Point of Contact', 'Point of Contact Number', 'Email Address', 'Service Providers']}
                                                                //                     tableValue={multipleContract}
                                                                //                     activitiesServicesValues={getContractManagementUpcomingValues('MULTIPLE')}
                                                                //                     styleName={style.multipleServiceReportGrid}
                                                                //                 />
                                                                //             )}
                                                                //         </>
                                                                //     ) : reportType === "staffReappointmentsNotes" ? (

                                                                //         <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                //             subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                //     ) : (

                                                                //         <ReportNoDataBox heading={'You do not have any One Time Contracts that will terminate on expiration'}
                                                                //             subHeading={''} />
                                                                //     ))
                                                                (reportType === "staffReappointmentsNotes") ? (
                                                                    (tableData?.length !== 0 || tableData?.length !== 0) ? (
                                                                        <>
                                                                            {tableData?.length !== 0 && (
                                                                                <ReportsApplicantTableNotes
                                                                                    tableData={tableData}
                                                                                />
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <ReportNoDataBox heading={'You do not have any One Time Contracts that will terminate on expiration'}
                                                                            subHeading={''} />
                                                                    )) : (reportType === "locumStaffRenewalNotes") ? (
                                                                        (tableData?.length !== 0 || tableData?.length !== 0) ? (
                                                                            <>
                                                                                {tableData?.length !== 0 && (
                                                                                    <ReportsApplicantTableNotes
                                                                                        tableData={tableData}
                                                                                    />
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <ReportNoDataBox heading={'You do not have any One Time Contracts that will terminate on expiration'}
                                                                                subHeading={''} />
                                                                        ))
                                                                    : (reportType === "staffReappointments") ? (
                                                                        (tableData?.length !== 0 || tableData?.length !== 0) ? (
                                                                            <>
                                                                                {tableData?.length !== 0 && (
                                                                                    <ReportsApplicantTable
                                                                                        tableData={tableData}
                                                                                    />
                                                                                )}
                                                                            </>
                                                                        ) : (
                                                                            <ReportNoDataBox heading={'You do not have any One Time Contracts that will terminate on expiration'}
                                                                                subHeading={''} />
                                                                        ))
                                                                        : (reportType === "locumStaffRenewal") ? (
                                                                            (tableData?.length !== 0 || tableData?.length !== 0) ? (
                                                                                <>
                                                                                    {tableData?.length !== 0 && (
                                                                                        <ReportsApplicantTable
                                                                                            tableData={tableData}
                                                                                        />
                                                                                    )}
                                                                                </>
                                                                            ) : (
                                                                                <ReportNoDataBox heading={'You do not have any Locum Extensions / Renewals'}
                                                                                    subHeading={''} />
                                                                            )
                                                                        ) : reportType === "expiredDocumentsSummaryForStaff" ? (
                                                                            <div className={style.marginTop20}>
                                                                                {expiredDocumentsSummaryForStaff?.length !== 0 ? (
                                                                                    <>
                                                                                        <TableTwo
                                                                                            tableHeaderValues={headerValuesExpiredDocument}
                                                                                            tableDataValues={getExpiredDocumentTableValues()}
                                                                                            tableData={expiredDocumentsSummaryForStaff}
                                                                                            gridStyle={style.expiredDocsGrid}
                                                                                            tableSortValues={colSortValuesExpiredDocument}
                                                                                            heading={"There are no record to display"}
                                                                                            className={`${style.tableRow} ${style.reportSection}`}
                                                                                            hidePagination={true}
                                                                                        />
                                                                                    </>
                                                                                ) : (
                                                                                    <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                )}

                                                                            </div>
                                                                        ) : reportType === "documentsExpirationSummaryForStaff" ? (
                                                                            <div className={style.marginTop20}>
                                                                                {staffDocumentsExpiration?.length !== 0 ? (
                                                                                    <>
                                                                                        <TableTwo
                                                                                            tableHeaderValues={headerValuesDocumentExpiration}
                                                                                            tableDataValues={getDocumentExpirationTableValues()}
                                                                                            tableData={staffDocumentsExpiration}
                                                                                            gridStyle={style.expiredDocsGrid}
                                                                                            tableSortValues={colSortValuesDocumentExpiration}
                                                                                            heading={"There are no record to display"}
                                                                                            className={`${style.tableRow} ${style.reportSection}`}
                                                                                            hidePagination={true}
                                                                                        />
                                                                                    </>
                                                                                ) : (
                                                                                    <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                )}

                                                                            </div>
                                                                        ) : reportType === "inactiveStaffSummary" ? (
                                                                            <div className={style.marginTop20}>
                                                                                {inactiveStaffSummary?.length !== 0 ? (
                                                                                    <>
                                                                                        <TableTwo
                                                                                            tableHeaderValues={headerValuesInactiveStaff}
                                                                                            tableDataValues={getInactiveStaffTableValues()}
                                                                                            tableData={inactiveStaffSummary}
                                                                                            gridStyle={style.inactiveStaffGrid}
                                                                                            tableSortValues={colSortValuesInactiveStaff}
                                                                                            heading={"There are no record to display"}
                                                                                            className={`${style.tableRow} ${style.reportSection}`}
                                                                                            hidePagination={true}
                                                                                        />
                                                                                    </>
                                                                                ) : (
                                                                                    <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                )}

                                                                            </div>
                                                                        ) : (reportType === "appointmentHistorySummary") ? (
                                                                            (appointmentHistorySummary?.length !== 0) ?
                                                                                appointmentHistorySummary?.map((data, index) => (
                                                                                    <div className={`${style.mdReportCard} ${index % 2 === 0 ? style.mdCardAlternateBackground : ''} ${style.marginTop20}`} key={index}>
                                                                                        <div className={style.spaceBetween}>
                                                                                            <div className={style.displayInRow}>

                                                                                                <div className={style.mdTitle}><span className={style.mdTitle}>{`${index + 1}. `}</span>{formatFirstNameLastName(data?.staff?.applicant?.name?.firstName, data?.staff?.applicant?.name?.lastName)}</div>
                                                                                            </div>
                                                                                            <div className={style.mdId}>{data?.staff?.staffId}</div>
                                                                                        </div>
                                                                                        <div className={`${style.mdDesc} ${style.marginTop}`}
                                                                                            dangerouslySetInnerHTML={{ __html: data?.description || "" }}
                                                                                        />
                                                                                        <div className={`${style.grid2} ${style.marginTop}`}>
                                                                                            <div>
                                                                                                <div className={style.mdGrid}>
                                                                                                    <div className={style.mdLabel}>Department:</div>
                                                                                                    <div className={style.mdValue}>{`${data?.staff?.basicDetailReferences?.department?.name}`}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>Staff Type:</div>
                                                                                                    <div className={style.mdValue}>{data?.staff?.basicDetailReferences?.applicantType?.serviceProviderType}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className={style.mdGrid}>
                                                                                                    <div className={style.mdLabel}>Division / Speciality:</div>
                                                                                                    <div className={style.mdValue}>{data?.staff?.basicDetailReferences?.specialty?.name}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>Email</div>
                                                                                                    <div className={style.mdValue}>{data?.staff?.applicant?.email?.officialEmail}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className={style.marginTop}>
                                                                                            <div className={style.mdLabel}>Appointment History:</div>
                                                                                            <div className={style.mdValue}>
                                                                                                {data?.applications?.map((applicationData, index) => {
                                                                                                    const from = applicationData?.cyclePeriod?.from
                                                                                                        ? format(new Date(applicationData.cyclePeriod.from), 'MMM dd yyyy')
                                                                                                        : '';
                                                                                                    const to = applicationData?.cyclePeriod?.to
                                                                                                        ? format(new Date(applicationData.cyclePeriod.to), 'MMM dd yyyy')
                                                                                                        : '';
                                                                                                    return (
                                                                                                        <div key={index} className={style.marginTop10}>
                                                                                                            {index + 1}. {from} - {to}
                                                                                                        </div>
                                                                                                    );
                                                                                                })}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )) : (
                                                                                    <ReportNoDataBox heading={'You do not have any Current Medical Directives'}
                                                                                        subHeading={''} />
                                                                                )
                                                                        ) : (reportType === "locumTermExpirationSummary") ? (
                                                                            (locumTermExpirationSummary?.length > 0) ? (
                                                                                <div className={`${style.marginTop20}`}>
                                                                                    <ApexBarChart series={[{
                                                                                        name: "Locum Term Expiration",
                                                                                        data: locumTermExpirationSummary?.map(data => data?.count)
                                                                                    }]} categories={locumTermExpirationSummary?.map(data => data?.month ? format(new Date(data?.month), 'MMM yyyy') : '') || []} reportingPeriod={``} yAxisTitle="Staff Count" xAxisTitle="Locum Term Expiration" />
                                                                                    {locumTermExpirationSummary?.map(data => (
                                                                                        <>
                                                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>{format(new Date(data?.month), 'MMMM, yyyy')}</div>
                                                                                            <TableTwo
                                                                                                tableHeaderValues={headerValuesLocumTermExpiration}
                                                                                                tableDataValues={getLocumTermExpirationTableValues(data?.staffs)}
                                                                                                tableData={data?.staffs}
                                                                                                gridStyle={style.locumTermExpirationGrid}
                                                                                                tableSortValues={colSortValuesLocumTermExpiration}
                                                                                                heading={"There are no record to display"}
                                                                                                className={`${style.tableRow} ${style.reportSection}`}
                                                                                                hidePagination={true}
                                                                                            />
                                                                                        </>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <ReportNoDataBox heading={'You do not have any Locum Term Expiration for the selected period.'}
                                                                                    subHeading={''} />
                                                                            )
                                                                        ) : (reportType === "newStaffAppointmentsSummary") ? (
                                                                            (newStaffAppointmentsSummary?.length > 0) ? (
                                                                                <div className={`${style.marginTop20}`}>
                                                                                    <ApexBarChart series={[{
                                                                                        name: "New Staff Appointments",
                                                                                        data: newStaffAppointmentsSummary?.map(data => data?.count)
                                                                                    }]} categories={newStaffAppointmentsSummary?.map(data => data?.month ? format(new Date(data?.month), 'MMM yyyy') : '') || []} reportingPeriod={``} yAxisTitle="Staff Count" xAxisTitle="New Staff Appointments" />
                                                                                    {newStaffAppointmentsSummary?.map(data => (
                                                                                        <>
                                                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>{format(new Date(data?.month), 'MMMM, yyyy')}</div>
                                                                                            <TableTwo
                                                                                                tableHeaderValues={headerValuesNewStaffReappointments}
                                                                                                tableDataValues={getNewStaffReappointmentsTableValues(data?.staffs)}
                                                                                                tableData={data?.staffs}
                                                                                                gridStyle={style.locumTermExpirationGrid}
                                                                                                tableSortValues={colSortValuesNewStaffReappointments}
                                                                                                heading={"There are no record to display"}
                                                                                                className={`${style.tableRow} ${style.reportSection}`}
                                                                                                hidePagination={true}
                                                                                            />
                                                                                        </>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <ReportNoDataBox heading={'You do not have any New Staff Appointments for the selected period.'}
                                                                                    subHeading={''} />
                                                                            )
                                                                        ) : (reportType === "inactiveStaffSummaryByMonth") ? (
                                                                            (inactiveStaffSummaryByMonth?.length > 0) ? (
                                                                                <div className={`${style.marginTop20}`}>
                                                                                    <ApexBarChart series={[{
                                                                                        name: "Inactive Staff Summary",
                                                                                        data: inactiveStaffSummaryByMonth?.map(data => data?.count)
                                                                                    }]} categories={inactiveStaffSummaryByMonth?.map(data => data?.month ? format(new Date(data?.month), 'MMM yyyy') : '') || []} reportingPeriod={``} yAxisTitle="Staff Count" xAxisTitle="Inactive Staff Summary" />
                                                                                    {inactiveStaffSummaryByMonth?.map(data => (
                                                                                        <>
                                                                                            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop20} `}>{format(new Date(data?.month), 'MMMM, yyyy')}</div>
                                                                                            <TableTwo
                                                                                                tableHeaderValues={headerValuesInactiveStaffSummaryByMonth}
                                                                                                tableDataValues={getInactiveStaffSummaryByMonthTableValues(data?.staffs)}
                                                                                                tableData={data?.staffs}
                                                                                                gridStyle={style.locumTermExpirationGrid}
                                                                                                tableSortValues={colSortValuesInactiveStaffSummaryByMonth}
                                                                                                heading={"There are no record to display"}
                                                                                                className={`${style.tableRow} ${style.reportSection}`}
                                                                                                hidePagination={true}
                                                                                            />
                                                                                        </>
                                                                                    ))}
                                                                                </div>
                                                                            ) : (
                                                                                <ReportNoDataBox heading={'You do not have any Inactive Staff Summary for the selected period.'}
                                                                                    subHeading={''} />
                                                                            )
                                                                        ) : (reportType === "staffUploadedDocumentsSummary") ? (
                                                                            (staffUploadedDocumentsSummary?.length > 0) ? (
                                                                                <div className={`${style.marginTop20}`}>
                                                                                    <ApexBarChart series={[{
                                                                                        name: "Staff Uploaded Documents",
                                                                                        data: staffUploadedDocumentsSummary?.map(data => data?.count)
                                                                                    }]} categories={staffUploadedDocumentsSummary?.map(data => data?.month ? format(new Date(data?.month), 'MMM yyyy') : '') || []} reportingPeriod={``} yAxisTitle="Document Count" xAxisTitle="Staff Uploaded Documents" />
                                                                                </div>
                                                                            ) : (
                                                                                <ReportNoDataBox heading={'You do not have any Staff Uploaded Documents for the selected period.'}
                                                                                    subHeading={''} />
                                                                            )
                                                                        ) : (reportType === "currentMedicalDirectives") ? (
                                                                            (currentMedicalDirectives?.length !== 0) ?
                                                                                currentMedicalDirectives?.map((data, index) => (
                                                                                    <div className={`${style.mdReportCard} ${index % 2 === 0 ? style.mdCardAlternateBackground : ''} ${style.marginTop20}`} key={index}>
                                                                                        <div className={style.spaceBetween}>
                                                                                            <div className={style.displayInRow}>

                                                                                                <div className={style.mdTitle}><span className={style.mdTitle}>{`${index + 1}. `}</span>{data?.title}</div>
                                                                                            </div>
                                                                                            <div className={style.mdId}>{data?.mdID}</div>
                                                                                        </div>
                                                                                        <div className={`${style.mdDesc} ${style.marginTop}`}
                                                                                            dangerouslySetInnerHTML={{ __html: data?.description || "" }}
                                                                                        />
                                                                                        <div className={`${style.grid2} ${style.marginTop}`}>
                                                                                            <div>
                                                                                                <div className={style.mdGrid}>
                                                                                                    <div className={style.mdLabel}>Department:</div>
                                                                                                    <div className={style.mdValue}>{data?.sites?.[0]?.departments?.map(data => data?.name)?.join(', ')}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>First Published:</div>
                                                                                                    <div className={style.mdValue}>{data?.initialPublishedDate ? format(new Date(data?.initialPublishedDate), 'MMM dd, yyyy') : '-'}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>Author / Owner:</div>
                                                                                                    <div className={style.mdValue}>{(data?.authors || data?.authors?.length > 0) ? data?.authors?.map(author => `${author?.name?.firstName} ${author?.name?.lastName}`)?.join(', ') : '-'}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className={style.mdGrid}>
                                                                                                    <div className={style.mdLabel}>Division / Speciality:</div>
                                                                                                    <div className={style.mdValue}>{data?.sites?.[0]?.departments
                                                                                                        ?.filter(dept => dept?.serviceAreas?.length > 0)?.length > 0 ? data?.sites?.[0]?.departments
                                                                                                            ?.filter(dept => dept?.serviceAreas?.length > 0)
                                                                                                            ?.map(dept =>
                                                                                                                dept.serviceAreas
                                                                                                                    ?.map(sa => `${sa.name} (${dept.name})`)
                                                                                                                    .join(", ")
                                                                                                            )
                                                                                                            .join(", ") : '-'}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>Last Revision:</div>
                                                                                                    <div className={style.mdValue}>{data?.lastRevisionDate ? format(new Date(data?.lastRevisionDate), 'MMM dd, yyyy') : 'Unknown'}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )) : (
                                                                                    <ReportNoDataBox heading={'You do not have any Current Medical Directives'}
                                                                                        subHeading={''} />
                                                                                )
                                                                        ) : (reportType === "retiredMedicalDirectives") ? (
                                                                            (retiredMedicalDirectives?.length !== 0) ?
                                                                                retiredMedicalDirectives?.map((data, index) => (
                                                                                    <div className={`${style.mdReportCard} ${index % 2 === 0 ? style.mdCardAlternateBackground : ''} ${style.marginTop20}`} key={index}>
                                                                                        <div className={style.spaceBetween}>
                                                                                            <div className={style.mdTitle}><span className={style.mdTitle}>{`${index + 1}. `}</span>{data?.title}</div>
                                                                                            <div className={style.mdId}>{data?.mdID}</div>
                                                                                        </div>
                                                                                        <div className={`${style.mdDesc} ${style.marginTop}`}
                                                                                            dangerouslySetInnerHTML={{ __html: data?.description || "" }}
                                                                                        />
                                                                                        <div className={`${style.grid2} ${style.marginTop}`}>
                                                                                            <div>
                                                                                                <div className={style.mdGrid}>
                                                                                                    <div className={style.mdLabel}>Department:</div>
                                                                                                    <div className={style.mdValue}>{data?.sites?.[0]?.departments?.map(data => data?.name)?.join(', ')}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>First Published:</div>
                                                                                                    <div className={style.mdValue}>{data?.initialPublishedDate ? format(new Date(data?.initialPublishedDate), 'MMM dd, yyyy') : '-'}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>Author / Owner:</div>
                                                                                                    <div className={style.mdValue}>{(data?.authors || data?.authors?.length > 0) ? data?.authors?.map(author => `${author?.name?.firstName} ${author?.name?.lastName}`)?.join(', ') : '-'}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className={style.mdGrid}>
                                                                                                    <div className={style.mdLabel}>Division / Speciality:</div>
                                                                                                    <div className={style.mdValue}>{data?.sites?.[0]?.departments
                                                                                                        ?.filter(dept => dept?.serviceAreas?.length > 0)?.length > 0 ? data?.sites?.[0]?.departments
                                                                                                            ?.filter(dept => dept?.serviceAreas?.length > 0)
                                                                                                            ?.map(dept =>
                                                                                                                dept.serviceAreas
                                                                                                                    ?.map(sa => `${dept.name} - ${sa.name}`)
                                                                                                                    .join(", ")
                                                                                                            )
                                                                                                            .join(", ") : '-'}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>Last Revision:</div>
                                                                                                    <div className={style.mdValue}>{data?.lastRevisionDate ? format(new Date(data?.lastRevisionDate), 'MMM dd, yyyy') : '-'}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )) : (
                                                                                    <ReportNoDataBox heading={'You do not have any Retired Medical Directives'}
                                                                                        subHeading={''} />
                                                                                )
                                                                        ) : (reportType === "currentPolicyAndProcedures") ? (
                                                                            (currentPolicyAndProcedures?.length !== 0) ?
                                                                                currentPolicyAndProcedures?.map((data, index) => (
                                                                                    <div className={`${style.mdReportCard} ${index % 2 === 0 ? style.mdCardAlternateBackground : ''} ${style.marginTop20}`} key={index}>
                                                                                        <div className={style.spaceBetween}>
                                                                                            <div className={style.displayInRow}>

                                                                                                <div className={style.mdTitle}><span className={style.mdTitle}>{`${index + 1}. `}</span>{data?.title}</div>
                                                                                            </div>
                                                                                            <div className={style.mdId}>{data?.mdID}</div>
                                                                                        </div>
                                                                                        <div className={`${style.mdDesc} ${style.marginTop}`}
                                                                                            dangerouslySetInnerHTML={{ __html: data?.description || "" }}
                                                                                        />
                                                                                        <div className={`${style.grid2} ${style.marginTop}`}>
                                                                                            <div>
                                                                                                <div className={style.mdGrid}>
                                                                                                    <div className={style.mdLabel}>Department:</div>
                                                                                                    <div className={style.mdValue}>{data?.sites?.[0]?.departments?.map(data => data?.name)?.join(', ')}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>First Published:</div>
                                                                                                    <div className={style.mdValue}>{data?.initialPublishedDate ? format(new Date(data?.initialPublishedDate), 'MMM dd, yyyy') : '-'}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>Author / Owner:</div>
                                                                                                    <div className={style.mdValue}>{(data?.authors || data?.authors?.length > 0) ? data?.authors?.map(author => `${author?.name?.firstName} ${author?.name?.lastName}`)?.join(', ') : '-'}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className={style.mdGrid}>
                                                                                                    <div className={style.mdLabel}>Division / Speciality:</div>
                                                                                                    <div className={style.mdValue}>{data?.sites?.[0]?.departments
                                                                                                        ?.filter(dept => dept?.serviceAreas?.length > 0)?.length > 0 ? data?.sites?.[0]?.departments
                                                                                                            ?.filter(dept => dept?.serviceAreas?.length > 0)
                                                                                                            ?.map(dept =>
                                                                                                                dept.serviceAreas
                                                                                                                    ?.map(sa => `${sa.name} (${dept.name})`)
                                                                                                                    .join(", ")
                                                                                                            )
                                                                                                            .join(", ") : '-'}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>Last Revision:</div>
                                                                                                    <div className={style.mdValue}>{data?.lastRevisionDate ? format(new Date(data?.lastRevisionDate), 'MMM dd, yyyy') : 'Unknown'}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )) : (
                                                                                    <ReportNoDataBox heading={'You do not have any Current Policy And Procedures'}
                                                                                        subHeading={''} />
                                                                                )
                                                                        ) : (reportType === "retiredPolicyAndProcedures") ? (
                                                                            (retiredPolicyAndProcedures?.length !== 0) ?
                                                                                retiredPolicyAndProcedures?.map((data, index) => (
                                                                                    <div className={`${style.mdReportCard} ${index % 2 === 0 ? style.mdCardAlternateBackground : ''} ${style.marginTop20}`} key={index}>
                                                                                        <div className={style.spaceBetween}>
                                                                                            <div className={style.mdTitle}><span className={style.mdTitle}>{`${index + 1}. `}</span>{data?.title}</div>
                                                                                            <div className={style.mdId}>{data?.mdID}</div>
                                                                                        </div>
                                                                                        <div className={`${style.mdDesc} ${style.marginTop}`}
                                                                                            dangerouslySetInnerHTML={{ __html: data?.description || "" }}
                                                                                        />
                                                                                        <div className={`${style.grid2} ${style.marginTop}`}>
                                                                                            <div>
                                                                                                <div className={style.mdGrid}>
                                                                                                    <div className={style.mdLabel}>Department:</div>
                                                                                                    <div className={style.mdValue}>{data?.sites?.[0]?.departments?.map(data => data?.name)?.join(', ')}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>First Published:</div>
                                                                                                    <div className={style.mdValue}>{data?.initialPublishedDate ? format(new Date(data?.initialPublishedDate), 'MMM dd, yyyy') : '-'}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>Author / Owner:</div>
                                                                                                    <div className={style.mdValue}>{(data?.authors || data?.authors?.length > 0) ? data?.authors?.map(author => `${author?.name?.firstName} ${author?.name?.lastName}`)?.join(', ') : '-'}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <div className={style.mdGrid}>
                                                                                                    <div className={style.mdLabel}>Division / Speciality:</div>
                                                                                                    <div className={style.mdValue}>{data?.sites?.[0]?.departments
                                                                                                        ?.filter(dept => dept?.serviceAreas?.length > 0)?.length > 0 ? data?.sites?.[0]?.departments
                                                                                                            ?.filter(dept => dept?.serviceAreas?.length > 0)
                                                                                                            ?.map(dept =>
                                                                                                                dept.serviceAreas
                                                                                                                    ?.map(sa => `${dept.name} - ${sa.name}`)
                                                                                                                    .join(", ")
                                                                                                            )
                                                                                                            .join(", ") : '-'}</div>
                                                                                                </div>
                                                                                                <div className={`${style.mdGrid} ${style.marginTop}`}>
                                                                                                    <div className={style.mdLabel}>Last Revision:</div>
                                                                                                    <div className={style.mdValue}>{data?.lastRevisionDate ? format(new Date(data?.lastRevisionDate), 'MMM dd, yyyy') : '-'}</div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )) : (
                                                                                    <ReportNoDataBox heading={'You do not have any Retired Policy And Procedures'}
                                                                                        subHeading={''} />
                                                                                )
                                                                        ) : reportType === 'workflow' ?
                                                                            medicalDirectivesWorkflow?.length > 0 ? (
                                                                                <ReportsTable
                                                                                    tableType={``}
                                                                                    tableHeader={['MD Title', 'MD ID', 'Department / Division', 'Assigned To', dataToUseInReport?.selectedWorkflowLevel !== "All" ? dataToUseInReport?.selectedWorkflowLevel === '1' ? 'Acknowledged' : dataToUseInReport?.selectedWorkflowLevel === '2' ? 'Approved' : dataToUseInReport?.selectedWorkflowLevel === '3' ? 'Signed Off' : 'Acknowledged' : 'Progress']}
                                                                                    tableValue={medicalDirectivesWorkflow}
                                                                                    activitiesServicesValues={getMedicalDirectivesWorkflowValues()}
                                                                                    styleName={style.workflowGrid}
                                                                                />
                                                                            ) : (
                                                                                <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                    subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                            ) : reportType === 'upcomingForReview' ?
                                                                                upcomingForReview?.length > 0 ? (
                                                                                    <ReportsTable
                                                                                        tableType={``}
                                                                                        tableHeader={['MD Title', 'MD ID', 'Department / Division', 'Last Revision Date', 'Published Date']}
                                                                                        tableValue={upcomingForReview}
                                                                                        activitiesServicesValues={getMedicalDirectivesUpcomingForReview()}
                                                                                        styleName={style.workflowGrid}
                                                                                    />
                                                                                ) : (
                                                                                    <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                ) : reportType === 'medicalDirectivesTracker' ?
                                                                                    medicalDirectivesTracker?.length > 0 ? (
                                                                                        <ReportsTable
                                                                                            tableType={``}
                                                                                            tableHeader={dataToUseInReport?.tab === "medical_directive_tab" ? ['MD Title', 'MD ID', 'Department / Division', 'Attested Count', 'Not Attested Count'] :
                                                                                                dataToUseInReport?.tab === "applicant_tab" ? ['Staff Name', 'Email', 'Department / Division', 'Attested Count', 'Not Attested Count'] :
                                                                                                    ['Department Name', 'Divisions', 'Staff Count', 'MD Count', 'Attested Count', 'Not Attested Count']
                                                                                            }
                                                                                            tableValue={medicalDirectivesTracker}
                                                                                            activitiesServicesValues={getMedicalDirectivesTrackerValues()}
                                                                                            styleName={dataToUseInReport?.tab === "medical_directive_tab" ? style.workflowGrid :
                                                                                                dataToUseInReport?.tab === "applicant_tab" ? style.applicantGrid :
                                                                                                    style.departmentGrid
                                                                                            }
                                                                                        />
                                                                                    ) : (
                                                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                    ) : reportType === 'attestationOutstanding' ?
                                                                                        attestationOutstanding?.length > 0 ? (
                                                                                            <>
                                                                                                <div className={style.mdTitle}>Staffs Assigned To Attest</div>
                                                                                                <TableTwo
                                                                                                    tableHeaderValues={["Attestation Group", "Count", "Attested To All", "Not Attested To Any", "Some Attested", '',]}
                                                                                                    tableDataValues={getValues()}
                                                                                                    tableData={attestationOutstanding}
                                                                                                    gridStyle={style.outstandingGrid}
                                                                                                    actions={[]}
                                                                                                    // scrollStyle={style.scrollStyle}
                                                                                                    tableSortValues={[]}
                                                                                                    heading={"There are no Records to display"}
                                                                                                    // getHandleSort={getHandleSort}
                                                                                                    // sortValue={{ sortBy: sortValue, sortByField: sortField }}
                                                                                                    onClickFunction={() => { }}
                                                                                                    hidePagination={true}
                                                                                                    // getSelectedPage={getSelectedPage}
                                                                                                    // totalCount={totalTableCount}
                                                                                                    // page={page}
                                                                                                    // searchTermForTable={searchTermForTable}
                                                                                                    // searchCount={searchCount}
                                                                                                    // setSearchTermForTable={setSearchTermForTable}
                                                                                                    // onLimitChange={handleLimitChange}
                                                                                                    // checkedIds={checkedIds}
                                                                                                    // handleCheckboxClick={handleCheckboxClick}
                                                                                                    expandedList={expandedList}
                                                                                                />
                                                                                            </>
                                                                                        ) : (
                                                                                            <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                                subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                        ) : reportType === 'policyAndProceduresWorkflow' ?
                                                                                            policyAndProceduresWorkflow?.length > 0 ? (
                                                                                                <ReportsTable
                                                                                                    tableType={``}
                                                                                                    tableHeader={['P&P Title', 'P&P ID', 'Department / Division', 'Assigned To', dataToUseInReport?.selectedWorkflowLevel !== "All" ? dataToUseInReport?.selectedWorkflowLevel === '1' ? 'Acknowledged' : dataToUseInReport?.selectedWorkflowLevel === '2' ? 'Approved' : dataToUseInReport?.selectedWorkflowLevel === '3' ? 'Signed Off' : 'Acknowledged' : 'Progress']}
                                                                                                    tableValue={policyAndProceduresWorkflow}
                                                                                                    activitiesServicesValues={getPolicyAndProceduresWorkflowValues()}
                                                                                                    styleName={style.workflowGrid}
                                                                                                />
                                                                                            ) : (
                                                                                                <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                                    subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                            ) : reportType === 'policyAndProceduresUpcomingForReview' ?
                                                                                                policyAndProceduresUpcomingForReview?.length > 0 ? (
                                                                                                    <ReportsTable
                                                                                                        tableType={``}
                                                                                                        tableHeader={['P&P Title', 'P&P ID', 'Department / Division', 'Last Revision Date', 'Published Date']}
                                                                                                        tableValue={policyAndProceduresUpcomingForReview}
                                                                                                        activitiesServicesValues={getPolicyAndProceduresUpcomingForReview()}
                                                                                                        styleName={style.workflowGrid}
                                                                                                    />
                                                                                                ) : (
                                                                                                    <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                                ) : reportType === 'policyAndProceduresTracker' ?
                                                                                                    policyAndProceduresTracker?.length > 0 ? (
                                                                                                        <ReportsTable
                                                                                                            tableType={``}
                                                                                                            tableHeader={dataToUseInReport?.tab === "medical_directive_tab" ? ['MD Title', 'MD ID', 'Department / Division', 'Attested Count', 'Not Attested Count'] :
                                                                                                                dataToUseInReport?.tab === "applicant_tab" ? ['Staff Name', 'Email', 'Department / Division', 'Attested Count', 'Not Attested Count'] :
                                                                                                                    ['Department Name', 'Divisions', 'Staff Count', 'PNP Count', 'Attested Count', 'Not Attested Count']
                                                                                                            }
                                                                                                            tableValue={policyAndProceduresTracker}
                                                                                                            activitiesServicesValues={getPolicyAndProceduresTrackerValues()}
                                                                                                            styleName={dataToUseInReport?.tab === "medical_directive_tab" ? style.workflowGrid :
                                                                                                                dataToUseInReport?.tab === "applicant_tab" ? style.applicantGrid :
                                                                                                                    style.departmentGrid
                                                                                                            }
                                                                                                        />
                                                                                                    ) : (
                                                                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                                    ) : reportType === 'policyAndProceduresAttestationOutstanding' ?
                                                                                                        policyAndProceduresAttestationOutstanding?.length > 0 ? (
                                                                                                            <>
                                                                                                                <div className={style.mdTitle}>Staffs Assigned To Attest</div>
                                                                                                                <TableTwo
                                                                                                                    tableHeaderValues={["Attestation Group", "Count", "Attested To All", "Not Attested To Any", "Some Attested", '',]}
                                                                                                                    tableDataValues={getPolicyAndProceduresValues()}
                                                                                                                    tableData={policyAndProceduresAttestationOutstanding}
                                                                                                                    gridStyle={style.outstandingGrid}
                                                                                                                    actions={[]}
                                                                                                                    // scrollStyle={style.scrollStyle}
                                                                                                                    tableSortValues={[]}
                                                                                                                    heading={"There are no Records to display"}
                                                                                                                    // getHandleSort={getHandleSort}
                                                                                                                    // sortValue={{ sortBy: sortValue, sortByField: sortField }}
                                                                                                                    onClickFunction={() => { }}
                                                                                                                    hidePagination={true}
                                                                                                                    // getSelectedPage={getSelectedPage}
                                                                                                                    // totalCount={totalTableCount}
                                                                                                                    // page={page}
                                                                                                                    // searchTermForTable={searchTermForTable}
                                                                                                                    // searchCount={searchCount}
                                                                                                                    // setSearchTermForTable={setSearchTermForTable}
                                                                                                                    // onLimitChange={handleLimitChange}
                                                                                                                    // checkedIds={checkedIds}
                                                                                                                    // handleCheckboxClick={handleCheckboxClick}
                                                                                                                    expandedList={expandedList}
                                                                                                                />
                                                                                                            </>
                                                                                                        ) : (
                                                                                                            <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                                                subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                                        ) : (reportType === "contractDocumentsOnFile") ?
                                                                                                            contractDocumentsOnFileValues?.length !== 0 ? (
                                                                                                                <>
                                                                                                                    {contractDocumentsOnFileValues?.map((data, index) => (
                                                                                                                        <ReportsTable
                                                                                                                            tableType={`${data?.contractName?.contractName} - ${format(new Date(data?.contractDetail?.contractTerm?.startDate), 'MMM d, yyyy')} - ${format(new Date(data?.contractDetail?.contractTerm?.endDate), 'MMM d, yyyy')} (${dataToUseInReport?.contractStatus})`}
                                                                                                                            tableHeader={['Document Name', 'Document Type', 'Description', 'Uploaded By', 'Uploaded Date']}
                                                                                                                            tableValue={data?.contractDetail?.contractFiles}
                                                                                                                            activitiesServicesValues={getContractDocumentsOnFileValues(data)}
                                                                                                                            styleName={style.grid5}
                                                                                                                            clickable={true}
                                                                                                                            directionList={fileURL}
                                                                                                                        />
                                                                                                                    ))}
                                                                                                                </>
                                                                                                            ) : (
                                                                                                                <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                                                    subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                                            ) : (reportType === "multiProviderContractsList") ?
                                                                                                                multiProviderContractValues?.length !== 0 ? (
                                                                                                                    <>
                                                                                                                        {multiProviderContractValues?.map(data => (
                                                                                                                            <ReportsTable
                                                                                                                                tableType={`${data?.contract?.contractName?.contractName} - ${format(new Date(data?.contract?.contractDetail?.contractTerm?.startDate || new Date()), 'MMM d, yyyy')} - ${format(new Date(data?.contractDetail?.contractTerm?.endDate || new Date()), 'MMM d, yyyy')}  (${dataToUseInReport?.contractStatus})`}
                                                                                                                                tableHeader={['Service Provider Name', 'Service Provider Type', 'Cell Phone', 'Email', 'City', 'State']}
                                                                                                                                tableValue={data?.users}
                                                                                                                                activitiesServicesValues={getMultipleContractsListValues(data)}
                                                                                                                                styleName={style.multiProviderGrid}
                                                                                                                            />
                                                                                                                        ))}
                                                                                                                    </>
                                                                                                                ) : (
                                                                                                                    <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                                                        subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                                                ) : (reportType === "contractsWithABusinessEntity") ?
                                                                                                                    contractsWithBusinessEntityValues?.length !== 0 ? (
                                                                                                                        <>
                                                                                                                            <ReportsTable
                                                                                                                                tableType={`Contracts With A Business Entity  (${dataToUseInReport?.contractStatus})`}
                                                                                                                                tableHeader={['Contract Name', 'Contract Type', 'Business Entity', 'Address', 'City', 'State', 'Point Of Contact', 'Email']}
                                                                                                                                tableValue={contractsWithBusinessEntityValues}
                                                                                                                                activitiesServicesValues={getContractsWithBusinessEntityValues()}
                                                                                                                                styleName={style.grid8}
                                                                                                                            />
                                                                                                                        </>
                                                                                                                    ) : (
                                                                                                                        <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                                                            subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                                                    ) : (reportType === "currentRemitToAddressForActiveContracts") ?
                                                                                                                        currentRemitToAddressValues?.length !== 0 ? (
                                                                                                                            <>
                                                                                                                                <ReportsTable
                                                                                                                                    tableType={'Current Remit To Address For Active Contracts'}
                                                                                                                                    tableHeader={['Contract Name', 'Contract Type', 'Remit To Address', 'City', 'State', 'ZIP Code', 'Last Updated Date']}
                                                                                                                                    tableValue={currentRemitToAddressValues}
                                                                                                                                    activitiesServicesValues={getCurrentRemitToAddressForActiveContractsValues()}
                                                                                                                                    styleName={style.remitToAddressGrid}
                                                                                                                                />
                                                                                                                            </>
                                                                                                                        ) : (
                                                                                                                            <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                                                                subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                                                        ) : (reportType === "staffbyTypes") ? (
                                                                                                                            (staffValues?.length !== 0) ? (
                                                                                                                                <ReportsStaffTable
                                                                                                                                    tableData={staffValues}
                                                                                                                                />
                                                                                                                            ) : (
                                                                                                                                <ReportNoDataBox heading={'You do not have any One Time Contracts that will terminate on expiration'}
                                                                                                                                    subHeading={''} />
                                                                                                                            )) : (reportType === "locumStaffbyTypes") ? (
                                                                                                                                (locumStaffValues?.length !== 0) ? (
                                                                                                                                    <ReportsStaffTable
                                                                                                                                        tableData={locumStaffValues}
                                                                                                                                    />
                                                                                                                                ) : (
                                                                                                                                    <ReportNoDataBox heading={'You do not have any One Time Contracts that will terminate on expiration'}
                                                                                                                                        subHeading={''} />
                                                                                                                                )) : reportType === "paymentProcessingStatusTracker" ? (
                                                                                                                                    <>
                                                                                                                                        <div className={`${style.paymentTabGrid} ${style.marginTop20}`}>
                                                                                                                                            <div className={`${style.paymentTabStyle} ${selectedPaymentTab === 'Payment Processed' ? style.selectedPaymentTabStyle : ''} ${style.verticalAlignCenter} ${style.alignCenterJustify}`} onClick={() => setSelectedPaymentTab('Payment Processed')}>Payment Processed</div>
                                                                                                                                            <div className={`${style.paymentTabStyle} ${selectedPaymentTab === 'Payment Pending' ? style.selectedPaymentTabStyle : ''} ${style.verticalAlignCenter} ${style.alignCenterJustify}`} onClick={() => setSelectedPaymentTab('Payment Pending')}>Payment Pending</div>
                                                                                                                                            <div className={`${style.paymentTabStyle} ${selectedPaymentTab === 'Approval Pending' ? style.selectedPaymentTabStyle : ''} ${style.verticalAlignCenter} ${style.alignCenterJustify}`} onClick={() => setSelectedPaymentTab('Approval Pending')}>Approval Pending </div>
                                                                                                                                            <div className={`${style.paymentTabStyle} ${selectedPaymentTab === 'Submission Pending' ? style.selectedPaymentTabStyle : ''} ${style.verticalAlignCenter} ${style.alignCenterJustify}`} onClick={() => setSelectedPaymentTab('Submission Pending')}>Submission Pending</div>
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
                                                                                                                                                <ReportNoDataBox heading={'Based on the parameters selected and applied, there were NO RECORDS found to include in the report.'}
                                                                                                                                                    subHeading={'Try again by changing some of the parameters on the left. If there are any qualifying records, the report will get displayed.'} />
                                                                                                                                            </div>
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
        </div>
    )
}

export default ReportTypeOverview;
