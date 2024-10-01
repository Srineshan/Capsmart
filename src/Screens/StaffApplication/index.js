import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import StaffApplicationList from './staffApplicationList';
import NewActiveApplication from './newActiveApplication';

const StaffApplication = () => {
    const [selectedTab, setSelectedTab] = useState('chiefOfStaff');
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getSelectedTab = (value) => {
        setSelectedTab(value);
    }

    const getActiveApplicationView = (value) => {
        setActiveApplicationView(value);
    }

    return (
        activeApplicationView ? (
            <NewActiveApplication getActiveApplicationView={getActiveApplicationView} />
        ) : (
            <Fragment>
                <Navbar />
                <StaffApplicationList
                    isLoading={isLoading}
                    getSelectedTab={getSelectedTab}
                    selectedTab={selectedTab}
                    getActiveApplicationView={getActiveApplicationView}
                />
            </Fragment>
        )
    )
}

export default StaffApplication;
