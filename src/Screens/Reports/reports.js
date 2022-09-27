import React, { useState, useRef, Fragment } from 'react';
import { Checkbox, Icon } from '@blueprintjs/core';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import Envelope from './../../images/envelope-report.png';
import Reject from './../../images/reject-report.png';
import Request from './../../images/request-report.png';
import ToDoReport from './../../images/todo-report.png';
import style from './index.module.scss';
import TimeSheetReports from './timeSheetReport';
import SampleReport from './sampleReport';
import Navbar from '../../Components/Navbar';

const TimeSheetReportsBase = () => {
    const [showSampleReport, setShowSampleReport] = useState(false);

    const getShowSampleReport = (value) => {
        setShowSampleReport(value);
    }

    return(
        <Fragment> 
            <Navbar />
            {!showSampleReport ? (
                <TimeSheetReports getShowSampleReport={getShowSampleReport} />
            ) : (
                <SampleReport />
            )}
        </Fragment>
    )
}

export default TimeSheetReportsBase;