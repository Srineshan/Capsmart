import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Classes, Icon, Intent, EditableText } from '@blueprintjs/core';
import SideBar from '../../Components/Sidebar';
import Navbar from '../../Components/Navbar';
import Tile from '../../Components/Tile';
import LevelTwoHeader from '../../Components/LevelTwoHeader';
import FeedbackTicketResolution from '../../Components/FeedbackTicketResolution';
import Table from '../../Components/TableDesign';
import { format, subDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz'
import { GET } from './../dataSaver';
import MessageIcon from '@mui/icons-material/Message';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { currentUser } from './../../utils/auth';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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
import SearchBar from '../../Components/SearchBar';

const HelpHome = () => {
    const [myTicket, setMyTicket] = useState([]);
    const [exceptionTicket, setExceptionTicket] = useState([]);
    const [showVideoOptions, setShowVideoOptions] = useState(false);
    const [showVideoConnectingDialog, setShowVideoConnectingDialog] = useState(false);
    const [showChatView, setShowChatView] = useState(false);
    const [selectedOption, setSelectedOption] = useState('TICKETS');
    const [showFeedbackTicketResolution, setShowFeedbackTicketResolution] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const [ticketId, setTicketId] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [users, setUsers] = useState([]);
    const [from, setFrom] = useState(subDays(new Date(), 30));
    const [to, setTo] = useState(new Date());
    const [currentUserDetails, setCurrentUserDetails] = useState({});
    const ticketsTableHeaderValues = ["", "TICKET ID", "TYPE", "SUBJECT/ ISSUE", "CUSTOMER", "START DATE/TIME", "LAST UPDATED", "USER NAME"];
    const exceptionTicketsTableHeaderValues = ["", "TICKET ID", "EXCEPTION CODE", "DESCRIPTION", "DATE/TIME", "CONTRACTOR NAME", "USER NAME", "LAST UPDATED"];
    const tutorialsTableHeaderValues = ["", "TITLE", "DESCRIPTION", "AUTHOR", "TYPE", "DATE / TIME", "LINK", "COMMENT"];
    const releaseTableHeaderValues = ["", "TITLE", "DESCRIPTION", "AUTHOR", "TYPE", "DATE / TIME", "UPLOAD", "COMMENT", "ACTION"];
    const messageTableHeaderValues = ["", "TYPE", "RELATED TO", "MESSAGE / COMMENT", "LAST RESPONDED", "DATE / TIME", "ACTION"];
    const tableHeaderValues = (selectedOption === 'TICKETS') ? ticketsTableHeaderValues : (selectedOption === "TUTORIALS & VIDEOS") ? tutorialsTableHeaderValues :
        (selectedOption === "RELEASE NOTES") ? releaseTableHeaderValues : selectedOption === "Messages" ? messageTableHeaderValues : selectedOption === 'Exception Error Tickets' ? exceptionTicketsTableHeaderValues : '';
    const [allMessages, setAllMessages] = useState();
    let customerName = sessionStorage.getItem('title');
    const [searchKey, setSearchKey] = useState('');
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchKeyTickets, setSearchKeyTickets] = useState('');
    const [pageTickets, setPageTickets] = useState(1);
    const [totalCountTickets, setTotalCountTickets] = useState(0);
    const currentUserData = currentUser();
    let screenCaptureImg = sessionStorage.getItem('screenCapture');

    const statusAvailableValues = {
        NEW: 'New',
        INPROGRESS: 'In-Progress',
        ESCALATED: 'Escalated',
        FIXINPROGRESS: 'Fix In-Progress',
        FIXINDEVELOPMENT: 'Fix In-Developement',
        ONHOLD: 'On-Hold',
        FUTURERELEASE: 'Future Release',
        FEATUREENHANCEMENT: 'Feature Enhancement',
        FIXINQA: 'Fix In QA',
        APPUPDATED: 'App Updated',
        FIXCONFIRMATION: 'Fix Confirmation',
        RESOLVED: 'resolved',
        CLOSED: 'Closed'
    };

    useEffect(() => {
        getTicket();
    }, [showFeedbackTicketResolution, from, to, selectedOption, page, searchKey, pageTickets, searchKeyTickets]);

    useEffect(() => {
        getCommentMessages();
    }, [currentUserDetails]);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        setShowFeedbackTicketResolution(screenCaptureImg ? true : false);
    }, [screenCaptureImg]);

    useEffect(() => {
        setCurrentUserDetails(users?.filter(data => data?.id === currentUserData?.id)?.map(data => data));
    }, [users]);

    const getSelectedContract = (value) => {
        setSelectedOption(value)
    }

    const getShowFeedbackTicketResolution = (value) => {
        setShowFeedbackTicketResolution(value);
    }

    const getSelectedPage = (value) => {
        if (selectedOption === 'TICKETS') {
            setPageTickets(value);
        }
        if (selectedOption === 'Exception Error Tickets') {
            setPage(value);
        }

    }

    const getSearchKey = (value) => {
        if (selectedOption === 'TICKETS') {
            setSearchKeyTickets(value);
        }
        if (selectedOption === 'Exception Error Tickets') {
            setSearchKey(value);
        }
    }

    const getTicket = async () => {
        if (currentUserData?.roles?.includes('Entity Sys Admin')) {
            const { data: ticket } = await GET(`feedback-management-service/ticket?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}&limit=${10}&offset=${pageTickets - 1}&searchText=${searchKeyTickets}`);
            setMyTicket(ticket?.tickets);
            setTotalCountTickets(ticket?.numberOfElements);
            const { data: exceptionTicket } = await GET(`feedback-management-service/ticket?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}&generationMode=SYSTEM&limit=${10}&offset=${page - 1}&searchText=${searchKey}`);
            setExceptionTicket(exceptionTicket?.tickets);
            setTotalCount(exceptionTicket?.numberOfElements);
        } else {
            const { data: ticket } = await GET(`feedback-management-service/ticket?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}&userId=${currentUserData?.id}&limit=${10}&offset=${pageTickets - 1}&searchText=${searchKeyTickets}`);
            // const { data: exceptionTicket } = await GET(`feedback-management-service/ticket?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}&generationMode=SYSTEM&userId=${currentUserData?.id}`);
            setMyTicket(ticket?.tickets);
            setTotalCountTickets(ticket?.numberOfElements);
            // setExceptionTicket(exceptionTicket);
        }
    };

    const getCommentMessages = async () => {
        const { data: messages } = await GET(`feedback-management-service/ticket_comment/message?userId=${currentUserData?.id}`);
        setAllMessages(messages);
    }

    const getUser = async () => {
        const { data: user } = await GET('user-management-service/user');
        setUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
        setCurrentUserDetails(users?.filter(data => data?.id === currentUserData?.id)?.map(data => data))
    };

    const onClickFunction = (data) => {
        setTicketId(data?.id);
        setIsEdit(true);
        setShowFeedbackTicketResolution(true);
    }

    const getTicketId = (value) => {
        setShowFeedbackTicketResolution(true);
        setTicketId(value?.ticketId?.id);
        setIsEdit(true);
    }

    const getIsExpanded = (value) => {
        setIsExpanded(value);
    }

    const messagesOnClickFunction = (data) => {
        setTicketId(data?.ticketId?.id);
        setIsEdit(true);
        setShowFeedbackTicketResolution(true);
    }

    const handleFromUpload = () => {
        sessionStorage.setItem('fromUpload', true);
    }

    let messageDot = [];
    let messageDotTooltipValues = [];
    let messageType = [];
    let relatedTo = [];
    let messageOrComment = [];
    let lastResponded = [];
    let messageDateOrTime = [];
    let messageAction = [];

    const getMessagesValues = () => {
        messageDot = [];
        messageDotTooltipValues = [];
        messageType = [];
        relatedTo = [];
        messageOrComment = [];
        lastResponded = [];
        messageDateOrTime = [];
        messageAction = [];

        allMessages?.map(data => {
            let status = myTicket?.filter(ticketData => ticketData?.id === data?.ticketId?.id)?.map(data => data)[0]?.status;

            messageDot.push(status === 'RESOLVED' ? 'green' : status === 'INPROGRESS' ? 'yellow' : status === 'NEW' ? 'purple' : status === 'CLOSED' ? 'grey' : 'yellow');
            messageDotTooltipValues.push(statusAvailableValues[status]);
            messageType.push('Comment');
            relatedTo.push('Ticket');
            messageOrComment.push(data?.comment);
            lastResponded.push(`${data?.commentedBy?.name?.firstName} ${data?.commentedBy?.name?.lastName}`);
            messageDateOrTime.push(format(new Date(data?.createdDateTime), 'MM-dd-yyyy HH:mm'));
            messageAction.push(true);
        })

        return [
            { "type": "dot", "value": messageDot, 'tooltipValue': messageDotTooltipValues },
            { "type": "text", "value": messageType, "onClickFunction": messagesOnClickFunction },
            { "type": "text", "value": relatedTo, "onClickFunction": messagesOnClickFunction },
            { "type": "text", "value": messageOrComment, "onClickFunction": messagesOnClickFunction },
            { "type": "text", "value": lastResponded, "onClickFunction": messagesOnClickFunction },
            { "type": "text", "value": messageDateOrTime, "onClickFunction": messagesOnClickFunction },
            { "type": "action", "value": messageAction },
        ];
    }

    let dot = [];
    let dotTooltipValues = [];
    let tktId = [];
    let generationMode = [];
    let type = [];
    let exceptionCode = [];
    let description = [];
    let contractorName = [];
    let subject = [];
    let openDateOrTime = [];
    let customer = [];
    let submittedBy = [];
    let lastUpdated = [];

    const getTicketValues = () => {
        dot = [];
        dotTooltipValues = [];
        generationMode = [];
        tktId = [];
        type = [];
        subject = [];
        openDateOrTime = [];
        customer = [];
        submittedBy = [];
        lastUpdated = [];

        myTicket?.map(data => {
            dot.push(data?.status === 'RESOLVED' ? 'green' : data?.status === 'INPROGRESS' ? 'yellow' : data?.status === 'NEW' ? 'purple' : data?.status === 'CLOSED' ? 'grey' : 'yellow');
            dotTooltipValues.push(statusAvailableValues[data?.status]);
            tktId.push(data?.ticketId);
            type.push(data?.type);
            subject.push(data?.subject);
            openDateOrTime.push(format(new Date(data?.createdDateTime), 'MM-dd-yyyy HH:mm'));
            customer.push(customerName);
            submittedBy.push(`${data?.createdBy?.name?.firstName} ${data?.createdBy?.name?.lastName}`);
            lastUpdated.push(format(new Date(data?.modifiedDateTime), 'MM-dd-yyyy'));
        })

        return [
            { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
            { "type": "text", "value": tktId, "onClickFunction": onClickFunction },
            { "type": "text", "value": type, "onClickFunction": onClickFunction },
            { "type": "text", "value": subject, "onClickFunction": onClickFunction },
            { "type": "text", "value": customer, "onClickFunction": onClickFunction },
            { "type": "text", "value": openDateOrTime, "onClickFunction": onClickFunction },
            { "type": "text", "value": lastUpdated, "onClickFunction": onClickFunction },
            { "type": "text", "value": submittedBy, "onClickFunction": onClickFunction },
        ];
    }

    console.log('exception Tickets', exceptionTicket);

    const getExceptionTicketValues = () => {
        dot = [];
        dotTooltipValues = [];
        generationMode = [];
        tktId = [];
        exceptionCode = [];
        description = [];
        openDateOrTime = [];
        contractorName = [];
        submittedBy = [];
        lastUpdated = [];

        exceptionTicket?.map(data => {
            dot.push(data?.status === 'RESOLVED' ? 'green' : data?.status === 'INPROGRESS' ? 'yellow' : data?.status === 'NEW' ? 'purple' : data?.status === 'CLOSED' ? 'grey' : 'yellow');
            dotTooltipValues.push(statusAvailableValues[data?.status]);
            tktId.push(data?.ticketId);
            exceptionCode.push('-');
            description.push(data?.description);
            openDateOrTime.push(format(new Date(data?.createdDateTime), 'MM-dd-yyyy HH:mm'));
            contractorName.push(data?.contractorName);
            submittedBy.push(`${data?.createdBy?.name?.firstName}`);
            lastUpdated.push(format(new Date(data?.modifiedDateTime), 'MM-dd-yyyy'));
        })

        return [
            { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
            { "type": "text", "value": tktId, "onClickFunction": onClickFunction },
            { "type": "text", "value": exceptionCode, "onClickFunction": onClickFunction },
            { "type": "text", "value": description, "onClickFunction": onClickFunction },
            { "type": "text", "value": openDateOrTime, "onClickFunction": onClickFunction },
            { "type": "text", "value": contractorName, "onClickFunction": onClickFunction },
            { "type": "text", "value": submittedBy, "onClickFunction": onClickFunction },
            { "type": "text", "value": lastUpdated, "onClickFunction": onClickFunction },
        ];
    }

    const messagesActionsData = [{ 'data': 'Reply', 'onClick': getTicketId },
    { 'data': 'View', 'onClick': getTicketId }]


    return (
        <Fragment>
            <Navbar />
            <div className={`${isExpanded ? style.bigCardGrid : style.smallCardGrid} ${style.margin20}`}>
                <div>
                    <SideBar isExpanded={isExpanded} getIsExpanded={getIsExpanded}>
                        <div></div>
                    </SideBar>
                </div>
                <div>
                    <LevelTwoHeader heading={'HELP MANAGEMENT'} updatedTime={`UPDATED ON ${formatInTimeZone(new Date(), 'America/New_York', 'MMM d, yy h:mm zzz')}`} hideClose={true} />
                    <div className={`${style.grid4} ${style.marginTop20}`}>
                        <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="TICKETS" bigNumber={totalCountTickets} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="TICKETS" topText='' bottomText='LAST 30 DAYS' />
                        <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="TUTORIALS & VIDEOS" bigNumber={0} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="TUTORIALS & VIDEOS" topText='' bottomText='LAST 30 DAYS' />
                        <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="FAQS" bigNumber={0} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="FAQS" topText='' bottomText='LAST 7 DAYS' />
                        <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="RELEASE NOTES" bigNumber={0} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="RELEASE NOTES" topText='' bottomText='LAST 30 DAYS' />
                    </div>
                    {selectedOption !== "FAQS" ? (
                        <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
                            <div className={style.spaceBetween}>
                                <p className={`${style.activeContractsWidth}`}>{formatInTimeZone(new Date(), 'America/New_York', 'MMM d, yy h:mm zzz')}</p>
                                <div className={`${style.displayInRow} ${style.marginTop20}`}>
                                    <SearchBar getSearchKey={getSearchKey} />
                                    <button className={style.contractButton} onClick={() => { setIsEdit(false); setShowFeedbackTicketResolution(true); handleFromUpload() }}>ADD TICKET</button>
                                </div>
                            </div>
                            <div className={style.buttonGroupUsers}>
                                <button className={selectedOption === "TICKETS" && style.activeButton} onClick={() => setSelectedOption('TICKETS')}>Tickets ( {totalCountTickets} )</button>
                                {currentUserData?.roles?.includes('Entity Sys Admin') && (
                                    <button className={selectedOption === "Exception Error Tickets" && style.activeButton} onClick={() => setSelectedOption('Exception Error Tickets')}>Exception Error ( {totalCount} )</button>
                                )}
                                <button className={selectedOption === "Messages" && style.activeButton} onClick={() => setSelectedOption('Messages')}>Messages ( {allMessages?.length} )</button>
                            </div>
                            {/* {selectedOption !== "Exception Error Tickets" && ( */}
                            <Table
                                tableHeaderValues={tableHeaderValues}
                                tableDataValues={selectedOption === 'TICKETS' ? getTicketValues() : (selectedOption === "TUTORIALS & VIDEOS"
                                    || selectedOption === "RELEASE NOTES") ? []
                                    : selectedOption === "Messages" ? getMessagesValues() : selectedOption === 'Exception Error Tickets' ? getExceptionTicketValues() : []}
                                tableData={selectedOption === 'TICKETS' ? myTicket : (selectedOption === "TUTORIALS & VIDEOS" || selectedOption === "RELEASE NOTES")
                                    ? [] : selectedOption === "Messages" ? allMessages : selectedOption === 'Exception Error Tickets' ? exceptionTicket : []}
                                gridStyle={(selectedOption === 'TICKETS' || selectedOption === 'Exception Error Tickets') ? style.ticketTableDataGrid : selectedOption === "TUTORIALS & VIDEOS" ? style.tutorialTableDataGrid
                                    : selectedOption === "RELEASE NOTES" ? style.releaseTableDataGrid
                                        : selectedOption === "Messages" ? style.messageTableDataGrid : ''}
                                scrollStyle={style.helpScrollStyle}
                                actions={selectedOption === 'Messages' ? messagesActionsData : []}
                                getSelectedPage={getSelectedPage}
                                totalCount={selectedOption === 'TICKETS' ? totalCountTickets : totalCount}
                                page={selectedOption === 'TICKETS' ? pageTickets : page}
                                hidePagination={false}
                            />
                            {/* )} */}
                            {showFeedbackTicketResolution && (
                                <FeedbackTicketResolution getShowFeedbackTicketResolution={getShowFeedbackTicketResolution} ticketId={ticketId} isEdit={isEdit} />
                            )}
                        </div>
                    ) : (
                        <FAQ />
                    )}
                </div>
            </div>
            <div>
                {showChatView && (
                    <div className={style.chatContainer}>
                        <div className={style.blueChatPart}>
                            <div className={style.justifyCenter}>TimeSmartAI.Inc Team</div>
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
                                        Welcome to TimeSmartAI.Inc Team!<br /> Please let us know if you have anything questions about your account or anything you might want to share. we would be happy to help you out
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
                {/* <div className={`${style.displayInRow} ${style.blueCircleContainer}`}>
                    <div className={style.blueCircle} onClick={() => setShowChatView(!showChatView)}>
                        {showChatView ? <CloseOutlinedIcon /> : <ChatOutlinedIcon />}
                    </div>
                    <div className={style.blueCircle} onClick={() => setShowVideoOptions(true)}>
                        <VideocamOutlinedIcon />
                    </div>
                </div> */}
            </div>
            <Dialog isOpen={showVideoOptions} onClose={() => setShowVideoOptions(false)} className={`${style.videoOptionsDialogStyle} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p></p>
                        <p className={style.extensionStyle}>VIDEO CALL</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowVideoOptions(false)} />
                    </div>
                    <div>
                        <div className={`${style.displayInCol} ${style.marginTop20} ${style.alignCenter}`}>
                            <button className={style.videoButtonStyle} onClick={() => { setShowVideoConnectingDialog(true); setShowVideoOptions(false) }}>TECHNICAL SUPPORT</button>
                            <button className={`${style.videoButtonStyle} ${style.marginTop20}`} onClick={() => { setShowVideoConnectingDialog(true); setShowVideoOptions(false) }}>ASSESSMENT SUPPORT</button>
                        </div>
                    </div>
                </div>
            </Dialog>
            <Dialog isOpen={showVideoConnectingDialog} onClose={() => setShowVideoConnectingDialog(false)} className={`${style.videoOptionsDialogStyle} ${style.dialogPaddingBottom}`}>
                <div className={`${Classes.DIALOG_BODY} ${style.extensionDialogBackground}`}>
                    <div className={style.spaceBetween}>
                        <p></p>
                        <p className={style.extensionStyle}>CONNECTING VIDEO CALL</p>
                        <Icon icon="cross" size={20} intent={Intent.DANGER} className={style.crossStyle} onClick={() => setShowVideoConnectingDialog(false)} />
                    </div>
                    <div className={style.spaceBetween}>
                        <DesktopWindowsIcon style={{ fontSize: 80, color: '#7165E3' }} className={style.marginTop10} />
                        <div className={`${style.displayInRow} ${style.verticalCenter}`}>
                            <FiberManualRecordIcon style={{ color: '#7165E3', fontSize: 12 }} className={`${style.marginTop40}`} />
                            <FiberManualRecordOutlinedIcon style={{ color: '#7165E3', fontSize: 12 }} className={`${style.marginTop40}`} />
                            <FiberManualRecordOutlinedIcon style={{ color: '#7165E3', fontSize: 12 }} className={`${style.marginTop40}`} />
                            <FiberManualRecordOutlinedIcon style={{ color: '#7165E3', fontSize: 12 }} className={`${style.marginTop40}`} />
                            <FiberManualRecordOutlinedIcon style={{ color: '#7165E3', fontSize: 12 }} className={`${style.marginTop40}`} />
                        </div>
                        <DesktopWindowsIcon style={{ fontSize: 80, color: '#7165E3' }} className={style.marginTop10} />
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