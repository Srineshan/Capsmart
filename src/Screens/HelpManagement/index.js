import React, { Fragment, useState } from 'react';
import { Dialog, Classes, Icon, Intent, EditableText } from '@blueprintjs/core';
import Navbar from './../../Components/Navbar';
import Tickets from './tickets';
import Tutorials from './tutorials';
import FAQ from './faq';
import './../../index.scss';
import UserLogo from './../../images/userLogo.jpg';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import FiberManualRecordOutlinedIcon from '@mui/icons-material/FiberManualRecordOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import style from './index.module.scss';
import ReleaseNotes from './releaseNotes';

const HelpHome = () => {
    const [selectedHelp, setSelectedHelp] = useState('TICKETS');
    const [showVideoOptions, setShowVideoOptions] = useState(false);
    const [showVideoConnectingDialog, setShowVideoConnectingDialog] = useState(false);
    const [showChatView, setShowChatView] = useState(false);

    const getSelectedHelp = (value) => {
        setSelectedHelp(value);
    }

return(
        <Fragment> 
            <Navbar />
            {selectedHelp === "TICKETS" ? (
                <Tickets 
                    getSelectedHelp={getSelectedHelp} 
                /> 
            ) : selectedHelp === "TUTORIALS & VIDEOS" ? (
                <Tutorials
                    getSelectedHelp={getSelectedHelp} 
                />
            ) : selectedHelp === "FAQS" ? (
                <FAQ
                    getSelectedHelp={getSelectedHelp} 
                />
            ) : selectedHelp === "RELEASE NOTES" ? (
                <ReleaseNotes
                    getSelectedHelp={getSelectedHelp} 
                />
            ) : ''}
            <div>
                {showChatView && (
                    <div className={style.chatContainer}>
                        <div className={style.blueChatPart}>
                            <div className={style.justifyCenter}>TimeSmart.AI Team</div>
                            <div className={`${style.justifyCenter}`}>
                                <div className={`${style.displayInRow} ${style.marginTop10}`}>
                                    <div>
                                        <img src={UserLogo} alt={'logo'} className={style.userLogoVerySmall} />
                                        <div>Allie</div>
                                    </div>
                                    <div className={style.marginLeft20}>
                                        <img src={UserLogo} alt={'logo'} className={style.userLogoVerySmall} />
                                        <div>Karen</div>
                                    </div>
                                    <div className={style.marginLeft20}>
                                        <img src={UserLogo} alt={'logo'} className={style.userLogoVerySmall} />
                                        <div>John</div> 
                                    </div>
                                </div>
                            </div>
                            <div className={style.marginTop10}>We’re here to answer your questions about your account. Ask us anything.</div>
                        </div>
                        <div className={style.whiteChatPart}>
                            <div className={style.messageSection}>
                                <div className={style.encryptionBox}>
                                    <div className={`${style.encryptionGrid} ${style.verticalCenter}`}>
                                        <div className={`${style.encryptionIconStyle} ${style.alignCenter}`}>
                                            <LockOutlinedIcon sx={{ fontSize: 15 }} className={style.whiteIcon} />
                                        </div>
                                        <div className={style.encryptionFontSize}>
                                        The messages you send to this chat are Secured with end-to-end encryption.
                                        </div>
                                    </div>
                                </div>
                                <div className={`${style.messageAlignment} ${style.messageGrid}`}>
                                    <div className={`${style.displayInRow} ${style.colRev} ${style.marginLeft20}`}>
                                        <img src={UserLogo} alt={'logo'} className={style.chatLogo} />
                                        <img src={UserLogo} alt={'logo'} className={`${style.chatLogo} ${style.chatLogo2Pos}`} />
                                        <img src={UserLogo} alt={'logo'} className={`${style.chatLogo} ${style.chatLogo3Pos}`} />
                                    </div>
                                    <div className={style.messageContainer}>
                                    Hi there, <br /><br />
                                     Welcome to TimeSmart.AI Team!<br /> Please let us know if you have anything questions about your account or anything you might want to share. we would be happy to help you out
                                    </div>
                                </div>
                            </div>
                            <div className={`${style.replySection} ${style.spaceBetween} ${style.verticalCenter}`}>
                                <EditableText placeholder='Write a reply…' multiline={true} />
                                <div className={style.displayInRow}>
                                    <Icon icon="emoji" />
                                    <Icon icon="paperclip" className={style.marginLeft20} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={`${style.displayInRow} ${style.blueCircleContainer}`}>
                    <div className={style.blueCircle} onClick={() => setShowChatView(!showChatView)}>
                        {showChatView ? <CloseOutlinedIcon /> : <ChatOutlinedIcon />}
                    </div>
                    <div className={style.blueCircle} onClick={() => setShowVideoOptions(true)}>
                        <VideocamOutlinedIcon />
                    </div>
                </div>
            </div>
            <Dialog isOpen={showVideoOptions} onClose={() => setShowVideoOptions(false)} className={`${style.videoOptionsDialogStyle} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p></p>
                        <p className={style.extensionStyle}>VIDEO CALL</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowVideoOptions(false)}  />
                    </div>
                    <div>
                        <div className={`${style.displayInCol} ${style.marginTop20} ${style.alignCenter}`}>
                            <button className={style.videoButtonStyle} onClick={() => {setShowVideoConnectingDialog(true);setShowVideoOptions(false)}}>TECHNICAL SUPPORT</button>
                            <button className={`${style.videoButtonStyle} ${style.marginTop20}`} onClick={() => {setShowVideoConnectingDialog(true);setShowVideoOptions(false)}}>ASSESSMENT SUPPORT</button>
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog isOpen={showVideoConnectingDialog} onClose={() => setShowVideoConnectingDialog(false)} className={`${style.videoOptionsDialogStyle} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p></p>
                        <p className={style.extensionStyle}>CONNECTING VIDEO CALL</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowVideoConnectingDialog(false)}  />
                    </div>
                    <div className={style.spaceBetween}>
                        <DesktopWindowsIcon  style={{ fontSize: 80, color: '#7165E3' }} className={style.marginTop10} />
                        <div className={`${style.displayInRow} ${style.verticalCenter}`}>
                            <FiberManualRecordIcon style={{ color: '#7165E3', fontSize: 12}}  className={`${style.marginTop40}`}/>
                            <FiberManualRecordOutlinedIcon style={{ color: '#7165E3', fontSize: 12}}  className={`${style.marginTop40}`} />
                            <FiberManualRecordOutlinedIcon style={{ color: '#7165E3', fontSize: 12}}  className={`${style.marginTop40}`} />
                            <FiberManualRecordOutlinedIcon style={{ color: '#7165E3', fontSize: 12}}  className={`${style.marginTop40}`} />
                            <FiberManualRecordOutlinedIcon style={{ color: '#7165E3', fontSize: 12}}  className={`${style.marginTop40}`} />
                        </div>
                        <DesktopWindowsIcon  style={{ fontSize: 80, color: '#7165E3' }} className={style.marginTop10} />
                    </div>
                    <div>
                        <div className={`${style.displayInCol} ${style.marginTop20} ${style.alignCenter}`}>
                            <button className={style.videoButtonOutlinedStyle} onClick={() => setShowVideoConnectingDialog(false)}>CANCEL</button>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Fragment>
    )
}

export default HelpHome;