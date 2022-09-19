import React, {useState} from 'react';
import {Link} from 'react-router-dom';
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
import { useParams } from 'react-router-dom';
import UserLogo1 from './../../images/userLogo3.png';
import UserLogo2 from './../../images/userLogo4.png';
import UserLogo3 from './../../images/userLogo5.png';
import UserLogo4 from './../../images/userLogo6.png';
import Search from './../../images/search.png';
import Info from './../../images/info.png';
import SaveReport from './saveReport';

import style from './index.module.scss';
// import PDFDocument from './pdf';


const ReportPerformanceAndOptions = ({getShowExpandedView, showExpandedView}) => {
    const {reportType} = useParams();
    const [showSaveReportOutput, setShowSaveReportOutput] = useState(false);
    const [showReportRefreshingDialog, setShowReportRefreshingDialog] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);
    const [showReportSavedDialog, setShowReportSavedDialog] = useState(false);
    const [showSaveReport, setShowSaveReport] = useState(false);

    const getSaveReportDialog = (value) => {
        setShowSaveReport(value);
    }

    return(
        <div>
            <div className={`${style.spaceBetween} ${style.alignCenter}`}>
                <div className={`${style.displayInRow} ${style.cardPadding} ${style.alignCenter}`}>
                    <div className={style.reportTypeTextStyle}>
                        {reportType === "upcomingContractRenewals" ? 'Upcoming Contract Renewals'
                        : reportType === "oneTimeContract" ? "List of One Time Contracts that will Terminate on Expiration"
                        : reportType === "scheduledActivity" ? "Scheduled Activity/ Services - Forcasted To Actual"
                        : reportType === "complianceStatus" ? "Proof Of Documentation Status By Contractor"
                        : reportType === "nonCompliant" ? 'List of Contracts that are non compliant with proof of documentation requirement' 
                        : 'Activities/ Services Log Status Summary'}
                    </div>
                    <img src={Info} className={`${style.infoStyle} ${style.marginLeft20}`} />
                    <div className={`${style.displayInRow} ${style.marginLeft20} ${style.reduceMarginTop}`}>
                        <Icon icon="star" size={20} color="#FEC106" className={style.marginLeft} />
                        <Icon icon="star" size={20} color="#FEC106" className={style.marginLeft} />
                        <Icon icon="star" size={20} color="#FEC106" className={style.marginLeft} />
                        <Icon icon="star" size={20} color="#D3D3D3" className={style.marginLeft} />
                        <Icon icon="star" size={20} color="#D3D3D3" className={style.marginLeft} />
                    </div>
                </div>
                <div className={` ${style.margin20}`}>
                    <div className={style.displayInRow}>
                        <div className={`${style.iconPadding} ${style.cursorPointer}`}>
                            <CachedOutlinedIcon style={{color:"#52575D"}} onClick={() => setShowReportRefreshingDialog(true)} />
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer}`}>
                            <ShareOutlinedIcon style={{color:"#52575D"}} onClick={() => setShowShareDialog(true)} />
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer}`}>
                            <CalendarTodayIcon style={{color:"#52575D"}} onClick={()=> setShowSaveReport(true)} />
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer}`} onClick={() => setShowSaveReportOutput(true)}>
                            <SaveOutlinedIcon style={{color:"#52575D"}} />
                        </div>
                      {/* <PDFDownloadLink
                        document={
                            <PDFDocument />
                        }
                        fileName={`report.pdf`}>
                        {({ blob, url, loading, error }) => ( */}
                            <div className={`${style.iconPadding} ${style.cursorPointer}`}>
                                <DownloadingOutlinedIcon style={{color:"#52575D"}} />
                            </div>
                         {/* )}
                        </PDFDownloadLink> */}
                        <div className={`${style.iconPadding} ${style.cursorPointer}`} onClick={() => window.print()} >
                            {/* <Link to={'/chart'} className={style.noFontStyle}> */}
                                <PrintOutlinedIcon style={{color:"#52575D"}} />
                            {/* </Link> */}
                        </div>
                        <div className={`${style.iconPadding} ${style.cursorPointer}`} >
                            {showExpandedView ? (
                                <ZoomInMapIcon style={{color:"#52575D"}} onClick={()=> getShowExpandedView(false)} />
                            ) : (
                                <ZoomOutMapIcon style={{color:"#52575D"}} onClick={()=> getShowExpandedView(true)} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.blueBorderStyle}></div>
            <Dialog isOpen={showSaveReportOutput} onClose={() => setShowSaveReportOutput(false)} className={`${style.sendMailUserDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>Save This Report Output</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowSaveReportOutput(false)}  />
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
                                    <button className={`${style.saveButtonStyle} ${style.marginLeft20} ${style.cursorPointer} `} onClick={() => {setShowReportSavedDialog(true);setShowSaveReportOutput(false)}}>Save</button>
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
            <Dialog isOpen={showReportRefreshingDialog} onClose={() => setShowReportRefreshingDialog(false)} className={`${style.reportSavedDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.justifyCenter}>
                        <CachedOutlinedIcon sx={{ fontSize: 60 }} style={{color:"#7165E3"}} className={style.reportIconStyle}  />
                    </div>
                    <div className={style.reportSavedStyle}>Refreshing Report</div>
                </div>
            </Dialog>
            <Dialog isOpen={showShareDialog} onClose={() => setShowShareDialog(false)} className={`${style.sendMailUserDialog} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.deleteEcecutedContractDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p className={`${style.extensionStyle} ${style.marginTop} ${style.bold}`}>Share This Report Output</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowShareDialog(false)}  />
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
                <SaveReport getSaveReportDialog={getSaveReportDialog} />
            )}
        </div>
    )
}

export default ReportPerformanceAndOptions;
