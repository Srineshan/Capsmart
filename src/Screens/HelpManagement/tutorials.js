import React, { useState, useEffect } from 'react';
import { Icon, Intent, Dialog, Classes, InputGroup, TextArea } from "@blueprintjs/core";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import Filter from './../../images/filter.png';
import Tooltip from '@mui/material/Tooltip';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import ThumbDownAltOutlinedIcon from '@material-ui/icons/ThumbDownAltOutlined';
import style from './index.module.scss';
import AddTutorial from './addTutorialDialog';
import VideoSequencePlayerDialog from './videoSequencePlayer';
import SearchBar from './../../Components/SearchBar';

const Tutorials = ({ getSelectedHelp }) => {
    const [selectedRow, setSelectedRow] = useState('');
    const [isSelected, setIsSelected] = useState(false);
    const [viewTickets, setViewTickets] = useState(true);
    const [viewExceptionTickets, setViewExceptionTickets] = useState(false);
    const [viewMessages, setViewMessages] = useState(false);
    const [sendEMail, setSendEMail] = useState(false);
    const [userDetails, setUserDetails] = useState();
    const [sendEmailUserListDialog, setSendEmailUserListDialog] = useState(false);
    const [showAddTutorialDialog, setShowAddTutorialDialog] = useState(false);
    const [showEditUserDialog, setShowEditUserDialog] = useState(false);
    const [showFeedbackPage, setShowFeedbackPage] = useState(false);
    const [showVideoSequenceDialog, setShowVideoSequenceDialog] = useState(false);
    const [tutorialName, setTutorialName] = useState('Tutorials & Videos');
    const [tutorialPage2, setTutorialPage2] = useState(false);

    const getSendEmailDialog = (value) => {
        setSendEMail(value);
    }

    const getSendEmailUserListDialog = (value) => {
        setSendEmailUserListDialog(value);
    }

    const getAddTutorialDialog = (value) => {
        setShowAddTutorialDialog(value);
    }

    const getEditUserDialog = (value) => {
        setShowEditUserDialog(value);
    }

    const getShowVideoSequenceDialog = (value) => {
        setShowVideoSequenceDialog(value);
    }
    return (
        <>
            {!tutorialPage2 ? (
                <div className={style.margin20}>
                    <div className={style.bigCardGrid}>
                        <div className={style.chevronCardStyle}>
                            <div className={`${style.alignCenter}`}>
                                <img src={ChevronRight} className={style.chevronRightStyle} />
                            </div>
                        </div>
                        <div className={style.displayInRow}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                HELP MANAGEMENT
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                        </div>
                    </div>
                    <div className={`${style.grid5} ${style.marginTop20}`}>
                        <div className={style.cardStyle}>
                            <div className={`${style.displayInCol} ${style.alignCenter}`}>
                                <div className={`${style.userNameStyle} `}>
                                    JOHN
                                </div>
                                <img src={UserLogo} className={style.userLogo} />
                            </div>
                        </div>
                        <div className={`${style.cardStyle}`} onClick={() => getSelectedHelp('TICKETS')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>TICKETS</h5>
                            <p className={style.last30Style}>LAST 30 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>70</p>
                            </div>
                        </div>
                        <div className={`${style.cardStyle} ${style.selectedCardBackground}`} onClick={() => getSelectedHelp('TUTORIALS & VIDEOS')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>TUTORIALS & VIDEOS</h5>
                            <p className={style.last30Style}>LAST 30 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>4</p>
                            </div>
                        </div>
                        <div className={`${style.cardStyle}`} onClick={() => getSelectedHelp('FAQS')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>FAQS</h5>
                            <p className={style.last30Style}>LAST 7 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>2</p>
                            </div>
                        </div>
                        <div className={style.cardStyle} onClick={() => getSelectedHelp('RELEASE NOTES')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>RELEASE NOTES</h5>
                            <p className={style.last30Style}>LAST 30 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>2</p>
                            </div>
                        </div>

                    </div>
                    <div className={style.bigCardGrid}>
                        <div className={`${style.bigCardStyle} ${style.bigCalendarLeftCardWidth}`}>
                            <div className={style.openCardStyle}>
                            </div>
                        </div>
                        <div className={style.bigCardStyle}>
                            <div className={style.spaceBetween}>
                                <p className={`${style.activeContractsWidth}`}>FEB 16, 2022 16:45 EST</p>
                                <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                    <SearchBar />
                                    {/* <img src={UploadUser} alt="UploadUser" className={style.uploadIcon} onClick={()=> getMailTemplate(true)} />
                                    <img src={CancelUser} alt="CancelUser" className={style.smallIcons} onClick={()=> getEditUserDialog(true)} />
                                    <img src={BlockUser} alt="BlockUser" className={style.smallIcons} onClick={() => getSendEmailDialog(true)} />
                                    <img src={LockReset} alt="LockReset" className={style.smallIcons} /> */}
                                    <img src={Filter} alt="Filter" className={style.filterIcon} onClick={() => setTutorialPage2(!tutorialPage2)} />
                                    <button className={style.tutorialButton} onClick={() => getAddTutorialDialog(true)}>ADD TUTORIAL / VIDEO</button>
                                </div>
                            </div>
                            <div className={style.buttonGroupUsers}>
                                <button className={tutorialName === "Tutorials & Videos" ? style.registeredButton : style.normalButton} onClick={() => setTutorialName('Tutorials & Videos')}>Tutorials & Videos ( 4 )</button>
                                <button className={tutorialName === "Frequently Viewed" ? style.registeredButton : style.normalButton} onClick={() => setTutorialName('Frequently Viewed')}>Frequently Viewed ( 1 )</button>
                                <button className={tutorialName === "No Views" ? style.registeredButton : style.normalButton} onClick={() => setTutorialName('No Views')}>No Views ( 1 )</button>
                            </div>
                            {tutorialName === "Tutorials & Videos" ? (
                                <div>
                                    <div className={`${style.tableHeader3} ${style.marginTop20}`}>
                                        <p></p>
                                        <p className={style.tableHeaderFontStyle}>TITLE</p>
                                        <p className={style.tableHeaderFontStyle}>DESCRIPTION</p>
                                        <p className={style.tableHeaderFontStyle}>AUTHOR</p>
                                        <p className={style.tableHeaderFontStyle}>TYPE</p>
                                        <p className={style.tableHeaderFontStyle}>DATE / TIME</p>
                                        <p className={style.tableHeaderFontStyle}>LINK</p>
                                        <p className={style.tableHeaderFontStyle}>COMMENT</p>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid3} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="Resolved" arrow>
                                                <div className={`${style.greenDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                                Lorem Ipsum
                                            </p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>Video</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableDataFontStyle} onClick={() => setShowVideoSequenceDialog(true)}><a>Watch?V=N70zjmvm8l0</a></p>
                                            <p className={style.tableDataFontStyle}>3</p>
                                        </div>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid3} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="Resolved" arrow>
                                                <div className={`${style.greenDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                                Lorem Ipsum
                                            </p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>Video</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableDataFontStyle} onClick={() => setShowVideoSequenceDialog(true)}><a>Watch?V=N70zjmvm8l0</a></p>
                                            <p className={style.tableDataFontStyle}>3</p>
                                        </div>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid3} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="In-Progress" arrow>
                                                <div className={`${style.yellowDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                                Lorem Ipsum
                                            </p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>Video</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableDataFontStyle} onClick={() => setShowVideoSequenceDialog(true)}><a>Watch?V=N70zjmvm8l0</a></p>
                                            <p className={style.tableDataFontStyle}>3</p>
                                        </div>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid3} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="Error" arrow>
                                                <div className={`${style.redDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                                Lorem Ipsum
                                            </p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>Video</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableDataFontStyle} onClick={() => setShowVideoSequenceDialog(true)}><a>Watch?V=N70zjmvm8l0</a></p>
                                            <p className={style.tableDataFontStyle}>3</p>
                                        </div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <p className={style.accountActivityStyle}>Last account activity: 30 days</p>
                                        <div className={style.displayInRow}>
                                            <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                                            <img src={ChevronRight} className={style.roundChevron} />
                                        </div>
                                    </div>
                                </div>
                            ) : tutorialName === "Frequently Viewed" ? (
                                <div>
                                    <div className={`${style.tableHeader} ${style.marginTop20}`}>
                                        <p></p>
                                        <p className={style.tableHeaderFontStyle}>TICKET ID</p>
                                        <p className={style.tableHeaderFontStyle}>EXCEPTION CODE</p>
                                        <p className={style.tableHeaderFontStyle}>DESCRIPTION</p>
                                        <p className={style.tableHeaderFontStyle}>DATE/TIME</p>
                                        <p className={style.tableHeaderFontStyle}>CONTRACTOR NAME</p>
                                        <p className={style.tableHeaderFontStyle}>USER NAME</p>
                                        <p className={style.tableHeaderFontStyle}>LAST UPDATED</p>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="Error" arrow>
                                                <div className={`${style.redDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                                Tckt006
                                            </p>
                                            <p className={style.tableDataFontStyle}>ECPTCODE001</p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Ipsum Lorem Ipsum ...</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>LOREM iPSUM</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        </div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <p className={style.accountActivityStyle}>Last account activity: 30 days</p>
                                        <div className={style.displayInRow}>
                                            <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                                            <img src={ChevronRight} className={style.roundChevron} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className={`${style.tableHeader2} ${style.marginTop20}`}>
                                        <p></p>
                                        <p className={style.tableHeaderFontStyle}>TYPE</p>
                                        <p className={style.tableHeaderFontStyle}>RELATED TO</p>
                                        <p className={style.tableHeaderFontStyle}>MESSAGE / COMMENT</p>
                                        <p className={style.tableHeaderFontStyle}>LAST RESPONDED</p>
                                        <p className={style.tableHeaderFontStyle}>DATE / TIME</p>
                                        <p className={style.tableHeaderFontStyle}>ACTION</p>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid2} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="Resolved" arrow>
                                                <div className={`${style.greenDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={style.tableDataFontStyle}>Comment</p>
                                            <p className={style.tableDataFontStyle}>Ticket</p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableHeaderFontStyle}>REPLY</p>
                                        </div>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid2} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="Resolved" arrow>
                                                <div className={`${style.greenDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={style.tableDataFontStyle}>Email</p>
                                            <p className={style.tableDataFontStyle}>Tutorial</p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableHeaderFontStyle}>VIEW</p>
                                        </div>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid2} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="In-Progress" arrow>
                                                <div className={`${style.yellowDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={style.tableDataFontStyle}>Email</p>
                                            <p className={style.tableDataFontStyle}>Ticket</p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableHeaderFontStyle}>VIEW</p>
                                        </div>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid2} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="Error" arrow>
                                                <div className={`${style.redDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={style.tableDataFontStyle}>Email</p>
                                            <p className={style.tableDataFontStyle}>Ticket</p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableHeaderFontStyle}>REPLY</p>
                                        </div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <p className={style.accountActivityStyle}>Last account activity: 30 days</p>
                                        <div className={style.displayInRow}>
                                            <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                                            <img src={ChevronRight} className={style.roundChevron} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={style.spaceBetween}>
                        <p className={style.poweredBy}>Powered by - TimeSmartAI.Inc LLP</p>
                        <p className={style.poweredBy}>© TimeSmartAI.Inc</p>
                    </div>
                    {showAddTutorialDialog && <AddTutorial getAddTutorialDialog={getAddTutorialDialog} />}
                    {showVideoSequenceDialog && <VideoSequencePlayerDialog getShowVideoSequenceDialog={getShowVideoSequenceDialog} />}
                </div>
            ) : (
                <div className={style.margin20}>
                    <div className={style.bigCardGrid}>
                        <div className={style.chevronCardStyle}>
                            <div className={`${style.alignCenter}`}>
                                <img src={ChevronRight} className={style.chevronRightStyle} />
                            </div>
                        </div>
                        <div className={style.displayInRow}>
                            <div className={`${style.userNameStyle} ${style.alignCenter} ${style.reduce} `}>
                                HELP MANAGEMENT
                            </div>
                            <div className={`${style.loginStatus} ${style.alignCenter} ${style.marginLeft20}`}>
                                UPDATED ON FEB 16, 2022 16:45 EST
                            </div>
                        </div>
                    </div>
                    <div className={`${style.grid5} ${style.marginTop20}`}>
                        <div className={style.cardStyle}>
                            <div className={`${style.displayInCol} ${style.alignCenter}`}>
                                <div className={`${style.userNameStyle} `}>
                                    JOHN
                                </div>
                                <img src={UserLogo} className={style.userLogo} />
                            </div>
                        </div>
                        <div className={`${style.cardStyle}`} onClick={() => getSelectedHelp('TICKETS')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>TICKETS</h5>
                            <p className={style.last30Style}>LAST 30 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>12</p>
                            </div>
                        </div>
                        <div className={`${style.cardStyle} ${style.selectedCardBackground}`} onClick={() => getSelectedHelp('TUTORIALS & VIDEOS')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>TUTORIALS & VIDEOS</h5>
                            <p className={style.last30Style}>LAST 30 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>4</p>
                            </div>
                        </div>
                        <div className={`${style.cardStyle}`} onClick={() => getSelectedHelp('FAQS')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>FAQS</h5>
                            <p className={style.last30Style}>LAST 7 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>2</p>
                            </div>
                        </div>
                        <div className={style.cardStyle} onClick={() => getSelectedHelp('RELEASE NOTES')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>RELEASE NOTES</h5>
                            <p className={style.last30Style}>LAST 30 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>2</p>
                            </div>
                        </div>

                    </div>
                    <div className={style.bigCardGrid}>
                        <div className={`${style.bigCardStyle} ${style.bigCalendarLeftCardWidth}`}>
                            <div className={style.openCardStyle}>
                            </div>
                        </div>
                        <div className={style.bigCardStyle}>
                            <div className={style.spaceBetween}>
                                <p className={`${style.activeContractsWidth}`}>FEB 16, 2022 16:45 EST</p>
                                <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                    <SearchBar />
                                    {/* <img src={UploadUser} alt="UploadUser" className={style.uploadIcon} onClick={()=> getMailTemplate(true)} />
                                    <img src={CancelUser} alt="CancelUser" className={style.smallIcons} onClick={()=> getEditUserDialog(true)} />
                                    <img src={BlockUser} alt="BlockUser" className={style.smallIcons} onClick={() => getSendEmailDialog(true)} />
                                    <img src={LockReset} alt="LockReset" className={style.smallIcons} /> */}
                                    <img src={Filter} alt="Filter" className={style.filterIcon} onClick={() => setTutorialPage2(!tutorialPage2)} />
                                    <button className={style.tutorialButton} onClick={() => getAddTutorialDialog(true)}>ADD TUTORIAL / VIDEO</button>
                                </div>
                            </div>
                            <div className={style.displayInRow}>
                                <div className={style.buttonGroupUsers}>
                                    <button className={tutorialName === "Tutorials & Videos" ? style.registeredButton : style.normalButton} onClick={() => setTutorialName('Tutorials & Videos')}>Tutorials & Videos ( 4 )</button>
                                    <button className={tutorialName === "Frequently Viewed" ? style.registeredButton : style.normalButton} onClick={() => setTutorialName('Frequently Viewed')}>Frequently Viewed ( 1 )</button>
                                    <button className={tutorialName === "No Views" ? style.registeredButton : style.normalButton} onClick={() => setTutorialName('No Views')}>No Views ( 1 )</button>
                                </div>
                            </div>
                            {tutorialName === "Tutorials & Videos" ? (
                                <div className={`${style.grid4} ${style.tutorialPostBackgroundCard}`}>
                                    <div className={style.tutorialPostCard}>
                                        <div className={style.newBadge}>new</div>
                                        <img src={UserLogo} alt="post" className={`${style.postImage} ${style.reduceTop20}`} />
                                        <div>
                                            <p className={style.postTitle}>Employee Agreement</p>
                                            <p className={`${style.postContent} ${style.reduceTop10}`}>The webinar talks about how you can detect data breaches and assist your customers by ...</p>
                                            <div className={style.spaceBetween}>
                                                <p className={style.postDateStyle}>JAN 12, 2022</p>
                                                <div className={style.displayInRow}>
                                                    <ThumbUpAltOutlinedIcon fontSize='small' className={style.marginLeft20} style={{ color: '#6C6CDA' }} />
                                                    <p className={`${style.postDateStyle} ${style.marginLeft5}`}>41</p>
                                                    <ThumbDownAltOutlinedIcon fontSize='small' className={style.marginLeft20} style={{ color: '#B3B8BD' }} />
                                                    <p className={`${style.postDateStyle} ${style.marginLeft5}`}>2</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.tutorialPostCard}>
                                        <div className={style.newBadge}>new</div>
                                        <img src={UserLogo} alt="post" className={`${style.postImage} ${style.reduceTop20}`} />
                                        <div>
                                            <p className={style.postTitle}>Employee Agreement</p>
                                            <p className={`${style.postContent} ${style.reduceTop10}`}>The webinar talks about how you can detect data breaches and assist your customers by ...</p>
                                            <div className={style.spaceBetween}>
                                                <p className={style.postDateStyle}>JAN 12, 2022</p>
                                                <div className={style.displayInRow}>
                                                    <ThumbUpAltOutlinedIcon fontSize='small' className={style.marginLeft20} style={{ color: '#6C6CDA' }} />
                                                    <p className={`${style.postDateStyle} ${style.marginLeft5}`}>41</p>
                                                    <ThumbDownAltOutlinedIcon fontSize='small' className={style.marginLeft20} style={{ color: '#B3B8BD' }} />
                                                    <p className={`${style.postDateStyle} ${style.marginLeft5}`}>2</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.tutorialPostCard}>
                                        <img src={UserLogo} alt="post" className={style.postImage} />
                                        <div>
                                            <p className={style.postTitle}>Employee Agreement</p>
                                            <p className={`${style.postContent} ${style.reduceTop10}`}>The webinar talks about how you can detect data breaches and assist your customers by ...</p>
                                            <div className={style.spaceBetween}>
                                                <p className={style.postDateStyle}>JAN 12, 2022</p>
                                                <div className={style.displayInRow}>
                                                    <ThumbUpAltOutlinedIcon fontSize='small' className={style.marginLeft20} style={{ color: '#6C6CDA' }} />
                                                    <p className={`${style.postDateStyle} ${style.marginLeft5}`}>41</p>
                                                    <ThumbDownAltOutlinedIcon fontSize='small' className={style.marginLeft20} style={{ color: '#B3B8BD' }} />
                                                    <p className={`${style.postDateStyle} ${style.marginLeft5}`}>2</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.tutorialPostCard}>
                                        <img src={UserLogo} alt="post" className={style.postImage} />
                                        <div>
                                            <p className={style.postTitle}>Employee Agreement</p>
                                            <p className={`${style.postContent} ${style.reduceTop10}`}>The webinar talks about how you can detect data breaches and assist your customers by ...</p>
                                            <div className={style.spaceBetween}>
                                                <p className={style.postDateStyle}>JAN 12, 2022</p>
                                                <div className={style.displayInRow}>
                                                    <ThumbUpAltOutlinedIcon fontSize='small' className={style.marginLeft20} style={{ color: '#6C6CDA' }} />
                                                    <p className={`${style.postDateStyle} ${style.marginLeft5}`}>41</p>
                                                    <ThumbDownAltOutlinedIcon fontSize='small' className={style.marginLeft20} style={{ color: '#B3B8BD' }} />
                                                    <p className={`${style.postDateStyle} ${style.marginLeft5}`}>2</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : tutorialName === "Frequently Viewed" ? (
                                <div>
                                    <div className={`${style.tableHeader} ${style.marginTop20}`}>
                                        <p></p>
                                        <p className={style.tableHeaderFontStyle}>TICKET ID</p>
                                        <p className={style.tableHeaderFontStyle}>EXCEPTION CODE</p>
                                        <p className={style.tableHeaderFontStyle}>DESCRIPTION</p>
                                        <p className={style.tableHeaderFontStyle}>DATE/TIME</p>
                                        <p className={style.tableHeaderFontStyle}>CONTRACTOR NAME</p>
                                        <p className={style.tableHeaderFontStyle}>USER NAME</p>
                                        <p className={style.tableHeaderFontStyle}>LAST UPDATED</p>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="Error" arrow>
                                                <div className={`${style.redDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                                Tckt006
                                            </p>
                                            <p className={style.tableDataFontStyle}>ECPTCODE001</p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Ipsum Lorem Ipsum ...</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>LOREM iPSUM</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        </div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <p className={style.accountActivityStyle}>Last account activity: 30 days</p>
                                        <div className={style.displayInRow}>
                                            <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                                            <img src={ChevronRight} className={style.roundChevron} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className={`${style.tableHeader2} ${style.marginTop20}`}>
                                        <p></p>
                                        <p className={style.tableHeaderFontStyle}>TYPE</p>
                                        <p className={style.tableHeaderFontStyle}>RELATED TO</p>
                                        <p className={style.tableHeaderFontStyle}>MESSAGE / COMMENT</p>
                                        <p className={style.tableHeaderFontStyle}>LAST RESPONDED</p>
                                        <p className={style.tableHeaderFontStyle}>DATE / TIME</p>
                                        <p className={style.tableHeaderFontStyle}>ACTION</p>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid2} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="Resolved" arrow>
                                                <div className={`${style.greenDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={style.tableDataFontStyle}>Comment</p>
                                            <p className={style.tableDataFontStyle}>Ticket</p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableHeaderFontStyle}>REPLY</p>
                                        </div>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid2} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="Resolved" arrow>
                                                <div className={`${style.greenDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={style.tableDataFontStyle}>Email</p>
                                            <p className={style.tableDataFontStyle}>Tutorial</p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableHeaderFontStyle}>VIEW</p>
                                        </div>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid2} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="In-Progress" arrow>
                                                <div className={`${style.yellowDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={style.tableDataFontStyle}>Email</p>
                                            <p className={style.tableDataFontStyle}>Ticket</p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableHeaderFontStyle}>VIEW</p>
                                        </div>
                                    </div>
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => { setIsSelected(!isSelected); setSelectedRow('1'); setShowFeedbackPage(true) }}>
                                        <div className={`${style.tableDataGrid2} ${style.fullWidth} ${style.marginTop7}`}>
                                            <Tooltip title="Error" arrow>
                                                <div className={`${style.redDotStyle}`}></div>
                                            </Tooltip>
                                            <p className={style.tableDataFontStyle}>Email</p>
                                            <p className={style.tableDataFontStyle}>Ticket</p>
                                            <p className={style.tableDataFontStyle}>Lorem Ipsum Dolor Sit Amet, Consectetur us</p>
                                            <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                            <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                            <p className={style.tableHeaderFontStyle}>REPLY</p>
                                        </div>
                                    </div>
                                    <div className={style.spaceBetween}>
                                        <p className={style.accountActivityStyle}>Last account activity: 30 days</p>
                                        <div className={style.displayInRow}>
                                            <p className={style.paginationStyle}>1 - 10 of 200<span className={`${style.marginLeft20} ${style.leftChevronColor}`}>&lt;</span> </p>
                                            <img src={ChevronRight} className={style.roundChevron} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={style.spaceBetween}>
                        <p className={style.poweredBy}>Powered by - TimeSmartAI.Inc LLP</p>
                        <p className={style.poweredBy}>© TimeSmartAI.Inc</p>
                    </div>
                    {showAddTutorialDialog && <AddTutorial getAddTutorialDialog={getAddTutorialDialog} />}
                    {showVideoSequenceDialog && <VideoSequencePlayerDialog getShowVideoSequenceDialog={getShowVideoSequenceDialog} />}
                </div>
            )}
        </>
    )
}

export default Tutorials;
