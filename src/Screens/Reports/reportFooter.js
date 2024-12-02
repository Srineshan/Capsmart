import React from 'react';
import HapiCare from "./../../images/PoweredHapiCare.png";

import style from './index.module.scss';

const ReportFooter = () => {
    return (
        <div>
            <div className={`${style.headerBorderStyle} ${style.marginTop40}`}></div>
            <div className={style.spaceBetween}>
                <div>
                    {/* <div className={style.poweredByTextStyle}>Powered By</div> */}
                    <img src={HapiCare} alt="poweredBy" className={style.reportFooterLogo} />
                </div>
                {/* <div id='content'>
                    <div className={`${style.reportFooterTextStyle}`} id="pageFooter"></div>
                </div> */}
                <div className={style.marginTop20}>
                    <div className={style.reportFooterTextStyle}>© Copyright {new Date()?.getFullYear()}. HapiCare.</div>
                    <div className={style.reportFooterTextStyle}>All Rights Reserved.</div>
                </div>
            </div>
        </div>
    )
}

export default ReportFooter;