import React, { useState, useEffect } from 'react';
import { GET } from './../dataSaver';
import Tile from '../../Components/Tile';
import Table from '../../Components/TableDesign';
import LevelTwoHeader from '../../Components/LevelTwoHeader';
import MessageIcon from '@mui/icons-material/Message';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import FeedbackTicketResolution from '../../Components/FeedbackTicketResolution';

import style from './index.module.scss';

const FeedbackTicket = ({ getSelectedOption }) => {
    const [selectedOption, setSelectedOption] = useState('OPEN TICKETS');
    const [openTicket, setOpenTicket] = useState([]);
    const [newTicket, setNewTicket] = useState([]);
    const [resolvedTicket, setResolvedTicket] = useState([]);
    const [exceptionErrors, setExceptionErrors] = useState([]);
    const ticket = selectedOption === 'OPEN TICKETS' ? openTicket : selectedOption === 'NEW TICKETS' ?
        newTicket : selectedOption === 'EXCEPTION ERRORS' ? exceptionErrors : resolvedTicket;
    const [ticketId, setTicketId] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [users, setUsers] = useState([]);
    const [allMessages, setAllMessages] = useState();
    const [currentUser, setCurrentUser] = useState({});
    const [showFeedbackTicketResolution, setShowFeedbackTicketResolution] = useState(false);
    const [from, setFrom] = useState(startOfWeek(new Date()));
    const [to, setTo] = useState(endOfWeek(new Date()));
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageOpenTickets, setPageOpenTickets] = useState(1);
    const [totalCountOpenTickets, setTotalCountOpenTickets] = useState(0);
    const [pageNewTickets, setPageNewTickets] = useState(1);
    const [totalCountNewTickets, setTotalCountNewTickets] = useState(0);
    const [pageResolvedTickets, setPageResolvedTickets] = useState(1);
    const [totalCountResolvedTickets, setTotalCountResolvedTickets] = useState(0);

    var cookie = new Cookie();
    let authValue = cookie.get('user');
    const loggedUser = jwt(authValue);
    const ticketsTableHeaderValues = ["", "TKT ID", "TYPE", "SUBJECT", "OPEN DATE/TIME", "IMPACT", "APP IN USE", "SUBMITTED BY’", "MESSAGES", "LAST UPDATED", "ACTION"];
    const exceptionTableHeaderValues = ["", "TICKET ID", "EXCEPTION CODE", "DESCRIPTION", "DATE/TIME", "CONTRACTOR NAME", "USER NAME", "LAST UPDATED", "ACTION"];
    const messagesTableHeaderValues = ["", "TYPE", "RELATED TO", "MESSAGE / COMMENT", "LAST RESPONDED", "DATE / TIME", "ACTION"];

    const tableHeaderValues = (selectedOption === 'OPEN TICKETS' || selectedOption === "RESOLVED TICKETS" || selectedOption === "NEW TICKETS")
        ? ticketsTableHeaderValues : selectedOption === "EXCEPTION ERRORS" ? exceptionTableHeaderValues
            : messagesTableHeaderValues;
    // let screenCaptureImg = sessionStorage.getItem('screenCapture');

    // useEffect(() => {
    //     setShowFeedbackTicketResolution(screenCaptureImg ? true : false);
    // }, [screenCaptureImg]);

    useEffect(() => {
        getTicket();
    }, [showFeedbackTicketResolution, from, to, selectedOption, page, pageOpenTickets, pageNewTickets, pageResolvedTickets])

    useEffect(() => {
        setCurrentUser(users?.filter(data => data?.id === loggedUser?.id)?.map(data => data));
    }, [users]);

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        getCommentMessages();
        getTicket();
    }, [currentUser]);

    console.log(currentUser, currentUser?.[0]?.roles?.filter(data => data?.roleName === 'Entity Sys Admin')?.map(data => data)?.length !== 0)


    const getSelectedPage = (value) => {
        if (selectedOption === 'OPEN TICKETS') {
            setPageOpenTickets(value);
        }
        if (selectedOption === 'RESOLVED TICKETS') {
            setPageResolvedTickets(value);
        }
        if (selectedOption === 'NEW TICKETS') {
            setPageNewTickets(value);
        }
        if (selectedOption === 'EXCEPTION ERRORS') {
            setPage(value);
        }
    }

    const getTicket = async () => {
        if (currentUser?.[0]?.roles?.filter(data => data?.roleName === 'Entity Sys Admin')?.map(data => data)?.length !== 0) {
            const { data: ticket } = await GET(`feedback-management-service/ticket?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}&limit=${10}&offset=${selectedOption === 'OPEN TICKETS' ? pageOpenTickets - 1 : selectedOption === "RESOLVED TICKETS" ? pageResolvedTickets - 1 : selectedOption === "NEW TICKETS" ? pageNewTickets - 1 : 0}`);
            const { data: exceptionTicket } = await GET(`feedback-management-service/ticket?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}&generationMode=SYSTEM&limit=${10}&offset=${page - 1}`);
            setOpenTicket(ticket?.tickets?.filter(data => (data?.status !== "NEW" && data?.status !== "RESOLVED"))?.map(data => data));
            setNewTicket(ticket?.tickets?.filter(data => data?.status === "NEW")?.map(data => data));
            setResolvedTicket(ticket?.tickets?.filter(data => data?.status === "RESOLVED")?.map(data => data));
            setExceptionErrors(exceptionTicket?.tickets);
            setTotalCountOpenTickets(ticket?.tickets?.filter(data => (data?.status !== "NEW" && data?.status !== "RESOLVED"))?.map(data => data)?.length);
            setTotalCountResolvedTickets(ticket?.tickets?.filter(data => data?.status === "RESOLVED")?.map(data => data)?.length);
            setTotalCountNewTickets(ticket?.tickets?.filter(data => data?.status === "NEW")?.map(data => data)?.length);
            setTotalCount(exceptionTicket?.numberOfElements);
        } else {
            const { data: ticket } = await GET(`feedback-management-service/ticket?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}&userId=${currentUser?.[0]?.id}&limit=${10}&offset=${selectedOption === 'OPEN TICKETS' ? pageOpenTickets - 1 : selectedOption === "RESOLVED TICKETS" ? pageResolvedTickets - 1 : selectedOption === "NEW TICKETS" ? pageNewTickets - 1 : 0}`);
            const { data: exceptionTicket } = await GET(`feedback-management-service/ticket?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}&userId=${currentUser?.[0]?.id}&generationMode=SYSTEM&limit=${10}&offset=${page - 1}`);
            setOpenTicket(ticket?.tickets?.filter(data => (data?.status !== "NEW" && data?.status !== "RESOLVED"))?.map(data => data));
            setNewTicket(ticket?.tickets?.filter(data => data?.status === "NEW")?.map(data => data));
            setResolvedTicket(ticket?.tickets?.filter(data => data?.status === "RESOLVED")?.map(data => data));
            setExceptionErrors(exceptionTicket?.tickets);
            setTotalCountOpenTickets(ticket?.tickets?.filter(data => (data?.status !== "NEW" && data?.status !== "RESOLVED"))?.map(data => data)?.length);
            setTotalCountResolvedTickets(ticket?.tickets?.filter(data => data?.status === "RESOLVED")?.map(data => data)?.length);
            setTotalCountNewTickets(ticket?.tickets?.filter(data => data?.status === "NEW")?.map(data => data)?.length);
            setTotalCount(exceptionTicket?.numberOfElements);
        }
        // const { data: ticket } = await GET(`feedback-management-service/ticket?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}`);
        // setOpenTicket(ticket?.filter(data => (data?.status !== "NEW" && data?.status !== "RESOLVED"))?.map(data => data));
        // setNewTicket(ticket?.filter(data => data?.status === "NEW")?.map(data => data));
        // setResolvedTicket(ticket?.filter(data => data?.status === "RESOLVED")?.map(data => data));
    };

    const getCommentMessages = async () => {
        const { data: messages } = await GET(`feedback-management-service/ticket_comment/message?userId=${currentUser?.[0]?.id}`);
        setAllMessages(messages);
    }

    const getUser = async () => {
        const { data: user } = await GET('user-management-service/user');
        setUsers(user?.filter(data => data?.blocked === false)?.map(data => data));
        setCurrentUser(users?.filter(data => data?.id === loggedUser?.id)?.map(data => data))
    };

    const getSelectedContract = (value) => {
        setSelectedOption(value)
    }

    const onClickFunction = (data) => {
        setTicketId(data?.id);
        setIsEdit(true);
        setShowFeedbackTicketResolution(true);
    }

    const messagesOnClickFunction = (data) => {
        setTicketId(data?.ticketId?.id);
        setIsEdit(true);
        setShowFeedbackTicketResolution(true);
    }

    const getDownloadDialog = () => {

    }

    const getReprocessDialog = () => {

    }

    const onCloseLevel2 = () => {
        getSelectedOption('');
    }

    const getFrom = (value) => {
        setFrom(value);
    }

    const getTo = (value) => {
        setTo(value);
    }

    const getShowFeedbackTicketResolution = (value) => {
        setShowFeedbackTicketResolution(value);
    }

    const getTicketId = (value) => {
        setShowFeedbackTicketResolution(true);
        setTicketId(value?.ticketId?.id);
        setIsEdit(true);
    }

    const getCommentView = (data) => {
        setShowFeedbackTicketResolution(true);
        setTicketId(data?.id);
        setIsEdit(true);
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
            messageDot.push('green');
            messageDotTooltipValues.push('In-Progress');
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
    // let generationMode = [];
    let tktId = [];
    let type = [];
    let subject = [];
    let openDateOrTime = [];
    let impact = [];
    let appInUse = [];
    let submittedBy = [];
    let messages = [];
    let messagesIcon = [];
    let lastUpdated = [];
    let action = [];

    const getTicketValues = () => {
        dot = [];
        dotTooltipValues = [];
        // generationMode = [];
        tktId = [];
        type = [];
        subject = [];
        openDateOrTime = [];
        impact = [];
        appInUse = [];
        submittedBy = [];
        messages = [];
        messagesIcon = [];
        lastUpdated = [];
        action = [];

        ticket?.map(data => {
            dot.push('green');
            dotTooltipValues.push('In-Progress');
            // generationMode.push(data?.generationMode);
            tktId.push(data?.ticketId);
            type.push(data?.type);
            subject.push(data?.subject);
            openDateOrTime.push(format(new Date(data?.createdDateTime), 'MM-dd-yyyy HH:mm'));
            impact.push(<WarningAmberIcon style={{ color: data?.impact === "HIGH" ? '#FF6562' : '#88D5A6' }} />);
            appInUse.push('TIMESMART.AI');
            submittedBy.push(`${data?.createdBy?.name?.firstName} ${data?.createdBy?.name?.lastName}`);
            messages.push(data?.messageCount);
            messagesIcon.push(<MessageIcon style={{ fontSize: 15, color: '#707070' }} />)
            lastUpdated.push(format(new Date(data?.modifiedDateTime), 'MM-dd-yyyy'));
            action.push(true);
        })

        return [
            { "type": "dot", "value": dot, 'tooltipValue': dotTooltipValues },
            { "type": "text", "value": tktId, "onClickFunction": onClickFunction },
            { "type": "text", "value": type, "onClickFunction": onClickFunction },
            // { "type": "text", "value": generationMode, "onClickFunction": onClickFunction },
            { "type": "text", "value": subject, "onClickFunction": onClickFunction },
            { "type": "text", "value": openDateOrTime, "onClickFunction": onClickFunction },
            { "type": "icon", "icon": impact },
            { "type": "text", "value": appInUse, "onClickFunction": onClickFunction },
            { "type": "text", "value": submittedBy, "onClickFunction": onClickFunction },
            { "type": "iconWithCount", "value": messages, "icon": messagesIcon, 'isShowHoverText': false },
            { "type": "text", "value": lastUpdated, "onClickFunction": onClickFunction },
            { "type": "action", "value": action },
        ];
    }

    let exceptionCode = [];
    let description = [];
    let contractorName = [];

    const getExceptionTicketValues = () => {
        dot = [];
        dotTooltipValues = [];
        tktId = [];
        exceptionCode = [];
        description = [];
        openDateOrTime = [];
        contractorName = [];
        submittedBy = [];
        lastUpdated = [];

        exceptionErrors?.map(data => {
            dot.push(data?.status === 'RESOLVED' ? 'green' : data?.status === 'INPROGRESS' ? 'yellow' : data?.status === 'NEW' ? 'grey' : '');
            dotTooltipValues.push(data?.status === 'RESOLVED' ? 'Resolved' : data?.status === 'INPROGRESS' ? 'In-Progress' : data?.status === 'NEW' ? 'New' : '');
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

    const actionsData = [{ 'data': 'Comment / Note', 'onClick': getCommentView },
    { 'data': 'Send Inquiry', 'onClick': getReprocessDialog }]

    const messagesActionsData = [{ 'data': 'Reply', 'onClick': getTicketId }]

    return (
        <div>
            <LevelTwoHeader heading={'FEEDBACK TICKET MANAGER'} updatedTime={''} onCloseLevel2={onCloseLevel2} needDateFilter={true} getFrom={getFrom} getTo={getTo} />
            <div className={`${style.grid4} ${style.marginTop20}`}>
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="OPEN TICKETS" bigNumber={totalCountOpenTickets} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="OPEN TICKETS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="NEW TICKETS" bigNumber={totalCountNewTickets} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="NEW TICKETS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="EXCEPTION ERRORS" bigNumber={totalCount} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="EXCEPTION ERRORS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="RESOLVED TICKETS" bigNumber={totalCountResolvedTickets} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="RESOLVED TICKETS" topText='' />
            </div>
            <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
                <div className={style.buttonGroupUsers}>
                    <button className={selectedOption === "OPEN TICKETS" && style.activeButton} onClick={() => setSelectedOption('OPEN TICKETS')}>Open Tickets ( {totalCountOpenTickets} )</button>
                    <button className={selectedOption === "EXCEPTION ERRORS" && style.activeButton} onClick={() => setSelectedOption('EXCEPTION ERRORS')}>Exception Error ( {totalCount} )</button>
                    <button className={selectedOption === "MESSAGES" && style.activeButton} onClick={() => setSelectedOption('MESSAGES')}>Messages ( {allMessages?.length} )</button>
                    <button className={selectedOption === "RESOLVED TICKETS" && style.activeButton} onClick={() => setSelectedOption('RESOLVED TICKETS')}>Resolved Tickets ( {totalCountResolvedTickets} )</button>
                </div>
                <Table
                    tableHeaderValues={tableHeaderValues}
                    tableDataValues={(selectedOption === 'OPEN TICKETS' || selectedOption === "RESOLVED TICKETS" || selectedOption === "NEW TICKETS")
                        ? getTicketValues() : selectedOption === "EXCEPTION ERRORS" ? getExceptionTicketValues()
                            : getMessagesValues()}
                    tableData={(selectedOption === 'OPEN TICKETS' || selectedOption === "RESOLVED TICKETS" || selectedOption === "EXCEPTION ERRORS" || selectedOption === "NEW TICKETS")
                        ? ticket : allMessages}
                    gridStyle={(selectedOption === 'OPEN TICKETS' || selectedOption === "RESOLVED TICKETS" || selectedOption === "NEW TICKETS")
                        ? style.ticketsGrid : selectedOption === "EXCEPTION ERRORS" ? style.exceptionGrid
                            : style.messageGrid}
                    actions={(selectedOption === 'OPEN TICKETS' || selectedOption === "RESOLVED TICKETS" || selectedOption === "NEW TICKETS")
                        ? actionsData : selectedOption === "EXCEPTION ERRORS" ? actionsData
                            : messagesActionsData}
                    scrollStyle={style.helpScrollStyle}
                    getSelectedPage={getSelectedPage}
                    totalCount={selectedOption === 'OPEN TICKETS' ? totalCountOpenTickets : selectedOption === "RESOLVED TICKETS" ? totalCountResolvedTickets : selectedOption === "EXCEPTION ERRORS" ? totalCount : selectedOption === "NEW TICKETS" ? totalCountNewTickets : 0}
                    page={selectedOption === 'OPEN TICKETS' ? pageOpenTickets : selectedOption === "RESOLVED TICKETS" ? pageResolvedTickets : selectedOption === "EXCEPTION ERRORS" ? page : selectedOption === "NEW TICKETS" ? pageNewTickets : 1}
                    hidePagination={false}
                />
                {showFeedbackTicketResolution && (
                    <FeedbackTicketResolution getShowFeedbackTicketResolution={getShowFeedbackTicketResolution} ticketId={ticketId} isEdit={isEdit} />
                )}
            </div>
        </div>
    )
}

export default FeedbackTicket;