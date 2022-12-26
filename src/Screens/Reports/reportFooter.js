import React from 'react';
import TimeSmartLogo from './../../images/timeSmartAI-logo.png';

import style from './index.module.scss';

const ReportFooter = () => {
    return (
        <div>
            <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
            <div className={style.spaceBetween}>
                <div>
                    <div className={style.poweredByTextStyle}>Powered By</div>
                    <img src={TimeSmartLogo} alt="poweredBy" className={style.reportFooterLogo} />
                </div>
                <div className={style.marginTop20}>
                    <div className={style.reportFooterTextStyle}>© 2022, by TimeSmart.AI</div>
                    <div className={style.reportFooterTextStyle}>All Rights Reserved</div>
                </div>
            </div>
        </div>
    )
}

export default ReportFooter;