import React, { Fragment, useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import LocumStaffList from './locumStaffList';
import NewActiveApplication from '../../Components/ViewVerifyScreen';
import DepartmentTrackerDialog from '../../Components/DepartmentTrackerDialog';
import LocumExtensionDialog from "../../Components/LocumExtensionDialog";
import LocumExtensionRequestDialog from "../../Components/LocumExtensionRequestDialog";
import LocumRequestDialog from "../../Components/LocumRequestDialog";
import NotesDialog from "../../Components/NotesDialog";

const LocumStaff = () => {
    const [selectedTab, setSelectedTab] = useState('ACTIVELOCUM');
    const [isLoading, setIsLoading] = useState(false);
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [staffView, setStaffView] = useState(false);
    const [showDeptTrackerDialog, setShowDeptTrackerDialog] = useState(false);
    const [showLocumExtensiveDialog, setShowLocumExtensiveDialog] = useState(false);
    const [showLocumExtensiveRequestDialog, setShowLocumExtensiveRequestDialog] = useState(false);
    const [showLocumRequestDialog, setShowLocumRequestDialog] = useState(false);
    const [showNotesDialog, setShowNotesDialog] = useState(false);

    useEffect(() => {
        const fetchSessionDetails = async () => {
            const query = new URLSearchParams(window.location.search);
            const selectTabValue = query.get("selectTabValue");
            const staffId = query.get("staffId");
            const path = window.location.pathname;
            console.log(selectTabValue, 'sessionDetails');
            if (!selectTabValue) {
                console.error("No session_id found in URL");
                return;
            } else {
                setSelectedTab(selectTabValue)
            }
            if (!staffId) {
                console.error("No session_id found in URL");
                return;
            } else if (selectTabValue === "ACTIVELOCUM" && staffId){
                setShowLocumExtensiveDialog(true)
                sessionStorage.setItem("applicationId", staffId);
            } else if (selectTabValue === "EXPIREDLOCUM" && staffId){
                setShowLocumExtensiveDialog(true)
                sessionStorage.setItem("applicationId", staffId);
            } else if (selectTabValue === "REQUEST" && staffId){
                setShowLocumRequestDialog(true)
                sessionStorage.setItem("applicationId", staffId);
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

    const getActiveApplicationView = (value) => {
        setActiveApplicationView(value);
    }

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

    return (
        <>
            {activeApplicationView ? (
                < NewActiveApplication isLoading={isLoading} getSelectedTab={getSelectedTab} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} getStaffView={getStaffView} staffView={staffView} />
            ) : (
                <Fragment>
                    <Navbar />
                    <LocumStaffList
                        isLoading={isLoading}
                        getSelectedTab={getSelectedTab}
                        selectedTab={selectedTab}
                        getActiveApplicationView={getActiveApplicationView}
                        getStaffView={getStaffView}
                        staffView={staffView}
                        getDeptTrackerDialog={getDeptTrackerDialog}
                        getLocumExtensiveDialog={getLocumExtensiveDialog}
                        getLocumExtensiveRequestDialog={getLocumExtensiveRequestDialog}
                        getLocumRequestDialog={getLocumRequestDialog}
                        getNotesDialog={getNotesDialog}
                        showLocumExtensiveDialog={showLocumExtensiveDialog}
                        showLocumExtensiveRequestDialog={showLocumExtensiveRequestDialog}
                        showLocumRequestDialog={showLocumRequestDialog}
                    />
                    {showDeptTrackerDialog && (
                        <DepartmentTrackerDialog isLoading={isLoading} getIsOpen={getDeptTrackerDialog} getActiveApplicationView={getActiveApplicationView} />
                    )}
                    {showNotesDialog && (
                        <NotesDialog isLoading={isLoading} getIsOpen={getNotesDialog} getActiveApplicationView={getActiveApplicationView} />
                    )}
                    {showLocumExtensiveDialog && (
                        <LocumExtensionDialog isLoading={isLoading} getIsOpen={getLocumExtensiveDialog} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} />
                    )}
                    {showLocumExtensiveRequestDialog && (
                        <LocumExtensionRequestDialog isLoading={isLoading} getIsOpen={getLocumExtensiveRequestDialog} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} />
                    )}
                    {showLocumRequestDialog && (
                        <LocumRequestDialog isLoading={isLoading} getIsOpen={getLocumRequestDialog} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} />
                    )}
                </Fragment>
            )}
        </>
    )
}

export default LocumStaff;
