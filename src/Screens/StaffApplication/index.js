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
import ClarificationRequestFromApplicantDialog from "../../Components/ClarificationRequestFromApplicantDialog";
import DocumentClarificationDialog from "../../Components/DocumentClarificationDialog";
import ResolveDialog from "../../Components/ResolveDialog";
import RequestOverrideDialog from "../../Components/RequestOverrideDialog";
import IdleTimer from '../../Components/IdleTimer';
import DepartmentTrackerDialog from '../../Components/DepartmentTrackerDialog'
import { fileLoadingURL, FormatPhoneNumber, FormatPostalCode } from "../../utils/formatting";

const StaffApplication = () => {
    const [selectedTab, setSelectedTab] = useState('');
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
    const [showClarificationRequestFromApplicantDialog, setShowClarificationRequestFromApplicantDialog] = useState(false);
    const [showDocumentClarificationDialog, setShowDocumentClarificationDialog] = useState(false);
    const [showResolveDialog, setShowResolveDialog] = useState(false);
    const [showRequestOverrideDialog, setShowRequestOverrideDialog] = useState(false);
    const [showDeptTrackerDialog, setShowDeptTrackerDialog] = useState(false);
    const [showTimerDialog, setShowTimerDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [staffView, setStaffView] = useState(false);
    const [clarificationMode, setClarificationMode] = useState('');
    const [clarificationModeType, setClarificationModeType] = useState({});
    const [clarificationFormMode, setClarificationFormMode] = useState({});
    const [clarificationRequestFormMode, setClarificationRequestFormMode] = useState({});
    const [ccDateSetMode, setCcDateSetMode] = useState('');
    const [ccMeetingDateSet, setCcMeetingDateSet] = useState();
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

    const getDeptTrackerDialog = (value) => {
        setShowDeptTrackerDialog(value);
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
        setCcMeetingDateSet(date)
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
                <NewActiveApplication isLoading={isLoading} dataLevel={ccDateSetMode} ccMeetingDateSet={ccMeetingDateSet} getloading={getloading} getSelectedTab={getSelectedTab} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} getApprovalNotesCommentBox={getApprovalNotesCommentBox} getApprovalwithoutNotesCommentBox={getApprovalwithoutNotesCommentBox} getActiveApplicationTask={getActiveApplicationTask} getEmailDialogBox={getEmailDialogBox} getApprovalNotesCommentBoxDept={getApprovalNotesCommentBoxDept} emailDialogBox={emailDialogBox} showTimerDialog={showTimerDialog} approvalnotesCommentsBox={approvalnotesCommentsBox} approvalwithoutnotesCommentsBox={approvalwithoutnotesCommentsBox} approvalnotesCommentsBoxDept={approvalnotesCommentsBoxDept} notesCommentsBox={notesCommentsBox} reappointmentChangesCommentsBox={reappointmentChangesCommentsBox} getNotesDialog={getNotesDialog} getClarificationRequestFromApplicantDialog={getClarificationRequestFromApplicantDialog} getDocumentClarificationDialog={getDocumentClarificationDialog} getResolveDialog={getResolveDialog} getRequestOverrideDialog={getRequestOverrideDialog} getStaffView={getStaffView} staffView={staffView} getPaymentDisplayBox={getPaymentDisplayBox} showClarificationRequestFromApplicantDialog={showClarificationRequestFromApplicantDialog} showDocumentClarificationDialog={showDocumentClarificationDialog} showNotesDialog={showNotesDialog} showResolveDialog={showResolveDialog} showRequestOverrideDialog={showRequestOverrideDialog} />
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
                        approvalnotesCommentsBox={approvalnotesCommentsBox}
                        approvalwithoutnotesCommentsBox={approvalwithoutnotesCommentsBox}
                        approvalnotesCommentsBoxDept={approvalnotesCommentsBoxDept}
                        notesCommentsBox={notesCommentsBox}
                        reappointmentChangesCommentsBox={reappointmentChangesCommentsBox}
                        showTimerDialog={showTimerDialog}
                        showNotesDialog={showNotesDialog}
                        getNotesDialog={getNotesDialog}
                        getClarificationRequestFromApplicantDialog={getClarificationRequestFromApplicantDialog}
                        getDocumentClarificationDialog={getDocumentClarificationDialog}
                        getResolveDialog={getResolveDialog}
                        getRequestOverrideDialog={getRequestOverrideDialog}
                        getDeptTrackerDialog={getDeptTrackerDialog}
                        getloading={getloading}
                        getStaffView={getStaffView}
                        staffView={staffView}
                        ccDateSetMode={ccDateSetMode}
                    />
                </Fragment>
            )}
            {activeApplicationTask && (
                <TaskStatusDialog isLoading={isLoading} getloading={getloading} getIsOpen={getActiveApplicationTask} />
            )}
            {notesCommentsBox && (
                <NotesCommentDialog isLoading={isLoading} getloading={getloading} getIsOpen={getNotesCommentBox} selectedTab={selectedTab} />
            )}
            {reappointmentChangesCommentsBox && (
                <ReappointmentApplicationChangesDialog isLoading={isLoading} getloading={getloading} getIsOpen={getReappointmentChangesCommentBox} selectedTab={selectedTab} />
            )}
            {approvalnotesCommentsBox && (
                <ApprovalWithNotesDialog isLoading={isLoading} getloading={getloading} getIsOpen={getApprovalNotesCommentBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab} />
            )}
            {paymentDisplayBox && (
                <PaymentDisplayDialog isLoading={isLoading} getloading={getloading} getIsOpen={getPaymentDisplayBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab} />
            )}
            {approvalwithoutnotesCommentsBox && (
                <ApprovalWithoutNotesDialog isLoading={isLoading} dateStorage={ccMeetingDateSet} getloading={getloading} getIsOpen={getApprovalwithoutNotesCommentBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab} />
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
                showDeptTrackerDialog && (
                    <DepartmentTrackerDialog isLoading={isLoading} getloading={getloading} getIsOpen={getDeptTrackerDialog} getActiveApplicationView={getActiveApplicationView} />
                )
            }
            {
                showTimerDialog && (
                    <IdleTimer getIsOpen={getTimerDialog} />
                )
            }
        </>
    )
}

export default StaffApplication;
