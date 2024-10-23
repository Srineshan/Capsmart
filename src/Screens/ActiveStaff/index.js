import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import ActiveStaffList from './activeStaffList';

const ActiveStaff = () => {
    const [selectedTab, setSelectedTab] = useState('PERMANENT');
    const [isLoading, setIsLoading] = useState(false);

    const getSelectedTab = (value) => {
        setSelectedTab(value);
    }

    return (
        <>
        <Fragment>
            <Navbar />
            <ActiveStaffList
                isLoading={isLoading}
                getSelectedTab={getSelectedTab}
                selectedTab={selectedTab}
            />
        </Fragment>
        </>
    )
}

export default ActiveStaff;
