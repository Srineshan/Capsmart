import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import StaffApplicationList from './staffApplicationList';
import NewActiveApplication from './newActiveApplication';
import NewCredCommApplication from './newCredCommApplication';
import { Dialog, Classes } from '@blueprintjs/core';
import ValidationDialog from '../../Components/validationDialog';
import TaskStatusDialog from '../../Components/TaskStatusDialog';
import NotesCommentDialog from '../../Components/NotesCommentDialog';
import ReappointmentApplicationChangesDialog from '../../Components/ReappointmentApplicationChangesDialog';
import ApprovalWithNotesDialog from '../../Components/ApprovalWithNotesDialog';
import ApprovalWithoutNotesDialog from '../../Components/ApprovalWithoutNotesDialog';
import ApprovalWithNotesDeptDialog from '../../Components/ApproveWithNotesDeptDialog';
import EmailDialog from '../../Components/EmailDialog';
import NotesDialog from "../../Components/NotesDialog";
import IdleTimer from '../../Components/IdleTimer';
import DepartmentTrackerDialog from '../../Components/DepartmentTrackerDialog'

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
    const [emailDialogBox, setEmailDialogBox] = useState(false);
    const [showNotesDialog, setShowNotesDialog] = useState(false);
    const [showDeptTrackerDialog, setShowDeptTrackerDialog] = useState(false);
    const [showTimerDialog, setShowTimerDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getSelectedTab = (value) => {
        setSelectedTab(value);
    }

    const getActiveApplicationView = (value) => {
        setActiveApplicationView(value);
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

    const getDeptTrackerDialog = (value) => {
        setShowDeptTrackerDialog(value);
    };

    const getTimerDialog = (value) => {
        setShowTimerDialog(value);
    };
    

    const getNotesCommentBox = (value) => {
        setNotesCommentBox(value);
    }

    const getReappointmentChangesCommentBox = (value) => {
        setReappointmentChangesCommentsBox(value);
    }

    const getApprovalNotesCommentBox = (value) => {
        setApprovalNotesCommentBox(value);
    }

    const getApprovalwithoutNotesCommentBox = (value) => {
        setApprovalwithoutNotesCommentBox(value);
    }

    const getApprovalNotesCommentBoxDept = (value) => {
        setApprovalNotesCommentBoxDept(value);
    }

    const getEmailDialogBox = (value) => {
        setEmailDialogBox(value);
    }

    return (
        <>
            {activeApplicationView ? (
                <NewActiveApplication getSelectedTab={getSelectedTab} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} getApprovalNotesCommentBox={getApprovalNotesCommentBox} getApprovalwithoutNotesCommentBox={getApprovalwithoutNotesCommentBox} getActiveApplicationTask={getActiveApplicationTask} getEmailDialogBox={getEmailDialogBox} getApprovalNotesCommentBoxDept={getApprovalNotesCommentBoxDept} emailDialogBox={emailDialogBox} showTimerDialog={showTimerDialog} approvalnotesCommentsBox={approvalnotesCommentsBox} approvalwithoutnotesCommentsBox={approvalwithoutnotesCommentsBox} approvalnotesCommentsBoxDept={approvalnotesCommentsBoxDept} notesCommentsBox={notesCommentsBox} reappointmentChangesCommentsBox={reappointmentChangesCommentsBox}/>
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
                      emailDialogBox={emailDialogBox}
                      approvalnotesCommentsBox={approvalnotesCommentsBox}
                      approvalwithoutnotesCommentsBox={approvalwithoutnotesCommentsBox}
                      approvalnotesCommentsBoxDept={approvalnotesCommentsBoxDept}
                      notesCommentsBox={notesCommentsBox}
                      reappointmentChangesCommentsBox={reappointmentChangesCommentsBox}
                      showTimerDialog={showTimerDialog}
                      getNotesDialog={getNotesDialog}
                      getDeptTrackerDialog={getDeptTrackerDialog}
                  />
              </Fragment>
          )}
           {activeApplicationTask && (
                <TaskStatusDialog getIsOpen={getActiveApplicationTask}/>
            )}
              {notesCommentsBox && (
                <NotesCommentDialog getIsOpen={getNotesCommentBox} selectedTab={selectedTab}/>
            )}
            {reappointmentChangesCommentsBox && (
                <ReappointmentApplicationChangesDialog getIsOpen={getReappointmentChangesCommentBox} selectedTab={selectedTab}/>
            )}
              {approvalnotesCommentsBox && (
                <ApprovalWithNotesDialog getIsOpen={getApprovalNotesCommentBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab}/>
            )}
            {approvalwithoutnotesCommentsBox && (
                <ApprovalWithoutNotesDialog getIsOpen={getApprovalwithoutNotesCommentBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab}/>
            )}
             {approvalnotesCommentsBoxDept && (
                <ApprovalWithNotesDeptDialog getIsOpen={getApprovalNotesCommentBoxDept} getActiveApplicationView={getActiveApplicationView}  selectedTab={selectedTab}/>
            )}
            {emailDialogBox && (
                <EmailDialog getIsOpen={getEmailDialogBox}/>
            )}
            {showNotesDialog && (
                <NotesDialog getIsOpen={getNotesDialog} getActiveApplicationView={getActiveApplicationView} />
            )}
            {showDeptTrackerDialog && (
                <DepartmentTrackerDialog getIsOpen={getDeptTrackerDialog} />
            )}
            {showTimerDialog && (
                <IdleTimer getIsOpen={getTimerDialog} />
            )}
        </>
      )
}

export default StaffApplication;
