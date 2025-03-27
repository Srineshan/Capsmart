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
import IdleTimer from '../../Components/IdleTimer';
import DepartmentTrackerDialog from '../../Components/DepartmentTrackerDialog'
import PDFGenerateBox from '../../Components/PdfGenerate'
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
    // const [showCCDateDialog, setShowCCDateDialog] = useState(false);
    const [showDeptTrackerDialog, setShowDeptTrackerDialog] = useState(false);
    const [showTimerDialog, setShowTimerDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [staffView, setStaffView] = useState(false);
    const [ccDateSetMode, setCcDateSetMode] = useState('');
    const [ccMeetingDateSet, setCcMeetingDateSet] = useState();
    const [showPdfGenrateBox, setShowPdfGenerateBox] = useState(false);

    const getSelectedTab = (value) => {
        setSelectedTab(value);
    }

    const getloading = (value) => {
        setIsLoading(value);
    }

    const getActiveApplicationView = (value,mode) => {
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

    // const getCCDateDialog = (value) => {
    //     setShowCCDateDialog(value);
    // };

    const getDeptTrackerDialog = (value) => {
        setShowDeptTrackerDialog(value);
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

    const getApprovalwithoutNotesCommentBox = (value,date) => {
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
                <NewActiveApplication isLoading={isLoading} dataLevel={ccDateSetMode} ccMeetingDateSet={ccMeetingDateSet} getloading={getloading} getSelectedTab={getSelectedTab} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} getApprovalNotesCommentBox={getApprovalNotesCommentBox} getApprovalwithoutNotesCommentBox={getApprovalwithoutNotesCommentBox} getActiveApplicationTask={getActiveApplicationTask} getEmailDialogBox={getEmailDialogBox} getApprovalNotesCommentBoxDept={getApprovalNotesCommentBoxDept} emailDialogBox={emailDialogBox} showTimerDialog={showTimerDialog} approvalnotesCommentsBox={approvalnotesCommentsBox} approvalwithoutnotesCommentsBox={approvalwithoutnotesCommentsBox} approvalnotesCommentsBoxDept={approvalnotesCommentsBoxDept} notesCommentsBox={notesCommentsBox} reappointmentChangesCommentsBox={reappointmentChangesCommentsBox} getNotesDialog={getNotesDialog} getStaffView={getStaffView} staffView = {staffView} getPaymentDisplayBox={getPaymentDisplayBox}/>
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
                    //   getCCDateDialog={getCCDateDialog}
                      getDeptTrackerDialog={getDeptTrackerDialog}
                      getPdfGenerateBox={getPdfGenerateBox}
                      getloading={getloading}
                      getStaffView = {getStaffView}
                      staffView ={staffView}
                      ccDateSetMode = {ccDateSetMode}
                  />
              </Fragment>
          )}
           {activeApplicationTask && (
                <TaskStatusDialog isLoading={isLoading} getloading={getloading} getIsOpen={getActiveApplicationTask} selectedTab={selectedTab}/>
            )}
              {notesCommentsBox && (
                <NotesCommentDialog isLoading={isLoading} getloading={getloading} getIsOpen={getNotesCommentBox} selectedTab={selectedTab}/>
            )}
            {reappointmentChangesCommentsBox && (     
                <ReappointmentApplicationChangesDialog isLoading={isLoading} getloading={getloading} getIsOpen={getReappointmentChangesCommentBox} selectedTab={selectedTab}/>
            )}
              {approvalnotesCommentsBox && (
                <ApprovalWithNotesDialog isLoading={isLoading} getloading={getloading} getIsOpen={getApprovalNotesCommentBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab}/>
            )}
            {paymentDisplayBox && (
                <PaymentDisplayDialog isLoading={isLoading} getloading={getloading} getIsOpen={getPaymentDisplayBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab}/>
            )}
            {approvalwithoutnotesCommentsBox && (
                <ApprovalWithoutNotesDialog isLoading={isLoading} dateStorage={ccMeetingDateSet} getloading={getloading} getIsOpen={getApprovalwithoutNotesCommentBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab}/>
            )}
             {approvalnotesCommentsBoxDept && (
                <ApprovalWithNotesDeptDialog isLoading={isLoading} getloading={getloading} getIsOpen={getApprovalNotesCommentBoxDept} getActiveApplicationView={getActiveApplicationView}  selectedTab={selectedTab}/>
            )}
            {emailDialogBox && (
                <EmailDialog isLoading={isLoading} getloading={getloading} getIsOpen={getEmailDialogBox}/>
            )}
            {showNotesDialog && (
                <NotesDialog isLoading={isLoading} getIsOpen={getNotesDialog} getloading={getloading} getActiveApplicationView={getActiveApplicationView} />
            )}
            {/* {showCCDateDialog && (
                <CCdateDialog isLoading={isLoading} getIsOpen={getCCDateDialog} getloading={getloading} getActiveApplicationView={getActiveApplicationView} />
            )} */}
            {showDeptTrackerDialog && (
                <DepartmentTrackerDialog isLoading={isLoading} getloading={getloading} getIsOpen={getDeptTrackerDialog}  getActiveApplicationView={getActiveApplicationView} getNotesDialog={getNotesDialog}/>
            )}
            {showTimerDialog && (
                <IdleTimer getIsOpen={getTimerDialog} />
            )}
            {showPdfGenrateBox && (
                <PDFGenerateBox isLoading={isLoading} getloading={getloading} getIsOpen={getPdfGenerateBox}/>
            )}
        </>
      )
}

export default StaffApplication;
