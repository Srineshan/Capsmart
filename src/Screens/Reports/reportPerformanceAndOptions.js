import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Intent, Dialog, Classes, TextArea } from '@blueprintjs/core';
import { TextField } from '@mui/material';
// import { PDFDownloadLink } from '@react-pdf/renderer';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DownloadingOutlinedIcon from '@mui/icons-material/DownloadingOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import CachedOutlinedIcon from '@mui/icons-material/CachedOutlined';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ZoomInMapIcon from '@mui/icons-material/ZoomInMap';
import Popover from '@mui/material/Popover';
import { useParams } from 'react-router-dom';
import UserLogo1 from './../../images/userLogo3.png';
import UserLogo2 from './../../images/userLogo4.png';
import UserLogo3 from './../../images/userLogo5.png';
import UserLogo4 from './../../images/userLogo6.png';
import Search from './../../images/search.png';
import Info from './../../images/info.png';
import SaveReport from './saveReport';
import ReactToPdf from "react-to-pdf";

import style from './index.module.scss';
// import PDFDocument from './pdf';


const ReportPerformanceAndOptions = ({ handle, getIsRefresh, handlePrint, isUpdated, isLoading, dataToUseInReport, refToUse, getIsDownloadClicked }) => {
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

    const getSaveReportDialog = (value) => {
        setShowSaveReport(value);
    }

    return (
        <div>
            <div className={`${style.spaceBetween} ${style.alignCenter}`}>
                <div className={`${style.displayInRow} ${style.cardPadding} ${style.alignCenter}`}>
                    <div className={style.reportTypeTextStyle}>
                        {reportType === "upcomingContractRenewals" ? 'Upcoming Contract Renewals'
                            : reportType === "oneTimeContract" ? "List of One Time Contracts that will Terminate on Expiration"
                                : reportType === "scheduledActivity" ? "Scheduled Activity/ Services - Forcasted To Actual"
                                    : reportType === "complianceStatus" ? "Proof Of Documentation Status By Contractor"
                                        : reportType === "nonCompliant" ? 'List of Contracts that are non compliant with proof of documentation requirement'
                                            : reportType === "paymentsProcessingSummary" ? 'Payments Processing Summary'
                                                : 'Activities/ Services Log Status Summary'}
                    </div>
                </div>
                <div className={` ${style.margin20}`}>
                    <div className={style.displayInRow}>
                        {/* <img src={Info} className={`${style.infoStyle} ${style.marginTop5}`} /> */}
                        <div className={`${style.displayInRow} ${style.marginLeft20}`}>
                            <Icon icon="star" size={20} color="#FEC106" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#FEC106" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#FEC106" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#D3D3D3" className={style.marginLeft} />
                            <Icon icon="star" size={20} color="#D3D3D3" className={style.marginLeft} />
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer} ${style.marginLeft20}`}
                            onMouseEnter={(e) => setAnchorElRefresh(e.currentTarget)} onMouseLeave={() => setAnchorElRefresh(null)} aria-owns={openRefresh ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <CachedOutlinedIcon style={{ color: isUpdated ? '#F46044' : '#52575D' }} onClick={() => { setShowReportRefreshingDialog(true); getIsRefresh(true) }} />
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
                                <div className={style.popoverStyle}>Click to Refresh this Report</div>
                            </Popover>
                        </div>
                        {/* <div className={`${style.iconPadding} ${style.cursorPointer}`}>
                            <ShareOutlinedIcon style={{color:"#52575D"}} onClick={() => setShowShareDialog(true)} />
                        </div> */}
                        <div className={`${style.iconPadding} ${style.cursorPointer}`}
                            onMouseEnter={(e) => setAnchorElSchedule(e.currentTarget)} onMouseLeave={() => setAnchorElSchedule(null)} aria-owns={openSchedule ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <CalendarTodayIcon style={{ color: "#52575D" }} onClick={() => setShowSaveReport(true)} />
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
                                <div className={style.popoverStyle}>Click to Schedule this Report</div>
                            </Popover>
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer}`} onClick={() => setShowSaveReportOutput(true)}
                            onMouseEnter={(e) => setAnchorElSave(e.currentTarget)} onMouseLeave={() => setAnchorElSave(null)} aria-owns={openSave ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            <SaveOutlinedIcon style={{ color: "#52575D" }} />
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
                        </div>
                        {/* <PDFDownloadLink
                        document={
                            <PDFDocument />
                        }
                        fileName={`report.pdf`}>
                        {({ blob, url, loading, error }) => ( */}
                        {/* <ReactToPdf targetRef={refToUse} filename="sample.pdf" x={.5} y={.5} scale={0.8}>
                            {({ toPdf }) =>  */}
                        <div className={`${style.iconPadding} ${style.cursorPointer}`} onClick={() => getIsDownloadClicked(true)}>
                            <DownloadingOutlinedIcon style={{ color: "#52575D" }} />
                        </div>
                        {/* }
                        </ReactToPdf> */}
                        {/* )}
                        </PDFDownloadLink> */}
                        <div className={`${style.iconPadding} ${style.cursorPointer}`} onClick={handlePrint}
                            onMouseEnter={(e) => setAnchorElPrint(e.currentTarget)} onMouseLeave={() => setAnchorElPrint(null)} aria-owns={openPrint ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true">
                            {/* <Link to={'/chart'} className={style.noFontStyle}> */}
                            <PrintOutlinedIcon style={{ color: "#52575D" }} />
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
                                <div className={style.popoverStyle}>Click to Print this Report</div>
                            </Popover>
                            {/* </Link> */}
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer}`} >
                            {/* {showExpandedView ? ( */}
                            <ZoomOutMapIcon style={{ color: "#52575D" }} onClick={handle.enter} />
                            {/* ) : (
                                <ZoomOutMapIcon style={{color:"#52575D"}} onClick={()=> getShowExpandedView(true)} />
                            )} */}
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
            <Dialog isOpen={isLoading} onClose={() => setShowReportRefreshingDialog(false)} className={`${style.reportSavedDialog} ${style.dialogPaddingBottom}`} canOutsideClickClose={false}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.justifyCenter}>
                        <CachedOutlinedIcon sx={{ fontSize: 60 }} style={{ color: "#7165E3" }} className={style.reportIconStyle} />
                    </div>
                    <div className={style.reportSavedStyle}>Refreshing Report</div>
                </div>
            </Dialog>
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
                                    <Icon icon="cross" className={style.marginTop10} color="#52575D" />
                                </div>
                                <div className={`${style.extensionBorder}`}></div>
                                <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10}`}>
                                    <img src={UserLogo2} alt={'User Logo 2'} className={style.userLogoMailStyle} />
                                    <div>
                                        <p className={`${style.mailIdTextColor}`}>Kyle Wright, MD</p>
                                        <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                    </div>
                                    <Icon icon="cross" className={style.marginTop10} color="#52575D" />
                                </div>
                                <div className={`${style.extensionBorder} `}></div>
                                <div className={`${style.userMailListGrid} ${style.padding10} ${style.marginTop10} `}>
                                    <img src={UserLogo3} alt={'User Logo 3'} className={style.userLogoMailStyle} />
                                    <div>
                                        <p className={`${style.mailIdTextColor}`}>Mathew Bailey, MD</p>
                                        <p className={`${style.descriptionText} ${style.reduceMarginTop}`}>Medical Director, Dept. of Surgery</p>
                                    </div>
                                    <Icon icon="cross" className={style.marginTop10} color="#52575D" />
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
                                    <Icon icon="cross" className={style.marginTop10} color="#52575D" />
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
