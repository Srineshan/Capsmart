import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import StaffApplicationList from './staffApplicationList';
import NewActiveApplication from '../../Components/ViewVerifyScreen';
import NewCredCommApplication from './newCredCommApplication';
import { Dialog, Classes } from '@blueprintjs/core';
import ValidationDialog from '../../Components/validationDialog';
import TaskStatusDialog from '../../Components/TaskStatusDialog';
import NotesCommentDialog from '../../Components/NotesCommentDialog';
import ReappointmentApplicationChangesDialog from '../../Components/ReappointmentApplicationChangesDialog';
import ApprovalWithNotesDialog from '../../Components/ApprovalWithNotesDialog';
import ApprovalWithoutNotesDialog from '../../Components/ApprovalWithoutNotesDialog';
import ApprovalWithNotesDeptDialog from '../../Components/ApproveWithNotesDeptDialog';
import PaymentDisplayDialog from '../../Components/PaymentDisplayDialog';
import EmailDialog from '../../Components/EmailDialog';
import CCdateDialog from '../../Components/CCDateDialog';
import NotesDialog from "../../Components/NotesDialog";
import LocumExtensionDialog from "../../Components/LocumExtensionDialog";
import ClarificationRequestFromApplicantDialog from "../../Components/ClarificationRequestFromApplicantDialog";
import DocumentClarificationDialog from "../../Components/DocumentClarificationDialog";
import ResolveDialog from "../../Components/ResolveDialog";
import RequestOverrideDialog from "../../Components/RequestOverrideDialog";
import OverrideRequestDialog from "../../Components/OverrideRequestDialog";
import IdleTimer from '../../Components/IdleTimer';
import DepartmentTrackerDialog from '../../Components/DepartmentTrackerDialog'
import PDFGenerateBox from '../../Components/PdfGenerate'
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";
import MDTrackerDialog from '../../Components/MDTrackerDialog';

const StaffApplication = () => {
    const [selectedTab, setSelectedTab] = useState('level-1');
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [credCommApplicationView, setCredCommApplicationView] = useState(false);
    const [activeApplicationTask, setActiveApplicationTask] = useState(false);
    // const [activeApplicationTaskReappoint, setActiveApplicationTaskReappoint] = useState(false);
    const [notesCommentsBox, setNotesCommentBox] = useState(false);
    const [reappointmentChangesCommentsBox, setReappointmentChangesCommentsBox] = useState(false);
    const [approvalnotesCommentsBox, setApprovalNotesCommentBox] = useState(false);
    const [approvalwithoutnotesCommentsBox, setApprovalwithoutNotesCommentBox] = useState(false);
    const [approvalnotesCommentsBoxDept, setApprovalNotesCommentBoxDept] = useState(false);
    const [paymentDisplayBox, setPaymentDisplayBox] = useState(false);
    const [emailDialogBox, setEmailDialogBox] = useState(false);
    const [showNotesDialog, setShowNotesDialog] = useState(false);
    const [showLocumExtensiveDialog, setShowLocumExtensiveDialog] = useState(false);
    const [showClarificationRequestFromApplicantDialog, setShowClarificationRequestFromApplicantDialog] = useState(false);
    const [showDocumentClarificationDialog, setShowDocumentClarificationDialog] = useState(false);
    const [showResolveDialog, setShowResolveDialog] = useState(false);
    const [showRequestOverrideDialog, setShowRequestOverrideDialog] = useState(false);
    const [showOverRideRequestDialog, setShowOverRideRequestDialog] = useState(false);
    const [showDeptTrackerDialog, setShowDeptTrackerDialog] = useState(false);
    const [showMdTrackerDialog, setShowMdTrackerDialog] = useState(false);
    const [showTimerDialog, setShowTimerDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [staffView, setStaffView] = useState(false);
    const [clarificationMode, setClarificationMode] = useState('');
    const [clarificationModeType, setClarificationModeType] = useState({});
    const [clarificationFormMode, setClarificationFormMode] = useState({});
    const [tableDataLocum, setTableDataLocum] = useState({});
    const [clarificationRequestFormMode, setClarificationRequestFormMode] = useState({});
    const [ccDateSetMode, setCcDateSetMode] = useState('');
    const [approveMeetDateSet, setApproveMeetDateSet] = useState();
    const [showPdfGenrateBox, setShowPdfGenerateBox] = useState(false);

    const getSelectedTab = (value) => {
        setSelectedTab(value);
    }

    const getloading = (value) => {
        setIsLoading(value);
    }

    const getActiveApplicationView = (value, mode) => {
        setActiveApplicationView(value);
        setCcDateSetMode(mode);
    }

    const getCredCommApplicationView = (value) => {
        setCredCommApplicationView(value);
    }

    const getActiveApplicationTask = (value) => {
        setActiveApplicationTask(value);
    }

    const getNotesDialog = (value) => {
        setShowNotesDialog(value);
    };

    const getLocumExtensiveDialog = (value,tableDataValue) => {
        setShowLocumExtensiveDialog(value);
        setTableDataLocum(tableDataValue)
    };

    const getClarificationRequestFromApplicantDialog = (value, formId, Type) => {
        setShowClarificationRequestFromApplicantDialog(value);
        setClarificationFormMode(formId)
        setClarificationModeType(Type)
    };

    const getDocumentClarificationDialog = (value, clarificationId, formId) => {
        setShowDocumentClarificationDialog(value);
        setClarificationRequestFormMode(clarificationId)
        setClarificationFormMode(formId)
    };

    const getResolveDialog = (value, mode, clarificationId, formId) => {
        setShowResolveDialog(value);
        setClarificationMode(mode);
        setClarificationRequestFormMode(clarificationId)
        setClarificationFormMode(formId)
    };

    const getRequestOverrideDialog = (value) => {
        setShowRequestOverrideDialog(value);
    };

    const getOverRideRequestDialog = (value) => {
        setShowOverRideRequestDialog(value);
    };

    const getDeptTrackerDialog = (value) => {
        setShowDeptTrackerDialog(value);
    };

    const getMdTrackerDialog = (value) => {
        setShowMdTrackerDialog(value);
    };

    const getPdfGenerateBox = (value) => {
        setShowPdfGenerateBox(value);
    };

    const getTimerDialog = (value) => {
        setShowTimerDialog(value);
    };


    const getNotesCommentBox = (value) => {
        setNotesCommentBox(value);
    }

    const getPaymentDisplayBox = (value) => {
        setPaymentDisplayBox(value);
    }

    const getReappointmentChangesCommentBox = (value) => {
        setReappointmentChangesCommentsBox(value);
    }

    const getApprovalNotesCommentBox = (value) => {
        setApprovalNotesCommentBox(value);
    }

    const getApprovalwithoutNotesCommentBox = (value, date) => {
        setApprovalwithoutNotesCommentBox(value);
        setApproveMeetDateSet(date)
    }

    const getApprovalNotesCommentBoxDept = (value) => {
        setApprovalNotesCommentBoxDept(value);
    }

    const getEmailDialogBox = (value) => {
        setEmailDialogBox(value);
    }

    const getStaffView = (value) => {
        setStaffView(value);
    }

    return (
        <>
            {activeApplicationView ? (
                <NewActiveApplication isLoading={isLoading} dataLevel={ccDateSetMode} ccMeetingDateSet={approveMeetDateSet} getloading={getloading} getSelectedTab={getSelectedTab} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} getApprovalNotesCommentBox={getApprovalNotesCommentBox} getApprovalwithoutNotesCommentBox={getApprovalwithoutNotesCommentBox} getActiveApplicationTask={getActiveApplicationTask} getEmailDialogBox={getEmailDialogBox} getApprovalNotesCommentBoxDept={getApprovalNotesCommentBoxDept} emailDialogBox={emailDialogBox} showTimerDialog={showTimerDialog} approvalnotesCommentsBox={approvalnotesCommentsBox} approvalwithoutnotesCommentsBox={approvalwithoutnotesCommentsBox} approvalnotesCommentsBoxDept={approvalnotesCommentsBoxDept} notesCommentsBox={notesCommentsBox} reappointmentChangesCommentsBox={reappointmentChangesCommentsBox} getNotesDialog={getNotesDialog} getClarificationRequestFromApplicantDialog={getClarificationRequestFromApplicantDialog} getDocumentClarificationDialog={getDocumentClarificationDialog} getResolveDialog={getResolveDialog} getRequestOverrideDialog={getRequestOverrideDialog} getStaffView={getStaffView} staffView={staffView} getPaymentDisplayBox={getPaymentDisplayBox} showClarificationRequestFromApplicantDialog={showClarificationRequestFromApplicantDialog} showDocumentClarificationDialog={showDocumentClarificationDialog} showNotesDialog={showNotesDialog} showResolveDialog={showResolveDialog} showRequestOverrideDialog={showRequestOverrideDialog} getOverRideRequestDialog={getOverRideRequestDialog} />
            ) : credCommApplicationView ? (
                <NewCredCommApplication getSelectedTab={getSelectedTab} selectedTab={selectedTab} getCredCommApplicationView={getCredCommApplicationView} />
            ) : (
                <Fragment>
                    <Navbar />
                    <StaffApplicationList
                        isLoading={isLoading}
                        getSelectedTab={getSelectedTab}
                        selectedTab={selectedTab}
                        getActiveApplicationView={getActiveApplicationView}
                        getActiveApplicationTask={getActiveApplicationTask}
                        getCredCommApplicationView={getCredCommApplicationView}
                        getNotesCommentBox={getNotesCommentBox}
                        getReappointmentChangesCommentBox={getReappointmentChangesCommentBox}
                        getApprovalNotesCommentBox={getApprovalNotesCommentBox}
                        getApprovalwithoutNotesCommentBox={getApprovalwithoutNotesCommentBox}
                        getApprovalNotesCommentBoxDept={getApprovalNotesCommentBoxDept}
                        getEmailDialogBox={getEmailDialogBox}
                        getPaymentDisplayBox={getPaymentDisplayBox}
                        emailDialogBox={emailDialogBox}
                        activeApplicationTask={activeApplicationTask}
                        approvalnotesCommentsBox={approvalnotesCommentsBox}
                        approvalwithoutnotesCommentsBox={approvalwithoutnotesCommentsBox}
                        approvalnotesCommentsBoxDept={approvalnotesCommentsBoxDept}
                        notesCommentsBox={notesCommentsBox}
                        reappointmentChangesCommentsBox={reappointmentChangesCommentsBox}
                        showTimerDialog={showTimerDialog}
                        showNotesDialog={showNotesDialog}
                        getNotesDialog={getNotesDialog}
                        getLocumExtensiveDialog ={getLocumExtensiveDialog}
                        getClarificationRequestFromApplicantDialog={getClarificationRequestFromApplicantDialog}
                        getDocumentClarificationDialog={getDocumentClarificationDialog}
                        getResolveDialog={getResolveDialog}
                        getRequestOverrideDialog={getRequestOverrideDialog}
                        getOverRideRequestDialog={getOverRideRequestDialog}
                        //   getCCDateDialog={getCCDateDialog}
                        getDeptTrackerDialog={getDeptTrackerDialog}
                        getPdfGenerateBox={getPdfGenerateBox}
                        getloading={getloading}
                        getStaffView={getStaffView}
                        staffView={staffView}
                        ccDateSetMode={ccDateSetMode}
                        getMdTrackerDialog={getMdTrackerDialog}
                    />
                </Fragment>
            )}
            {activeApplicationTask && (
                <TaskStatusDialog isLoading={isLoading} getloading={getloading} getIsOpen={getActiveApplicationTask} selectedTab={selectedTab} />
            )}
            {activeApplicationTask && (
                <TaskStatusDialog isLoading={isLoading} getloading={getloading} getIsOpen={getActiveApplicationTask} />
            )}
            {notesCommentsBox && (
                <NotesCommentDialog isLoading={isLoading} getloading={getloading} getIsOpen={getNotesCommentBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab} />
            )}
            {reappointmentChangesCommentsBox && (
                <ReappointmentApplicationChangesDialog isLoading={isLoading} getloading={getloading} getIsOpen={getReappointmentChangesCommentBox} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} />
            )}
            {approvalnotesCommentsBox && (
                <ApprovalWithNotesDialog isLoading={isLoading} getloading={getloading} getIsOpen={getApprovalNotesCommentBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab} />
            )}
            {paymentDisplayBox && (
                <PaymentDisplayDialog isLoading={isLoading} getloading={getloading} getIsOpen={getPaymentDisplayBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab} />
            )}
            {approvalwithoutnotesCommentsBox && (
                <ApprovalWithoutNotesDialog isLoading={isLoading} dateStorage={approveMeetDateSet} getloading={getloading} getIsOpen={getApprovalwithoutNotesCommentBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab} />
            )}
            {approvalnotesCommentsBoxDept && (
                <ApprovalWithNotesDeptDialog isLoading={isLoading} getloading={getloading} getIsOpen={getApprovalNotesCommentBoxDept} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab} />
            )}
            {emailDialogBox && (
                <EmailDialog isLoading={isLoading} getloading={getloading} getIsOpen={getEmailDialogBox} />
            )}
            {showNotesDialog && (
                <NotesDialog isLoading={isLoading} getIsOpen={getNotesDialog} getloading={getloading} getActiveApplicationView={getActiveApplicationView} />
            )}
            {showLocumExtensiveDialog && (
                <LocumExtensionDialog isLoading={isLoading} getIsOpen={getLocumExtensiveDialog} tableDataValue ={tableDataLocum} getloading={getloading} getActiveApplicationView={getActiveApplicationView} />
            )}
            {
                showClarificationRequestFromApplicantDialog && (
                    <ClarificationRequestFromApplicantDialog isLoading={isLoading} getIsOpen={getClarificationRequestFromApplicantDialog} getDocumentClarificationDialog={getDocumentClarificationDialog} data={clarificationFormMode} type={clarificationModeType} getloading={getloading} getActiveApplicationView={getActiveApplicationView} />
                )
            }
            {
                showDocumentClarificationDialog && (
                    <DocumentClarificationDialog isLoading={isLoading} getIsOpen={getDocumentClarificationDialog} data={clarificationRequestFormMode} form={clarificationFormMode} getloading={getloading} getActiveApplicationView={getActiveApplicationView} />
                )
            }
            {
                showResolveDialog && (
                    <ResolveDialog isLoading={isLoading} getIsOpen={getResolveDialog} data={clarificationMode} formData={clarificationRequestFormMode} form={clarificationFormMode} getloading={getloading} getActiveApplicationView={getActiveApplicationView} />
                )
            }
            {
                showRequestOverrideDialog && (
                    <RequestOverrideDialog isLoading={isLoading} getIsOpen={getRequestOverrideDialog} getloading={getloading} getActiveApplicationView={getActiveApplicationView} />
                )
            }
            {
                showOverRideRequestDialog && (
                    <OverrideRequestDialog isLoading={isLoading} getIsOpen={getOverRideRequestDialog} getloading={getloading} getActiveApplicationView={getActiveApplicationView} />
                )
            }
            {/* {showCCDateDialog && (
                <CCdateDialog isLoading={isLoading} getIsOpen={getCCDateDialog} getloading={getloading} getActiveApplicationView={getActiveApplicationView} />
            )} */}
            {showDeptTrackerDialog && (
                <DepartmentTrackerDialog isLoading={isLoading} getloading={getloading} getIsOpen={getDeptTrackerDialog} getActiveApplicationView={getActiveApplicationView} getNotesDialog={getNotesDialog} />
            )}
            {showMdTrackerDialog && (
                <MDTrackerDialog isLoading={isLoading} getloading={getloading} getIsOpen={getMdTrackerDialog} />
            )}
            {showTimerDialog && (
                <IdleTimer getIsOpen={getTimerDialog} />
            )}
            {showPdfGenrateBox && (
                <PDFGenerateBox isLoading={isLoading} getloading={getloading} getIsOpen={getPdfGenerateBox} />
            )}
        </>
    )
}

export default StaffApplication;
