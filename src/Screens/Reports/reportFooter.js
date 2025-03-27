import React from 'react';
import HapiCare from "./../../images/PoweredHapiCare.png";
import CommonDivider from '../../Components/CommonFields/CommonDivider';

import style from './index.module.scss';

const ReportFooter = () => {
    return (
        <div>
            <div className={`${style.marginTop40}`}></div>
            <CommonDivider />
            <div className={style.spaceBetween}>
                <div>
                    {/* <div className={style.poweredByTextStyle}>Powered By</div> */}
                    <img src={HapiCare} alt="poweredBy" className={style.reportFooterLogoApplicant} />
                </div>
                {/* <div id='content'>
                    <div className={`${style.reportFooterTextStyle}`} id="pageFooter"></div>
                </div> */}
                <div className={style.marginTop10}>
                    <div className={style.reportCopyRightFooterTextStyle}>© Copyright {new Date()?.getFullYear()}. HapiCare All Rights Reserved.</div>
                </div>
            </div>
        </div>
    )
}

export default ReportFooter;