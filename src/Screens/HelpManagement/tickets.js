import React, { useState, useEffect } from 'react';
import { Icon, Intent, Dialog, Classes, InputGroup, TextArea } from "@blueprintjs/core";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import UserLogo from './../../images/userLogo.jpg';
import ChevronRight from './../../images/chevronRight.png';
import Filter from './../../images/filter.png';
import Tooltip from '@mui/material/Tooltip';
import style from './index.module.scss';
import AddTicket from './addTicket';
import AddFeedbackTicket from './addFeedackTicket';

const Tickets = ({getSelectedHelp}) => {
    const [selectedRow, setSelectedRow] = useState('');
    const [isSelected, setIsSelected] = useState(false);
    const [viewTickets, setViewTickets] = useState(true);
    const [viewExceptionTickets, setViewExceptionTickets] = useState(false);
    const [viewMessages, setViewMessages] = useState(false);
    const [sendEMail, setSendEMail] = useState(false);
    const [userDetails, setUserDetails] = useState();
    const [sendEmailUserListDialog, setSendEmailUserListDialog] = useState(false);
    const [showAddTicketDialog,setShowAddTicketDialog] = useState(false);
    const [showAddFeedbackTicketDialog, setShowAddFeedbackTicketDialog] = useState(false);
    const [showEditUserDialog,setShowEditUserDialog] = useState(false);
    const [showFeedbackPage,setShowFeedbackPage] = useState(false);
    const [showMailtemplate,setShowMailTemplate] = useState(false);
    const [ticketName, setTicketName] = useState('Tickets');
    const [showTicketPage2, setShowTicketPage2] = useState(false);
    const [ticketStatus, setTicketStatus] = useState('New');

    const getSendEmailDialog = (value) => {
        setSendEMail(value);
    }

    const getSendEmailUserListDialog = (value) => {
        setSendEmailUserListDialog(value);
    }

    const getAddTicketDialog = (value) => {
        setShowAddTicketDialog(value);
    }

    const getAddFeedbackTicketDialog = (value) => {
        setShowAddFeedbackTicketDialog(value);
    }

    const getEditUserDialog = (value) => {
        setShowEditUserDialog(value);
    }

    const getMailTemplate = (value) => {
        setShowMailTemplate(value);
    }
    return(
        <>
            {!showTicketPage2 ? (
                <div className={style.margin20}>
                    <div className={style.bigCardGrid}>
                        <div className={style.chevronCardStyle}>
                            <div className={`${style.alignCenter}`}>
                                <img src={ChevronRight} className={style.chevronRightStyle}/>
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
                        <div className={`${style.cardStyle} ${style.selectedCardBackground}`} onClick={() => getSelectedHelp('TICKETS')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>TICKETS</h5>
                            <p className={style.last30Style}>LAST 30 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>70</p>
                            </div>
                        </div>
                        <div className={`${style.cardStyle}`} onClick={() => getSelectedHelp('TUTORIALS & VIDEOS')}>
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
                                    <div className={`${style.searchBarStyle} ${style.spaceBetween}`}>
                                        <p>Search here</p>
                                        <p className={style.marginRight}>&#128269;</p>
                                    </div>
                                    {/* <img src={UploadUser} alt="UploadUser" className={style.uploadIcon} onClick={()=> getMailTemplate(true)} />
                                    <img src={CancelUser} alt="CancelUser" className={style.smallIcons} onClick={()=> getEditUserDialog(true)} />
                                    <img src={BlockUser} alt="BlockUser" className={style.smallIcons} onClick={() => getSendEmailDialog(true)} />
                                    <img src={LockReset} alt="LockReset" className={style.smallIcons} /> */}
                                    <img src={Filter} alt="Filter" className={style.filterIcon} onClick={() => setShowTicketPage2(!showTicketPage2)} />
                                    <button className={style.contractButton} onClick={() => getAddTicketDialog(true)}>ADD TICKET</button>
                                </div>
                            </div>
                            <div className={style.buttonGroupUsers}>
                                <button className={ticketName === "Tickets" ? style.registeredButton : style.normalButton} onClick={() => setTicketName('Tickets')}>Tickets ( 70 )</button>
                                <button className={ticketName === "Exception Error Tickets"  ? style.registeredButton : style.normalButton} onClick={() => setTicketName('Exception Error Tickets')}>Exception Error Tickets ( 1 )</button>
                                <button className={ticketName === "Messages / Comments"  ? style.registeredButton : style.normalButton} onClick={() => setTicketName('Messages / Comments')}>Messages / Comments ( 4 )</button>
                            </div>
                            {ticketName === "Tickets" ? (
                            <div>
                                <div className={`${style.tableHeader} ${style.marginTop20}`}>
                                    <p></p>
                                    <p className={style.tableHeaderFontStyle}>TICKET ID</p>
                                    <p className={style.tableHeaderFontStyle}>TYPE</p>
                                    <p className={style.tableHeaderFontStyle}>SUBJECT/ ISSUE</p>
                                    <p className={style.tableHeaderFontStyle}>CUSTOMER</p>
                                    <p className={style.tableHeaderFontStyle}>START DATE/TIME</p>
                                    <p className={style.tableHeaderFontStyle}>LAST UPDATED</p>
                                    <p className={style.tableHeaderFontStyle}>USER NAME</p>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="Resolved" arrow>
                                            <div className={`${style.greenDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('2')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="Resolved" arrow>
                                            <div className={`${style.greenDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('3')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="In-Progress" arrow>
                                            <div className={`${style.yellowDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('4')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="New" arrow>
                                            <div className={`${style.blueDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('5')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="New" arrow>
                                            <div className={`${style.blueDotStyle}`}></div>
                                        </Tooltip>                               
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('6')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="Resolved" arrow>
                                            <div className={`${style.greenDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('7')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="In-Progress" arrow>
                                            <div className={`${style.yellowDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
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
                            ) : ticketName === "Exception Error Tickets"  ?  (
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
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
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
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
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
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
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
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
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
                                    <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
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
                        <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                        <p className={style.poweredBy}>© TimeSmart.AI</p>
                    </div>
                    {showAddTicketDialog && <AddTicket getAddTicketDialog={getAddTicketDialog} />}
                </div>
            ) : (
                <div className={style.margin20}>
                    <div className={style.bigCardGrid}>
                        <div className={style.chevronCardStyle}>
                            <div className={`${style.alignCenter}`}>
                                <img src={ChevronRight} className={style.chevronRightStyle}/>
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
                        <div className={`${style.cardStyle} ${style.selectedCardBackground}`} onClick={() => getSelectedHelp('TICKETS')}>
                            <h5 className={`${style.headingForContracts} ${style.marginTop20}`}>TICKETS</h5>
                            <p className={style.last30Style}>LAST 30 DAYS</p>
                            <div className={style.spaceBetween}>
                                <p></p>
                                <p className={`${style.headingCountForContracts} ${style.marginRight20}`}>30</p>
                            </div>
                        </div>
                        <div className={`${style.cardStyle}`} onClick={() => getSelectedHelp('TUTORIALS & VIDEOS')}>
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
                                    <div className={`${style.searchBarStyle} ${style.spaceBetween}`}>
                                        <p>Search here</p>
                                        <p className={style.marginRight}>&#128269;</p>
                                    </div>
                                    {/* <img src={UploadUser} alt="UploadUser" className={style.uploadIcon} onClick={()=> getMailTemplate(true)} />
                                    <img src={CancelUser} alt="CancelUser" className={style.smallIcons} onClick={()=> getEditUserDialog(true)} />
                                    <img src={BlockUser} alt="BlockUser" className={style.smallIcons} onClick={() => getSendEmailDialog(true)} />
                                    <img src={LockReset} alt="LockReset" className={style.smallIcons} /> */}
                                    <img src={Filter} alt="Filter" className={style.filterIcon} onClick={() => setShowTicketPage2(!showTicketPage2)} />
                                    <button className={style.contractButton} onClick={() => getAddFeedbackTicketDialog(true)}>ADD TICKET</button>
                                </div>
                            </div>
                            <div className={style.buttonGroupUsers}>
                                <button className={ticketName === "Tickets" ? style.registeredButton : style.normalButton} onClick={() => setTicketName('Tickets')}>Tickets ( 70 )</button>
                                <button className={ticketName === "Messages / Comments"  ? style.registeredButton : style.normalButton} onClick={() => setTicketName('Messages / Comments')}>Messages / Comments ( 4 )</button>
                            </div>
                            {ticketName === "Tickets" ? (
                            <div>
                                <div className={`${style.tableHeader} ${style.marginTop20}`}>
                                    <p></p>
                                    <p className={style.tableHeaderFontStyle}>TICKET ID</p>
                                    <p className={style.tableHeaderFontStyle}>TYPE</p>
                                    <p className={style.tableHeaderFontStyle}>SUBJECT/ ISSUE</p>
                                    <p className={style.tableHeaderFontStyle}></p>
                                    <p className={style.tableHeaderFontStyle}>START DATE/TIME</p>
                                    <p className={style.tableHeaderFontStyle}>LAST UPDATED</p>
                                    <p className={style.tableHeaderFontStyle}>USER NAME</p>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="Resolved" arrow>
                                            <div className={`${style.greenDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('2')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="Resolved" arrow>
                                            <div className={`${style.greenDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('3')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="In-Progress" arrow>
                                            <div className={`${style.yellowDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('4')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="New" arrow>
                                            <div className={`${style.blueDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('5')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="New" arrow>
                                            <div className={`${style.blueDotStyle}`}></div>
                                        </Tooltip>                               
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol} ${style.alternativeBackgroundColor}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('6')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="Resolved" arrow>
                                            <div className={`${style.greenDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
                                    </div>
                                </div>
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('7')}}>
                                    <div className={`${style.tableDataGrid} ${style.fullWidth} ${style.marginTop7}`}>
                                        <Tooltip title="In-Progress" arrow>
                                            <div className={`${style.yellowDotStyle}`}></div>
                                        </Tooltip>
                                        <p className={`${style.tableDataFontStyle} ${style.displayInRow}`}>
                                            Tckt006
                                        </p>
                                        <p className={style.tableDataFontStyle}>Calculation Error</p>
                                        <p className={style.tableDataFontStyle}>Main Account </p>
                                        <p className={style.tableDataFontStyle}></p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>07/19/2019 22:45 EST</p>
                                        <p className={style.tableDataFontStyle}>Sanjaya KAI</p>
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
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
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
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
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
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
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
                                <div className={`${style.tableData} ${style.displayInCol}`} onClick={() => {setIsSelected(!isSelected);setSelectedRow('1');setShowFeedbackPage(true)}}>
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
                    <p className={style.poweredBy}>Powered by - TimeSmart.AI LLP</p>
                    <p className={style.poweredBy}>© TimeSmart.AI</p>
                </div>
                {showAddFeedbackTicketDialog && <AddFeedbackTicket getAddFeedbackTicketDialog={getAddFeedbackTicketDialog} />}
            </div>
            )}
            <Dialog isOpen={showFeedbackPage} onClose={() => setShowFeedbackPage(false)} className={`${style.addManagerDialogBackground} ${style.feedbackDialog}`}>
                <div className={`${Classes.DIALOG_BODY} `}>
                    <div className={style.spaceBetween}>
                        <p className={style.extensionStyle}>Feedback Ticket Resolution Progress</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={`${style.crossStyle} ${style.marginLeft20}`} onClick={() => setShowFeedbackPage(false)}  />
                    </div>
                    <div className={style.extensionBorder}></div>
                    <div className={style.feedbackGrid}>
                        <div>
                            <div className={`${style.feedbackContentGrid} ${style.marginTop20}`}>
                                <p className={style.extentionLableStyle}>Ticket ID</p>
                                <p className={style.extentionLableStyle}>Date & Time</p>
                            </div>
                            <div className={style.feedbackContentGrid}>
                                <p className={style.feedbackFontStyle}>FBTID-001</p>
                                <p className={style.feedbackFontStyle}>01-20-2022 14:03 IST</p>
                            </div>
                            <div className={`${style.feedbackContentGrid} ${style.marginTop20}`}>
                                <p className={style.extentionLableStyle}>User Name</p>
                                <p className={style.extentionLableStyle}>Customer</p>
                            </div>
                            <div className={style.feedbackContentGrid}>
                                <p className={style.feedbackFontStyle}>Lorem Ipsum</p>
                                <p className={style.feedbackFontStyle}>ACME corp</p>
                            </div>
                            <div className={`${style.feedbackContentGrid} ${style.marginTop20}`}>
                                <p className={style.extentionLableStyle}>Feedback SUBJECT</p>
                                <p className={style.extentionLableStyle}>FEEDBACK DESCRIPTION</p>
                            </div>
                            <div className={style.feedbackContentGrid}>
                                <p className={style.feedbackFontStyle}>Lorem Ipsum</p>
                                <p className={style.feedbackFontStyle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus ac nisl tempor elementum. Aliquam a eros porttitor, commodo lacus eget, dapibus felis.Aliquam a eros porttitor, commodo lacus eget, dapibus felis</p>
                            </div>
                            <div className={style.extensionBorder}></div>
                            <div className={`${style.feedbackContentGrid} ${style.marginTop20}`}>
                                <p className={style.extentionLableStyle}>Feedback TYPE</p>
                                <div className={style.twoCol}>
                                    <p className={style.extentionLableStyle}>Work impact</p>
                                    <p className={style.extentionLableStyle}>SCREEN CAPTURE</p>
                                </div>
                            </div>
                            <div className={style.feedbackContentGrid}>
                                <p className={style.feedbackFontStyle}>Application Issue Identify</p>
                                <div className={style.twoCol}>
                                    <p className={style.feedbackFontStyle}>HIGH</p>
                                    <p className={style.feedbackFontStyle}>YES</p>
                                </div>
                            </div>
                            <div className={`${style.extensionBorder} ${style.marginTop20}`}></div>
                            <div className={style.marginTop20}>
                                <p className={style.extentionLableStyle}>SCREEN CAPTURE</p>
                            </div>
                            <div className={style.dashedBorder}>
                                <div className={`${style.imageDisplayStyle} ${style.alignCenter}`}>
                                    <div className={style.imageNameStyle}>IMAGE.PNG</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className={`${style.collapseHeader} ${style.marginTop20} ${style.spaceBetween}`}>
                                <div className={style.displayInRow}>
                                    <p className={style.collapseHeaderText}>Ticket Status</p>
                                    <div className={`${ticketStatus !== 'In-Progress' ? style.greenDotFeedbackStyle : style.orageDotFeedbackStyle} ${style.marginLeft20}`}></div>
                                </div>
                                <div className={style.displayInRow}>
                                    <p className={style.feedbackFontStyle}>Updated On 01-06-2022 23:34</p>
                                    <Icon icon="chevron-up" color='#7165E3' className={style.marginLeft20} />
                                </div>
                            </div>
                            <div className={style.collapseBody}>
                                <div className={`${style.extentionGrid}`}>
                                    <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Assign To</div>
                                    <div className={style.displayInRow}>
                                        <select
                                            name="class"
                                            id="Class"
                                            className={`${style.fieldWidth2InARow} ${style.transparentBackground}`}>
                                                <option value="Sanjaya Kumar" >
                                                Sanjaya Kumar
                                                </option>
                                        </select>
                                    </div>
                                </div>
                                {ticketStatus !== 'In-Progress' && (
                                    <>
                                        <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                            <div></div>
                                            <div>sanjaya@timesmart.ai  <span className={`${style.marginLeft20} ${style.marginRight}`}> | </span> 987 8767646</div>
                                        </div>
                                        <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                            <div className={`${style.extentionLableStyle}`}>Contractor</div>
                                            <div>
                                                <div>Philipp Stevens</div>
                                                <div>pstev_msp@metropoli.ai  <span className={`${style.marginLeft20} ${style.marginRight}`}> | </span>  987 8767646</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                    <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Status</div>
                                    <div className={style.displayInRow}>
                                        <select
                                            name="class"
                                            id="Class"
                                            value={ticketStatus}
                                            onChange={(e) => setTicketStatus(e.target.value)}
                                            className={`${style.fieldWidth2InARow} ${style.transparentBackground}`}>
                                                <option value="New" >
                                                New
                                                </option>
                                                <option value="In-Progress" >
                                                In-Progress
                                                </option>
                                                <option value="Resolved" >
                                                Resolved
                                                </option>
                                        </select>
                                    </div>
                                </div>
                                {ticketStatus === 'In-Progress' && (
                                    <>
                                        <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                            <div></div>
                                            <div>sanjaya@timesmart.ai  <span className={`${style.marginLeft20} ${style.marginRight}`}> | </span> 987 8767646</div>
                                        </div>
                                        <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                            <div className={`${style.extentionLableStyle}`}>Contractor</div>
                                            <div>
                                                <div>Philipp Stevens</div>
                                                <div>pstev_msp@metropoli.ai  <span className={`${style.marginLeft20} ${style.marginRight}`}> | </span>  987 8767646</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {ticketStatus === 'Resolved' && (
                                    <div className={`${style.extentionGrid} ${style.marginTop10}`}>
                                        <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Status Resolve Note*</div>
                                        <TextArea placeholder='add status change note...' rows="4" className={style.statusResolvedTextarea} />
                                    </div>
                                )}
                                {ticketStatus !== 'In-Progress' && (
                                    <div className={`${style.twoCol} ${style.marginTop10}`}>
                                        <div className={`${style.extentionGrid}`}>
                                            <div className={`${style.extentionLableStyle} ${style.marginTop10}`}>Jira Ticket</div>
                                            <div className={style.displayInRow}>
                                                <FormControlLabel
                                                    control={
                                                        <Switch checked={true}  size="small" />
                                                    }
                                                    className={`${style.switchFontStyle}`}
                                                    label={'YES'}                        
                                                />
                                            </div>
                                        </div>
                                        <div className={`${style.extentionGrid}`}>
                                            <div className={`${style.extentionLableStyle} ${style.marginTop20}`}>Jira Id</div>
                                            <div className={style.displayInRow}>
                                                <div className={`${style.feedbackFontStyle} ${style.marginTop15}`}>JTKT00023</div>
                                                <div className={`${style.orageDotFeedbackStyle} ${style.marginLeft20} ${style.marginTop20}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className={`${style.collapseHeader} ${style.marginTop20} ${style.spaceBetween}`}>
                                <p className={style.collapseHeaderText}>Log File Reference</p>
                                <div className={style.reduceTop10}>
                                    <Icon icon={ticketStatus !== "Resolved" ? "chevron-up" : "chevron-down"} color='#7165E3' className={style.marginLeft20} />
                                </div>
                            </div>
                            {ticketStatus !== "Resolved" && (
                                <div className={style.collapseBody2}>
                                    <div className={style.spaceBetween}>
                                        <div className={`${style.displayInRow}`}>
                                            <div className={style.logFileBlueDot}></div>
                                            {/* <div className={style.leftBorder}></div> */}
                                            <div className={style.marginLeft20}>
                                                <div>Login</div>
                                                <div>userId sia@sureshield.com</div>
                                            </div>
                                        </div>
                                        <div className={style.extentionLableStyle}>JAN 12, 2022<br />07:35 PST</div>
                                    </div>
                                </div>
                            )}
                            <div className={`${style.collapseHeader} ${style.marginTop20} ${style.spaceBetween}`}>
                                {ticketStatus !== 'In-Progress' ? (
                                    <>
                                        <p className={style.collapseHeaderText}>Comments</p>
                                        <div className={style.reduceTop10}>
                                            <Icon icon="chevron-up" color='#7165E3' className={style.marginLeft20} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className={style.collapseHeaderText}>Resolution Comments</p>
                                        <div className={style.displayInRow}>
                                            <p className={style.collapseHeaderText}>1 Unread</p>
                                            <Icon icon="chevron-up" color='#7165E3' className={style.marginLeft20} />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={style.collapseBody}>
                                <div className={style.displayInRow}>
                                    <img src={UserLogo} alt="logo"  className={style.userLogo} />
                                    <div className={style.marginLeft20}>
                                        <div className={`${style.displayInRow} ${style.marginTop10}`}>Sanjaya Kumar <span className={`${style.blue} ${style.marginLeft20}`}> MD</span> <span className={`${style.greyText} ${style.marginLeft20}`}>3 days ago</span> </div>
                                        <div className={style.marginTop10}>lorem ipsum dolor sit amet, consectetur adipiscing elit. sed finibus ac nisl tempor elementum. aliquam a eros porttitor, commodo</div>
                                        <TextArea placeholder='reply here...' rows={4} className={`${style.fullWidth} ${style.marginTop10}`} />
                                    </div>
                                </div>
                                <div className={`${style.floatRight} ${style.marginTop10}`}>
                                    <button className={style.sendButton}>{ticketStatus !== 'In-Progress' ? 'SEND' : 'REPLY'}</button>
                                </div>
                            </div>
                            <div className={`${style.floatRight} ${style.marginTop20}`}>
                                <button className={style.doneButton}>Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default Tickets;
