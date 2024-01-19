import React from 'react';

import style from './index.module.scss';

const TrackTable = ({ heading, columnHeading, tableHead, tableHeadTop, tableHeadBottom, tableData, headerGrid, dataGrid, tableHeadGrid, tableHeadTopGrid, tableHeadBottomGrid }) => {
    console.log(tableData)
    const activityValueList = {
        obligatedActivity: 'Obligated Activity',
        supplementalActivity: 'Supplemental Activity',
        addOnActivity: 'Add-On Activity',
        adminActivity: 'Admin Activity',
        clinicalInformaticsActivity: 'Clinical Informatics Activity'
    }
    return (
        <div className={`${style.trackTable} ${style.marginTop20}`}>
            <div className={`${headerGrid}`}>
                {columnHeading?.map((data, index) => (
                    <div key={index}>
                        {(index === 0 && heading !== '') && (
                            <div className={`${style.headingStyle} ${style.textAlignLeft}`}>{heading}</div>
                        )}
                        <div className={`${style.columnHeading} ${style.textAlignLeft}`}>{data}</div>
                    </div>
                ))}
            </div>
            <div className={`${style.divider} ${style.marginTop}`}></div>
            <div className={`${style.tableHeaderStyle} ${style.marginTop20}`}>
                <div className={tableHeadTopGrid}>
                    {tableHeadTop?.map((data, index) => (
                        <div className={`${style.tableHeaderTopBottomTextStyle} ${style.textAlignCenter}`} key={index}>{data}</div>
                    ))}
                </div>
                <div className={tableHeadGrid}>
                    {tableHead?.map((data, index) => (
                        <div className={`${style.tableHeaderTextStyle} ${style.textAlignCenter}`} key={index}>{data}</div>
                    ))}
                </div>
                <div className={tableHeadBottomGrid}>
                    {tableHeadBottom?.map((data, index) => (
                        <div className={`${style.tableHeaderTopBottomTextStyle} ${style.textAlignCenter}`} key={index}>{data}</div>
                    ))}
                </div>
            </div>
            <div className={`${dataGrid} ${style.tableBodyStyle}`}>
                {tableData?.map((data, index) => (
                    <div className={style.dividerRight}>
                        {data?.map((arrayData, arrayDataIndex, array) =>
                            arrayData?.type === 'parentChildService' ? (
                                <div key={index}>
                                    <div className={`${style.tableDataTextStyle} ${style.marginTop20}`}>{activityValueList[arrayData?.name]}</div>
                                    {arrayData?.values?.map(data => (
                                        <div className={`${style.marginLeft20} ${style.tableDataTextStyle} ${style.marginTop20}`}>{data}</div>
                                    ))}
                                </div>
                            ) : arrayData?.type === 'text' ?
                                arrayData?.values?.map((data, indexForColor) => (
                                    <div className={`${style.marginLeft20} ${style.tableDataTextStyle} ${arrayData?.color?.[indexForColor]} ${(arrayData !== array[arrayDataIndex - 1]) ? style.marginDifferenceFromPrevIndex : style.marginTop20}`}>{data < 0 ? `(${data})` : data}</div>
                                )) : arrayData?.type === 'nteAmount' ?
                                    (
                                        <div className={style.alignCenter}>
                                            <div>
                                                <div className={style.marginTop20}>
                                                    <div className={style.nteTextStyle}>CY NTE AMOUNT</div>
                                                    <div className={`${style.nteAmountCard} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {arrayData?.values?.maxContractYearPayment?.toLocaleString()}</div>
                                                </div>
                                                <div className={style.marginTop20}>
                                                    <div className={style.nteTextStyle}>NTE USED</div>
                                                    <div className={`${style.nteAmountCard} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {(arrayData?.values?.maxContractYearPayment - arrayData?.values?.contractYearBalance)?.toLocaleString()}</div>
                                                </div>
                                                <div className={style.marginTop20}>
                                                    <div className={style.nteTextStyle}>NTE BALANCE</div>
                                                    <div className={`${style.nteAmountCardGreen} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {arrayData?.values?.contractYearBalance?.toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (<div></div>)
                        )}
                    </div>
                )
                )}
            </div>
        </div>
    )
}

export default TrackTable;