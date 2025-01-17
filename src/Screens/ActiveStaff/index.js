import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import ActiveStaffList from './activeStaffList';
import NewActiveApplication from '../../Components/ViewVerifyScreen';

const ActiveStaff = () => {
    const [selectedTab, setSelectedTab] = useState('PERMANENT');
    const [isLoading, setIsLoading] = useState(false);
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [staffView, setStaffView] = useState(false);

    const getSelectedTab = (value) => {
        setSelectedTab(value);
    }

    const getActiveApplicationView = (value) => {
        setActiveApplicationView(value);
    }

    const getStaffView = (value) => {
        setStaffView(value);
    }

    return (
        <>
        {activeApplicationView ? (
                < NewActiveApplication isLoading={isLoading} getSelectedTab={getSelectedTab} selectedTab={selectedTab} getActiveApplicationView={getActiveApplicationView} getStaffView={getStaffView} staffView = {staffView} />
            ) : (
        <Fragment>
            <Navbar />
            <ActiveStaffList
                isLoading={isLoading}
                getSelectedTab={getSelectedTab}
                selectedTab={selectedTab}
                getActiveApplicationView={getActiveApplicationView}
                getStaffView = {getStaffView}
                staffView ={staffView}
            />
        </Fragment>
            )}
        </>
    )
}

export default ActiveStaff;
