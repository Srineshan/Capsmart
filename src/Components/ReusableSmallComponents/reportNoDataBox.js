import React from 'react';
import style from './index.module.scss';


const ReportNoDataBox = ({ heading, subHeading }) => {
    return (
        <div className={`${style.noReportsBox} ${style.alignCenter}`}>
            <div>
                <div className={style.noContractsFontStyle}>{heading}</div>
                <div className={`${style.displayInRow} ${style.justifyCenter} ${style.marginTop20}`}>
                    <div className={style.noContractsSmallFontStyle}>{subHeading} </div>
                </div>
            </div>
        </div>
    )
}

export default ReportNoDataBox;