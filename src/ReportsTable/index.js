import React from 'react';

import style from './index.module.scss';

const ReportsTable = ({tableType, tableHeader, tableValue, activitiesServicesValues, styleName}) => {
    console.log(tableValue, activitiesServicesValues)
    return(
        <div className={style.marginTop20}>
            <div className={`${style.entityNameHeaderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{tableType}</div>
            <div className={`${styleName ? `${styleName}` : ''} ${style.marginTop20}`}>
                {tableHeader?.map((data, index) => (
                    <div className={`${style.reportRunByTextStyle} ${style.marginTop5}`} key={index}>{data}</div> 
                ))}
            </div>
            {
                tableValue?.map((data, index)=>(
                <div className={`${styleName ? `${styleName}` : ''} ${style.marginTop20}`} key={`${data}${index}`}>
                    {activitiesServicesValues?.map((innerData, innerIndex) => (
                        <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.marginTop5}`} key={`${innerIndex}${innerData?.[index]}`}>{innerData?.[index] !== '' ? innerData?.[index] : '-' }</div>
                    ))}
                </div>
                ))
            }
        </div>
    )
}

export default ReportsTable;