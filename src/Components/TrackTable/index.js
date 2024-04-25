import React, { useState, useRef } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Popover from "@mui/material/Popover";

import style from './index.module.scss';

const useStyles = makeStyles((theme) => ({
    popover: {
        pointerEvents: "none",
    },
    popoverContent: {
        pointerEvents: "auto",
    },
}));

const TrackTable = ({ heading, columnHeading, tableHead, tableHeadTop, tableHeadBottom, tableData, headerGrid, dataGrid, tableHeadGrid, tableHeadTopGrid, tableHeadBottomGrid, header, directionRow, directionRowCommonText }) => {
    const [anchorElTrackeReviewAndApproval, setAnchorElTrackeReviewAndApproval] = useState(null);
    const openTrackeReviewAndApproval = Boolean(anchorElTrackeReviewAndApproval);
    const [anchorElTrackePaymentProcessing, setAnchorElTrackePaymentProcessing] = useState(null);
    const openTrackePaymentProcessing = Boolean(anchorElTrackePaymentProcessing);
    const [anchorElTrackeSubmission, setAnchorElTrackeSubmission] = useState(null);
    const openTrackeSubmission = Boolean(anchorElTrackeSubmission);
    const popoverAnchorTracker = useRef(null);
    const [selectedMenuIndex, setSelectedMenuIndex] = useState(-1);
    const [selectedMenuColIndex, setSelectedMenuColIndex] = useState(-1);
    const handleClickTrackeReviewAndApproval = (event, index, innerIndex) => {
        setAnchorElTrackeReviewAndApproval(event.currentTarget);
        setSelectedMenuIndex(index)
        setSelectedMenuColIndex(innerIndex);
    };

    const handleCloseTrackeReviewAndApproval = () => {
        setAnchorElTrackeReviewAndApproval(null);
    };
    const handleClickTrackePaymentProcessing = (event, index, innerIndex) => {
        setAnchorElTrackePaymentProcessing(event.currentTarget);
        setSelectedMenuIndex(index)
        setSelectedMenuColIndex(innerIndex);
    };

    const handleCloseTrackePaymentProcessing = () => {
        setAnchorElTrackePaymentProcessing(null);
    };
    const handleClickTrackeSubmission = (event, index, innerIndex) => {
        setAnchorElTrackeSubmission(event.currentTarget);
        setSelectedMenuIndex(index)
        setSelectedMenuColIndex(innerIndex);
    };

    const handleCloseTrackeSubmission = () => {
        setAnchorElTrackeSubmission(null);
    };
    const classes = useStyles();

    const activityValueList = {
        obligatedActivity: 'Obligated Activity',
        supplementalActivity: 'Supplemental Activity',
        addOnActivity: 'Add-On Activity',
        adminActivity: 'Admin Activity',
        clinicalInformaticsActivity: 'Clinical Informatics Activity'
    }
    console.log(tableData)
    return (
        <div className={`${style.trackTable} ${style.marginTop20}`}>
            {header && (
                <>
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
                </>
            )}
            <div className={`${style.tableHeaderStyle} ${header ? style.marginTop20 : ''}`}>
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
            {!directionRow ? (
                <div className={`${style.tableBodyStyle}`}>
                    <div className={`${dataGrid}`}>
                        {tableData?.map((data, index) => (
                            <div className={tableData?.length !== (index + 1) ? style.dividerRight : ''}>
                                {data?.map((arrayData, arrayDataIndex) =>
                                    arrayData?.type === 'parentChildService' ? (
                                        <div key={arrayDataIndex}>
                                            <div className={`${style.tableDataTextStyle} ${style.marginTop}`}>{activityValueList[arrayData?.name]}</div>
                                            {arrayData?.values?.map(data => (
                                                <div className={`${style.paddingLeft20} ${style.tableDataTextStyle} ${style.marginTop}`}>{data}</div>
                                            ))}
                                        </div>
                                    ) : arrayData?.type === 'number' ?
                                        arrayData?.values?.map((data, indexForColor) => (
                                            <div className={`${style.tableDataTextStyle} ${arrayData?.color?.[indexForColor]} ${(indexForColor === 0) ? style.marginDifferenceFromPrevIndex : style.marginTop} ${style.textAlignCenter}`}>{data === -1 ? '-' : data < 0 ? `(${data})` : data}</div>
                                        )) : arrayData?.type === 'text' ?
                                            arrayData?.values?.map((data, indexForColor) => (
                                                <div className={`${style.tableDataNormalTextStyle}  ${style.marginTop} ${style.textAlignCenter}`}>{data !== undefined ? data : '-'}</div>
                                            ))
                                            //  : arrayData?.type === 'nteAmount' ?
                                            //     (
                                            //         <div className={`${style.alignCenter} ${style.verticalAlignCenter} `}>
                                            //             <div>
                                            //                 <div className={style.marginTop20}>
                                            //                     <div className={style.nteTextStyle}>CY NTE AMOUNT</div>
                                            //                     <div className={`${style.nteAmountCard} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {arrayData?.values?.maxContractYearPayment?.toLocaleString("en-US")}</div>
                                            //                 </div>
                                            //                 <div className={style.marginTop20}>
                                            //                     <div className={style.nteTextStyle}>CY NTE USED</div>
                                            //                     <div className={`${style.nteAmountCard} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {(arrayData?.values?.maxContractYearPayment - arrayData?.values?.contractYearBalance)?.toLocaleString("en-US")}</div>
                                            //                 </div>
                                            //                 <div className={style.marginTop20}>
                                            //                     <div className={style.nteTextStyle}>AVERAGE PAYMENT PER TIMESHEET</div>
                                            //                     <div className={`${style.nteAmountCard} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {arrayData?.values?.averagePaymentPerTimesheet?.toLocaleString("en-US")}</div>
                                            //                 </div>
                                            //                 <div className={style.marginTop20}>
                                            //                     <div className={style.nteTextStyle}>CY NTE BALANCE</div>
                                            //                     <div className={`${arrayData?.values?.contractYearBalanceStatus === "SUFFICIENT" ? style.nteAmountCardGreen : style.nteAmountCardYellow} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {arrayData?.values?.contractYearBalance?.toLocaleString("en-US")}</div>
                                            //                 </div>
                                            //                 <div className={style.marginTop20}>
                                            //                     <div className={style.nteTextStyle}>CY NTE PROJECTED BALANCE</div>
                                            //                     <div className={`${arrayData?.values?.contractYearProjectedBalanceStatus === "SUFFICIENT" ? style.nteAmountCardGreen : style.nteAmountCardYellow} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {arrayData?.values?.contractYearProjectedBalance?.toLocaleString("en-US")}</div>
                                            //                 </div>
                                            //                 <div className={style.marginTop20}>
                                            //                     <div className={style.nteTextStyle}>CP NTE BALANCE</div>
                                            //                     <div className={`${arrayData?.values?.contractPeriodBalanceStatus === "SUFFICIENT" ? style.nteAmountCardGreen : style.nteAmountCardYellow} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {arrayData?.values?.contractPeriodBalance?.toLocaleString("en-US")}</div>
                                            //                 </div>
                                            //                 <div className={style.marginTop20}>
                                            //                     <div className={style.nteTextStyle}>CP NTE PROJECTED BALANCE</div>
                                            //                     <div className={`${arrayData?.values?.contractPeriodProjectedBalanceStatus === "SUFFICIENT" ? style.nteAmountCardGreen : style.nteAmountCardYellow} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {arrayData?.values?.contractPeriodProjectedBalance?.toLocaleString("en-US")}</div>
                                            //                 </div>
                                            //             </div>
                                            //         </div>
                                            //     ) 
                                            : (<div></div>)
                                )}
                            </div>
                        )
                        )}
                    </div>
                    {/* <div className={`${style.alignCenter} ${style.verticalAlignCenter} `}> */}
                    <div className={style.nteGrid}>
                        <div className={style.marginTop20}>
                            <div className={style.nteTextStyle}>CY NTE AMOUNT</div>
                            <div className={`${style.nteAmountCard} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {tableData[tableData?.length - 1][0]?.values?.maxContractYearPayment?.toLocaleString("en-US")}</div>
                        </div>
                        <div className={style.marginTop20}>
                            <div className={style.nteTextStyle}>CY NTE USED</div>
                            <div className={`${style.nteAmountCard} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {(tableData[tableData?.length - 1][0]?.values?.maxContractYearPayment - tableData[tableData?.length - 1][0]?.values?.contractYearBalance)?.toLocaleString("en-US")}</div>
                        </div>
                        <div className={style.marginTop20}>
                            <div className={style.nteTextStyle}>AVERAGE PAYMENT PER TIMESHEET</div>
                            <div className={`${style.nteAmountCard} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {tableData[tableData?.length - 1][0]?.values?.averagePaymentPerTimesheet?.toLocaleString("en-US")}</div>
                        </div>
                        <div className={style.marginTop20}>
                            <div className={style.nteTextStyle}>CY NTE BALANCE</div>
                            <div className={`${tableData[tableData?.length - 1][0]?.values?.contractYearBalanceStatus === "SUFFICIENT" ? style.nteAmountCardGreen : style.nteAmountCardYellow} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {tableData[tableData?.length - 1][0]?.values?.contractYearBalance?.toLocaleString("en-US")}</div>
                        </div>
                        <div className={style.marginTop20}>
                            <div className={style.nteTextStyle}>CY NTE PROJECTED BALANCE</div>
                            <div className={`${tableData[tableData?.length - 1][0]?.values?.contractYearProjectedBalanceStatus === "SUFFICIENT" ? style.nteAmountCardGreen : style.nteAmountCardYellow} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {tableData[tableData?.length - 1][0]?.values?.contractYearProjectedBalance?.toLocaleString("en-US")}</div>
                        </div>
                        <div className={style.marginTop20}>
                            <div className={style.nteTextStyle}>CP NTE BALANCE</div>
                            <div className={`${tableData[tableData?.length - 1][0]?.values?.contractPeriodBalanceStatus === "SUFFICIENT" ? style.nteAmountCardGreen : style.nteAmountCardYellow} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {tableData[tableData?.length - 1][0]?.values?.contractPeriodBalance?.toLocaleString("en-US")}</div>
                        </div>
                        <div className={style.marginTop20}>
                            <div className={style.nteTextStyle}>CP NTE PROJECTED BALANCE</div>
                            <div className={`${tableData[tableData?.length - 1][0]?.values?.contractPeriodProjectedBalanceStatus === "SUFFICIENT" ? style.nteAmountCardGreen : style.nteAmountCardYellow} ${style.verticalAlignCenter} ${style.alignCenter} ${style.marginTop5}`}>$ {tableData[tableData?.length - 1][0]?.values?.contractPeriodProjectedBalance?.toLocaleString("en-US")}</div>
                        </div>
                    </div>
                    {/* </div> */}
                </div>
            ) : directionRowCommonText ? (
                tableData?.[0][Object.keys(tableData?.[0])?.[0]]?.map((data, index) => (
                    <div className={`${dataGrid} ${style.tableBodyStyle}  ${index % 2 === 0 && style.alternativeBackgroundColor}`} key={index}>
                        {tableData?.[0]?.order?.map((innerData, innerIndex) => (
                            <div className={`${style.tableDataNormalTextStyle} ${style.padding} ${tableData?.[0]?.order?.length - 1 !== innerIndex ? style.dividerRight : ''} ${tableData?.[0]?.[innerData][index] === "Timesheet Not Entered" ? style.redLabel : ''} ${innerData === 'interval' ? style.textAlignCenter : ''}`}>{tableData?.[0]?.[innerData][index]}</div>
                        ))}
                    </div>
                ))
                // <></>
            ) : tableData?.map((data, index) => (
                <div className={`${dataGrid} ${style.tableBodyStyle}`} key={index}>
                    {data?.timesheetName?.map((innerData, innerIndex) => (
                        <>
                            <div className={`${style.tableDataNormalTextStyle}  ${style.paddingTop} ${style.textAlignCenter} ${style.dividerRight}`}>{data?.timesheetName[innerIndex]}</div>
                            <div className={`${style.tableDataNormalTextStyle}  ${style.paddingTop} ${style.textAlignCenter} ${style.dividerRight}`}>{data?.timesheetContractName[innerIndex]}</div>
                            <div className={`${style.tableDataNormalTextStyle}  ${style.paddingTop} ${style.textAlignCenter} ${style.dividerRight}`}
                                onMouseEnter={(e) => handleClickTrackeSubmission(e, index, innerIndex)}
                                onMouseLeave={() => handleCloseTrackeSubmission()}
                                aria-owns={openTrackeSubmission ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true">{data?.submissionStatusAndDate[innerIndex]?.icon} {data?.submissionStatusAndDate[innerIndex]?.value}
                                {index === selectedMenuIndex && innerIndex === selectedMenuColIndex && data?.submissionStatusAndDate[innerIndex]?.length !== 0 && data?.submissionStatusAndDate[innerIndex]?.status !== '' && (
                                    <Popover
                                        id={'mouse-over-popover'}
                                        sx={{
                                            pointerEvents: 'none',
                                        }}
                                        open={openTrackeSubmission}
                                        anchorEl={anchorElTrackeSubmission}
                                        onClose={handleCloseTrackeSubmission}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        disableRestoreFocus
                                    >
                                        <div
                                            className={style.statusPopoverCard}
                                            onClick={() => handleCloseTrackeSubmission()}
                                        >
                                            {data?.submissionStatusAndDate[innerIndex]?.status}
                                        </div>
                                    </Popover>
                                )}
                            </div>
                            <div className={`${style.tableDataNormalTextStyle}  ${style.paddingTop} ${style.textAlignCenter} ${style.dividerRight}`}
                                onMouseEnter={(e) => handleClickTrackeReviewAndApproval(e, index, innerIndex)}
                                onMouseLeave={() => handleCloseTrackeReviewAndApproval()}
                                aria-owns={openTrackeReviewAndApproval ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true">{data?.reviewAndApprovalStatusAndDate[innerIndex]?.icon} {data?.reviewAndApprovalStatusAndDate[innerIndex]?.value}
                                {index === selectedMenuIndex && innerIndex === selectedMenuColIndex && data?.reviewAndApprovalStatusAndDate[innerIndex]?.length !== 0 && data?.reviewAndApprovalStatusAndDate[innerIndex]?.status !== '' && (
                                    <Popover
                                        id={'mouse-over-popover'}
                                        sx={{
                                            pointerEvents: 'none',
                                        }}
                                        open={openTrackeReviewAndApproval}
                                        anchorEl={anchorElTrackeReviewAndApproval}
                                        onClose={handleCloseTrackeReviewAndApproval}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        disableRestoreFocus
                                    >
                                        <div
                                            className={style.statusPopoverCard}
                                            onClick={() => handleCloseTrackeReviewAndApproval()}
                                        >
                                            {data?.reviewAndApprovalStatusAndDate[innerIndex]?.status}
                                        </div>
                                    </Popover>
                                )}
                            </div>
                            <div className={`${style.tableDataNormalTextStyle}  ${style.paddingTop} ${style.textAlignCenter} ${style.dividerRight}`}>{data?.reviewAndApprovalApprovalDays[innerIndex]}</div>
                            <div className={`${style.tableDataNormalTextStyle}  ${style.paddingTop} ${style.textAlignCenter} ${style.dividerRight}`}
                                onMouseEnter={(e) => handleClickTrackePaymentProcessing(e, index, innerIndex)}
                                onMouseLeave={() => handleCloseTrackePaymentProcessing()}
                                aria-owns={openTrackePaymentProcessing ? 'mouse-over-popover' : undefined}
                                aria-haspopup="true">{data?.paymentProcessingStatusAndDate[innerIndex]?.icon} {data?.paymentProcessingStatusAndDate[innerIndex]?.value}
                                {index === selectedMenuIndex && innerIndex === selectedMenuColIndex && data?.paymentProcessingStatusAndDate[innerIndex]?.length !== 0 && data?.paymentProcessingStatusAndDate[innerIndex]?.status !== '' && (
                                    <Popover
                                        id={'mouse-over-popover'}
                                        sx={{
                                            pointerEvents: 'none',
                                        }}
                                        open={openTrackePaymentProcessing}
                                        anchorEl={anchorElTrackePaymentProcessing}
                                        onClose={handleCloseTrackePaymentProcessing}
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'left',
                                        }}
                                        disableRestoreFocus
                                    >
                                        <div
                                            className={style.statusPopoverCard}
                                            onClick={() => handleCloseTrackePaymentProcessing()}
                                        >
                                            {data?.paymentProcessingStatusAndDate[innerIndex]?.status}
                                        </div>
                                    </Popover>
                                )}
                            </div>
                            <div className={`${style.tableDataNormalTextStyle}  ${style.paddingTop} ${style.textAlignCenter} ${style.dividerRight}`}>{data?.paymentProcessingApprovalDays[innerIndex]}</div>
                            <div className={`${style.tableDataNormalTextStyle}  ${style.paddingTop} ${style.textAlignCenter}`}>{data?.remainingTerm[innerIndex]}</div>
                        </>
                    ))}
                </div>
            ))}
        </div >
    )
}

export default TrackTable;