import React, { Fragment, useState } from 'react';
import Navbar from '../../../Components/Navbar';
import ActiveStaffList from './activeStaffList';
import NewActiveApplication from '../../../Components/ViewVerifyScreen';
import ApplicantDetailsViewScreen from '../../../Components/ApplicantDetailViewScreen';

const ActiveStaff = () => {
    const [selectedTab, setSelectedTab] = useState('PERMANENT');
    const [isLoading, setIsLoading] = useState(false);
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [staffView, setStaffView] = useState(false);
    const [applicationDetailsView, setApplicationDetailsView] = useState(false)

    const getSelectedTab = (value) => {
        setSelectedTab(value);
    }

    const getApplicantDetailsViewScreen = (value) => {
        setApplicationDetailsView(value);
    }

    const getActiveApplicationView = (value) => {
        setApplicationDetailsView(false);
        setActiveApplicationView(value);
    }

    const getStaffView = (value) => {
        setStaffView(value);
    }

    return (
        <>
            {applicationDetailsView ? (
                <ApplicantDetailsViewScreen isLoading={isLoading} getSelectedTab={getSelectedTab} selectedTab={selectedTab} getApplicantDetailsViewScreen={getApplicantDetailsViewScreen} getActiveApplicationView={getActiveApplicationView} />
            ) : activeApplicationView ? (
                < NewActiveApplication isLoading={isLoading} getSelectedTab={getSelectedTab} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} getStaffView={getStaffView} staffView={staffView} />
            ) : (
                <Fragment>
                    <Navbar />
                    <ActiveStaffList
                        isLoading={isLoading}
                        getSelectedTab={getSelectedTab}
                        selectedTab={selectedTab}
                        getActiveApplicationView={getActiveApplicationView}
                        getStaffView={getStaffView}
                        getApplicantDetailsViewScreen={getApplicantDetailsViewScreen}
                        staffView={staffView}
                    />
                </Fragment>
            )}
        </>
    )
}

export default ActiveStaff;
