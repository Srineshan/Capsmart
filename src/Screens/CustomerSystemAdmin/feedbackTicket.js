import React, { useState, useEffect } from 'react';
import { GET } from './../dataSaver';
import Tile from '../../Components/Tile';
import Table from '../../Components/TableDesign';
import LevelTwoHeader from '../../Components/LevelTwoHeader';
import MessageIcon from '@mui/icons-material/Message';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {format, startOfWeek, endOfWeek} from 'date-fns';
import Cookie from 'universal-cookie';
import jwt from 'jwt-decode';
import FeedbackTicketResolution from '../../Components/FeedbackTicketResolution';

import style from './index.module.scss';

const FeedbackTicket = ({getSelectedOption}) => {
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

    var cookie = new Cookie();
    let authValue = cookie.get('user');
    const loggedUser = jwt(authValue);
    const ticketsTableHeaderValues = ["", "TKT ID", "TYPE", "SUBJECT", "OPEN DATE/TIME", "IMPACT", "APP IN USE", "SUBMITTED BY’", "MESSAGES", "LAST UPDATED", "ACTION"];
    const exceptionTableHeaderValues = ["", "TICKET ID", "EXCEPTION CODE", "DESCRIPTION", "DATE/TIME", "CONTRACTOR NAME", "USER NAME", "LAST UPDATED", "ACTION"];
    const messagesTableHeaderValues = ["", "TYPE", "RELATED TO", "MESSAGE / COMMENT", "LAST RESPONDED", "DATE / TIME", "ACTION"];

    const tableHeaderValues = (selectedOption === 'OPEN TICKETS' || selectedOption === "RESOLVED TICKETS" || selectedOption === "NEW TICKETS")
    ? ticketsTableHeaderValues : selectedOption === "EXCEPTION ERRORS" ? exceptionTableHeaderValues 
    : messagesTableHeaderValues;
    let screenCaptureImg = sessionStorage.getItem('screenCapture');

    useEffect(() => {
        setShowFeedbackTicketResolution(screenCaptureImg ? true : false);
    }, [screenCaptureImg]);

    useEffect(() => {
        getTicket();
    }, [showFeedbackTicketResolution, from, to])

    useEffect(() => {
        setCurrentUser(users?.filter(data => data?.id === loggedUser?.id)?.map(data => data));
    }, [users]);

    useEffect(()=>{
        getUser();
    }, []);

    useEffect(()=>{
        getCommentMessages();
    }, [currentUser]);


    const getTicket = async () => {
        const { data: ticket } = await GET(`feedback-management-service/ticket?startDate=${format(new Date(from), 'yyyy-MM-dd')}&endDate=${format(new Date(to), 'yyyy-MM-dd')}`);
        setOpenTicket(ticket.filter(data => (data?.status !== "NEW" && data?.status !== "RESOLVED"))?.map(data => data));
        setNewTicket(ticket.filter(data => data?.status === "NEW")?.map(data => data));
        setResolvedTicket(ticket.filter(data => data?.status === "RESOLVED")?.map(data => data));
    };

    const getCommentMessages = async() => {
        const {data:messages} = await GET(`feedback-management-service/ticket_comment/message?userId=${currentUser?.[0]?.id}`);
        setAllMessages(messages);
    }

    const getUser = async() => {
        const {data: user} = await GET('user-management-service/user');
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

        allMessages?.map(data=> 
        {
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
            {"type": "dot", "value": messageDot, 'tooltipValue': messageDotTooltipValues},
            {"type": "text", "value": messageType, "onClickFunction": messagesOnClickFunction},
            {"type": "text", "value": relatedTo, "onClickFunction": messagesOnClickFunction},
            {"type": "text", "value": messageOrComment, "onClickFunction": messagesOnClickFunction},
            {"type": "text", "value": lastResponded, "onClickFunction": messagesOnClickFunction},
            {"type": "text", "value": messageDateOrTime, "onClickFunction": messagesOnClickFunction},
            {"type": "action", "value": messageAction},
        ];
    }

    let dot = [];
    let dotTooltipValues = [];
    let tktId = [];
    let type = [];
    let subject = [];
    let openDateOrTime = [];
    let impact = [];
    let appInUse = [];
    let submittedBy = [];
    let messages = [];
    let lastUpdated = [];
    let action = [];

    const getTicketValues = () => {
         dot = [];
         dotTooltipValues = [];
         tktId = [];
         type = [];
         subject = [];
         openDateOrTime = [];
         impact = [];
         appInUse = [];
         submittedBy = [];
         messages = [];
         lastUpdated = [];
         action = [];

        ticket?.map(data=> 
        {
            dot.push('green');
            dotTooltipValues.push('In-Progress');
            tktId.push(data?.ticketId);
            type.push(data?.type);
            subject.push(data?.subject);
            openDateOrTime.push(format(new Date(data?.createdDateTime), 'MM-dd-yyyy HH:mm'));
            impact.push(<WarningAmberIcon style={{color: data?.impact === "HIGH" ? '#FF6562' : '#88D5A6'}} />);
            appInUse.push('TIMESMART.AI');
            submittedBy.push(`${data?.createdBy?.name?.firstName} ${data?.createdBy?.name?.lastName}`);
            messages.push('2');
            lastUpdated.push(format(new Date(data?.modifiedDateTime), 'MM-dd-yyyy'));
            action.push(true);
        })

        return [
            {"type": "dot", "value": dot, 'tooltipValue': dotTooltipValues},
            {"type": "text", "value": tktId, "onClickFunction": onClickFunction},
            {"type": "text", "value": type, "onClickFunction": onClickFunction},
            {"type": "text", "value": subject, "onClickFunction": onClickFunction},
            {"type": "text", "value": openDateOrTime, "onClickFunction": onClickFunction},
            {"type": "icon", "icon": impact},
            {"type": "text", "value": appInUse, "onClickFunction": onClickFunction},
            {"type": "text", "value": submittedBy, "onClickFunction": onClickFunction},
            {"type": "iconWithCount", "value": messages, "icon": <MessageIcon style={{fontSize: 15, color: '#707070'}} />},
            {"type": "text", "value": lastUpdated, "onClickFunction": onClickFunction},
            {"type": "action", "value": action},
        ];
    }

    const actionsData = [{'data': 'Comment / Note', 'onClick': getCommentView},
        {'data': 'Send Inquiry', 'onClick': getReprocessDialog}]

    const messagesActionsData = [{'data': 'Reply', 'onClick': getTicketId}]

    return (
        <div>
            <LevelTwoHeader heading={'FEEDBACK TICKET MANAGER'} updatedTime={''} onCloseLevel2={onCloseLevel2} needDateFilter={true} getFrom={getFrom} getTo={getTo} />
            <div className={`${style.grid4} ${style.marginTop20}`}>
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="OPEN TICKETS" bigNumber={openTicket?.length} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="OPEN TICKETS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="NEW TICKETS" bigNumber={newTicket?.length} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="NEW TICKETS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="EXCEPTION ERRORS" bigNumber={1} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="EXCEPTION ERRORS" topText='' />
                <Tile selectedContract={selectedOption} getSelectedContract={getSelectedContract} tileLabel="RESOLVED TICKETS" bigNumber={resolvedTicket?.length} smallNum1="" smallNum2="" smallText1="" smallText2="" currentTile="RESOLVED TICKETS" topText='' />
            </div>
            <div className={`${style.bigCardStyle} ${style.marginTop20}`}>
                <div className={style.buttonGroupUsers}>
                    <button className={selectedOption === "OPEN TICKETS" && style.activeButton} onClick={() => setSelectedOption('OPEN TICKETS')}>Open Tickets ( {openTicket?.length} )</button>
                    <button className={selectedOption === "EXCEPTION ERRORS" && style.activeButton} onClick={() => setSelectedOption('EXCEPTION ERRORS')}>Exception Error ( 1 )</button>
                    <button className={selectedOption === "MESSAGES" && style.activeButton} onClick={() => setSelectedOption('MESSAGES')}>Messages ( {allMessages?.length} )</button>
                    <button className={selectedOption === "RESOLVED TICKETS" && style.activeButton} onClick={() => setSelectedOption('RESOLVED TICKETS')}>Resolved Tickets ( {resolvedTicket?.length} )</button>
                </div>
                <Table
                    tableHeaderValues={tableHeaderValues} 
                    tableDataValues={(selectedOption === 'OPEN TICKETS' || selectedOption === "RESOLVED TICKETS" || selectedOption === "NEW TICKETS")
                    ? getTicketValues() : selectedOption === "EXCEPTION ERRORS" ? getTicketValues() 
                    : getMessagesValues()}
                    tableData={(selectedOption === 'OPEN TICKETS' || selectedOption === "RESOLVED TICKETS" || selectedOption === "EXCEPTION ERRORS" || selectedOption === "NEW TICKETS")
                    ? ticket : allMessages}
                    gridStyle={(selectedOption === 'OPEN TICKETS' || selectedOption === "RESOLVED TICKETS" || selectedOption === "NEW TICKETS")
                        ? style.ticketsGrid : selectedOption === "EXCEPTION ERRORS" ? style.exceptionGrid 
                        : style.messageGrid}
                    actions={(selectedOption === 'OPEN TICKETS' || selectedOption === "RESOLVED TICKETS" || selectedOption === "NEW TICKETS")
                    ? actionsData : selectedOption === "EXCEPTION ERRORS" ? actionsData 
                    : messagesActionsData}
                />
                {showFeedbackTicketResolution && (
                    <FeedbackTicketResolution getShowFeedbackTicketResolution={getShowFeedbackTicketResolution} ticketId={ticketId} isEdit={isEdit} />
                )}
            </div>
        </div>
    )
}

export default FeedbackTicket;