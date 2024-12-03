import React, { useState } from 'react';
import { Icon, Intent, Dialog, Classes, TextArea } from '@blueprintjs/core';
import { TextField } from '@mui/material';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DownloadingOutlinedIcon from '@mui/icons-material/DownloadingOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import Popover from '@mui/material/Popover';
import { useParams } from 'react-router-dom';
import UserLogo1 from './../../images/userLogo3.png';
import UserLogo2 from './../../images/userLogo4.png';
import UserLogo3 from './../../images/userLogo5.png';
import UserLogo4 from './../../images/userLogo6.png';
import Search from './../../images/search.png';
import ReportsRefresh from './../../images/reportsRefresh.png';
import ReportsDownload from './../../images/reportsDownload.png';
import ReportsSchedule from './../../images/reportsSchedule.png';
import ReportsPrint from './../../images/reportsPrint.png';
import ReportsFullScreen from './../../images/reportsFullScreen.png';
import ReportsShare from './../../images/reportsShare.png';
import Info from './../../images/info.png';
import SaveReport from './saveReport';
import { format } from 'date-fns';

import style from './index.module.scss';

const ReportPerformanceAndOptions = ({ handle, handlePrint, dataToUseInReport, refToUse, getIsDownloadClicked, isNoData }) => {
    const { reportType } = useParams();
    const [showSaveReportOutput, setShowSaveReportOutput] = useState(false);
    const [showReportRefreshingDialog, setShowReportRefreshingDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [showReportSavedDialog, setShowReportSavedDialog] = useState(false);
    const [showSaveReport, setShowSaveReport] = useState(false);
    const [anchorElRefresh, setAnchorElRefresh] = useState(null);
    const openRefresh = Boolean(anchorElRefresh);
    const [anchorElSchedule, setAnchorElSchedule] = useState(null);
    const openSchedule = Boolean(anchorElSchedule);
    const [anchorElSave, setAnchorElSave] = useState(null);
    const openSave = Boolean(anchorElSave);
    const [anchorElPrint, setAnchorElPrint] = useState(null);
    const openPrint = Boolean(anchorElPrint);
    const [anchorElDownload, setAnchorElDownload] = useState(null);
    const openDownload = Boolean(anchorElDownload);
    const [anchorElFullscreen, setAnchorElFullscreen] = useState(null);
    const openFullscreen = Boolean(anchorElFullscreen);
    const [anchorElInfo, setAnchorElInfo] = useState(null);
    const openInfo = Boolean(anchorElInfo);

    const reportTitleList = {
        upcomingContractRenewals: 'Upcoming Contract Renewals',
        oneTimeContract: "List of One Time Contracts that will Terminate on Expiration",
        scheduledActivity: "Scheduled Activity/ Services - Forcasted To Actual",
        scheduledActivityByContract: "Scheduled Activity/ Services - Forcasted To Actual By Contract",
        complianceStatus: "Proof Of Documentation Status By Contractor",
        nonCompliant: 'List of Contracts that are non compliant with proof of documentation requirement',
        paymentsProcessingSummary: 'Payments Processing Summary',
        compensationCostAnalysis: 'Compensation Cost Analysis',
        timesheetProcessingSummary: 'Timesheet Processing Summary',
        listingOfTimesheetsNotPaid: 'Listing Of Timesheets Not Paid',
        submittedTimesheetsPaymentStatus: 'Submitted Timesheets Payment Status',
        addOnActivities: 'Add On Activities/ Services Requests Status Summary',
        activitiesOrServices: 'Activities/ Services Log Status Summary',
        contractDocumentsOnFile: 'Contract Documents On File',
        multiProviderContractsList: 'Multi Provider Contracts List',
        contractsWithABusinessEntity: 'Contracts With A Business Entity',
        currentRemitToAddressForActiveContracts: 'Current Remit To Address For Active Contracts',
        activityStatusTracker: `Status Of Activities/ Services By Service Provider For ${format(new Date(), 'MMMM yyyy')}`,
        paymentProcessingStatusTracker: 'Payment Processing Status By Service Provider'
    }

    const getSaveReportDialog = (value) => {
        setShowSaveReport(value);
    }

    return (
        <div>
            <div className={`${style.spaceBetween} ${style.alignCenter}`}>
                <div className={`${style.displayInRow} ${style.cardPadding} ${style.alignCenter}`}>
                    <div className={style.reportTypeTextStyle}>
                        {reportTitleList[reportType]}
                    </div>
                    <div onMouseEnter={(e) => setAnchorElInfo(e.currentTarget)} onMouseLeave={() => setAnchorElInfo(null)} aria-owns={openInfo ? 'mouse-over-popover' : undefined} aria-haspopup="true">
                        <img src={Info} className={`${style.infoStyle} ${style.marginTop5} ${style.marginLeft10}`} />
                        <Popover
                            id={'mouse-over-popover'}
                            sx={{
                                pointerEvents: 'none',
                            }}
                            open={openInfo}
                            anchorEl={anchorElInfo}
                            onClose={() => setAnchorElInfo(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            disableRestoreFocus
                        >
                            <div className={style.popoverStyle}>{reportTitleList[reportType]}</div>
                        </Popover>
                    </div>
                </div>
                <div className={` ${style.margin20}`}>
                    <div className={style.displayInRow}>
                        {/* <img src={Info} className={`${style.infoStyle} ${style.marginTop5}`} /> */}
                        {/* <div className={`${style.displayInRow} ${style.marginLeft20}`}>
                            <Icon icon="star" size={20} color="#FFCA27" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#FFCA27" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#FFCA27" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#D3D3D3" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#D3D3D3" className={style.marginLeft} />
                        </div> */}
                        <div className={`${style.iconPadding} ${style.cursorPointer} ${style.marginLeft20}`}
                            onMouseEnter={(e) => setAnchorElRefresh(e.currentTarget)} onMouseLeave={() => setAnchorElRefresh(null)} aria-owns={openRefresh ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <img src={ReportsRefresh} alt="" className={`${style.reportsActions} ${style.marginTop5}`} onClick={() => { setShowReportRefreshingDialog(true); window.location.reload() }} />
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openRefresh}
                                anchorEl={anchorElRefresh}
                                onClose={() => setAnchorElRefresh(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click To Refresh This Report</div>
                            </Popover>
                        </div>
                        {/* <div className={`${style.iconPadding} ${style.cursorPointer}`}>
                            <ShareOutlinedIcon style={{color:"#2C2C2C"}} onClick={() => setShowShareDialog(true)} />
                        </div> */}
                        <div className={`${style.iconPadding} ${style.cursorPointer} ${isNoData && style.disabledCursor}`}
                            onMouseEnter={(e) => !isNoData ? setAnchorElSchedule(e.currentTarget) : {}} onMouseLeave={() => !isNoData ? setAnchorElSchedule(null) : {}} aria-owns={openSchedule ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <img src={ReportsSchedule} alt="" className={`${style.reportsActions} ${style.marginTop5}`} onClick={() => !isNoData ? setShowSaveReport(true) : {}} />
                            {/* <CalendarTodayIcon style={{ color: "#2C2C2C" }} onClick={() => !isNoData ? setShowSaveReport(true) : {}} /> */}
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openSchedule}
                                anchorEl={anchorElSchedule}
                                onClose={() => setAnchorElSchedule(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click To Schedule This Report</div>
                            </Popover>
                        </div>
                        {/* <div className={`${style.iconPadding} ${style.cursorPointer}`} onClick={() => setShowSaveReportOutput(true)}
                            onMouseEnter={(e) => setAnchorElSave(e.currentTarget)} onMouseLeave={() => setAnchorElSave(null)} aria-owns={openSave ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <SaveOutlinedIcon style={{ color: "#2C2C2C" }} />
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openSave}
                                anchorEl={anchorElSave}
                                onClose={() => setAnchorElSave(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click to Save this Report</div>
                            </Popover>
                        </div> */}
                        <div className={`${style.iconPadding} ${style.cursorPointer} ${isNoData && style.disabledCursor}`} onClick={() => !isNoData ? getIsDownloadClicked(true) : {}}
                            onMouseEnter={(e) => !isNoData ? setAnchorElDownload(e.currentTarget) : {}} onMouseLeave={() => !isNoData ? setAnchorElDownload(null) : {}} aria-owns={openDownload ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <img src={ReportsDownload} alt="" className={`${style.reportsActions} ${style.marginTop5}`} />
                            {/* <DownloadingOutlinedIcon style={{ color: "#2C2C2C" }} /> */}
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openDownload}
                                anchorEl={anchorElDownload}
                                onClose={() => setAnchorElDownload(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click To Download This Report</div>
                            </Popover>
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer} ${isNoData && style.disabledCursor}`} onClick={!isNoData ? handlePrint : {}}
                            onMouseEnter={(e) => !isNoData ? setAnchorElPrint(e.currentTarget) : {}} onMouseLeave={() => !isNoData ? setAnchorElPrint(null) : {}} aria-owns={openPrint ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <img src={ReportsPrint} alt="" className={`${style.reportsActions} ${style.marginTop5}`} />
                            {/* <PrintOutlinedIcon style={{ color: "#2C2C2C" }} /> */}
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openPrint}
                                anchorEl={anchorElPrint}
                                onClose={() => setAnchorElPrint(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click To Print This Report</div>
                            </Popover>
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer} ${isNoData && style.disabledCursor}`}
                            onMouseEnter={(e) => !isNoData ? setAnchorElFullscreen(e.currentTarget) : {}} onMouseLeave={() => !isNoData ? setAnchorElFullscreen(null) : {}} aria-owns={openFullscreen ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true" >
                            <img src={ReportsFullScreen} alt="" className={`${style.reportsActions} ${style.marginTop5}`} onClick={!isNoData ? handle.enter : {}} />
                            {/* <ZoomOutMapIcon style={{ color: "#2C2C2C" }} onClick={!isNoData ? handle.enter : {}} /> */}
                            <Popover
                                id={'mouse-over-popover'}
                                sx={{
                                    pointerEvents: 'none',
                                }}
                                open={openFullscreen}
                                anchorEl={anchorElFullscreen}
                                onClose={() => setAnchorElFullscreen(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                disableRestoreFocus
                            >
                                <div className={style.popoverStyle}>Click To View This Report In Full Screen</div>
                            </Popover>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.blueBorderStyle}></div>
            <Dialog isOpen={showSaveReportOutput} onClose={() => setShowSaveReportOutput(false)} className={`${style.sendMailUserDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>Save This Report Output</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowSaveReportOutput(false)} />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={`${style.padding10}`}>
                        <div>
                            <div className={`${style.marginTop20} ${style.recipientsDataHeight}`}>
                                <div className={style.displayInCol}>
                                    <label for="standard-basic" className={style.saveReportLabelStyle}>Report Output Name</label>
                                    <TextField id="standard-basic" variant="standard" value="Report Name - ABC" className={`${style.threeColWidth} ${style.saveReportFieldStyle} ${style.marginTop10}`} />
                                </div>
                                <div className={style.marginTop20}>
                                    <label for="description" className={`${style.saveReportLabelStyle}`}>Report Output Notes</label>
                                    <TextArea id="description" rows={5} placeholder="Enter Notes" className={`${style.fullWidth} ${style.saveReportFieldStyle} ${style.marginTop10}`} />
                                </div>
                            </div>
                            <div>
                                <div className={`${style.justifyCenter} ${style.marginTop20}`}>
                                    <button className={`${style.saveButtonStyle} ${style.marginLeft20} ${style.cursorPointer} `} onClick={() => { setShowReportSavedDialog(true); setShowSaveReportOutput(false) }}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog isOpen={showReportSavedDialog} onClose={() => setShowReportSavedDialog(false)} className={`${style.reportSavedDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.justifyCenter}>
                        <div className={style.reportIconStyle}></div>
                    </div>
                    <div className={style.reportSavedStyle}>Report Saved</div>
                </div>
            </Dialog>
            {/* <Dialog isOpen={isLoading} onClose={() => setShowReportRefreshingDialog(false)} className={`${style.reportSavedDialog} ${style.dialogPaddingBottom}`} canOutsideClickClose={false}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.justifyCenter}>
                        <CachedOutlinedIcon sx={{ fontSize: 60 }} style={{ color: "#06617A" }} className={style.reportIconStyle} />
                    </div>
                    <div className={style.reportSavedStyle}>Refreshing Report</div>
                </div>
            </Dialog> */}
            <Dialog isOpen={showShareDialog} onClose={() => setShowShareDialog(false)} className={`${style.sendMailUserDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>Share This Report Output</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowShareDialog(false)} />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={style.spaceBetween}>
                        <div className={style.displayInRow}>
                            <p className={`${style.mailBoldText} ${style.marginTop20} ${style.blueText}`}>Registered Users</p>
                            <div className={`${style.taskCountStyle} ${style.marginTop20} ${style.marginLeft20}`}>20</div>
                            <p className={`${style.mailBoldText} ${style.marginTop20} ${style.externalRecipientsMarginLeft}`}>External Recipients</p>
                            <div className={style.deliveryCountStyle}>20</div>
                            <div className={`${style.searchBarStyle} ${style.spaceBetween} ${style.externalRecipientsMarginLeft}`}>
                                <p>Search</p>
                                <img src={Search} className={style.searchIcon} />
                            </div>
                        </div>
                    </div>
                    <div className={`${style.extensionBorder} ${style.marginTop10}`}></div>
                    <div className={`${style.padding10}`}>
                        <div>
                            <div className={style.padding10}>
                                <div className={`${style.userMailListGrid} ${style.padding10} `}>
                                    <img src={UserLogo1} alt={'User Logo 1'} className={style.userLogoMailStyle} />
                                    <div>
                                        <p className={`${style.mailIdTextColor}`}>Ronald Jones (Myself)</p>
                                        <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                    </div>
                                    <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
                                </div>
                                <div className={`${style.extensionBorder}`}></div>
                                <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10}`}>
                                    <img src={UserLogo2} alt={'User Logo 2'} className={style.userLogoMailStyle} />
                                    <div>
                                        <p className={`${style.mailIdTextColor}`}>Kyle Wright, MD</p>
                                        <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                    </div>
                                    <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
                                </div>
                                <div className={`${style.extensionBorder} `}></div>
                                <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10} `}>
                                    <img src={UserLogo3} alt={'User Logo 3'} className={style.userLogoMailStyle} />
                                    <div>
                                        <p className={`${style.mailIdTextColor}`}>Mathew Bailey, MD</p>
                                        <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                    </div>
                                    <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
                                </div>
                                <div className={`${style.extensionBorder}`}></div>
                                <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10}`}>
                                    <img src={UserLogo4} alt={'User Logo 4'} className={style.userLogoMailStyle} />
                                    <div className={style.displayInRow}>
                                        <div>
                                            <p className={`${style.mailIdTextColor}`}>Ronnie Owens, MD</p>
                                            <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                        </div>
                                    </div>
                                    <Icon icon="cross" className={style.marginTop10} color="#2C2C2C" />
                                </div>
                                <div className={`${style.extensionBorder}`}></div>
                            </div>
                            <div>
                                <div className={`${style.justifyCenter} ${style.marginTop20}`}>
                                    <button className={`${style.cloneButtonStyle} ${style.marginLeft20} ${style.cursorPointer} `}>{'Share Now'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            {showSaveReport && (
                <SaveReport getSaveReportDialog={getSaveReportDialog} dataToUseInReport={dataToUseInReport} reportType={reportType} />
            )}
        </div>
    )
}

export default ReportPerformanceAndOptions;
