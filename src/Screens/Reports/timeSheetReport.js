import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Reject from './../../images/reject-report.png';
import SideBar from '../../Components/Sidebar';
import Popover from '@mui/material/Popover';
import TemplateIcon from './../../images/templateIcon.png';
import style from './index.module.scss';
import { Link, useParams } from 'react-router-dom';
import { GET } from '../dataSaver';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { currentUser } from '../../utils/auth';
import { userTimeZone } from '../../utils/formatting';
import ReportNoDataBox from '../../Components/ReusableSmallComponents/reportNoDataBox';

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
    const [tabName, setTabName] = useState('Standard Report Templates');
    const { reportType } = useParams();
    const [myReports, setMyReports] = useState([]);
    const [savedReports, setSavedReports] = useState([]);
    const [standardTemplates, setStandardTemplates] = useState([]);
    const currentUserDetails = currentUser();
    const [isExpanded, setIsExpanded] = useState(true);
    const availableCategories = {
        servicesOrActivities: 'SERVICES_ACTIVITIES',
        contractManagement: 'CONTRACT_MANAGEMENT',
        contractCompliance: 'CONTRACT_COMPLIANCE',
        contractPerformance: 'CONTRACT_PERFORMANCE',
        payments: 'PAYMENT',
        timesheets: 'TIMESHEET',
        reviewsApprovals: 'REVIEWS_APPROVALS',
        systemAdministrative: 'SYSTEM_ADMINISTRATIVE',
    }

    const routeList = {
        ACTIVITES_SERVICES_LOG_SUMMARY: 'activitiesOrServices',
        ADDON_ACTIVITES_SERVICES_LOG_SUMMARY: 'addOnActivities',
        // key: 'scheduledActivity',
        UPCOMING_CONTRACT_RENEWALS: 'upcomingContractRenewals',
        ONE_TIME_CONTRACT: 'oneTimeContract',
        // key: 'complianceStatus',
        // key: 'nonCompliant',
        PAID_CONSULTING_HOURS_BILLING_PRODUCTIVITY_INDEX_BY_CONTRACTOR: 'paidConsultingHours',
        // key: 'scheduledActivityByContract',
        PAYMENT_PROCESSING_SUMMARY: 'paymentsProcessingSummary',
        COST_REPORT_FOR_CONTRACTED_SERVICES_PERFORMED: 'compensationCostAnalysis',
        TIME_AND_PAYEMENT_LOG_FOR_CONTRACTED_SERVICES: 'timeAndPaymentLog',
        SITE_DEPARTMENT_SPECIFIC_CONTRACTOR_SUMMARY: 'siteDepartmentSpecificContractorSummary',
        TIMESHEET_PROCESSING_SUMMARY: 'timesheetProcessingSummary',
        LISTING_OF_TIMESHEETS_NOTPAID: 'listingOfTimesheetsNotPaid',
        SUBMITTED_TIMESHEETS_PAYMENT_STATUS: 'submittedTimesheetsPaymentStatus',
        CURRENT_REMIT_TO_ADDRESS: 'currentRemitToAddressForActiveContracts',
        CONTRACT_DOCUMENT_ON_FILE: 'contractDocumentsOnFile',
        CONTRACT_WITH_BUSINESS_ENTITY: 'contractsWithABusinessEntity',
        MULTI_PROVIDER_CONTRACT: 'multiProviderContractsList'
    }
    const descriptionList = {
        ACTIVITES_SERVICES_LOG_SUMMARY: 'Activities/ Services Log Status Summary',
        ADDON_ACTIVITES_SERVICES_LOG_SUMMARY: 'Add On Activities/ Services Requests Status Summary',
        // key: 'Scheduled Activity/ Services - forcasted to actual',
        UPCOMING_CONTRACT_RENEWALS: 'Upcoming Contract Renewals',
        ONE_TIME_CONTRACT: 'List of One Time Contracts that will Terminate on Expiration',
        // key: 'Contract Based Proof of Documentation Compliance Status Summary',
        // key: 'List Of Contracts That Are Non Compliant With Proof Of Documentation Requirement',
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
        MULTI_PROVIDER_CONTRACT: 'Multi Provider Contracts List'
    }

    const titleList = {
        ACTIVITES_SERVICES_LOG_SUMMARY: 'Activities/ Services Log Status Summary',
        ADDON_ACTIVITES_SERVICES_LOG_SUMMARY: 'Add On Activities/ Services Requests Status Summary',
        // key: 'Scheduled Activity/ Services - forcasted to actual',
        UPCOMING_CONTRACT_RENEWALS: 'Upcoming Contract Renewals',
        ONE_TIME_CONTRACT: 'List of One Time Contracts that will Terminate on Expiration',
        // key: 'Contract Based Proof of Documentation Compliance Status Summary',
        // key: 'List Of Contracts That Are Non Compliant With Proof Of Documentation Requirement',
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
        MULTI_PROVIDER_CONTRACT: 'Multi Provider Contracts List'
    }

    useEffect(() => {
        sessionStorage.removeItem('reportFilter');
        sessionStorage.removeItem('myReportId');
    }, [])

    const showMyReport = (data) => {
        let reportURL = routeList[data?.report?.type];
        sessionStorage.setItem('reportFilter', JSON.stringify(data?.report?.filters));
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
        if (tabName === 'My Reports') {
            getMyReports();
        } else if (tabName === 'Saved Report Outputs') {
            getSavedReports();
        } else {
            getStandardTemplates();
        }
    }, [tabName, reportType])

    const getMyReports = async () => {
        if (reportType === 'contractManagement') {
            const { data: myReport } = await GET(`timesheet-management-service/report/myReport?userId=${currentUserDetails?.id}&category=TIMESHEET`);
            setMyReports(myReport);
            let temp = [...myReport] || [];
            const { data: myReportContract } = await GET(`contract-managment-service/reports/myReport?userId=${currentUserDetails?.id}&category=${availableCategories[reportType]}`);
            myReportContract?.map(data => { temp.push(data) })
            setMyReports(temp);
        } else {
            const { data: myReport } = await GET(`timesheet-management-service/report/myReport?userId=${currentUserDetails?.id}&category=${availableCategories[reportType]}`);
            setMyReports(myReport);
        }
    }

    console.log(myReports)

    const getSavedReports = async () => {
        const { data: savedReport } = await GET(`timesheet-management-service/report/savedReport?userId=${currentUserDetails?.id}&category=${availableCategories[reportType]}`);
        setSavedReports(savedReport);
    }

    const getStandardTemplates = async () => {
        if (reportType === 'contractManagement') {
            const { data: standardTemplates } = await GET(`timesheet-management-service/report/standardTemplates?userId=${currentUserDetails?.id}&category=${availableCategories[reportType]}`);
            const { data: standardTemplatesContract } = await GET(`contract-managment-service/reports/standardTemplates?userId=${currentUserDetails?.id}&category=${availableCategories[reportType]}`);
            let temp = standardTemplates || [];
            standardTemplatesContract?.map(data => {
                temp.push(data)
            })
            console.log(temp)
            setStandardTemplates(temp);
        } else {
            const { data: standardTemplates } = await GET(`timesheet-management-service/report/standardTemplates?userId=${currentUserDetails?.id}&category=${availableCategories[reportType]}`);
            setStandardTemplates(standardTemplates);
        }
    }

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    }

    const getScheduleValue = (value) => {
        if (value === 'ONETIME') {
            return 'One Time';
        } else if (value === 'EVERYWEEKDAY') {
            return 'Every Weekday';
        } else if (value === 'WEEKLY') {
            return 'Weekly';
        } else if (value === 'MONTHLY') {
            return 'Monthly';
        } else if (value === 'QUARTELY') {
            return 'Quaterly';
        } else if (value === 'ANNUALY') {
            return 'Annualy';
        } else {
            return '';
        }
    }
    return (
        <div className={style.margin20}>
            <div className={isExpanded ? style.bigCardGrid : style.smallCardGrid}>
                <div>
                    <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                        <div></div>
                    </SideBar>
                </div>
                <div className={style.bigCardStyle}>
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
                        {/* <div className={`${style.spaceBetween} ${style.margin20}`}>
                            <div className={style.displayInRow}>
                                <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                                <img src={ChevronRight} className={style.roundChevron} />
                            </div>
                            <select
                                name="sort"
                                id="sort"
                                className={style.selectFieldWidth}>
                                <option value="Sort By" >
                                    Sort By
                                </option>
                            </select>
                            <select
                                name="action"
                                id="action"
                                className={style.selectFieldWidth}>
                                <option value="Action" >
                                    Action
                                </option>
                            </select>
                        </div> */}
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
                                {/* <p className={style.headingStyle}>Last Updated By</p> */}
                                {/* <p className={style.headingStyle}>Owner</p> */}
                                <p className={style.headingStyle}>Last Updated</p>
                            </div>
                            <div className={style.scrollStyle}>
                                {standardTemplates?.map((data, index) => (
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`} key={index}>
                                        <div className={style.tableDataReportsFontStyle}>{index + 1}</div>
                                        <Link to={`/reportTypeOverview/${routeList[data?.subCategory]}`} className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>{titleList[data?.title]}</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>{descriptionList[data?.description]}</div>
                                        {/* <div className={style.tableDataReportsFontStyle}>{data?.lastRun !== null ? format(getZonedTime(new Date(data?.lastRun)), 'd MMM yyyy HH:mm z') : '-'} </div> */}
                                        <div className={style.tableDataReportsFontStyle}>{data?.lastRun !== null ? formatInTimeZone(new Date(data?.lastRun), userTimeZone, 'd MMM yyyy HH:mm') : '-'} </div>
                                        {/* <div className={style.tableDataReportsFontStyle}>{currentUserDetails?.fullName}</div> */}
                                        <div className={style.tableDataReportsFontStyle}>{data?.lastUpdate !== null ? format(new Date(data?.lastUpdate), 'd MMM yyyy') : '-'}</div>
                                        <Link to={`/reportTypeOverview/${routeList[data?.subCategory]}`} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                ))}
                                {/* {reportType === 'contractManagement' && (
                                    <div className={style.scrollStyle}>
                                        <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                            <div className={style.tableDataReportsFontStyle}>1</div>
                                            <Link to="/reportTypeOverview/upcomingContractRenewals" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Upcoming Contract Renewals</div></Link>
                                            <div className={style.tableDataReportsFontStyle}>Upcoming Contract Renewals</div>
                                            <div className={style.tableDataReportsFontStyle}>{formatInTimeZone(new Date(), 'America/New_York', 'd MMM yyyy HH:mm')} </div>
                                            <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'd MMM yyyy')}</div>
                                            <Link to={"/reportTypeOverview/upcomingContractRenewals"} className={style.linkStyle}>
                                                <Run />
                                            </Link>
                                        </div>
                                        <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                            <div className={style.tableDataReportsFontStyle}>2</div>
                                            <Link to="/reportTypeOverview/oneTimeContract" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>List of One Time Contracts that will Terminate on Expiration</div></Link>
                                            <div className={style.tableDataReportsFontStyle}>List of One Time Contracts that will Terminate on Expiration</div>
                                            <div className={style.tableDataReportsFontStyle}>{formatInTimeZone(new Date(), 'America/New_York', 'd MMM yyyy HH:mm')} </div>
                                            <div className={style.tableDataReportsFontStyle}>{formatInTimeZone(new Date(), 'America/New_York', 'd MMM yyyy')}</div>
                                            <Link to={"/reportTypeOverview/oneTimeContract"} className={style.linkStyle}>
                                                <Run />
                                            </Link>
                                        </div>
                                        <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                            <div className={style.tableDataReportsFontStyle}>3</div>
                                            <Link to="/reportTypeOverview/contractDocumentsOnFile" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Contract Documents On File</div></Link>
                                            <div className={style.tableDataReportsFontStyle}>Contract Documents On File</div>
                                            <div className={style.tableDataReportsFontStyle}>{formatInTimeZone(new Date(), 'America/New_York', 'd MMM yyyy HH:mm')} </div>
                                            <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'd MMM yyyy')}</div>
                                            <Link to={"/reportTypeOverview/contractDocumentsOnFile"} className={style.linkStyle}>
                                                <Run />
                                            </Link>
                                        </div>
                                        <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                            <div className={style.tableDataReportsFontStyle}>4</div>
                                            <Link to="/reportTypeOverview/multiProviderContractsList" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Multi Provider Contracts List</div></Link>
                                            <div className={style.tableDataReportsFontStyle}>Multi Provider Contracts List</div>
                                            <div className={style.tableDataReportsFontStyle}>{formatInTimeZone(new Date(), 'America/New_York', 'd MMM yyyy HH:mm')} </div>
                                            <div className={style.tableDataReportsFontStyle}>{formatInTimeZone(new Date(), 'America/New_York', 'd MMM yyyy')}</div>
                                            <Link to={"/reportTypeOverview/multiProviderContractsList"} className={style.linkStyle}>
                                                <Run />
                                            </Link>
                                        </div>
                                        <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                            <div className={style.tableDataReportsFontStyle}>5</div>
                                            <Link to="/reportTypeOverview/contractsWithABusinessEntity" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Contracts With A Business Entity</div></Link>
                                            <div className={style.tableDataReportsFontStyle}>Contracts With A Business Entity</div>
                                            <div className={style.tableDataReportsFontStyle}>{formatInTimeZone(new Date(), 'America/New_York', 'd MMM yyyy HH:mm')} </div>
                                            <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'd MMM yyyy')}</div>
                                            <Link to={"/reportTypeOverview/contractsWithABusinessEntity"} className={style.linkStyle}>
                                                <Run />
                                            </Link>
                                        </div>
                                        <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                            <div className={style.tableDataReportsFontStyle}>6</div>
                                            <Link to="/reportTypeOverview/currentRemitToAddressForActiveContracts" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Current Remit To Address For Active Contracts</div></Link>
                                            <div className={style.tableDataReportsFontStyle}>Current Remit To Address For Active Contracts</div>
                                            <div className={style.tableDataReportsFontStyle}>{formatInTimeZone(new Date(), 'America/New_York', 'd MMM yyyy HH:mm')} </div>
                                            <div className={style.tableDataReportsFontStyle}>{formatInTimeZone(new Date(), 'America/New_York', 'd MMM yyyy')}</div>
                                            <Link to={"/reportTypeOverview/currentRemitToAddressForActiveContracts"} className={style.linkStyle}>
                                                <Run />
                                            </Link>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                            {/* {reportType === 'servicesOrActivities' ? (
                                <div className={style.scrollStyle}>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>1</div>
                                        <Link to="/reportTypeOverview/activitiesOrServices" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Activities/ Services Log Status Summary</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Activities/ Services Log Status Summary</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Link to={"/reportTypeOverview/activitiesOrServices"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/addOnActivities" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Add On Activities/ Services Requests Status Summary</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Add On Activities/ Services Requests Status Summary</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022, 18:09 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022</div>
                                        <Link to={"/reportTypeOverview/addOnActivities"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                </div>
                            ) : reportType === 'contractManagement' ? (
                                <div className={style.scrollStyle}>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>1</div>
                                        <Link to="/reportTypeOverview/upcomingContractRenewals" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Upcoming Contract Renewals</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Upcoming Contract Renewals</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Link to={"/reportTypeOverview/upcomingContractRenewals"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/oneTimeContract" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>List of One Time Contracts that will Terminate on Expiration</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>List of One Time Contracts that will Terminate on Expiration</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Link to={"/reportTypeOverview/oneTimeContract"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                </div>
                            ) : reportType === 'contractCompliance' ? (
                                <div className={style.scrollStyle}>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/nonCompliant" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>List Of Contracts That Are Non Compliant With Proof Of Documentation Requirement</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>List Of Contracts That Are Non Compliant With Proof Of Documentation Requirement</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022, 18:09 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022</div>
                                        <Link to={"/reportTypeOverview/nonCompliant"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                </div>
                            ) : reportType === 'contractPerformance' ? (
                                <div className={style.scrollStyle}>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>1</div>
                                        <Link to="/reportTypeOverview/complianceStatus" className={style.linkStyle}>
                                        <div className={style.tableDataReportsFontStyle}>Paid Consulting Hours & Billing Productivity Index by Contractor</div>
                                        </Link>
                                        <div className={style.tableDataReportsFontStyle}>Paid Consulting Hours & Billing Productivity Index by Contractor</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Link to={"/reportTypeOverview/complianceStatus"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/scheduledActivityByContract" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Scheduled Activity/ Services - forecasted to actual by contract</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Scheduled Activity/ Services - forecasted to actual by contract</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20  </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Link to={"/reportTypeOverview/scheduledActivityByContract"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                </div>
                            ) : reportType === 'payments' ? (
                                <div className={style.scrollStyle}>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>1</div>
                                        <Link to="/reportTypeOverview/paymentsProcessingSummary" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Payments Processing Summary</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>This report provides a comprehensive summary of statistics with regards to status of payments being made to contracted service providers</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'MMM d yyyy, H:m')} </div>
                                        <div className={style.tableDataReportsFontStyle}>{currentUserDetails?.fullName}</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'MMM d yyyy')} </div>
                                        <Link to={"/reportTypeOverview/paymentsProcessingSummary"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/compensationCostAnalysis" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Compensation Cost Analysis</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>This report provides a comprehensive summary of statistics with regards to status of payments being made to contracted service providers</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'MMM d yyyy, H:m')} </div>
                                        <div className={style.tableDataReportsFontStyle}>{currentUserDetails?.fullName}</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'MMM d yyyy')} </div>
                                        <Link to={"/reportTypeOverview/compensationCostAnalysis"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                </div>
                            ) : reportType === 'timesheets' ? (
                                <div className={style.scrollStyle}>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>1</div>
                                        <Link to="/reportTypeOverview/timesheetProcessingSummary" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Timesheet Processing Summary</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Timesheet Processing Summary</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'MMM d yyyy, H:m')} </div>
                                        <div className={style.tableDataReportsFontStyle}>{currentUserDetails?.fullName}</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'MMM d yyyy')} </div>
                                        <Link to={"/reportTypeOverview/timesheetProcessingSummary"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/listingOfTimesheetsNotPaid" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Listing Of Timesheets Not Paid</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Listing Of Timesheets Not Paid</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'MMM d yyyy, H:m')} </div>
                                        <div className={style.tableDataReportsFontStyle}>{currentUserDetails?.fullName}</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'MMM d yyyy')} </div>
                                        <Link to={"/reportTypeOverview/listingOfTimesheetsNotPaid"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>3</div>
                                        <Link to="/reportTypeOverview/submittedTimesheetsPaymentStatus" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Submitted Timesheets Payment Status</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Submitted Timesheets Payment Status</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'MMM d yyyy, H:m')} </div>
                                        <div className={style.tableDataReportsFontStyle}>{currentUserDetails?.fullName}</div>
                                        <div className={style.tableDataReportsFontStyle}>{format(new Date(), 'MMM d yyyy')} </div>
                                        <Link to={"/reportTypeOverview/submittedTimesheetsPaymentStatus"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className={style.scrollStyle}>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>1</div>
                                        <Link to="/reportTypeOverview/activitiesOrServices" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Activities/ Services Log Status Summary</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Activities/ Services Log Status Summary</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022, 14:20 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Jan 1 2022</div>
                                        <Link to={"/reportTypeOverview/activitiesOrServices"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>2</div>
                                        <Link to="/reportTypeOverview/addOnActivities" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Add On Activities/ Services Requests Status Summary</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Add On Activities/ Services Requests Status Summary</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022, 18:09 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 11 2022</div>
                                        <Link to={"/reportTypeOverview/addOnActivities"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                    <div className={`${style.reportsTableGrid} ${style.marginTop20}`}>
                                        <div className={style.tableDataReportsFontStyle}>3</div>
                                        <Link to="/reportTypeOverview/scheduledActivity" className={style.linkStyle}><div className={style.tableDataReportsFontStyle}>Scheduled Activity/ Services - forcasted to actual</div></Link>
                                        <div className={style.tableDataReportsFontStyle}>Scheduled Activity/ Services - forcasted to actual</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 15 2022, 03:40 </div>
                                        <div className={style.tableDataReportsFontStyle}>Carlos C</div>
                                        <div className={style.tableDataReportsFontStyle}>Feb 15 2022</div>
                                        <Link to={"/reportTypeOverview/scheduledActivity"} className={style.linkStyle}>
                                            <Run />
                                        </Link>
                                    </div>
                                </div>
                            )} */}
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
                                        {/* <div className={`${style.reportStyle} ${style.blueCard} ${style.cursorPointer}`}>Run</div> */}
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
                </div>
            </div>
        </div>
    )
}

export default TimeSheetReports;
