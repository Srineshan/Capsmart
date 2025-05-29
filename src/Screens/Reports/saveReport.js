import React, { useEffect, useState } from 'react';
import { Dialog, Classes, Icon, Intent, TextArea, Radio, RadioGroup, InputGroup } from '@blueprintjs/core';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import Typography from '@mui/material/Typography';
import UserLogo1 from './../../images/userLogo3.png';
import UserLogo2 from './../../images/userLogo4.png';
import UserLogo3 from './../../images/userLogo5.png';
import UserLogo4 from './../../images/userLogo6.png';
import Search from './../../images/search.png';
import BlueChevronLeft from './../../images/blueChevronLeft.png';
import style from './index.module.scss';
import { TenantID, POST, GET, PUT } from '../dataSaver';
import { format } from 'date-fns';
import { ErrorToaster, SuccessToaster } from './../../utils/toaster';
import { currentUser } from '../../utils/auth';

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: 'flex',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 15,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(12px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#06617A' : '#06617A',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 12,
        height: 12,
        borderRadius: 6,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? '#06617A' : '#06617A',
        boxSizing: 'border-box',
    },
}));

const SaveReport = ({ getSaveReportDialog, dataToUseInReport, reportType, setIsLoading }) => {
    const currentUserData = currentUser();
    const isMyReport = window.location.pathname.includes("/myReport");
    let myReportContent = JSON.parse(sessionStorage.getItem('myReportContent'))
    const myReportId = sessionStorage.getItem('myReportId')
    const [isPrivate, setIsPrivate] = useState(false);
    const [isDeliveryScheduled, setIsDeliveryScheduled] = useState(false);
    const [reportName, setReportName] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [deliverySchedule, setDeliverySchedule] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [deliveryTime, setDeliveryTime] = useState(new Date());
    const [scheduledFor, setScheduledFor] = useState('MYSELF');
    const [showDeliveryDialog, setShowDeliveryDialog] = useState(false);
    const [isAddRecipients, setIsAddRecipients] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [userDetails, setUserDetails] = useState({});
    // const category = (reportType === 'activitiesOrServices' || reportType === 'addOnActivities' || reportType === 'scheduledActivity') ?
    //     'SERVICES_ACTIVITIES' :
    //     (reportType === 'staffReappointmentsNotes' || reportType === 'staffReappointments') ?
    //         'CONTRACT_MANAGEMENT' :
    //         (reportType === 'complianceStatus' || reportType === 'nonCompliant') ?
    //             'CONTRACT_COMPLIANCE' :
    //             (reportType === 'complianceStatus' || reportType === 'scheduledActivityByContract') ?
    //                 'CONTRACT_PERFORMANCE' :
    //                 (reportType === 'paymentsProcessingSummary') ?
    //                     'PAYMENT' : '';

    // const availableCategories = {
    //     servicesOrActivities: 'SERVICES_ACTIVITIES',
    //     contractManagement: 'CONTRACT_MANAGEMENT',
    //     contractCompliance: 'CONTRACT_COMPLIANCE',
    //     contractPerformance: 'CONTRACT_PERFORMANCE',
    //     payments: 'PAYMENT',
    //     timesheets: 'TIMESHEET',
    //     reviewsApprovals: 'REVIEWS_APPROVALS',
    //     systemAdministrative: 'SYSTEM_ADMINISTRATIVE',
    // }

    const availableCategories = {
        'activitiesOrServices': 'SERVICES_ACTIVITIES',
        'addOnActivities': 'SERVICES_ACTIVITIES',
        'scheduledActivity': 'SERVICES_ACTIVITIES',
        'staffReappointmentsNotes': 'CONTRACT_MANAGEMENT',
        'staffReappointments': 'CONTRACT_MANAGEMENT',
        'complianceStatus': 'CONTRACT_COMPLIANCE',
        'nonCompliant': 'CONTRACT_COMPLIANCE',
        'paidConsultingHours': 'CONTRACT_PERFORMANCE',
        'scheduledActivityByContract': 'CONTRACT_PERFORMANCE',
        'paymentsProcessingSummary': 'PAYMENT',
        'compensationCostAnalysis': 'PAYMENT',
        'timeAndPaymentLog': 'PAYMENT',
        'siteDepartmentSpecificContractorSummary': 'PAYMENT',
        'timesheetProcessingSummary': 'TIMESHEET',
        'listingOfTimesheetsNotPaid': 'TIMESHEET',
        'staffReappointmentTracker': 'TIMESHEET',
        'contractDocumentsOnFile': 'CONTRACT_MANAGEMENT',
        'contractsWithABusinessEntity': 'CONTRACT_MANAGEMENT',
        'multiProviderContractsList': 'CONTRACT_MANAGEMENT',
        'currentRemitToAddressForActiveContracts': 'TIMESHEET',
        'activityStatusTracker': 'TIMESHEET',
        'paymentProcessingStatusTracker': 'PAYMENT',
        'submittedApplicationsReviewSummary': 'STAFF_REAPPOINTMENT',
        'ohipBillingNumbersByCareProvider': 'ALL_STAFF',
        'reappointmentApplicationNotStarted': 'STAFF_REAPPOINTMENT',
        'privilegedStaffSummary': 'ALL_STAFF',
        'currentNotesSummary': 'ALL_STAFF',
        'staffReappointmentStatusSummary': 'STAFF_REAPPOINTMENT',
        'locumRenewalOrExtensionApplicationsSummary': 'LOCUM_EXTENSION_OR_RENEWAL',
        'careProviderCareerMilestoneSummary': 'PERMANENT_STAFF',
        'declinedOrNotRenewedStaffSummary': 'LOCUM_EXTENSION_OR_RENEWAL'
    }

    // const type = (reportType === 'activitiesOrServices' ?
    //     'ACTIVITES_SERVICES_LOG_SUMMARY' :
    //     reportType === 'addOnActivities' ? 'ADDON_ACTIVITES_SERVICES_LOG_SUMMARY' :
    //         reportType === 'paymentsProcessingSummary' ? 'PAYMENT_PROCESSING_SUMMARY' : ''
    // );

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

    const filters = {
        reportingTimePeriod: dataToUseInReport?.reportingTimePeriod,
        startDate: dataToUseInReport?.from,
        endDate: dataToUseInReport?.to,
        contracts: dataToUseInReport?.selectedContracts,
        users: dataToUseInReport?.selectedContractedServiceProvider,
        sites: dataToUseInReport?.selectedSites,
        departments: dataToUseInReport?.selectedDepartments
    }

    useEffect(() => {
        getUserDetail()
    }, [currentUserData?.id])

    useEffect(() => {
        console.log('enteredInMyreport')
        if (myReportContent) {
            // setIsReadOnly(true)
            setReportName(myReportContent?.title)
            setIsPrivate(myReportContent?.private)
            setIsDeliveryScheduled(myReportContent?.schedule?.isdeliveryScheduled)
            setReportDescription(myReportContent?.description)
            setDeliverySchedule(myReportContent?.schedule?.schedule)
            setStartDate(myReportContent?.schedule?.startDate)
            setDeliveryTime(`${myReportContent?.schedule?.startDate}T${myReportContent?.schedule?.deliveryTime}`)
            setScheduledFor(myReportContent?.schedule?.scheduledFor)
            // setShowDeliveryDialog(myReportContent?.)
        }
    }, [myReportContent?.title])

    console.log(reportName, reportDescription, myReportContent, deliveryTime, new Date(myReportContent?.schedule?.deliveryTime))

    const getUserDetail = async () => {
        const { data: user } = await GET(`user-management-service/user/${currentUserData?.id}`);
        setUserDetails(user);
    }

    const handleSave = async (isNew) => {
        setIsReadOnly(true)
        let data = {
            "tenant": {
                "id": TenantID
            },
            "report": {
                "category": availableCategories[reportType],
                "type": typeList[reportType],
                "title": reportName,
                "description": reportDescription,
                "schedule": {
                    "isdeliveryScheduled": isDeliveryScheduled,
                    "schedule": deliverySchedule !== "" ? deliverySchedule : 'ONETIME',
                    "startDate": format(new Date(startDate), 'yyyy-MM-dd'),
                    "deliveryTime": format(new Date(deliveryTime), 'HH:mm:ss'),
                    "scheduledFor": scheduledFor
                },
                "owner": {
                    "id": currentUserData?.id,
                    "name": userDetails?.name
                },
                "lastUpdated": format(new Date(), 'yyyy-MM-dd'),
                "filters": {
                    'startDate': dataToUseInReport?.from,
                    'endDate': dataToUseInReport?.to,
                    'applicantTypeId': dataToUseInReport?.selectedStaffType?.[0] !== '' ? dataToUseInReport?.selectedStaffType : [],
                    // 'sites': dataToUseInReport?.selectedSites?.[0] !== '' ? dataToUseInReport?.selectedSites : [],
                    'departmentSpecialties': dataToUseInReport?.selectedDepartments?.[0] !== '' ? dataToUseInReport?.selectedDepartments : [],
                    'privilegingCategoryId': dataToUseInReport?.selectedPrivilegeCategory !== '' ? dataToUseInReport?.selectedPrivilegeCategory : '',
                    "positionType": dataToUseInReport?.selectedPosition !== "" ? [dataToUseInReport?.selectedPosition] : [],
                    "applicationCreationType": dataToUseInReport?.selectedApplicationType !== "" ? [dataToUseInReport?.selectedApplicationType] : [],
                    // "intervals": decodeURIComponent(dataToUseInReport?.selectedTimesheetInterval).split(','),
                    "applicationCurrentLevel": sessionStorage.getItem('workModeType'),
                    "staffReappointmentStatus": dataToUseInReport?.selectedReappointmentStatus ? [dataToUseInReport?.selectedReappointmentStatus] : []
                },
                filtersWithLabels: [
                    { name: 'Reporting Period used for this report', values: dataToUseInReport?.from },
                    { name: 'Reporting Period used for this report', values: dataToUseInReport?.to },
                    { name: 'Staff Type', values: dataToUseInReport?.selectedStaffType?.[0] !== '' ? dataToUseInReport?.selectedStaffType : [] },
                    { name: 'Departments', values: dataToUseInReport?.selectedDepartments?.[0] !== '' ? dataToUseInReport?.selectedDepartments : [] },
                    { name: 'Privilege Category', values: dataToUseInReport?.selectedPrivilegeCategory !== '' ? dataToUseInReport?.selectedPrivilegeCategory : '' },
                    { name: 'Position', values: dataToUseInReport?.selectedPosition !== "" ? [dataToUseInReport?.selectedPosition] : [] },
                    { name: 'Application Type', values: dataToUseInReport?.selectedApplicationType !== "" ? [dataToUseInReport?.selectedApplicationType] : [] },
                    { name: 'Reappointment Status', values: dataToUseInReport?.selectedReappointmentStatus ? [dataToUseInReport?.selectedReappointmentStatus] : [] },
                ],
                "private": isPrivate
            }
        }
        console.log(data, 'dataInConsole')
        if (reportName !== '' && reportDescription !== '') {
            if (myReportContent) {
                let newData = {
                    "tenant": {
                        "id": TenantID
                    },
                    "report": {
                        "category": availableCategories[reportType],
                        "type": typeList[reportType],
                        "title": reportName,
                        "description": reportDescription,
                        "schedule": {
                            "isdeliveryScheduled": isDeliveryScheduled,
                            "schedule": deliverySchedule !== "" ? deliverySchedule : 'ONETIME',
                            "startDate": format(new Date(startDate), 'yyyy-MM-dd'),
                            "deliveryTime": format(new Date(deliveryTime), 'HH:mm:ss'),
                            "scheduledFor": scheduledFor
                        },
                        "owner": {
                            "id": currentUserData?.id,
                            "name": userDetails?.name
                        },
                        "lastUpdated": format(new Date(), 'yyyy-MM-dd'),
                        "filters": {
                            'startDate': dataToUseInReport?.from,
                            'endDate': dataToUseInReport?.to,
                            'applicantTypeId': dataToUseInReport?.selectedStaffType?.[0] !== '' ? dataToUseInReport?.selectedStaffType : [],
                            // 'sites': dataToUseInReport?.selectedSites?.[0] !== '' ? dataToUseInReport?.selectedSites : [],
                            'departmentSpecialties': dataToUseInReport?.selectedDepartments?.[0] !== '' ? dataToUseInReport?.selectedDepartments : [],
                            'privilegingCategoryId': dataToUseInReport?.selectedPrivilegeCategory !== '' ? dataToUseInReport?.selectedPrivilegeCategory : '',
                            "positionType": dataToUseInReport?.selectedPosition !== "" ? [dataToUseInReport?.selectedPosition] : [],
                            "applicationCreationType": dataToUseInReport?.selectedApplicationType !== "" ? [dataToUseInReport?.selectedApplicationType] : [],
                            // "intervals": decodeURIComponent(dataToUseInReport?.selectedTimesheetInterval).split(','),
                            "applicationCurrentLevel": sessionStorage.getItem('workModeType'),
                            "staffReappointmentStatus": dataToUseInReport?.selectedReappointmentStatus ? [dataToUseInReport?.selectedReappointmentStatus] : []
                        },
                        "private": isPrivate
                    }
                }

                if (isNew) {
                    await POST('application-management-service/report/myReport/', JSON.stringify(newData))
                        .then(response => {
                            SuccessToaster('Report Saved Successfully');
                        })
                        .catch(error => {
                            ErrorToaster('Unexpected Error');
                        })
                    getSaveReportDialog(false);
                } else {
                    await PUT(`application-management-service/report/myReport/${myReportId}`, JSON.stringify(data))
                        .then(response => {
                            SuccessToaster('Report Updated Successfully');
                        })
                        .catch(error => {
                            ErrorToaster('Unexpected Error');
                        })
                    getSaveReportDialog(false);
                }
            }
            else {
                await POST('application-management-service/report/myReport/', JSON.stringify(data))
                    .then(response => {
                        SuccessToaster('Report Saved Successfully');
                    })
                    .catch(error => {
                        ErrorToaster('Unexpected Error');
                    })
                getSaveReportDialog(false);
            }
        } else {
            ErrorToaster('All Fields are Mandatory');
        }
    }
    console.log(availableCategories[reportType], 'savereport')

    return (
        <div>
            <Dialog isOpen={getSaveReportDialog} onClose={() => getSaveReportDialog(false)} className={`${style.dialogStyle} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>Save As My Report</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => getSaveReportDialog(false)} />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={style.saveReportDialogGrid}>
                        <div className={style.saveLeftPart}>
                            <div>
                                <label for="standard-basic" className={style.saveReportLabelStyle}>Title (name of the report)</label>
                                <TextField id="standard-basic" variant="standard" value={reportName} onChange={(e) => setReportName(e.target.value)} className={`${style.fullWidth} ${style.saveReportFieldStyle}`} />
                            </div>
                            <div className={style.marginTop20}>
                                <label for="description" className={`${style.saveReportLabelStyle}`}>Description</label>
                                <TextArea id="description" rows={9} placeholder="Enter Notes" value={reportDescription} onChange={(e) => setReportDescription(e.target.value)} className={`${style.fullWidth} ${style.saveReportFieldStyle} ${style.marginTop10}`} />
                            </div>
                        </div>
                        <div className={`${style.marginTop20} ${style.marginLeft20}`}>
                            <div className={style.smallHeading}>Report Schedule</div>
                            <div className={`${style.marginTop20} ${style.spaceBetween}`}>
                                <label className={`${style.saveReportLabelStyle}`}>Create Delivery Schedule</label>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography className={!isDeliveryScheduled && style.typographyStyle}>No</Typography>
                                    <AntSwitch checked={isDeliveryScheduled} onChange={(e) => setIsDeliveryScheduled(e.target.checked)} inputProps={{ 'aria-label': 'ant design' }} />
                                    <Typography className={isDeliveryScheduled && style.typographyStyle}>Yes</Typography>
                                </Stack>
                            </div>
                            {isDeliveryScheduled && (
                                <>
                                    <div className={`${style.saveReportLabelStyle} ${style.marginTop20}`}>Delivery Schedule</div>
                                    <select
                                        name="action"
                                        id="action"
                                        value={deliverySchedule}
                                        onChange={(e) => setDeliverySchedule(e.target.value)}
                                        className={`${style.fullWidth} ${style.marginTop10}`}>
                                        <option value="" >
                                            Select Delivery Schedule
                                        </option>
                                        <option value="ONETIME" >
                                            One Time (Does Not Repeat)
                                        </option>
                                        <option value="EVERYWEEKDAY" >
                                            Every Weekday
                                        </option>
                                        <option value="WEEKLY" >
                                            Weekly
                                        </option>
                                        <option value="MONTHLY" >
                                            Monthly
                                        </option>
                                        <option value="QUARTELY" >
                                            Quarterly
                                        </option>
                                        <option value="ANNUALY" >
                                            Annually
                                        </option>
                                    </select>
                                    <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                        <div className={`${style.displayInCol} ${style.marginTop5}`}>
                                            <label className={`${style.saveReportLabelStyle}`}>Start Date</label>
                                            <div className={style.marginTop10}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <DatePicker
                                                        InputProps={{
                                                            style: {
                                                                fontSize: 14,
                                                                height: 30,
                                                            }
                                                        }}
                                                        value={startDate}
                                                        onChange={(e) => setStartDate(e)}
                                                        renderInput={(params) => <TextField  {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                        <div className={style.marginLeft20}>
                                            <label className={`${style.saveReportLabelStyle}`}>Delivery Time</label>
                                            <div className={style.marginTop5}>
                                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                                    <TimePicker
                                                        InputProps={{
                                                            style: {
                                                                fontSize: 14,
                                                                height: 30,
                                                            }
                                                        }}
                                                        value={deliveryTime}
                                                        onChange={(e) => setDeliveryTime(e)}
                                                        renderInput={(params) => <TextField {...params} />}
                                                    />
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                        <div className={style.marginTop20}>

                                        </div>
                                    </div>
                                    <div className={style.marginTop20}>
                                        <RadioGroup
                                            label="Schedule this Report for"
                                            selectedValue={scheduledFor}
                                            onChange={(e) => setScheduledFor(e.target.value)}
                                            inline={true}
                                        >
                                            <Radio label="Only Myself" value="MYSELF" intent={Intent.SUCCESS} />
                                            {!isPrivate && (
                                                <Radio label="Myself & Others" value="MYSELFANDOTHERS" />
                                            )}
                                            {!isPrivate && (
                                                <Radio label="Others Only" value="OTHERS" />
                                            )}
                                        </RadioGroup>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={style.privateGrid}>
                        <div className={`${style.marginTop20} ${style.spaceBetween}`}>
                            <label className={`${style.privateLabelStyle}`}>Private</label>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography className={!isPrivate && style.typographyStyle}>No</Typography>
                                <AntSwitch checked={isPrivate} onChange={(e) => { setIsPrivate(e.target.checked); setScheduledFor('MYSELF') }} inputProps={{ 'aria-label': 'ant design' }} />
                                <Typography className={isPrivate && style.typographyStyle}>Yes</Typography>
                            </Stack>
                        </div>
                    </div>
                    {!isReadOnly && (
                        <div className={`${style.spaceBetween} ${style.marginTop20}`}>
                            <div>
                                <button className={`${style.outlinedButton} ${style.cursorPointer}`}
                                    onClick={() => { getSaveReportDialog(false) }}
                                // onClick={() => { scheduledFor !== "MYSELF" && setShowDeliveryDialog(true); handleSave() }}
                                >{"CANCEL"}</button>
                            </div>
                            <div className={style.displayInRow}>
                                <button className={`${style.saveStyle} ${style.cursorPointer}`}
                                    onClick={() => { handleSave() }}
                                // onClick={() => { scheduledFor !== "MYSELF" && setShowDeliveryDialog(true); handleSave() }}
                                >{"REPLACE REPORT"}</button>
                                <button className={`${style.saveStyle} ${style.cursorPointer} ${style.marginLeft20} ${(reportName === "" || reportDescription === "" || reportName.trim() === myReportContent?.title || '') ? style.disabledButton : ''}`}
                                    onClick={(reportName === "" || reportDescription === "" || reportName.trim() === myReportContent?.title || '') ? () => { } : () => { handleSave(true) }}
                                // onClick={() => { scheduledFor !== "MYSELF" && setShowDeliveryDialog(true); handleSave() }}
                                >{isMyReport ? 'SAVE AS A NEW REPORT' : "SAVE"}</button>
                            </div>
                        </div>
                    )}
                </div>
            </Dialog>
            <Dialog isOpen={showDeliveryDialog} onClose={() => setShowDeliveryDialog(false)} className={`${style.sendMailUserDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>Report Delivery Recipents - Myself & Others</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowDeliveryDialog(false)} />
                    </div>
                    <div className={style.extensionBorder}></div>
                    {isAddRecipients ? (
                        <div className={`${style.displayInRow} ${style.marginTop10}`}>
                            <img src={BlueChevronLeft} alt="chevronLeft" className={`${style.chevronImgLeft}`} onClick={() => setIsAddRecipients(false)} />
                            <p className={`${style.extensionStyle} ${style.marginTop10} ${style.bold} ${style.marginLeft20}`}>Add External Recipients</p>
                        </div>
                    ) : (
                        <div className={style.spaceBetween}>
                            <div className={style.displayInRow}>
                                <p className={`${style.mailBoldText} ${style.marginTop20}`}>Registered Users</p>
                                <div className={style.deliveryCountStyle}>20</div>
                                <div className={`${style.searchBarStyle} ${style.spaceBetween} ${style.marginLeft20}`}>
                                    <p>Search</p>
                                    <img src={Search} className={style.searchIcon} />
                                </div>
                            </div>
                            <button className={`${style.cloneOutlinedButton} ${style.cursorPointer}`} onClick={() => setIsAddRecipients(true)}>Add External Recipients</button>
                        </div>
                    )}
                    <div className={`${style.extensionBorder} ${style.marginTop10}`}></div>
                    <div className={`${style.padding10}`}>
                        <div>
                            {isAddRecipients ? (
                                <div className={`${style.marginTop20} ${style.recipientsDataHeight}`}>
                                    <div className={style.recipientsGrid}>
                                        <div>
                                            <p>First Name</p>
                                            <InputGroup value="John" className={style.fullWidth} />
                                        </div>
                                        <div>
                                            <p>Last Name</p>
                                            <InputGroup value="Scott" className={style.fullWidth} />
                                        </div>
                                        <div>
                                            <p>Title</p>
                                            <select
                                                name="action"
                                                id="action"
                                                className={`${style.fullWidth} ${style.marginTop3}`}>
                                                <option value="Scott" className={style.fullWidth} >
                                                    Scott
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={style.marginTop20}>
                                        <div>
                                            <p>Company Name</p>
                                            <InputGroup value="ABC Medical" className={style.companyFieldWidth} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={style.padding10}>
                                    <div className={`${style.userMailListGrid} ${style.padding10} `}>
                                        <img src={UserLogo1} alt={'User Logo 1'} className={style.userLogoMailStyle} />
                                        <div>
                                            <p className={`${style.mailIdTextColor}`}>Ronald Jones (Myself)</p>
                                            <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                        </div>
                                        <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
                                    </div>
                                    <div className={`${style.extensionBorder}`}></div>
                                    <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10}`}>
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
                                            <div className={`${style.expertStyle} ${style.blueCard}`}>Expert</div>
                                        </div>
                                        <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
                                    </div>
                                    <div className={`${style.extensionBorder}`}></div>
                                </div>
                            )}
                            <div>
                                <div className={`${style.justifyCenter} ${style.marginTop20}`}>
                                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} `}>{isAddRecipients ? "Add Recipient" : 'Save My Report'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div>
    )
}

export default SaveReport;