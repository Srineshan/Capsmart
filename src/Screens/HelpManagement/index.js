import React, { Fragment, useState } from 'react';
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import Navbar from './../../Components/Navbar';
import Tickets from './tickets';
import Tutorials from './tutorials';
import FAQ from './faq';
import './../../index.scss';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
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

                        </div>
                        <div className={style.whiteChatPart}>
                             
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