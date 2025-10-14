import React, { Fragment, useState } from 'react';
import Navbar from './../../../Components/Navbar';
import StaffList from './staffList';

const Staffs = () => {
    const [selectedApplicant, setSelectedApplicant] = useState('activestaffs');
    const [activeApplicationView, setActiveApplicationView] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const getSelectedApplicant = (value) => {
        setSearchKey("");
        setSelectedApplicant(value);
        setPage(1);
    }

    const getActiveApplicantView = (value) => {
        setActiveApplicationView(value);
    }

    return (
        <Fragment>
            <Navbar />
            <StaffList
                isLoading={isLoading}
                getSelectedApplicant={getSelectedApplicant}
                selectedApplicant={selectedApplicant}
                totalCount={totalCount}
                page={page}
                getActiveApplicantView={getActiveApplicantView}
                searchKey={searchKey}
            />
        </Fragment>
    )
}

export default Staffs;
