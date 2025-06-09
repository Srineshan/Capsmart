import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import LocumStaffList from './locumStaffList';
import ApplicantDetailViewScreen from '../../Components/ApplicantDetailViewScreen';
import ViewVerifyScreen from '../../Components/ViewVerifyScreen';
import DepartmentTrackerDialog from '../../Components/DepartmentTrackerDialog';
import LocumExtensionDialog from "../../Components/LocumExtensionDialog";
import LocumExtensionRequestDialog from "../../Components/LocumExtensionRequestDialog";
import LocumRequestDialog from "../../Components/LocumRequestDialog";
import NotesDialog from "../../Components/NotesDialog";
import SummaryDialog from "../../Components/SummaryDialog";

const LocumStaff = () => {
    const [selectedTab, setSelectedTab] = useState('ACTIVELOCUM');
    const [isLoading, setIsLoading] = useState(false);
    const [applicationDetailsView, setApplicationDetailsView] = useState(false);
    const [applicationDetailsViewVerify, setApplicationDetailsViewVerify] = useState(false);
    const [staffView, setStaffView] = useState(false);
    const [showDeptTrackerDialog, setShowDeptTrackerDialog] = useState(false);
    const [showLocumExtensiveDialog, setShowLocumExtensiveDialog] = useState(false);
    const [showLocumExtensiveRequestDialog, setShowLocumExtensiveRequestDialog] = useState(false);
    const [showLocumRequestDialog, setShowLocumRequestDialog] = useState(false);
    const [showNotesDialog, setShowNotesDialog] = useState(false);
    const [showSummaryDialog, setShowSummaryDialog] = useState(false);

    useEffect(() => {
        const fetchSessionDetails = async () => {
            const query = new URLSearchParams(window.location.search);
            const selectTabValue = query.get("selectTabValue");
            const staffId = query.get("staffId");
            const requestId = query.get("requestId");
            console.log(selectTabValue, 'sessionDetails');
            if (!selectTabValue) {
                console.error("No session_id found in URL");
                return;
            } else {
                setSelectedTab(selectTabValue)
            }
            if (!requestId && !staffId) {
                console.error("No session_id found in URL");
                return;
            } else if (selectTabValue === "ACTIVELOCUM" && staffId){
                setShowLocumExtensiveDialog(true)
                sessionStorage.setItem("applicationId", staffId);
            } else if (selectTabValue === "EXPIREDLOCUM" && staffId){
                setShowLocumExtensiveDialog(true)
                sessionStorage.setItem("applicationId", staffId);
            } else if (selectTabValue === "REQUEST" && requestId){
                setShowLocumRequestDialog(true)
                sessionStorage.setItem("applicationId", requestId);
            }
        };
        fetchSessionDetails();
    }, []);

    useEffect(() => {
        if (showLocumRequestDialog) {
            setTimeout (() => {
            const path = window.location.pathname;
            window.history.replaceState(null, '', path);
            }, 2000 )
        }
         if (showLocumExtensiveDialog) {
            setTimeout (() => {
            const path = window.location.pathname;
            window.history.replaceState(null, '', path);
            }, 2000 )
        }
    }, [showLocumRequestDialog,showLocumExtensiveDialog]);


    const getSelectedTab = (value) => {
        setSelectedTab(value);
    }

    const getDeptTrackerDialog = (value) => {
        setShowDeptTrackerDialog(value);
    };

    const getApplicantDetailsViewScreen = (value) => {
        setApplicationDetailsView(value);
    }

    const getActiveApplicationView = (value) => {
    setApplicationDetailsView(false);
    setApplicationDetailsViewVerify(value);
};

    const getStaffView = (value) => {
        setStaffView(value);
    }

    const getLocumExtensiveDialog = (value) => {
        setShowLocumExtensiveDialog(value);
    };

    const getLocumExtensiveRequestDialog = (value) => {
        setShowLocumExtensiveRequestDialog(value);
    };

    const getLocumRequestDialog = (value) => {
        setShowLocumRequestDialog(value);
    };

    const getNotesDialog = (value) => {
        setShowNotesDialog(value);
    };

     const getSummaryDialog = (value) => {
        setShowSummaryDialog(value);
    };

    return (
        <>
            {applicationDetailsView ? (
                < ApplicantDetailViewScreen isLoading={isLoading} getSelectedTab={getSelectedTab} selectedTab={selectedTab} getApplicantDetailsViewScreen={getApplicantDetailsViewScreen} getActiveApplicationView={getActiveApplicationView} getStaffView={getStaffView} staffView={staffView} />
            ) 
            : applicationDetailsViewVerify ? (
                < ViewVerifyScreen isLoading={isLoading} getSelectedTab={getSelectedTab} selectedTab={selectedTab} getApplicantDetailsViewScreen={getApplicantDetailsViewScreen} getActiveApplicationView={getActiveApplicationView}/>
            ) 
            : (
                <Fragment>
                    <Navbar />
                    <LocumStaffList
                        isLoading={isLoading}
                        getSelectedTab={getSelectedTab}
                        selectedTab={selectedTab}
                        getApplicantDetailsViewScreen={getApplicantDetailsViewScreen}
                        getStaffView={getStaffView}
                        staffView={staffView}
                        getDeptTrackerDialog={getDeptTrackerDialog}
                        getLocumExtensiveDialog={getLocumExtensiveDialog}
                        getLocumExtensiveRequestDialog={getLocumExtensiveRequestDialog}
                        getLocumRequestDialog={getLocumRequestDialog}
                        getNotesDialog={getNotesDialog}
                        getSummaryDialog={getSummaryDialog}
                        showLocumExtensiveDialog={showLocumExtensiveDialog}
                        showLocumExtensiveRequestDialog={showLocumExtensiveRequestDialog}
                        showLocumRequestDialog={showLocumRequestDialog}
                    />
                    {showDeptTrackerDialog && (
                        <DepartmentTrackerDialog isLoading={isLoading} getIsOpen={getDeptTrackerDialog} getApplicantDetailsViewScreen={getApplicantDetailsViewScreen} />
                    )}
                    {showNotesDialog && (
                        <NotesDialog isLoading={isLoading} getIsOpen={getNotesDialog} getApplicantDetailsViewScreen={getApplicantDetailsViewScreen} />
                    )}
                    {showSummaryDialog && (
                        <SummaryDialog isLoading={isLoading} getIsOpen={getSummaryDialog} getApplicantDetailsViewScreen={getApplicantDetailsViewScreen} />
                    )}
                    {showLocumExtensiveDialog && (
                        <LocumExtensionDialog isLoading={isLoading} getIsOpen={getLocumExtensiveDialog} selectedTab={selectedTab} getApplicantDetailsViewScreen={getApplicantDetailsViewScreen} />
                    )}
                    {showLocumExtensiveRequestDialog && (
                        <LocumExtensionRequestDialog isLoading={isLoading} getIsOpen={getLocumExtensiveRequestDialog} selectedTab={selectedTab} getApplicantDetailsViewScreen={getApplicantDetailsViewScreen} />
                    )}
                    {showLocumRequestDialog && (
                        <LocumRequestDialog isLoading={isLoading} getIsOpen={getLocumRequestDialog} selectedTab={selectedTab} getApplicantDetailsViewScreen={getApplicantDetailsViewScreen} />
                    )}
                </Fragment>
            )}
        </>
    )
}

export default LocumStaff;
