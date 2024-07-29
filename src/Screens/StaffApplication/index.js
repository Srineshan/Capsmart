import React, { Fragment, useState } from 'react';
import Navbar from '../../Components/Navbar';
import StaffApplicationList from './staffApplicationList';
import NewActiveApplication from './newActiveApplication';

const StaffApplication = () => {
    const [selectedApplicant, setSelectedApplicant] = useState('Applicants');
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const getSelectedApplicant = (value) => {
        setSelectedApplicant(value);
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
                    getSelectedApplicant={getSelectedApplicant}
                    selectedApplicant={selectedApplicant}
                    getActiveApplicationView={getActiveApplicationView}
                />
            </Fragment>
        )
    )
}

export default StaffApplication;
