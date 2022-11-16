import React, { useState, useEffect, Fragment } from 'react';
import { GET } from './../dataSaver';
import SideBar from '../../Components/Sidebar';
import Navbar from '../../Components/Navbar';
import Tile from '../../Components/Tile';
import Table from '../../Components/TableDesign';
import {useNavigate} from 'react-router-dom';
import style from './index.module.scss';
import SearchBar from '../../Components/SearchBar';
import RegisteredUsers from './registeredUsers';
import DataUpload from './dataUpload';
import FeedbackTicket from './feedbackTicket';
import ReferenceList from './../ReferenceList';

const Home = () => {
    const navigate = useNavigate();
    const [alertsData, setAlertsData] = useState([]);
    const [feedBackTileData, setFeedBackTileData] = useState([]);
    const [userMetadata, setUserMetadata] = useState([]);
    const [viewAlerts, setViewAlerts] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');
    let selectedOptionValue = sessionStorage.getItem('selectedOption');

    useEffect(() => {
        setSelectedOption(selectedOptionValue);
    }, [selectedOptionValue])

    useEffect(() => {
        feedBackTileValues();
        userTileValues();
    }, [])

    const togglePin = () => {

    }

    const getSelectedOption = (value) => {
        setSelectedOption(value)
    }

    const feedBackTileValues = async() => {
        const {data: feedback} = await GET(`feedback-management-service/ticket/metadata`);
        setFeedBackTileData(feedback);
    }

    const userTileValues = async() => {
        const {data: user} = await GET(`user-management-service/user/registeredUserMetadata`);
        setUserMetadata(user);
    }

    const tableHeaderValues = ["", "", "ALERT TYPE", "ALERT NAME", "ALERT DATE & TIME", "ACTION"];
    const toDoTableHeaderValues = ["", "TASK ID", "TASK TYPE", "SUBJECT / REFERENCE", "ACTION REQUIRED", "DUE DATE", "ASSIGN TO", "LAST UPDATED", "LAST UPDATED BY"];

    let pin = [];
    let alert = [];
    let alertType = [];
    let alertName = [];
    let alertDateAndTime = [];
    let action = [];

    const getActiveFilesValues = () => {
         pin = [];
         alert = [];
         alertType = [];
         alertName = [];
         alertDateAndTime = [];
         action = [];

         alertsData?.map(data=>
        {
            pin.push('pin');
            alert.push(data?.fileId);
            alertType.push(data?.processingStatus);
            alertName.push(data?.fileName);
            alertDateAndTime.push('-');
            action.push(true)
        })

        return [
            {"type": "dot", "value": pin},
            {"type": "text", "value": alert},
            {"type": "text", "value": alertType},
            {"type": "text", "value": alertName},
            {"type": "text", "value": alertDateAndTime},
            {"type": "action", "value": action},
        ];
    }

    let dot = [];
    let taskId = [];
    let taskType = [];
    let subjectOrReference = [];
    let actionRequired = [];
    let dueDate = [];
    let assignTo = [];
    let lastUpdated = [];
    let lastUpdatedBy = [];

    const getToDoValues = () => {
         dot = [];
         taskId = [];
         taskType = [];
         subjectOrReference = [];
         actionRequired = [];
         dueDate = [];
         assignTo = [];
         lastUpdated = [];
         lastUpdatedBy = [];

         alertsData?.map(data=>
        {
            pin.push('pin');
            alert.push(data?.fileId);
            alertType.push(data?.processingStatus);
            alertName.push(data?.fileName);
            alertDateAndTime.push('-');
            action.push(true)
        })

        return [
            {"type": "dot", "value": pin},
            {"type": "text", "value": alert},
            {"type": "text", "value": alertType},
            {"type": "text", "value": alertName},
            {"type": "text", "value": alertDateAndTime},
            {"type": "action", "value": action},
        ];
    }

    const actionsData = [{'data': 'Unpin', 'onClick': togglePin}];

    return(
        <Fragment>
            <Navbar />
            <div className={`${style.bigCardGrid} ${style.margin20}`}>
                <SideBar />
                {selectedOption === 'REGISTERED USERS' ? (
                    <RegisteredUsers getSelectedOption={getSelectedOption} />
                ) : selectedOption === 'OPEN FEEDBACK TICKETS' ? (
                    <FeedbackTicket getSelectedOption={getSelectedOption} />
                ) : selectedOption === 'DATA UPLOADS' ? (
                    <DataUpload getSelectedOption={getSelectedOption} />
                ) : selectedOption === 'REFERENCE LISTS' ?
                  navigate('/referenceList')
                  :(
                <div>
                    <div className={`${style.grid4}`}>
                        <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOption} tileLabel="REGISTERED USERS" bigNumber={userMetadata?.allRegisteredUsersCount} bigText="APP USERS" smallNum1={0} smallNum2={userMetadata?.allBlockedUsers} smallText1="ON HOLD" smallText2="BLOCKED" currentTile="REGISTERED USERS" topText='' />
                        <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOption} tileLabel="OPEN FEEDBACK TICKETS" bigNumber={feedBackTileData?.allTickets} bigText="TOTAL TICKETS" smallNum1={feedBackTileData?.dueDateTickets} smallNum2={feedBackTileData?.highImpactTickets} smallText1="PAST DUE" smallText2="HIGH IMPACT" currentTile="OPEN FEEDBACK TICKETS" topText='' />
                        <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOption} tileLabel="REFERENCE LISTS" bigNumber={6} bigText="CUSTOM" bigNumber2={5} bigText2="DEFAULT IN USE" smallNum1={5} smallNum2={5} smallText1="REVIEW FOR USE" smallText2="SETUP REQUIRED" currentTile="REFERENCE LISTS" topText='' />
                        <Tile selectedContract={selectedOption} getSelectedContract={getSelectedOption} tileLabel="DATA UPLOADS" bigNumber={2} bigText="DEFAULT IN USE" smallNum1={2} smallNum2={1} smallText1="FAILED TO PROCESS" smallText2="FAILED RECORDS" currentTile="DATA UPLOADS" topText='' />
                    </div>
                    <div className={`${style.bigCardStyleWithoutHeading} ${style.marginTop20}`}>
                        {/* <div className={style.spaceBetween}> */}
                            <div className={style.buttonGroupUsers}>
                                <button className={viewAlerts && style.activeButton} onClick={() => setViewAlerts(true)}>Alerts ( 16 )</button>
                                <button className={!viewAlerts && style.activeButton} onClick={() => setViewAlerts(false)}>To Do Tasks ( 8 )</button>
                            </div>
                            {/* <SearchBar /> */}
                        {/* </div> */}
                        <Table
                            tableHeaderValues={viewAlerts ? tableHeaderValues : toDoTableHeaderValues}
                            tableDataValues={viewAlerts ? getActiveFilesValues() : getToDoValues()}
                            tableData={viewAlerts ? alertsData : alertsData}
                            gridStyle={viewAlerts ? style.alertsGrid : style.toDoGrid}
                            actions={viewAlerts ? actionsData : []}
                        />
                    </div>
                </div>
                )}
            </div>
        </Fragment>
    )
}

export default Home;
