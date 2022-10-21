import React from 'react';
import { Link } from 'react-router-dom';
import style from './index.module.scss';

const ReportType = () => {
    return(
        <div className={style.reportTypeBackground}>
            <div className={style.grid2}>
                <Link to='/reports/servicesOrActivities' className={style.linkStyle}>
                    <div className={style.justifyCenter}>
                        <div className={style.reportTypeCardStyle}>
                        Services / Activities Log Reports
                        </div>
                    </div>
                </Link>
                <div className={style.justifyCenter}>
                    <div className={style.reportTypeCardStyle}>
                    Payments
                    </div>
                </div>
            </div>
            <div className={`${style.grid2} ${style.marginTop70}`}>
                <div className={style.justifyCenter}>
                    <div className={style.reportTypeCardStyle}>
                    Contract Management
                    </div>
                </div>
                <div className={style.justifyCenter}>
                    <div className={style.reportTypeCardStyle}>
                    Reviews & Approvals
                    </div>
                </div>
            </div>
            <div className={`${style.grid2} ${style.marginTop70}`}>
                <div className={style.justifyCenter}>
                    <div className={style.reportTypeCardStyle}>
                    Timesheet Reports
                    </div>
                </div>
                <div className={style.justifyCenter}>
                    <div className={style.reportTypeCardStyle}>
                    Contract Performance
                    </div>
                </div>
            </div>
            <div className={`${style.grid2} ${style.marginTop70}`}>
                <div className={style.justifyCenter}>
                    <div className={style.reportTypeCardStyle}>
                    Contract Compliance
                    </div>
                </div>
                <div className={style.justifyCenter}>
                    <div className={style.reportTypeCardStyle}>
                    System Administration Reports
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportType;