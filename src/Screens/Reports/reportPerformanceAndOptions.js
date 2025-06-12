import React, { useEffect, useState } from 'react';
import { Icon, Intent, Dialog, Classes, TextArea } from '@blueprintjs/core';
import { TextField } from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DownloadingOutlinedIcon from '@mui/icons-material/DownloadingOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import html2pdf from "html2pdf.js";
import Popover from '@mui/material/Popover';
import { useParams } from 'react-router-dom';
import UserLogo1 from './../../images/userLogo3.png';
import UserLogo2 from './../../images/userLogo4.png';
import UserLogo3 from './../../images/userLogo5.png';
import UserLogo4 from './../../images/userLogo6.png';
import Search from './../../images/search.png';
import ReportsRefresh from './../../images/reportsRefresh.png';
import ReportsDownload from './../../images/reportsDownload.png';
import ReportsSchedule from './../../images/reportsSchedule.png';
import ReportsPrint from './../../images/reportsPrint.png';
import ReportsFullScreen from './../../images/reportsFullScreen.png';
import ReportsShare from './../../images/reportsShare.png';
import DoctorAnime from './../../images/doctorAnime.png';
import Info from './../../images/info.png';
import SaveReport from './saveReport';
import { format } from 'date-fns';

import style from './index.module.scss';
import { GET, POST } from '../dataSaver';
import CommonSearchField from '../../Components/CommonFields/CommonSearchField';
import { formatFirstNameLastName } from '../../utils/formatting';
import { SuccessToaster2 } from '../../utils/toaster';

const ReportPerformanceAndOptions = ({ handle, handlePrint, dataToUseInReport, refToUse, getIsDownloadClicked, isNoData, setIsFullScreenLoading }) => {
    const { reportType } = useParams();
    const [showSaveReportOutput, setShowSaveReportOutput] = useState(false);
    const [showReportRefreshingDialog, setShowReportRefreshingDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [showReportSavedDialog, setShowReportSavedDialog] = useState(false);
    const [showSaveReport, setShowSaveReport] = useState(false);
    const [anchorElRefresh, setAnchorElRefresh] = useState(null);
    const openRefresh = Boolean(anchorElRefresh);
    const [anchorElSchedule, setAnchorElSchedule] = useState(null);
    const openSchedule = Boolean(anchorElSchedule);
    const [anchorElSave, setAnchorElSave] = useState(null);
    const openSave = Boolean(anchorElSave);
    const [anchorElPrint, setAnchorElPrint] = useState(null);
    const openPrint = Boolean(anchorElPrint);
    const [anchorElDownload, setAnchorElDownload] = useState(null);
    const openDownload = Boolean(anchorElDownload);
    const [anchorElFullscreen, setAnchorElFullscreen] = useState(null);
    const openFullscreen = Boolean(anchorElFullscreen);
    const [anchorElInfo, setAnchorElInfo] = useState(null);
    const [reportName, setReportName] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const openInfo = Boolean(anchorElInfo);
    // const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const reportTitleList = {
        // staffReappointmentsNotes: 'Upcoming Contract Renewals',
        staffReappointmentsNotes: 'Staff Reappointments to Process',
        locumStaffRenewalNotes: 'Locum Staff Extensions Renewals To Review',
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
        nonCompliant: 'List of Contracts that are non compliant with proof of documentation requirement',
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
        activityStatusTracker: `Status Of Activities/ Services By Service Provider For ${format(new Date(), 'MMMM yyyy')}`,
        paymentProcessingStatusTracker: 'Payment Processing Status By Service Provider',
        submittedApplicationsReviewSummary: 'Submitted Applications Review Summary',
        ohipBillingNumbersByCareProvider: 'OHIP Billing Numbers By Care Provider',
        reappointmentApplicationNotStarted: 'Reappointment Application Not Yet Started Summary',
        privilegedStaffSummary: 'Privileged Staff Summary',
        currentNotesSummary: 'Current Notes Summary',
        staffReappointmentStatusSummary: 'Staff Reappointment Status Summary',
        locumRenewalOrExtensionApplicationsSummary: 'Locum Renewal / Extension Applications Summary',
        careProviderCareerMilestoneSummary: 'Care Providers Career Milestone Summary',
        declinedOrNotRenewedStaffSummary: 'Declined Or Not Renewed Staff Summary'
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
        declinedOrNotRenewedStaffSummary: 'LOCUM_EXTENSION_OR_RENEWAL'
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

    const availableApplicationTypes = {
        NEW: 'New Applicants',
        REAPPOINTMENT: 'Staff Reappointments',
        LOCUM_RENEWAL: 'Locum Renewals'
    }

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

    const getSaveReportDialog = (value) => {
        setShowSaveReport(value);
    }

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

    const handleDownload = (isShare) => {
        setIsFullScreenLoading(true)
        const uniqueFileName = `SavedReport_${Date.now()}.pdf`;
        setShowSaveReportOutput(false)
        setShowShareDialog(false)
        const element = refToUse.current;
        const opt = {
            margin: 0.5,
            filename: uniqueFileName,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                logging: true,
            },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
            pagebreak: { mode: [] },
        };

        html2pdf().set(opt).from(element).outputPdf("blob").then((pdfBlob) => {
            if (isShare) {
                handleShare(pdfBlob, uniqueFileName)
            } else {
                addSavedReport(pdfBlob, uniqueFileName)
            }
        });
    }

    const addSavedReport = async (pdfBlob, uniqueFileName) => {
        let userData = (sessionStorage.getItem('user') && sessionStorage.getItem('user') !== 'undefined') ? JSON.parse(sessionStorage.getItem('user')) : {}
        console.log(userData, 'userData')
        let data = {
            reportName: reportTitleList[reportType],
            reportNotes: reportDescription,
            runDate: new Date(),
            reportDoc: {
                fileName: uniqueFileName
            },
            category: availableCategories[reportType],
            type: typeList[reportType],
            owner: userData,
            filters: {
                'startDate': dataToUseInReport?.from,
                'endDate': dataToUseInReport?.to,
                'applicantTypeId': dataToUseInReport?.selectedStaffType?.[0] !== '' ? dataToUseInReport?.selectedStaffType : [],
                'departmentSpecialties': dataToUseInReport?.selectedDepartments?.[0] !== '' ? dataToUseInReport?.selectedDepartments : [],
                'privilegingCategoryId': dataToUseInReport?.selectedPrivilegeCategory !== '' ? dataToUseInReport?.selectedPrivilegeCategory : '',
                "positionType": dataToUseInReport?.selectedPosition !== "" ? [dataToUseInReport?.selectedPosition] : [],
                "applicationCreationType": dataToUseInReport?.selectedApplicationType !== "" ? [dataToUseInReport?.selectedApplicationType] : [],
                "applicationCurrentLevel": sessionStorage.getItem('workModeType'),
                "staffReappointmentStatus": dataToUseInReport?.selectedReappointmentStatus ? [dataToUseInReport?.selectedReappointmentStatus] : []
            },
            filterDisplayNames: [
                { name: 'Reporting Period used for this report', values: [`${dataToUseInReport?.fromToDisplay} - ${dataToUseInReport?.toToDisplay}`] },
                { name: 'Staff Type', values: [dataToUseInReport?.selectedStaffTypeToSend?.map(data => data?.applicantType).join(', ') || 'All Staff Type'] },
                { name: 'Departments', values: [dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'] },
                { name: 'Privilege Category', values: [dataToUseInReport?.selectedPrivilegeCategoryToSend?.map(data => data?.category).join(', ') || 'All Categories'] },
                { name: 'Position', values: dataToUseInReport?.selectedPosition !== "" ? [dataToUseInReport?.selectedPosition] : [] },
                { name: 'Application Type', values: [availableApplicationTypes[dataToUseInReport?.selectedApplicationType] || 'All Application Type'] },
                { name: 'Reappointment Status', values: [dataToUseInReport?.selectedReappointmentStatus || 'All Applications'] },
            ],
        }
        const formData = new FormData();
        if (pdfBlob !== null) {
            const blob = new Blob([pdfBlob], { type: `application/pdf` });
            formData.append('savedReport', new Blob([JSON.stringify(data)], {
                type: "application/json"
            }));
            formData.append('savedReportFile', blob, uniqueFileName);

            try {
                const response = await POST(`application-management-service/report/savedReport/`, formData);
                console.log(response?.data);
                setShowReportSavedDialog(true);
            } catch (error) {
                console.error(error);
                return null;
            }
        };
        setIsFullScreenLoading(false);
    }

    const handleShare = async (pdfBlob, uniqueFileName) => {
        let data = {
            mailIds: selectedUsers?.map(data => data?.mailId),
            savedReportIds: [],
            reportName: reportTitleList[reportType],
            file: {
                fileName: uniqueFileName
            },
            category: availableCategories[reportType],
            type: typeList[reportType],
            filterDisplayNames: [
                { name: 'Reporting Period used for this report', values: [`${dataToUseInReport?.fromToDisplay} - ${dataToUseInReport?.toToDisplay}`] },
                { name: 'Staff Type', values: [dataToUseInReport?.selectedStaffTypeToSend?.map(data => data?.applicantType).join(', ') || 'All Staff Type'] },
                { name: 'Departments', values: [dataToUseInReport?.selectedDepartmentsToSend?.map(data => data?.departmentName?.name).join(', ') || 'All Departments'] },
                { name: 'Privilege Category', values: [dataToUseInReport?.selectedPrivilegeCategoryToSend?.map(data => data?.category).join(', ') || 'All Categories'] },
                { name: 'Position', values: dataToUseInReport?.selectedPosition !== "" ? [dataToUseInReport?.selectedPosition] : [] },
                { name: 'Application Type', values: [availableApplicationTypes[dataToUseInReport?.selectedApplicationType] || 'All Application Type'] },
                { name: 'Reappointment Status', values: [dataToUseInReport?.selectedReappointmentStatus || 'All Applications'] },
            ],
        }
        const formData = new FormData();
        if (pdfBlob !== null) {
            const blob = new Blob([pdfBlob], { type: `application/pdf` });
            formData.append('sharingDetails', new Blob([JSON.stringify(data)], {
                type: "application/json"
            }));
            formData.append('document', blob, uniqueFileName);
            console.log(formData, blob, data, pdfBlob)
            try {
                const response = await POST(`application-management-service/report/shareReports/`, formData);
                console.log(response?.data);
                SuccessToaster2('Report Output Shared Successfully!')
            } catch (error) {
                console.error(error);
                return null;
            }
        };
        setIsFullScreenLoading(false);
    }

    console.log(searchData)


    return (
        <div>
            <div className={`${style.spaceBetween} ${style.alignCenter} ${style.IconHeaderBackgroundStyle} ${style.marginTop20}`}>
                <div className={`${style.displayInRow} ${style.cardPadding} ${style.alignCenter}`}>
                    <div className={style.reportTypeTextNotificationStyle}>
                        {reportTitleList[reportType]}
                    </div>
                    {/* <div onMouseEnter={(e) => setAnchorElInfo(e.currentTarget)} onMouseLeave={() => setAnchorElInfo(null)} aria-owns={openInfo ? 'mouse-over-popover' : undefined} aria-haspopup="true">
                        <img src={Info} className={`${style.infoStyle} ${style.marginTop5} ${style.marginLeft10}`} />
                        <Popover
                            id={'mouse-over-popover'}
                            sx={{
                                pointerEvents: 'none',
                            }}
                            open={openInfo}
                            anchorEl={anchorElInfo}
                            onClose={() => setAnchorElInfo(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            disableRestoreFocus
                        >
                            <div className={style.popoverStyle}>{reportTitleList[reportType]}</div>
                        </Popover>
                    </div> */}
                </div>
                <div className={` ${style.margin20}`}>
                    <div className={style.displayInRow}>
                        {/* <img src={Info} className={`${style.infoStyle} ${style.marginTop5}`} /> */}
                        {/* <div className={`${style.displayInRow} ${style.marginLeft20}`}>
                            <Icon icon="star" size={20} color="#FFCA27" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#FFCA27" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#FFCA27" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#D3D3D3" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#D3D3D3" className={style.marginLeft} />
                        </div> */}
                        <div className={`${style.iconPadding} ${style.cursorPointer} ${style.marginLeft20}`}
                            onMouseEnter={(e) => setAnchorElRefresh(e.currentTarget)} onMouseLeave={() => setAnchorElRefresh(null)} aria-owns={openRefresh ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <img src={ReportsRefresh} alt="" className={`${style.reportsActions} ${style.marginTop5}`} onClick={() => { setShowReportRefreshingDialog(true); window.location.reload() }} />
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openRefresh}
                                anchorEl={anchorElRefresh}
                                onClose={() => setAnchorElRefresh(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click To Refresh This Report</div>
                            </Popover>
                        </div>
                        {/* <div className={`${style.iconPadding} ${style.cursorPointer}`}>
                            <ShareOutlinedIcon style={{ color: "#2C2C2C" }} onClick={() => setShowShareDialog(true)} />
                        </div> */}
                        <div className={`${style.iconPadding} ${style.cursorPointer} ${isNoData && style.disabledCursor}`}
                            onMouseEnter={(e) => !isNoData ? setAnchorElSchedule(e.currentTarget) : {}} onMouseLeave={() => !isNoData ? setAnchorElSchedule(null) : {}} aria-owns={openSchedule ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <img src={ReportsShare} alt="" className={`${style.reportsActions} ${style.marginTop5}`} onClick={() => !isNoData ? setShowShareDialog(true) : {}} />
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openSchedule}
                                anchorEl={anchorElSchedule}
                                onClose={() => setAnchorElSchedule(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click To Share This Report</div>
                            </Popover>
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer}`}
                            onMouseEnter={(e) => setAnchorElSave(e.currentTarget)} onMouseLeave={() => setAnchorElSave(null)} aria-owns={openSave ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <img src={ReportsSchedule} alt="" className={`${style.reportsActions} ${style.marginTop5}`} onClick={() => setShowSaveReportOutput(true)} />
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openSave}
                                anchorEl={anchorElSave}
                                onClose={() => setAnchorElSave(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click to Save this Report</div>
                            </Popover>
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer} ${isNoData && style.disabledCursor}`} onClick={() => !isNoData ? getIsDownloadClicked(true) : {}}
                            onMouseEnter={(e) => !isNoData ? setAnchorElDownload(e.currentTarget) : {}} onMouseLeave={() => !isNoData ? setAnchorElDownload(null) : {}} aria-owns={openDownload ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <img src={ReportsDownload} alt="" className={`${style.reportsActions} ${style.marginTop5}`} />
                            {/* <DownloadingOutlinedIcon style={{ color: "#2C2C2C" }} /> */}
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openDownload}
                                anchorEl={anchorElDownload}
                                onClose={() => setAnchorElDownload(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click To Download This Report</div>
                            </Popover>
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer} ${isNoData && style.disabledCursor}`} onClick={!isNoData ? handlePrint : {}}
                            onMouseEnter={(e) => !isNoData ? setAnchorElPrint(e.currentTarget) : {}} onMouseLeave={() => !isNoData ? setAnchorElPrint(null) : {}} aria-owns={openPrint ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <img src={ReportsPrint} alt="" className={`${style.reportsActions} ${style.marginTop5}`} />
                            {/* <PrintOutlinedIcon style={{ color: "#2C2C2C" }} /> */}
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openPrint}
                                anchorEl={anchorElPrint}
                                onClose={() => setAnchorElPrint(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click To Print This Report</div>
                            </Popover>
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer} ${isNoData && style.disabledCursor}`}
                            onMouseEnter={(e) => !isNoData ? setAnchorElFullscreen(e.currentTarget) : {}} onMouseLeave={() => !isNoData ? setAnchorElFullscreen(null) : {}} aria-owns={openFullscreen ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true" >
                            <img src={ReportsFullScreen} alt="" className={`${style.reportsActions} ${style.marginTop5}`} onClick={!isNoData ? handle.enter : {}} />
                            {/* <ZoomOutMapIcon style={{ color: "#2C2C2C" }} onClick={!isNoData ? handle.enter : {}} /> */}
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openFullscreen}
                                anchorEl={anchorElFullscreen}
                                onClose={() => setAnchorElFullscreen(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click To View This Report In Full Screen</div>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.blueBorderStyle}></div>
            <Dialog isOpen={showSaveReportOutput} onClose={() => setShowSaveReportOutput(false)} className={`${style.sendMailUserDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>Save This Report Output</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowSaveReportOutput(false)} />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={`${style.padding10}`}>
                        <div>
                            <div className={`${style.marginTop20} ${style.recipientsDataHeight}`}>
                                <div className={style.displayInCol}>
                                    <label for="standard-basic" className={style.saveReportLabelStyle}>Report Output Name</label>
                                    <TextField id="standard-basic" variant="standard" value={reportTitleList[reportType]} className={`${style.threeColWidth} ${style.saveReportFieldStyle} ${style.marginTop10}`} />
                                </div>
                                <div className={style.marginTop20}>
                                    <label for="description" className={`${style.saveReportLabelStyle}`}>Report Output Notes</label>
                                    <TextArea id="description" rows={5} placeholder="Indicate why you’re saving this report output" className={`${style.fullWidth} ${style.saveReportFieldStyle} ${style.marginTop10}`} value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <div className={`${style.justifyCenter} ${style.marginTop20}`}>
                                    <button className={`${style.saveButtonStyle} ${style.marginLeft20} ${style.cursorPointer} `} onClick={() => { handleDownload(); }}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog isOpen={showReportSavedDialog} onClose={() => setShowReportSavedDialog(false)} className={`${style.reportSavedDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.justifyCenter}>
                        <div className={style.reportIconStyle}></div>
                    </div>
                    <div className={style.reportSavedStyle}>Report Saved</div>
                </div>
            </Dialog>
            {/* <Dialog isOpen={isLoading} onClose={() => setShowReportRefreshingDialog(false)} className={`${style.reportSavedDialog} ${style.dialogPaddingBottom}`} canOutsideClickClose={false}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.justifyCenter}>
                        <CachedOutlinedIcon sx={{ fontSize: 60 }} style={{ color: "#06617A" }} className={style.reportIconStyle} />
                    </div>
                    <div className={style.reportSavedStyle}>Refreshing Report</div>
                </div>
            </Dialog> */}
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
                            <div>
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
                                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} ${selectedUsers?.length === 0 ? style.disabledButton : ''}  `} onClick={selectedUsers?.length === 0 ? () => { } : () => handleDownload(true)}>{'Share Now'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            {showSaveReport && (
                <SaveReport getSaveReportDialog={getSaveReportDialog} dataToUseInReport={dataToUseInReport} reportType={reportType} />
            )}
        </div>
    )
}

export default ReportPerformanceAndOptions;
