import React, { createRef, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Intent, Dialog, Classes } from '@blueprintjs/core';
import Reject from './../../images/reject-report.png';
import SideBar from '../../Components/Sidebar';
import Popover from '@mui/material/Popover';
import TemplateIcon from './../../images/templateIcon.png';
import DoctorAnime from './../../images/doctorAnime.png';
import style from './index.module.scss';
import { Link, useParams } from 'react-router-dom';
import { DELETE, GET, POST } from '../dataSaver';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { currentUser } from '../../utils/auth';
import { corsUrl, formatFirstNameLastName, siteTimeZone } from '../../utils/formatting';
import ReportNoDataBox from '../../Components/ReusableSmallComponents/reportNoDataBox';
import TileApplication from '../../Components/TileApplication';
import TableTwo from '../../Components/TableDesignTwo';
import FileDisplayDialog from '../../Components/fileDisplayDialog';
import CommonSearchField from '../../Components/CommonFields/CommonSearchField';
import { SuccessToaster2 } from '../../utils/toaster';

export const Run = ({ link }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };


    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div onMouseEnter={(e) => handleClick(e)} onMouseLeave={() => handleClose()} aria-owns={open ? 'mouse-over-popover' : undefined}
            aria-haspopup="true">
            <div className={`${style.reportStyle} ${style.blueCard} ${style.cursorPointer}`}>Run</div>
            <Popover
                id={'mouse-over-popover'}
                sx={{
                    pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                disableRestoreFocus
            >
                <div className={style.popoverStyle}>Click to Generate this Report</div>
            </Popover>
        </div>
    )
}

const TimeSheetReports = ({ getShowSampleReport }) => {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('REPORTINGTEMPLATES');
    const [selectedTopTab, setSelectedTopTab] = useState('');
    const [tabName, setTabName] = useState('Standard Report Templates');
    const { reportType } = useParams();
    const [myReports, setMyReports] = useState([]);
    const [savedReports, setSavedReports] = useState([]);
    const [standardTemplates, setStandardTemplates] = useState([]);
    const currentUserDetails = currentUser();
    const [isExpanded, setIsExpanded] = useState(true);
    const myReportsHeaderValues = ["Report Title", "Schedule", "Saved Parameters", "Last Updated", "Action"];
    const reportingTemplateHeaderValues = ["Report Template Title", "Type", "Last Run by", "Last Run Date/ Time", "Last Updated by", "Last Updated", "Action"];
    const savedReportsHeaderValues = ["Saved Report", "Reporting Period", "Saved On", "Action"];
    const [sortField, setSortField] = useState("DEFAULT");
    const [sortValue, setSortValue] = useState("DESCENDING");
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [limit, setLimit] = useState(9999);
    const [selectedFile, setselectedFile] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [showFileDisplayDialog, setShowFileDisplayDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedReport, setSelectedReport] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const myReportsColSortValues = [false, false, false, false, false];
    const reportingTemplateColSortValues = [false, false, false, false, false, false, false, false, false];
    const savedReportsColSortValues = [false, false, false, false, false, false, false, false, false, false];

    let tableHeaderValues =
        selectedTab === "MYREPORTS"
            ? myReportsHeaderValues
            : selectedTab === "REPORTINGTEMPLATES"
                ? reportingTemplateHeaderValues
                : selectedTab === "SAVEDREPORTOUTPUTS"
                    ? savedReportsHeaderValues
                    : myReportsHeaderValues
    let tableSortValues =
        selectedTab === "MYREPORTS"
            ? myReportsColSortValues
            : selectedTab === "REPORTINGTEMPLATES"
                ? reportingTemplateColSortValues
                : selectedTab === "SAVEDREPORTOUTPUTS"
                    ? savedReportsColSortValues
                    : myReportsColSortValues
    // let tableDataValues = selectedTab !== 'applicantsToProcess' ? getApplicantValues() : selectedTab === 'level-1' ? getApplicationValues() : selectedTab === 'level-1' ? getApplicationValues() : getApplicationValues();

    useEffect(() => {
        if (searchTerm.trim() === "") {
            setSearchData([]); // Clear results if input is empty
            return;
        }

        const controller = new AbortController(); // Create an AbortController instance
        const signal = controller.signal;

        getUserDataSearch(signal); // Call API function with signal

        return () => controller.abort(); // Cleanup: Cancel previous request if a new one starts
    }, [searchTerm]);

    useEffect(() => {
        getUserList()
    }, [])

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const onSearchClickFunc = (data) => {
        setSelectedUsers((prevList) => {
            if (!prevList?.map(data => data?.id)?.includes(data?.id)) {
                return [...prevList, data];
            }
            return prevList;
        });
    }

    const handleRemoveFromList = (id) => {
        setSelectedUsers((prevList) => {
            if (prevList?.map(data => data?.id)?.includes(id)) {
                return prevList?.filter(item => item?.id !== id);
            }
        });
    };

    const getUserList = async () => {
        const { data: users } = await GET(`user-management-service/user`);
        setSearchData(users?.map(item => ({
            id: item.id,
            name: `${formatFirstNameLastName(item?.name?.firstName, item?.name?.lastName)}` || " ",
            desc: `${item?.title?.title || ''}`,
            profilePic: item?.profilePic?.file?.fileURL,
            mailId: item?.email?.officialEmail
        })));
    }

    const getUserDataSearch = async (signal) => {
        try {
            let response;

            response = await GET(
                `user-management-service/user?searchText=${searchTerm}`, { signal }
            );
            console.log("Application data", response?.data);
            setSearchData(response?.data?.map(item => ({
                id: item.id,
                name: `${formatFirstNameLastName(item?.name?.firstName, item?.name?.lastName)}` || " ",
                desc: `${item?.title?.title || ''}`,
                profilePic: item?.profilePic?.file?.fileURL,
                mailId: item?.email?.officialEmail
            })));

            return response?.data?.applications || [];
        } catch (error) {
            console.error("Error fetching applications:", error);
            return [];
        }
    };


    const onClickRunReport = (data) => {
        navigate(`/reportTypeOverview/${routeList[data?.subCategory]}`);
    }

    const onClickMyReport = (data) => {
        showMyReport(data)
    }

    const onClickDownloadReport = async (data) => {
        const uniqueFileName = `SavedReport_${Date.now()}.pdf`;
        try {
            const proxyUrl = `${corsUrl}${encodeURIComponent(data?.savedReport?.reportDoc?.fileURL)}`;

            const response = await fetch(proxyUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = uniqueFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url); // cleanup
        } catch (err) {
            console.error("Download failed:", err);
        }
    }

    const handleShare = async () => {
        setShowShareDialog(false)
        let data = {
            mailIds: selectedUsers?.map(data => data?.mailId),
            savedReportIds: [selectedReport?.id],
            category: selectedReport?.savedReport?.category,
            type: selectedReport?.savedReport?.type,
        }
        const formData = new FormData();
        formData.append('sharingDetails', new Blob([JSON.stringify(data)], {
            type: "application/json"
        }));
        try {
            const response = await POST(`application-management-service/report/shareReports/`, formData);
            console.log(response?.data);
            SuccessToaster2('Report Output Shared Successfully!')
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    const onClickPrintPDF = (data) => {
        const printWindow = window.open(`${corsUrl}${encodeURIComponent(data?.savedReport?.reportDoc?.fileURL)}`, "_blank");
        if (printWindow) {
            printWindow.focus();

            // Wait until PDF is fully loaded before calling print
            printWindow.onload = () => {
                printWindow.print();
            };
        } else {
            alert("Popup blocked! Please allow popups for this site.");
        }
    };

    const onClickSharePDF = (data) => {
        setSelectedReport(data);
        setShowShareDialog(true);
    }

    const onClickDeleteReport = async (data) => {
        await DELETE(`application-management-service/report/savedReport/${data?.id}`)
            .then((response) => {
                getSavedReports();
            })
    }

    const onClickViewReport = (data) => {
        setselectedFile(data?.savedReport?.reportDoc);
        setShowFileDisplayDialog(true);
    }

    let savedReportsActions = [{
        data: "View",
        requiredValue: "boolean",
        onClick: onClickViewReport,
    }, {
        data: "Delete",
        requiredValue: "boolean",
        onClick: onClickDeleteReport,
    }, {
        data: "Download",
        requiredValue: "boolean",
        onClick: onClickDownloadReport,
    }, {
        data: "Print",
        requiredValue: "boolean",
        onClick: onClickPrintPDF,
    }, {
        data: "Share",
        requiredValue: "boolean",
        onClick: onClickSharePDF,
    }]
    let reportingTemplatesActions = [{
        data: "Run",
        requiredValue: "boolean",
        onClick: onClickRunReport,
    }]
    let myReportsActions = [{
        data: "Run",
        requiredValue: "boolean",
        onClick: onClickMyReport,
    }]
    let actions = selectedTab === "MYREPORTS"
        ? myReportsActions
        : selectedTab === "REPORTINGTEMPLATES"
            ? reportingTemplatesActions
            : selectedTab === "SAVEDREPORTOUTPUTS"
                ? savedReportsActions
                : myReportsActions
    let gridStyle =
        selectedTab === "MYREPORTS"
            ? style.myReportsGrid
            : selectedTab === "REPORTINGTEMPLATES"
                ? style.reportingTemplatesGrid
                : selectedTab === "SAVEDREPORTOUTPUTS"
                    ? style.savedReportOutputsGrid
                    : style.myReportsGrid
    const PDFRef = createRef();
    const componentRef = useRef(null);

    const availableParentList = {
        allStaffMembers: 'All Staff Members',
        permanentStaff: 'Permanent Staff',
        locumStaff: 'Locum Staff',
        allApplications: 'All Applications',
        newApplicants: 'New Applicants',
        staffReappointments: 'Reappointments',
        locumExtensionOrRenewal: 'Locum Extension / Renewal',
        savedReportsArchive: 'Saved Reports Archive'
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
        locumExtensionOrRenewal: 'LOCUM_EXTENSION_OR_RENEWAL'
    }

    const routeList = {
        ACTIVITES_SERVICES_LOG_SUMMARY: 'activitiesOrServices',
        ADDON_ACTIVITES_SERVICES_LOG_SUMMARY: 'addOnActivities',
        // key: 'scheduledActivity',
        UPCOMING_CONTRACT_RENEWALS: 'staffReappointmentsNotes',
        ONE_TIME_CONTRACT: 'staffReappointments',
        // key: 'complianceStatus',
        PAID_CONSULTING_HOURS_BILLING_PRODUCTIVITY_INDEX_BY_CONTRACTOR: 'paidConsultingHours',
        // key: 'scheduledActivityByContract',
        PAYMENT_PROCESSING_SUMMARY: 'paymentsProcessingSummary',
        COST_REPORT_FOR_CONTRACTED_SERVICES_PERFORMED: 'compensationCostAnalysis',
        TIME_AND_PAYEMENT_LOG_FOR_CONTRACTED_SERVICES: 'timeAndPaymentLog',
        SITE_DEPARTMENT_SPECIFIC_CONTRACTOR_SUMMARY: 'siteDepartmentSpecificContractorSummary',
        TIMESHEET_PROCESSING_SUMMARY: 'timesheetProcessingSummary',
        LISTING_OF_TIMESHEETS_NOTPAID: 'listingOfTimesheetsNotPaid',
        SUBMITTED_TIMESHEETS_PAYMENT_STATUS: 'staffReappointmentTracker',
        CURRENT_REMIT_TO_ADDRESS: 'currentRemitToAddressForActiveContracts',
        CONTRACT_DOCUMENT_ON_FILE: 'contractDocumentsOnFile',
        CONTRACT_WITH_BUSINESS_ENTITY: 'contractsWithABusinessEntity',
        MULTI_PROVIDER_CONTRACT: 'multiProviderContractsList',
        PROOF_OF_DOCUMENTATION_COMPLIANCE_FOR_CONTRACT_BASED_REQUIREMENTS: 'nonCompliant',
        ACTIVITY_STATUS_TRACKER: 'activityStatusTracker',
        PAYMENT_TRACKER: 'paymentProcessingStatusTracker',
        SUBMITTED_APPLICATIONS_REVIEW_SUMMARY: 'submittedApplicationsReviewSummary',
        DETAILED_PRIVILEGED_STAFF_SUMMARY: 'detailedPrivilegedStaffSummary',
        OHIP_BILLING_NUMBERS_BY_CARE_PROVIDER: 'ohipBillingNumbersByCareProvider',
        PRIVILEGED_STAFF_SUMMARY: 'privilegedStaffSummary',
        CURRENT_NOTES_SUMMARY: 'currentNotesSummary',
        STAFF_REAPPOINTMENT_STATUS_SUMMARY: 'staffReappointmentStatusSummary',
        REAPPOINTMENT_APPLICATIONS_NOT_YET_STARTED_SUMMARY: 'reappointmentApplicationNotStarted',
        LOCUM_RENEWAL_OR_EXTENSION_APPLICATIONS_SUMMARY: 'locumRenewalOrExtensionApplicationsSummary',
        DECLINED_OR_NOT_RENEWED_STAFF_SUMMARY: 'declinedOrNotRenewedStaffSummary',
        CARE_PROVIDER_CAREER_MILESTONE_SUMMARY: 'careProviderCareerMilestoneSummary',
        CARE_PROVIDERS_SUMMARY: 'careProvidersSummary'
    }
    const descriptionList = {
        ACTIVITES_SERVICES_LOG_SUMMARY: 'Activities/ Services Log Status Summary',
        ADDON_ACTIVITES_SERVICES_LOG_SUMMARY: 'Add On Activities/ Services Requests Status Summary',
        // key: 'Scheduled Activity/ Services - forcasted to actual',
        UPCOMING_CONTRACT_RENEWALS: 'Upcoming Contract Renewals',
        ONE_TIME_CONTRACT: 'List of One Time Contracts that will Terminate on Expiration',
        // key: 'Contract Based Proof of Documentation Compliance Status Summary',
        PAID_CONSULTING_HOURS_BILLING_PRODUCTIVITY_INDEX_BY_CONTRACTOR: 'Paid Consulting Hours & Billing Productivity Index by Contractor',
        // key: 'Scheduled Activity/ Services - forecasted to actual by contract',
        PAYMENT_PROCESSING_SUMMARY: 'Payments Processing Summary',
        COST_REPORT_FOR_CONTRACTED_SERVICES_PERFORMED: 'Cost Report for Contracted Services Performed',
        TIME_AND_PAYEMENT_LOG_FOR_CONTRACTED_SERVICES: 'Time and Payment Log for Contracted Services',
        SITE_DEPARTMENT_SPECIFIC_CONTRACTOR_SUMMARY: 'Site/ Department Specific Contractor Summary Statistics',
        TIMESHEET_PROCESSING_SUMMARY: 'Timesheet Processing Summary',
        LISTING_OF_TIMESHEETS_NOTPAID: 'Listing Of Timesheets Not Paid',
        SUBMITTED_TIMESHEETS_PAYMENT_STATUS: 'Submitted Timesheets Payment Status',
        CURRENT_REMIT_TO_ADDRESS: 'Current Remit To Address For Active Contracts',
        CONTRACT_DOCUMENT_ON_FILE: 'Contract Documents On File',
        CONTRACT_WITH_BUSINESS_ENTITY: 'Contracts With A Business Entity',
        MULTI_PROVIDER_CONTRACT: 'Multi Provider Contracts List',
        PROOF_OF_DOCUMENTATION_COMPLIANCE_FOR_CONTRACT_BASED_REQUIREMENTS: 'Proof of documentation compliance for contract based requirments',
        ACTIVITY_STATUS_TRACKER: `Status Of Activities/ Services By Service Provider For ${format(new Date(), 'MMMM yyyy')}`,
        PAYMENT_TRACKER: 'Payment Processing Status By Service Provider',
        SUBMITTED_APPLICATIONS_REVIEW_SUMMARY: 'submittedApplicationsReviewSummary',
        STAFF_REAPPOINTMENT_STATUS_SUMMARY: 'staffReappointmentStatusSummary'
    }

    const titleList = {
        ACTIVITES_SERVICES_LOG_SUMMARY: 'Activities/ Services Log Status Summary',
        ADDON_ACTIVITES_SERVICES_LOG_SUMMARY: 'Add On Activities/ Services Requests Status Summary',
        // key: 'Scheduled Activity/ Services - forcasted to actual',
        UPCOMING_CONTRACT_RENEWALS: 'Upcoming Contract Renewals',
        ONE_TIME_CONTRACT: 'List of One Time Contracts that will Terminate on Expiration',
        // key: 'Contract Based Proof of Documentation Compliance Status Summary',
        // key: 'Paid Consulting Hours & Billing Productivity Index by Contractor',
        // key: 'Scheduled Activity/ Services - forecasted to actual by contract',
        PAYMENT_PROCESSING_SUMMARY: 'Payments Processing Summary',
        COST_REPORT_FOR_CONTRACTED_SERVICES_PERFORMED: 'Cost Report for Contracted Services Performed',
        TIME_AND_PAYEMENT_LOG_FOR_CONTRACTED_SERVICES: 'Time and Payment Log for Contracted Services',
        SITE_DEPARTMENT_SPECIFIC_CONTRACTOR_SUMMARY: 'Site/ Department Specific Contractor Summary Statistics',
        TIMESHEET_PROCESSING_SUMMARY: 'Timesheet Processing Summary',
        LISTING_OF_TIMESHEETS_NOTPAID: 'Listing Of Timesheets Not Paid',
        SUBMITTED_TIMESHEETS_PAYMENT_STATUS: 'Submitted Timesheets Payment Status',
        CURRENT_REMIT_TO_ADDRESS: 'Current Remit To Address For Active Contracts',
        CONTRACT_DOCUMENT_ON_FILE: 'Contract Documents On File',
        CONTRACT_WITH_BUSINESS_ENTITY: 'Contracts With A Business Entity',
        MULTI_PROVIDER_CONTRACT: 'Multi Provider Contracts List',
        PROOF_OF_DOCUMENTATION_COMPLIANCE_FOR_CONTRACT_BASED_REQUIREMENTS: 'Proof of documentation compliance for contract based requirments',
        ACTIVITY_STATUS_TRACKER: `Status Of Activities/ Services By Service Provider For ${format(new Date(), 'MMMM yyyy')}`,
        PAYMENT_TRACKER: 'Payment Processing Status By Service Provider',
        SUBMITTED_APPLICATIONS_REVIEW_SUMMARY: 'Submitted Applications Review Summary',
        STAFF_REAPPOINTMENT_STATUS_SUMMARY: 'Staff Reappointment Status Summary'
    }

    const typeList = {
        'activitiesOrServices': 'ACTIVITES_SERVICES_LOG_SUMMARY',
        'addOnActivities': 'ADDON_ACTIVITES_SERVICES_LOG_SUMMARY',
        'scheduledActivity': '',
        'staffReappointmentsNotes': 'UPCOMING_CONTRACT_RENEWALS',
        'staffReappointments': 'ONE_TIME_CONTRACT',
        'complianceStatus': '',
        'nonCompliant': '',
        'paidConsultingHours': '',
        'scheduledActivityByContract': '',
        'paymentsProcessingSummary': 'PAYMENT_PROCESSING_SUMMARY',
        'compensationCostAnalysis': 'COST_REPORT_FOR_CONTRACTED_SERVICES_PERFORMED',
        'timeAndPaymentLog': 'TIME_AND_PAYEMENT_LOG_FOR_CONTRACTED_SERVICES',
        'siteDepartmentSpecificContractorSummary': 'SITE_DEPARTMENT_SPECIFIC_CONTRACTOR_SUMMARY',
        'timesheetProcessingSummary': 'TIMESHEET_PROCESSING_SUMMARY',
        'listingOfTimesheetsNotPaid': 'LISTING_OF_TIMESHEETS_NOTPAID',
        'staffReappointmentTracker': 'SUBMITTED_TIMESHEETS_PAYMENT_STATUS',
        'contractDocumentsOnFile': 'CONTRACT_DOCUMENT_ON_FILE',
        'contractsWithABusinessEntity': 'CONTRACT_WITH_BUSINESS_ENTITY',
        'multiProviderContractsList': 'MULTI_PROVIDER_CONTRACT',
        'currentRemitToAddressForActiveContracts': 'CURRENT_REMIT_TO_ADDRESS',
        'activityStatusTracker': 'ACTIVITY_STATUS_TRACKER',
        'paymentProcessingStatusTracker': 'PAYMENT_TRACKER',
        'submittedApplicationsReviewSummary': 'SUBMITTED_APPLICATIONS_REVIEW_SUMMARY',
        'ohipBillingNumbersByCareProvider': 'OHIP_BILLING_NUMBERS_BY_CARE_PROVIDER',
        'reappointmentApplicationNotStarted': 'REAPPOINTMENT_APPLICATIONS_NOT_YET_STARTED_SUMMARY',
        'privilegedStaffSummary': 'PRIVILEGED_STAFF_SUMMARY',
        'currentNotesSummary': 'CURRENT_NOTES_SUMMARY',
        'staffReappointmentStatusSummary': 'STAFF_REAPPOINTMENT_STATUS_SUMMARY',
        'locumRenewalOrExtensionApplicationsSummary': 'DECLINED_OR_NOT_RENEWED_STAFF_SUMMARY',
        'careProviderCareerMilestoneSummary': 'CARE_PROVIDER_CAREER_MILESTONE_SUMMARY',
        'declinedOrNotRenewedStaffSummary': 'DECLINED_OR_NOT_RENEWED_STAFF_SUMMARY'
    }

    const availableScheduleValue = {
        ONETIME: 'One Time',
        EVERYWEEKDAY: 'Every Weekday',
        WEEKLY: 'Weekly',
        MONTHLY: 'Monthly',
        QUARTELY: 'Quaterly',
        ANNUALY: 'Annually'
    }

    const filterLabels = {
        departmentSpecialties: "Department",
        positionType: "Position",
        applicationCreationType: "Application Type",
        applicantTypeId: "Staff Type",
        privilegingCategoryId: "Privilege Category",
        startDate: "Reporting Time Period", // represents start + end together
    };

    useEffect(() => {
        sessionStorage.removeItem('reportFilter');
        sessionStorage.removeItem('myReportContent');
        sessionStorage.removeItem('myReportId');
    }, [])

    const showMyReport = (data) => {
        let reportURL = routeList[data?.report?.type];
        sessionStorage.setItem('reportFilter', JSON.stringify(data?.report?.filters));
        sessionStorage.setItem('myReportContent', JSON.stringify(data?.report));
        sessionStorage.setItem('myReportId', data?.id);
        navigate(`/myReport/${reportURL}`);
    };

    // const getMyReportURL = (value) => {
    //     if (value === 'ACTIVITES_SERVICES_LOG_SUMMARY') {
    //         return 'activitiesOrServices';
    //     } else if (value === 'ADDON_ACTIVITES_SERVICES_LOG_SUMMARY') {
    //         return 'addOnActivities';
    //     } else if (value === 'PAYMENT_PROCESSING_SUMMARY') {
    //         return 'paymentsProcessingSummary';
    //     } else {
    //         return '';
    //     }
    // }

    useEffect(() => {
        getMyReports();
        getSavedReports();
        getStandardTemplates();
    }, [selectedTab, reportType])

    const getFilterSummary = (filters) => {
        let count = 0;
        const labels = [];

        // Special handling for startDate + endDate
        if (filters.startDate && filters.endDate) {
            count += 1;
            labels.push(filterLabels.startDate);
        }

        const excludeKeys = ["startDate", "endDate", "applicationCurrentLevel"];

        for (const [key, value] of Object.entries(filters)) {
            if (excludeKeys.includes(key)) continue;

            const hasValue = Array.isArray(value)
                ? value.length > 0
                : value !== null && value !== undefined && value !== "";

            if (hasValue && filterLabels[key]) {
                count += 1;
                labels.push(filterLabels[key]);
            }
        }

        return {
            count,
            labels
        };
    }

    const getMyReports = async () => {
        setIsLoading(true)
        const { data: myReport } = await GET(`application-management-service/report/myReport?userId=${currentUserDetails?.id}&category=${availableCategories[reportType]}`);
        setMyReports(myReport);
        setIsLoading(false)
    }

    console.log(myReports)

    const getSavedReports = async () => {
        setIsLoading(true)
        const { data: savedReport } = await GET(`application-management-service/report/savedReport?userId=${currentUserDetails?.id}&category=${availableCategories[reportType]}`);
        setSavedReports(savedReport);
        setIsLoading(false)
    }

    const getSelectedTab = (value) => {
        setSelectedTab(value);
    }

    const getStandardTemplates = async () => {
        setIsLoading(true)
        const { data: standardTemplates } = await GET(`application-management-service/report/standardTemplates?userId=${currentUserDetails?.id}&category=${availableCategories[reportType]}`);
        setStandardTemplates(standardTemplates);
        setIsLoading(false)
    }

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    }

    const getIsShowFileDialog = (value) => {
        setShowFileDisplayDialog(value);
    }

    const getMyReportsValues = () => {
        const title = [];
        const titleHover = [];
        const schedule = [];
        const savedParams = [];
        const savedParamHoverText = [];
        const lastUpdated = [];
        const actions = [];
        myReports?.map((data, index) => {
            title.push(data?.report?.title);
            titleHover.push(data?.report?.description)
            schedule.push(availableScheduleValue[data?.report?.schedule?.schedule]);
            savedParams.push(getFilterSummary(data?.report?.filters)?.count);
            // const remindTooltipValue = reminderCount >= 0 ? (
            //     <div>
            //       <div>{reminderText}</div>
            //       <div>{reminderDates}</div>
            //     </div>
            //   ) : null;
            lastUpdated.push(data?.report?.lastUpdated ? format(new Date(data?.report?.lastUpdated), "MMM dd, yyyy") : '-');
            actions.push(true);
        });

        return [
            { type: "text", value: title, tooltipValueText: titleHover },
            { type: "text", value: schedule },
            { type: "text", value: savedParams },
            { type: "text", value: lastUpdated },
            { type: "action", value: actions },
        ];
    }

    const getReportingTemplatesValues = () => {
        const title = [];
        const titleHover = [];
        const type = [];
        const lastRunDateAndTime = [];
        const lastRunBy = [];
        const lastUpdated = [];
        const lastUpdatedBy = [];
        const actions = [];
        standardTemplates?.map((data, index) => {
            title.push(data?.title)
            titleHover.push(data?.description)
            type.push('Standard');
            lastRunBy.push(data?.lastRunBy?.name?.firstName);
            lastRunDateAndTime.push(data?.lastRun ? format(new Date(data?.lastRun), "MMM dd, yyyy hh:mm") : '-');
            lastUpdatedBy.push(data?.lastUpdatedBy?.name?.firstName);
            lastUpdated.push(data?.lastUpdate ? format(new Date(data?.lastUpdate), "MMM dd, yyyy") : '-');
            actions.push(true);
        });

        return [
            { type: "text", value: title, tooltipValueText: titleHover },
            { type: "text", value: type },
            { type: "text", value: lastRunBy },
            { type: "text", value: lastRunDateAndTime },
            { type: "text", value: lastUpdatedBy },
            { type: "text", value: lastUpdated },
            { type: "action", value: actions },
        ];
    }

    const getSavedReportOutputsValues = () => {
        const title = [];
        const titleHover = [];
        const period = [];
        const savedOn = [];
        const actions = [];
        savedReports?.map((data, index) => {
            title.push(data?.savedReport?.reportName)
            titleHover.push(data?.savedReport?.reportNotes)
            period.push(data?.report?.schedule?.schedule);
            savedOn.push(data?.savedReport?.runDate ? format(new Date(data?.savedReport?.runDate), "MMM dd, yyyy") : '-');
            actions.push(true);
        });

        return [
            { type: "text", value: title, tooltipValueText: titleHover },
            { type: "text", value: period },
            { type: "text", value: savedOn },
            { type: "action", value: actions },
        ];
    }

    let tableDataValues =
        selectedTab === "MYREPORTS"
            ? getMyReportsValues()
            : selectedTab === "REPORTINGTEMPLATES"
                ? getReportingTemplatesValues()
                : selectedTab === "SAVEDREPORTOUTPUTS"
                    ? getSavedReportOutputsValues()
                    : getMyReportsValues()

    let tableData =
        selectedTab === "MYREPORTS"
            ? myReports
            : selectedTab === "REPORTINGTEMPLATES"
                ? standardTemplates
                : selectedTab === "SAVEDREPORTOUTPUTS"
                    ? savedReports
                    : myReports

    const getSelectedPage = (value) => {
        setPage(value);
    }

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
    };

    const getHandleSort = (value, sortBy) => {
        if (sortBy === "ASCENDING") {
            setSortField(value);
            setSortValue("DESCENDING");
        } else if (sortBy === "DESCENDING") {
            setSortField("DEFAULT");
            setSortValue("ASCENDING");
        } else if (sortBy === "NONE") {
            setSortField(value);
            setSortValue("ASCENDING");
        }
    };

    console.log(tableDataValues, 'tableDataValues')
    return (
        <div className={style.margin20}>
            <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
                <div>
                    <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                        <div></div>
                    </SideBar>
                </div>
                {/* <div className={style.bigCardStyle}>
                    <div className={style.paginationCol}>
                        <div className={` ${style.titleStyle} ${style.margin20}`}>
                            {reportType === 'servicesOrActivities' ? 'Services / Activities Log Reports'
                                : reportType === 'timesheets' ? 'Timesheets'
                                    : reportType === 'reviewsAndApprovals' ? 'Reviews & Approval'
                                        : reportType === 'taskManagement' ? 'Task Management'
                                            : reportType === 'payments' ? 'Payments'
                                                : reportType === 'contractManagement' ? 'Contract Management'
                                                    : reportType === 'contractCompliance' ? 'Contract Compliance'
                                                        : reportType === 'contractPerformance' ? 'Contract Performance'
                                                            : reportType === 'systemAdministration' ? 'System Administration'
                                                                : ""}
                        </div>
                    </div>
                    <div className={style.reportsBorderStyle}></div>
                    <div className={`${style.reportsMargin20} ${style.spaceBetween} ${style.borderBottomReportsStyle}`}>
                        <div className={`${style.reportsTabWidth} ${tabName === "Standard Report Templates" && style.selectedReportsTab}`}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => setTabName('Standard Report Templates')}>
                                    <img src={TemplateIcon} alt="template" className={style.iconStyle} />
                                    <p className={`${style.taskFontStyle} ${tabName === "Standard Report Templates" && style.selectedStyle}`}>Standard Report Templates</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.reportsTabWidth} ${tabName === "My Reports" && style.selectedReportsTab} `}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => setTabName('My Reports')}>
                                    <img src={Reject} alt="reject" className={style.iconStyle} />
                                    <p className={`${style.taskFontStyle} ${tabName === "My Reports" && style.selectedStyle}`}>My Reports</p>
                                </div>
                            </div>
                        </div>
                        <div className={`${style.reportsTabWidth} ${tabName === "Saved Report Outputs" && style.selectedReportsTab}`}>
                            <div className={style.spaceBetween}>
                                <div className={`${style.displayInRow} ${style.cursorPointer}`} onClick={() => setTabName('Saved Report Outputs')}>
                                    <img src={Reject} alt="req" className={style.iconStyle} />
                                    <p className={`${style.taskFontStyle} ${tabName === "Saved Report Outputs" && style.selectedStyle}`}>Saved Report Outputs</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {tabName === "Standard Report Templates" ? (
                        <div className={`${style.marginLeft20} ${style.marginTop20}`}>
                            <div className={style.reportsTableGrid}>
                                <p className={style.headingStyle}>No.</p>
                                <p className={style.headingStyle}>Report Title</p>
                                <p className={style.headingStyle}>Description</p>
                                <p className={style.headingStyle}>Last Run Date/ Time</p>
                                <p className={style.headingStyle}>Last Updated</p>
                            </div>
                            <div className={style.scrollStyle}>
                                {standardTemplates?.map((data, index) => (
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`} key={index}>
                                        <div className={style.tableDataReportsFontStyle}>{index + 1}</div>
                                        <Link to={`/reportTypeOverview/${routeList[data?.subCategory]}`} className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>{titleList[data?.title]}</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>{descriptionList[data?.description]}</div>
                                        <div className={style.tableDataReportsFontStyle}>{data?.lastRun !== null ? formatInTimeZone(new Date(data?.lastRun), siteTimeZone(), 'd MMM yyyy HH:mm') : '-'} </div>
                                        <div className={style.tableDataReportsFontStyle}>{data?.lastUpdate !== null ? format(new Date(`${data?.lastUpdate}T00:00`), 'd MMM yyyy') : '-'}</div>
                                        <Link to={`/reportTypeOverview/${routeList[data?.subCategory]}`} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : tabName === "My Reports" ? (
                        <div className={`${style.marginLeft20} ${style.marginTop20}`}>
                            {myReports?.length !== 0 && (
                                <div className={style.timeSheetTableGrid}>
                                    <p className={style.headingStyle}>No.</p>
                                    <p className={style.headingStyle}>Report Title</p>
                                    <p className={style.headingStyle}>Description</p>
                                    <p className={style.headingStyle}>Last Run Date</p>
                                    <p className={style.headingStyle}>Schedule</p>
                                    <p className={style.headingStyle}>Owner</p>
                                    <p className={style.headingStyle}>Last Updated</p>
                                </div>
                            )}
                            <div className={style.scrollStyle}>
                                {myReports?.length !== 0 ? myReports?.map((data, index) => (
                                    <div className={`${style.timeSheetTableGrid} ${style.marginTop20}`} key={index}>
                                        <div className={style.tableDataReportsFontStyle}>{index + 1}</div>
                                        <div className={style.tableDataReportsFontStyle}>{data?.report?.title}</div>
                                        <div className={style.tableDataReportsFontStyle}>{data?.report?.description}</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(data?.report?.lastUpdated), 'd MMM yyyy')} </div>
                                        <div className={style.tableDataReportsFontStyle}>{getScheduleValue(data?.report?.schedule?.schedule)}</div>
                                        <div className={style.tableDataReportsFontStyle}>{`${data?.report?.owner?.name?.firstName} ${data?.report?.owner?.name?.lastName}`}</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(data?.report?.lastUpdated), 'd MMM yyyy')}</div>
                                        <div onClick={() => showMyReport(data)}>
                                            <Run />
                                        </div>
                                    </div>
                                )) : (
                                    <ReportNoDataBox heading={'There are no scheduled reports for you to run.'}
                                        subHeading={'Try again by scheduling the standard report'} />
                                )}
                            </div>
                        </div>
                    ) : tabName === "Saved Report Outputs" ? (
                        <div className={`${style.marginLeft20} ${style.marginTop20}`}>
                            {savedReports?.length !== 0 && (
                                <div className={style.savedReportTableGrid}>
                                    <p className={style.headingStyle}>No.</p>
                                    <p className={style.headingStyle}>Report Output Name</p>
                                    <p className={style.headingStyle}>Notes</p>
                                    <p className={style.headingStyle}>Run Date</p>
                                </div>
                            )}
                            <div className={style.scrollStyle}>
                                {savedReports?.length !== 0 ? savedReports?.map((data, index) => (
                                    <div className={`${style.savedReportTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>{index + 1}</div>
                                        <div className={style.tableDataReportsFontStyle}>{data?.savedReport?.reportName}</div>
                                        <div className={style.tableDataReportsFontStyle}>{data?.savedReport?.reportNotes}</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(data?.savedReport?.runDate), 'd MMM yyyy')}</div>
                                        <div className={`${style.reportStyle} ${style.redCard} ${style.cursorPointer}`}>Delete</div>
                                    </div>
                                )) : (
                                    <ReportNoDataBox heading={'There are no Saved reports for you to run.'}
                                        subHeading={'Try again by saving the standard report'} />
                                )}
                            </div>
                        </div>
                    ) : ''}
                </div> */}
                <div>
                    <div>
                        <div
                            className={`${style.spaceBetween} ${style.marginLeft30} `}
                        >
                            <div className={`${style.tabs}`}>
                                <TileApplication selectedTab={selectedTopTab} getSelectedTab={() => { }} tileLabel={`Reports Accross ${availableParentList[reportType]}`} currentTile="" />
                            </div>
                        </div>
                        <div className={`${style.borderStyleTiles} ${style.marginLeft30}`}></div>
                        <div
                            className={`${style.spaceBetween} ${style.marginLeft30} ${style.marginTop10} `}
                        >
                            <div className={`${style.tabs}`}>
                                <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="My Reports" tileCount={myReports?.length} currentTile="MYREPORTS" />
                                <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Reporting Templates" tileCount={standardTemplates?.length} currentTile="REPORTINGTEMPLATES" />
                                <TileApplication selectedTab={selectedTab} getSelectedTab={getSelectedTab} tileLabel="Saved Report Outputs" tileCount={savedReports?.length} currentTile="SAVEDREPORTOUTPUTS" />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.bigCardStyle}`}>
                        <div ref={componentRef}>
                            <div
                                className={`${style.reduceMarginTop10} ${style.margin20} staffApplicationList`}
                                ref={PDFRef}
                            >
                                {!isLoading && (
                                    <TableTwo
                                        tableHeaderValues={tableHeaderValues}
                                        tableDataValues={tableDataValues}
                                        tableData={tableData}
                                        gridStyle={gridStyle}
                                        actions={actions}
                                        scrollStyle={style.contractScrollStyle}
                                        tableSortValues={tableSortValues}
                                        heading={"There are no Record for you to manage"}
                                        onClickFunction={() => { }}
                                        getHandleSort={getHandleSort}
                                        sortValue={{ sortBy: sortValue, sortByField: sortField }}
                                        getSelectedPage={getSelectedPage}
                                        totalCount={totalCount}
                                        page={page}
                                        searchTermForTable={""}
                                        searchCount={0}
                                        setSearchTermForTable={() => { }}
                                        onLimitChange={handleLimitChange}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Dialog isOpen={showShareDialog} onClose={() => setShowShareDialog(false)} className={`${style.sendMailUserDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>Share This Report Output</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowShareDialog(false)} />
                    </div>
                    <div className={style.spaceBetween}>
                        <div></div>
                        <div className={style.displayInRow}>
                            {/* <p className={`${style.mailBoldText} ${style.marginTop20} ${style.blueText}`}>Registered Users</p>
                            <div className={`${style.taskCountStyle} ${style.marginTop20} ${style.marginLeft20}`}>20</div>
                            <p className={`${style.mailBoldText} ${style.marginTop20} ${style.externalRecipientsMarginLeft}`}>External Recipients</p>
                            <div className={style.deliveryCountStyle}>20</div> */}
                            <div className={style.marginTop10}>
                                <CommonSearchField searchTerm={searchTerm} setSearchTerm={setSearchTerm} onChange={handleSearch} searchData={searchData} handleShowForSearch={() => { }} isOnClickAvailable={true} onClickFunc={onSearchClickFunc} placeholder={"Search by Staff Name"} />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.extensionBorder} ${style.marginTop10}`}></div>
                    <div className={`${style.padding10}`}>
                        <div>
                            <div>
                                {selectedUsers?.map((data, index) => (
                                    <>
                                        <div className={`${style.userMailListGrid} ${style.padding10}  ${index !== 0 ? style.marginTop10 : ''}`}>
                                            <img src={data?.profilePic ? data?.profilePic : DoctorAnime} alt={'User Logo 1'} className={style.userLogoMailStyle} />
                                            <div>
                                                <p className={`${style.mailIdTextColor}`}>{`${data?.name}`}</p>
                                                <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>{`${data?.desc}`}</p>
                                            </div>
                                            <Icon icon="cross" className={`${style.marginTop10} ${style.cursorPointer}`} color="#2C2C2C" onClick={() => handleRemoveFromList(data?.id)} />
                                        </div>
                                        <div className={`${style.extensionBorder}`}></div>
                                    </>
                                ))}
                                {/* <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10}`}>
                                    <img src={UserLogo2} alt={'User Logo 2'} className={style.userLogoMailStyle} />
                                    <div>
                                        <p className={`${style.mailIdTextColor}`}>Kyle Wright, MD</p>
                                        <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                    </div>
                                    <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
                                </div>
                                <div className={`${style.extensionBorder} `}></div>
                                <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10} `}>
                                    <img src={UserLogo3} alt={'User Logo 3'} className={style.userLogoMailStyle} />
                                    <div>
                                        <p className={`${style.mailIdTextColor}`}>Mathew Bailey, MD</p>
                                        <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                    </div>
                                    <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
                                </div>
                                <div className={`${style.extensionBorder}`}></div>
                                <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10}`}>
                                    <img src={UserLogo4} alt={'User Logo 4'} className={style.userLogoMailStyle} />
                                    <div className={style.displayInRow}>
                                        <div>
                                            <p className={`${style.mailIdTextColor}`}>Ronnie Owens, MD</p>
                                            <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                        </div>
                                    </div>
                                    <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
                                </div>
                                <div className={`${style.extensionBorder}`}></div>*/}
                            </div>
                            <div>
                                <div className={`${style.justifyCenter} ${style.marginTop20}`}>
                                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} ${selectedUsers?.length === 0 ? style.disabledButton : ''}  `} onClick={selectedUsers?.length === 0 ? () => { } : () => handleShare()}>{'Share Now'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            {showFileDisplayDialog && (
                <FileDisplayDialog
                    getIsOpen={getIsShowFileDialog}
                    file={selectedFile}
                />
            )}
        </div >
    )
}

export default TimeSheetReports;
