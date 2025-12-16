import React, { useState } from 'react'
import { Dialog, Classes, Icon, Intent } from '@blueprintjs/core';
import Timer from "./../../images/Timer.png";
import Reminder from "./../../images/reminder.png";
import DataEntry from "./../../images/dataEntry.png";
import CrossPink from "../../images/crossPink.png";
import CAPSmart from "./../../images/capSmartTransparent.png";
import style from './index.module.scss'

const AIAssistantDialog = ({ getIsOpen }) => {
    const [isContinue, setIsContinue] = useState(false);
    return (
        <Dialog isOpen={getIsOpen} onClose={() => getIsOpen(false)} className={`${style.loginDialog} ${style.loginDialogBackground}`} canOutsideClickClose={false} canEscapeKeyClose={false}>
            <div>
                <div className={style.whiteBackground}>
                    <div className={style.spaceBetween}>
                        <div></div>
                        <img
                            src={'https://capmanager-dev.s3.us-east-1.amazonaws.com/CAP_Manager.png'}
                            alt="cross"
                            className={`${style.logoStyle}  `}
                        />
                        {/* <p className={style.loginHeaderText}><span className={style.bold}>Cap</span>Smart</p> */}
                        <img
                            src={CrossPink}
                            alt="cross"
                            className={`${style.crossStyle} ${style.cursorPointer} `}
                            onClick={() => { getIsOpen(false) }}
                        />
                    </div>
                    <div className={`${style.featureTextStyle} ${style.marginTop}`}>Our inbuilt <span className={style.featureTextHighlight}> AI Assistant, Poppy,</span> shortens your time to complete this application to just a few minutes.</div>
                    {/* <div className={`${style.featureGrid} ${style.marginTop40}`}>
                        <div className={style.alignCenter}>
                            <div>
                                <div className={`${style.withOrWithoutText} ${style.withoutOpacity}`}>Without Smart AI</div>
                                <div className={`${style.featureTextStyle} ${style.withoutValueOpacity} ${style.valueFont}`}>3 Hours 2 mins</div>
                            </div>
                        </div>
                        <div className={style.alignCenter}>
                            <div>
                                <div className={style.withOrWithoutText}>With Smart AI Assistance</div>
                                <div className={`${style.featureTextStyle} ${style.featureTextHighlight} ${style.valueFont}`}>30 Mins</div>
                            </div>
                        </div>
                    </div> */}
                    <div className={`${style.threeCol} ${style.marginTop}`}>
                        <div className={style.advantagesCard}>
                            <img src={Timer} alt='' className={style.advantagesImageStyle} />
                            <div className={`${style.advantageHeading} ${style.marginTop}`}>90% Faster</div>
                            <div className={`${style.advantageDescription} ${style.marginTop10}`}>Than other conventional credentialing platforms</div>
                        </div>
                        <div className={style.advantagesCard}>
                            <img src={Reminder} alt='' className={style.advantagesImageStyle} />
                            <div className={`${style.advantageHeading} ${style.marginTop}`}>AI Aided Auto-Fill</div>
                            <div className={`${style.advantageDescription} ${style.marginTop10}`}>Simply upload or take pictures of your documents and CAPManager will autofill required data fields throughout your application.</div>
                        </div>
                        <div className={style.advantagesCard}>
                            <img src={DataEntry} alt='' className={style.advantagesImageStyle} />
                            <div className={`${style.advantageHeading} ${style.marginTop}`}>Stay Updated</div>
                            <div className={`${style.advantageDescription} ${style.marginTop10}`}>Get Alerts and Notifications when your application moves through different stages of Review and Approvals.</div>
                        </div>
                    </div>
                </div>
                <div className={`${style.daysToCompleteCard}`}>
                    <div className={`${style.verticalAlignCenter} ${style.alignRight}`}>
                        <div className={`${style.continue} ${style.marginTop}`} onClick={() => { getIsOpen(false) }}>CONTINUE</div>
                    </div>
                </div>
            </div>
        </Dialog>
    )
}

export default AIAssistantDialog;