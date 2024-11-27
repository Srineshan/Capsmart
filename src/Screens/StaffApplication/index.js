import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import StaffApplicationList from './staffApplicationList';
import NewActiveApplication from './newActiveApplication';
import NewCredCommApplication from './newCredCommApplication';
import { Dialog, Classes } from '@blueprintjs/core';
import ValidationDialog from '../../Components/validationDialog';
import TaskStatusDialog from '../../Components/TaskStatusDialog';
import NotesCommentDialog from '../../Components/NotesCommentDialog';
import ApprovalWithNotesDialog from '../../Components/ApprovalWithNotesDialog';
import ApprovalWithoutNotesDialog from '../../Components/ApprovalWithoutNotesDialog';
import ApprovalWithNotesDeptDialog from '../../Components/ApproveWithNotesDeptDialog';
import EmailDialog from '../../Components/EmailDialog';

const StaffApplication = () => {
    const [selectedTab, setSelectedTab] = useState('level-1');
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [credCommApplicationView, setCredCommApplicationView] = useState(false);
    const [activeApplicationTask, setActiveApplicationTask] = useState(false);
    // const [activeApplicationTaskReappoint, setActiveApplicationTaskReappoint] = useState(false);
    const [notesCommentsBox, setNotesCommentBox] = useState(false);
    const [approvalnotesCommentsBox, setApprovalNotesCommentBox] = useState(false);
    const [approvalwithoutnotesCommentsBox, setApprovalwithoutNotesCommentBox] = useState(false);
    const [approvalnotesCommentsBoxDept, setApprovalNotesCommentBoxDept] = useState(false);
    const [emailDialogBox, setEmailDialogBox] = useState(false);
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

    const getNotesCommentBox = (value) => {
        setNotesCommentBox(value);
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
                <NewActiveApplication getSelectedTab={getSelectedTab} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} getApprovalNotesCommentBox={getApprovalNotesCommentBox} getApprovalwithoutNotesCommentBox={getApprovalwithoutNotesCommentBox} getActiveApplicationTask={getActiveApplicationTask} getEmailDialogBox={getEmailDialogBox} getApprovalNotesCommentBoxDept={getApprovalNotesCommentBoxDept} />
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
                      getApprovalNotesCommentBox={getApprovalNotesCommentBox}
                      getApprovalwithoutNotesCommentBox={getApprovalwithoutNotesCommentBox}
                      getApprovalNotesCommentBoxDept={getApprovalNotesCommentBoxDept}
                      getEmailDialogBox={getEmailDialogBox}
                  />
              </Fragment>
          )}
           {activeApplicationTask && (
                <TaskStatusDialog getIsOpen={getActiveApplicationTask}/>
            )}
              {/* {notesCommentsBox && (
                <NotesCommentDialog getIsOpen={getNotesCommentBox}/>
            )} */}
              {approvalnotesCommentsBox && (
                <ApprovalWithNotesDialog getIsOpen={getApprovalNotesCommentBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab}/>
            )}
            {approvalwithoutnotesCommentsBox && (
                <ApprovalWithoutNotesDialog getIsOpen={getApprovalwithoutNotesCommentBox} getActiveApplicationView={getActiveApplicationView} selectedTab={selectedTab}/>
            )}
             {approvalnotesCommentsBoxDept && (
                <ApprovalWithNotesDeptDialog getIsOpen={getApprovalNotesCommentBoxDept} getActiveApplicationView={getActiveApplicationView}/>
            )}
            {emailDialogBox && (
                <EmailDialog getIsOpen={getEmailDialogBox}/>
            )}
        </>
      )
}

export default StaffApplication;
