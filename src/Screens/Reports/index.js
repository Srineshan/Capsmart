import React, { Fragment } from 'react';
import ReportsNavbar from './../../Components/ReportsNavbar';
import Tasks from './tasks';
import './../../index.scss';

const ReportsHome = () => {

    return(
        <Fragment> 
            <ReportsNavbar />
            <Tasks />
        </Fragment>
    )
}

export default ReportsHome;