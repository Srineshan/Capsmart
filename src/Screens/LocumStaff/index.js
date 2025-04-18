import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import LocumStaffList from './locumStaffList';
import NewActiveApplication from '../../Components/ViewVerifyScreen';
import DepartmentTrackerDialog from '../../Components/DepartmentTrackerDialog';
import LocumExtensionDialog from "../../Components/LocumExtensionDialog";
import LocumExtensionReactiveDialog from "../../Components/LocumExtensionReactiveDialog";
import LocumExtensionRequestDialog from "../../Components/LocumExtensionRequestDialog";
import LocumExtensionReactiveRequestDialog from "../../Components/LocumExtensionReactiveRequestDialog";
import NotesDialog from "../../Components/NotesDialog";

const LocumStaff = () => {
    const [selectedTab, setSelectedTab] = useState('ACTIVELOCUM');
    const [isLoading, setIsLoading] = useState(false);
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [staffView, setStaffView] = useState(false);
    const [showDeptTrackerDialog, setShowDeptTrackerDialog] = useState(false);
    const [showLocumExtensiveDialog, setShowLocumExtensiveDialog] = useState(false);
    const [showLocumExtensiveReactiveDialog, setShowLocumExtensiveReactiveDialog] = useState(false);
    const [showLocumExtensiveRequestDialog, setShowLocumExtensiveRequestDialog] = useState(false);
    const [showLocumExtensiveReactiveRequestDialog, setShowLocumExtensiveReactiveRequestDialog] = useState(false);
    const [showNotesDialog, setShowNotesDialog] = useState(false);

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

    const getLocumExtensiveReactiveDialog = (value) => {
        setShowLocumExtensiveReactiveDialog(value);
    };

    const getLocumExtensiveRequestDialog = (value) => {
        setShowLocumExtensiveRequestDialog(value);
    };

    const getLocumExtensiveReactiveRequestDialog = (value) => {
        setShowLocumExtensiveReactiveRequestDialog(value);
    };

    const getNotesDialog = (value) => {
        setShowNotesDialog(value);
    };

    return (
        <>
        {activeApplicationView ? (
                < NewActiveApplication isLoading={isLoading} getSelectedTab={getSelectedTab} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} getStaffView={getStaffView} staffView = {staffView} />
            ) : (
        <Fragment>
            <Navbar />
            <LocumStaffList
                isLoading={isLoading}
                getSelectedTab={getSelectedTab}
                selectedTab={selectedTab}
                getActiveApplicationView={getActiveApplicationView}
                getStaffView = {getStaffView}
                staffView ={staffView}
                getDeptTrackerDialog={getDeptTrackerDialog}
                getLocumExtensiveDialog ={getLocumExtensiveDialog}
                getLocumExtensiveReactiveDialog={getLocumExtensiveReactiveDialog}
                getLocumExtensiveRequestDialog={getLocumExtensiveRequestDialog}
                getLocumExtensiveReactiveRequestDialog={getLocumExtensiveReactiveRequestDialog}
                getNotesDialog = {getNotesDialog}
            />
             {showDeptTrackerDialog && (
                <DepartmentTrackerDialog isLoading={isLoading} getIsOpen={getDeptTrackerDialog} getActiveApplicationView={getActiveApplicationView}/>
            )}
            {showNotesDialog && (
                <NotesDialog isLoading={isLoading} getIsOpen={getNotesDialog} getActiveApplicationView={getActiveApplicationView} />
            )}
              {showLocumExtensiveDialog && (
                <LocumExtensionDialog isLoading={isLoading} getIsOpen={getLocumExtensiveDialog} getActiveApplicationView={getActiveApplicationView} />
            )}
            {showLocumExtensiveReactiveDialog && (
                <LocumExtensionReactiveDialog isLoading={isLoading} getIsOpen={getLocumExtensiveReactiveDialog} getActiveApplicationView={getActiveApplicationView} />
            )}
            {showLocumExtensiveRequestDialog && (
                <LocumExtensionRequestDialog isLoading={isLoading} getIsOpen={getLocumExtensiveRequestDialog} getActiveApplicationView={getActiveApplicationView} />
            )}
            {showLocumExtensiveReactiveRequestDialog && (
                <LocumExtensionReactiveRequestDialog isLoading={isLoading} getIsOpen={getLocumExtensiveReactiveRequestDialog} getActiveApplicationView={getActiveApplicationView} />
            )}
        </Fragment>
            )}
        </>
    )
}

export default LocumStaff;
