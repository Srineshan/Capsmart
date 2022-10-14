import React, { Fragment } from 'react';
import Navbar from '../../Components/Navbar';
import Tasks from './tasks';
import './../../index.scss';

const ReportsHome = () => {

    return(
        <Fragment> 
            <Navbar />
            <Tasks />
        </Fragment>
    )
}

export default ReportsHome;