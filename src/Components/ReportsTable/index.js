import React from 'react';

import style from './index.module.scss';

const ReportsTable = ({ tableType, tableHeader, tableValue, activitiesServicesValues, styleName }) => {
    return (
        <div className={style.marginTop40}>
            <div className={`${style.entityNameBolderStyle} ${style.textAlignLeft} ${style.marginTop5}`}>{tableType}</div>
            <div className={`${styleName ? `${styleName}` : ''} ${style.marginTop20} ${style.headingBackground}`}>
                {tableHeader?.map((data, index) => (
                    <div className={`${style.reportRunByTextStyle} ${style.verticalAlignCenter}`} key={index}>{data}</div>
                ))}
            </div>
            {
                tableValue?.map((data, index) => (
                    <div className={`${styleName ? `${styleName}` : ''} ${index % 2 === 0 ? style.row1Background : style.row2Background}`} key={`${data}${index}`}>
                        {activitiesServicesValues?.map((innerData, innerIndex) => (
                            <div className={`${style.reportTypeValueTextStyle} ${style.textAlignLeft} ${style.verticalAlignCenter}`} key={`${innerIndex}${innerData?.[index]}`}>{innerData?.[index] !== '' ? innerData?.[index] : '-'}</div>
                        ))}
                    </div>
                ))
            }
        </div>
    )
}

export default ReportsTable;