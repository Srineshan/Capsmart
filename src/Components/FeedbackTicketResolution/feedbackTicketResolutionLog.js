import React, { useState, useEffect, useRef } from 'react';
import { Dialog, Classes } from "@blueprintjs/core";
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import { useReactToPrint } from 'react-to-print';
import { GET } from './../../Screens/dataSaver';
import TimeSmartLogo from '../../images/timeSmartAILogo.png';
import WhiteTimeSmartLogo from '../../images/whiteLogo.png';
import RedWarning from '../../images/redWarning.png';
import FeedbackStepper1 from '../../images/feedbackStepper1.png';
import FeedbackStepper2 from '../../images/feedbackStepper2.png';
import FeedbackStepper3 from '../../images/feedbackStepper3.png';
import FeedbackStepper4 from '../../images/feedbackStepper4.png';
import FeedbackStepper5 from '../../images/feedbackStepper5.png';
import FeedbackStepper6 from '../../images/feedbackStepper6.png';
import FeedbackStepper7 from '../../images/feedbackStepper7.png';
import FeedbackStepper8 from '../../images/feedbackStepper8.png';
import FeedbackStepper9 from '../../images/feedbackStepper9.png';

import { format } from 'date-fns';

import style from './index.module.scss';

const FeedbackTicketResolutionLog = ({ getShowFeedbackTicketResolutionLog, ticketId }) => {
    const [ticketLog, setTicketLog] = useState([]);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        getTicketLog();
    }, [])

    const getTicketLog = async () => {
        const { data: log } = await GET(`feedback-management-service/ticket/${ticketId}/ticketLogs`);
        setTicketLog(log);
    }

    console.log(ticketLog)
    return (
        <Dialog isOpen={getShowFeedbackTicketResolutionLog} onClose={() => getShowFeedbackTicketResolutionLog(false)} className={`${style.addManagerDialogBackground} ${style.feedbackLogDialog}`}>
            <div className={`${Classes.DIALOG_BODY} `} ref={componentRef}>
                <div className={style.feedbackLogHeaderGrid}>
                    <div>
                        <img src={TimeSmartLogo} alt="logo" className={style.logoStyle} />
                    </div>
                    <div>
                        <div className={style.headerTitle}>FEEDBACK TICKET RESOLUTION LOG</div>
                        <div className={`${style.subHeading} ${style.marginTop5}`}>REPORT NOT WORKING LOREM IPSUM LOREM IPSUM</div>
                        <div className={`${style.displayInRow} ${style.justifyCenter} ${style.marginTop5}`}>
                            <img src={RedWarning} alt="warning" className={`${style.warningStyle} ${style.marginRight}`} />
                            <div className={style.subHeading}>FBTID-001</div>
                        </div>
                    </div>
                    <div>
                        <img src={TimeSmartLogo} alt="logo" className={style.logoStyle} />
                        <PrintOutlinedIcon className={`${style.headerPrintIcon} ${style.cursorPointer}`} onClick={handlePrint} />
                    </div>
                </div>
                <div className={`${style.logMainGrid} ${style.logMainBoxStyle} ${style.marginTop10}`}>
                    <div className={style.leftCardStyle}>
                        <div className={style.miniHeading}>Ticket Resolution Progress:</div>
                        <div className={`${style.miniHeadingTitles} ${style.justifyCenter} ${style.red} ${style.marginTop10}`}>
                            FEEDBACK TICKET CLOSED
                        </div>
                        <div className={`${style.miniHeadingTitles} ${style.justifyCenter} ${style.blue}`}>
                            TODAY
                        </div>
                        <div className={`${style.smallTextStyle} ${style.justifyCenter}`}>{format(new Date(), 'MMM d, yyyy')}</div>
                        <div className={`${style.smallTextStyle} ${style.justifyCenter}`}>Surya Raj- Timesmart.Ai</div>
                        <div className={`${style.feedbackTicketClosedGrid} ${style.marginTop5}`}>
                            <div className={`${style.verticalAlignCenter} ${style.stepperLeftContent} ${style.marginTop20} ${style.alignRight}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.green} ${style.alignRight}`}>Application code update</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'MMM d, yyyy')}</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'H m')} EST</div>
                                </div>
                            </div>
                            <div className={style.feedbackVerticalStepper}></div>
                            <div className={`${style.stepperStyle} ${style.verticalAlignCenter} `}>
                                <div className={`${style.alignCenter} ${style.stepperImgStyle} ${style.marginTop20}`}>
                                    <img src={FeedbackStepper1} alt={'stepperImg'} className={`${style.feedbackStepperImgStyle} ${style.alignCenter}`} />
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperRightContent} ${style.marginTop20}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.blue}`}>Partner / customer resolution response</div>
                                    <div className={`${style.smallTextStyle}`}>Surya Raj- Timesmart.Ai</div>
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperLeftContent} ${style.marginTop20} ${style.alignRight}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.green} ${style.alignRight}`}>Application code update</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'MMM d, yyyy')}</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'H m')} EST</div>
                                </div>
                            </div>
                            <div className={style.feedbackVerticalStepper}></div>
                            <div className={`${style.verticalAlignCenter} `}>
                                <div className={`${style.alignCenter} ${style.stepperImgStyle} ${style.marginTop20}`}>
                                    <img src={FeedbackStepper2} alt={'stepperImg'} className={`${style.feedbackStepperImgStyle} ${style.alignCenter}`} />
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperRightContent} ${style.marginTop20}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.blue}`}>Production release</div>
                                    <div className={`${style.smallTextStyle}`}>Surya Raj- Timesmart.Ai</div>
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperLeftContent} ${style.marginTop20} ${style.alignRight}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.green} ${style.alignRight}`}>Technical code review</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'MMM d, yyyy')}</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'H m')} EST</div>
                                </div>
                            </div>
                            <div className={style.feedbackVerticalStepper}></div>
                            <div className={`${style.verticalAlignCenter} `}>
                                <div className={`${style.alignCenter} ${style.stepperImgStyle} ${style.marginTop20}`}>
                                    <img src={FeedbackStepper3} alt={'stepperImg'} className={`${style.feedbackStepperImgStyle} ${style.alignCenter}`} />
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperRightContent} ${style.marginTop20}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.blue}`}>Quality assurance review</div>
                                    <div className={`${style.smallTextStyle}`}>Surya Raj- Timesmart.Ai</div>
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperLeftContent} ${style.marginTop20} ${style.alignRight}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.red} ${style.alignRight}`}>Bug resolution verified</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'MMM d, yyyy')}</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'H m')} EST</div>
                                </div>
                            </div>
                            <div className={style.feedbackVerticalStepper}></div>
                            <div className={`${style.verticalAlignCenter} `}>
                                <div className={`${style.alignCenter} ${style.stepperImgStyle} ${style.marginTop20}`}>
                                    <img src={FeedbackStepper4} alt={'stepperImg'} className={`${style.feedbackStepperImgStyle} ${style.alignCenter}`} />
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperRightContent} ${style.marginTop20}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.blue}`}>Technical support engineer update</div>
                                    <div className={`${style.smallTextStyle}`}>Surya Raj- Timesmart.Ai</div>
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperLeftContent} ${style.marginTop20} ${style.alignRight}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.yellow} ${style.alignRight}`}>Resolution timeline provided</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'MMM d, yyyy')}</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'H m')} EST</div>
                                </div>
                            </div>
                            <div className={style.feedbackVerticalStepper}></div>
                            <div className={`${style.verticalAlignCenter} `}>
                                <div className={`${style.alignCenter} ${style.stepperImgStyle} ${style.marginTop20}`}>
                                    <img src={FeedbackStepper5} alt={'stepperImg'} className={`${style.feedbackStepperImgStyle} ${style.alignCenter}`} />
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperRightContent} ${style.marginTop20}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.blue}`}>Partner / customer response by</div>
                                    <div className={`${style.smallTextStyle}`}>Surya Raj- Timesmart.Ai</div>
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperLeftContent} ${style.marginTop20} ${style.alignRight}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.green} ${style.alignRight}`}>Bug validated & jira ticket opened</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'MMM d, yyyy')}</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'H m')} EST</div>
                                </div>
                            </div>
                            <div className={style.feedbackVerticalStepper}></div>
                            <div className={`${style.verticalAlignCenter} `}>
                                <div className={`${style.alignCenter} ${style.stepperImgStyle} ${style.marginTop20}`}>
                                    <img src={FeedbackStepper6} alt={'stepperImg'} className={`${style.feedbackStepperImgStyle} ${style.alignCenter}`} />
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperRightContent} ${style.marginTop20}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.blue}`}>Technical support engineer review</div>
                                    <div className={`${style.smallTextStyle}`}>Ranjith Kumar - TimeSmart.Ai</div>
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperLeftContent} ${style.marginTop20} ${style.alignRight}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.orange} ${style.alignRight}`}>Status response to customer</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'MMM d, yyyy')}</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'H m')} EST</div>
                                </div>
                            </div>
                            <div className={style.feedbackVerticalStepper}></div>
                            <div className={`${style.verticalAlignCenter} `}>
                                <div className={`${style.alignCenter} ${style.stepperImgStyle} ${style.marginTop20}`}>
                                    <img src={FeedbackStepper7} alt={'stepperImg'} className={`${style.feedbackStepperImgStyle} ${style.alignCenter}`} />
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperRightContent} ${style.marginTop20}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.blue}`}>Customer response by</div>
                                    <div className={`${style.smallTextStyle}`}>Sandeep Dahiya - Partner Name</div>
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperLeftContent} ${style.marginTop20} ${style.alignRight}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.green} ${style.alignRight}`}>Ticket verified & logged</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'MMM d, yyyy')}</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'H m')} EST</div>
                                </div>
                            </div>
                            <div className={style.feedbackVerticalStepper}></div>
                            <div className={`${style.verticalAlignCenter} `}>
                                <div className={`${style.alignCenter} ${style.stepperImgStyle} ${style.marginTop20}`}>
                                    <img src={FeedbackStepper8} alt={'stepperImg'} className={`${style.feedbackStepperImgStyle} ${style.alignCenter}`} />
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperRightContent} ${style.marginTop20}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.blue}`}>Reviewed by</div>
                                    <div className={`${style.smallTextStyle}`}>Sandeep Dahiya - Partner Name</div>
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperLeftContent} ${style.marginTop20} ${style.alignRight}`}>
                                <div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'MMM d, yyyy')}</div>
                                    <div className={`${style.smallTextStyle} ${style.alignRight}`}>{format(new Date(), 'H m')} EST</div>
                                </div>
                            </div>
                            <div className={style.feedbackVerticalStepper}></div>
                            <div className={`${style.verticalAlignCenter} `}>
                                <div className={`${style.alignCenter} ${style.stepperImgStyle} ${style.marginTop20}`}>
                                    <img src={FeedbackStepper9} alt={'stepperImg'} className={`${style.feedbackStepperImgStyle} ${style.alignCenter}`} />
                                </div>
                            </div>
                            <div className={`${style.verticalAlignCenter} ${style.stepperRightContent} ${style.marginTop20}`}>
                                <div>
                                    <div className={`${style.miniHeadingTitles} ${style.blue}`}>Submitted by</div>
                                    <div className={`${style.smallTextStyle}`}>Ajay Shah Contract Manager</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={style.rightCardStyle}>
                        <div className={style.miniHeading}>Feedback Ticket Comments</div>
                        <div className={`${style.miniHeadingTitles} ${style.green} ${style.marginTop10}`}>
                            Application Code Update
                        </div>
                        <div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                                <div className={style.userProfileStyle}></div>
                                <div className={`${style.userNameStyle} ${style.marginLeft20}`}>Philipp Stevens  Md</div>
                                <div className={`${style.smallTextStyle} ${style.marginLeft20}`}>3 days ago</div>
                            </div>
                            <div className={style.descriptionStyle}>
                                lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus ac nisl tempor elementum. aliquam a eros porttitor, commodo
                            </div>
                        </div>
                        <div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                                <div className={style.userProfileStyle}></div>
                                <div className={`${style.userNameStyle} ${style.marginLeft20}`}>Philipp Stevens  Md</div>
                                <div className={`${style.smallTextStyle} ${style.marginLeft20}`}>3 days ago</div>
                            </div>
                            <div className={style.descriptionStyle}>
                                lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus ac nisl tempor elementum. aliquam a eros porttitor, commodo
                            </div>
                        </div>
                        <div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                                <div className={style.userProfileStyle}></div>
                                <div className={`${style.userNameStyle} ${style.marginLeft20}`}>Philipp Stevens  Md</div>
                                <div className={`${style.smallTextStyle} ${style.marginLeft20}`}>3 days ago</div>
                            </div>
                            <div className={style.descriptionStyle}>
                                lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus ac nisl tempor elementum. aliquam a eros porttitor, commodo
                            </div>
                        </div>
                        <div className={`${style.miniHeadingTitles} ${style.blue} ${style.marginTop20}`}>
                            Technical Code Review
                        </div>
                        <div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                                <div className={style.userProfileStyle}></div>
                                <div className={`${style.userNameStyle} ${style.marginLeft20}`}>Philipp Stevens  Md</div>
                                <div className={`${style.smallTextStyle} ${style.marginLeft20}`}>3 days ago</div>
                            </div>
                            <div className={style.descriptionStyle}>
                                lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus ac nisl tempor elementum. aliquam a eros porttitor, commodo
                            </div>
                        </div>
                        <div className={`${style.miniHeadingTitles} ${style.red} ${style.marginTop20}`}>
                            Status Response To Customer
                        </div>
                        <div>
                            <div className={`${style.displayInRow} ${style.verticalAlignCenter} ${style.marginTop10}`}>
                                <div className={style.userProfileStyle}></div>
                                <div className={`${style.userNameStyle} ${style.marginLeft20}`}>Philipp Stevens  Md</div>
                                <div className={`${style.smallTextStyle} ${style.marginLeft20}`}>3 days ago</div>
                            </div>
                            <div className={style.descriptionStyle}>
                                lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus ac nisl tempor elementum. aliquam a eros porttitor, commodo
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.feedBackLogFooterStyle}>
                <div className={`${style.footerLogoStyle} ${style.justifyCenter}`}>
                    <img src={WhiteTimeSmartLogo} alt="logo" className={style.logoStyle} />
                </div>
                <div className={style.copyrightText}>Copyright © 2022 TimeSmartAI.Inc. All rights reserved.</div>
            </div>
        </Dialog>
    )
}

export default FeedbackTicketResolutionLog;